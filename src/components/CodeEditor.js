import { escapeHTML } from './lessonText.js';

// The same tokenizer powers lesson samples and the existing accessible editor.
export function highlightJavaScript(source) {
 const tokens=/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;
 let cursor=0,html='';
 for(const match of source.matchAll(tokens)){
  const token=match[0];let kind='variable';
  if(token.startsWith('//')||token.startsWith('/*'))kind='comment';
  else if(/^["'`]/.test(token))kind='string';
  else if(/^\d/.test(token))kind='number';
  else if(/^(let|const|var|true|false|null|undefined|typeof|function|return|if|else|for|while|new|throw|async|await)$/.test(token))kind='keyword';
  else if(/^\s*\(/.test(source.slice(match.index+token.length)))kind='function';
  html+=escapeHTML(source.slice(cursor,match.index))+`<span class="token-${kind}">${escapeHTML(token)}</span>`;
  cursor=match.index+token.length;
 }
 return html+escapeHTML(source.slice(cursor));
}
// The native textarea keeps keyboard, selection and accessibility behavior.
export function attachCodeEditor(textarea) {
 if(textarea.dataset.highlighted)return;textarea.dataset.highlighted='true';
 const wrapper=document.createElement('div');wrapper.className='code-editor-shell';
 const highlight=document.createElement('pre');highlight.className='code-highlight';highlight.setAttribute('aria-hidden','true');
 textarea.before(wrapper);wrapper.append(highlight,textarea);
 const paint=()=>{
  const source=textarea.value;
  if(textarea.closest('.lesson04')){
   highlight.innerHTML=highlightJavaScript(source)+'\n';highlight.scrollTop=textarea.scrollTop;highlight.scrollLeft=textarea.scrollLeft;return;
  }
  const tokens=/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b(?:const|let|function|return|if|else|for|while|do|break|continue|switch|case|default|new|throw|try|catch|async|await|export|import|from|of|true|false|null|undefined)\b|\b\d+(?:\.\d+)?\b)/g;
  let cursor=0,html='';
  for(const match of source.matchAll(tokens)){const token=match[0];html+=escapeHTML(source.slice(cursor,match.index));const kind=token.startsWith('//')||token.startsWith('/*')?'comment':/^["'`]/.test(token)?'string':/^\d/.test(token)?'number':'keyword';html+=`<span class="token-${kind}">${escapeHTML(token)}</span>`;cursor=match.index+token.length;}
  highlight.innerHTML=html+escapeHTML(source.slice(cursor))+'\n';highlight.scrollTop=textarea.scrollTop;highlight.scrollLeft=textarea.scrollLeft;
 };
 const descriptor=Object.getOwnPropertyDescriptor(HTMLTextAreaElement.prototype,'value');
 Object.defineProperty(textarea,'value',{configurable:true,get(){return descriptor.get.call(this);},set(value){descriptor.set.call(this,value);paint();}});
 textarea.addEventListener('input',paint);textarea.addEventListener('scroll',()=>{highlight.scrollTop=textarea.scrollTop;highlight.scrollLeft=textarea.scrollLeft;});paint();
}
