// This file is passed as text to a dedicated Worker inside an opaque sandbox.
const nodes=new Map();let seq=0,lines=0,pending=false,storage={};
const send=(type,data={})=>postMessage({type,...data});
const fmt=x=>{try{return typeof x==='string'?x:JSON.stringify(x)??String(x);}catch{return String(x);}};
const log=(...args)=>{if(lines++<150)send('log',{text:args.map(fmt).join(' ')});};
console.log=log;console.info=log;console.warn=log;console.error=(...a)=>log('Xato:',...a);
console.assert=(ok,...a)=>{if(!ok)log('Assertion failed:',...a);};
function publish(){if(pending)return;pending=true;queueMicrotask(()=>{pending=false;send('tree',{tree:body.toJSON()});});}
class Element {
 constructor(tag){this.uid=++seq;this.tagName=tag.toUpperCase();this.children=[];this.parentElement=null;this.listeners={};this.attrs={};this._text='';this._value='';this._checked=false;nodes.set(this.uid,this);
  this.style=new Proxy({},{set:(o,k,v)=>{o[k]=String(v);publish();return true;}});
  this.classList={add:(...names)=>{this.className=[...new Set([...this.className.split(' '),...names])].filter(Boolean).join(' ');},remove:(...names)=>{this.className=this.className.split(' ').filter(x=>!names.includes(x)).join(' ');},contains:name=>this.className.split(' ').includes(name),toggle:(name,force)=>{const add=force??!this.classList.contains(name);add?this.classList.add(name):this.classList.remove(name);return add;}};
 }
 get id(){return this.attrs.id||'';}set id(v){this.attrs.id=String(v);publish();}
 get className(){return this.attrs.class||'';}set className(v){this.attrs.class=String(v);publish();}
 get textContent(){return this._text+this.children.map(x=>x.textContent).join('');}
 set textContent(v){for(const c of this.children)c.parentElement=null;this.children=[];this._text=String(v);publish();}
 get value(){return this._value;}set value(v){this._value=String(v);publish();}
 get checked(){return this._checked;}set checked(v){this._checked=!!v;publish();}
 set type(v){this.attrs.type=String(v);publish();}get type(){return this.attrs.type;}
 set placeholder(v){this.attrs.placeholder=String(v);publish();}
 set disabled(v){this.attrs.disabled=!!v;publish();}get disabled(){return !!this.attrs.disabled;}
 set innerHTML(html){this.textContent='';const stack=[this];
  for(const token of String(html).match(/<[^>]*>|[^<]+/g)||[]){
   if(token.startsWith('</')){if(stack.length>1)stack.pop();continue;}
   if(token.startsWith('<')){const m=token.match(/^<([a-z][\w-]*)/i);if(!m)continue;const child=new Element(m[1]);
    for(const a of token.matchAll(/\s([\w-]+)=["']([^"']*)["']/g))child.setAttribute(a[1],a[2]);
    stack.at(-1).append(child);if(!/\/>$/.test(token)&&!['INPUT','BR','HR'].includes(child.tagName))stack.push(child);
   }else{const child=new Element('span');child.textContent=token;stack.at(-1).append(child);}
  }publish();
 }
 append(...items){for(let item of items){if(!(item instanceof Element)){const text=new Element('span');text.textContent=item;item=text;}item.remove();item.parentElement=this;this.children.push(item);}publish();}
 appendChild(child){this.append(child);return child;}
 remove(){if(this.parentElement){const p=this.parentElement;p.children=p.children.filter(c=>c!==this);this.parentElement=null;publish();}}
 replaceChildren(...items){for(const c of this.children)c.parentElement=null;this.children=[];this._text='';this.append(...items);}
 setAttribute(name,value){this.attrs[name]=String(value);publish();}getAttribute(name){return this.attrs[name]??null;}
 matches(s){if(s[0]==='#')return this.id===s.slice(1);if(s[0]==='.')return this.classList.contains(s.slice(1));return this.tagName.toLowerCase()===s.toLowerCase();}
 querySelectorAll(s){return this.children.flatMap(c=>[...(c.matches(s)?[c]:[]),...c.querySelectorAll(s)]);}
 querySelector(s){return this.querySelectorAll(s)[0]||null;}closest(s){return this.matches(s)?this:this.parentElement?.closest(s)||null;}
 addEventListener(t,fn){(this.listeners[t]??=[]).push(fn);}removeEventListener(t,fn){this.listeners[t]=(this.listeners[t]||[]).filter(x=>x!==fn);}
 toJSON(){return {uid:this.uid,tag:this.tagName.toLowerCase(),text:this._text,attrs:this.attrs,style:{...this.style},value:this.value,checked:this.checked,children:this.children.map(x=>x.toJSON())};}
}
const body=new Element('body');
globalThis.document={body,createElement:t=>new Element(String(t)),querySelector:s=>s==='body'?body:body.querySelector(s),querySelectorAll:s=>body.querySelectorAll(s)};
globalThis.window=globalThis;
globalThis.localStorage={getItem:k=>storage[k]??null,setItem:(k,v)=>{storage[String(k)]=String(v);send('storage',{storage});},removeItem:k=>{delete storage[k];send('storage',{storage});},clear:()=>{storage={};send('storage',{storage});}};
globalThis.alert=x=>log('Xabar:',x);
globalThis.prompt=(q,initial='')=>{log('prompt laboratoriyada standart qiymatni qaytaradi:',q);return initial;};
globalThis.confirm=q=>{log('confirm laboratoriyada true qaytaradi:',q);return true;};
addEventListener('error',e=>send('error',{text:e.message}));
addEventListener('unhandledrejection',e=>send('error',{text:String(e.reason)}));
onmessage=async event=>{
 const m=event.data;
 if(m.type==='event'){
  const target=nodes.get(m.uid);if(!target)return;target._value=m.value??target.value;target._checked=m.checked??target.checked;
  const e={type:m.event,target,currentTarget:target,preventDefault(){},stopPropagation(){this.stopped=true;}};
  try{for(let node=target;node;node=node.parentElement){e.currentTarget=node;for(const cb of node.listeners[m.event]||[])cb(e);if(e.stopped)break;}publish();}catch(err){send('error',{text:err.name+': '+err.message});}return;
 }
 if(m.type!=='start')return;storage=m.storage||{};
 try{
  if(m.mode==='check'){
   const solve=new Function(`${m.source}\n;return typeof solve==='function'?solve:null;`)();
   if(!solve)throw new Error('solve nomli funksiya yozing.');
   const actual=[];for(const test of m.tests)actual.push(await solve(...test.args));send('results',{actual});
  }else{new Function(m.source)();publish();send('ready');}
 }catch(err){send('error',{text:err.name+': '+err.message});}
};
