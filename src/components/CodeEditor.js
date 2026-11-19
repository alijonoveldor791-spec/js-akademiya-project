import { escapeHTML, highlightJavaScript } from './lessonText.js';
export { highlightJavaScript };
export function formatJavaScript(source) {
 const raw = String(source || '').replace(/\r\n/g, '\n');
 let indent = 0;
 const out = [];
 for (const rawLine of raw.split('\n')) {
  const line = rawLine.trim();
  if (!line) { if (out.length && out[out.length - 1] !== '') out.push(''); continue; }
  if (/^[}\])]/.test(line)) indent = Math.max(0, indent - 1);
  out.push('  '.repeat(indent) + line);
  const opens = (line.match(/\{/g) || []).length;
  const closes = (line.match(/\}/g) || []).length;
  if (opens > closes && !/^[}\])]/.test(line)) indent += opens - closes;
  else if (opens > closes) indent += opens - closes;
 }
 while (out.length && out[out.length - 1] === '') out.pop();
 return out.join('\n');
}

// The native textarea keeps keyboard, selection and accessibility behavior.
export function attachCodeEditor(textarea) {
 if(textarea.dataset.highlighted)return;textarea.dataset.highlighted='true';
 const wrapper=document.createElement('div');wrapper.className='code-editor-shell';
 const highlight=document.createElement('pre');highlight.className='code-highlight';highlight.setAttribute('aria-hidden','true');
 textarea.before(wrapper);wrapper.append(highlight,textarea);
 const paint=()=>{
  const source=textarea.value;
  highlight.innerHTML=highlightJavaScript(source)+'\n';
  highlight.scrollTop=textarea.scrollTop;
  highlight.scrollLeft=textarea.scrollLeft;
 };
 const descriptor=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value');
 Object.defineProperty(textarea,'value',{configurable:true,get(){return descriptor.get.call(this);},set(value){descriptor.set.call(this,value);paint();}});
 textarea.addEventListener('input',paint);textarea.addEventListener('scroll',()=>{highlight.scrollTop=textarea.scrollTop;highlight.scrollLeft=textarea.scrollLeft;});paint();
}
