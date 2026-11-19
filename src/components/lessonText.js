export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

export function highlightJavaScript(source) {
 const tokens=/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|`(?:\\.|[^`\\])*`|\b\d+(?:\.\d+)?\b|\b[A-Za-z_$][\w$]*\b)/g;
 let cursor=0,html='';
 for(const match of String(source??'').matchAll(tokens)){
  const token=match[0];let kind='variable';
  if(token.startsWith('//')||token.startsWith('/*'))kind='comment';
  else if(/^["'`]/.test(token))kind='string';
  else if(/^\d/.test(token))kind='number';
  else if(/^(let|const|var|true|false|null|undefined|typeof|function|return|if|else|for|while|switch|case|break|continue|default|new|throw|try|catch|finally|async|await|import|export)$/.test(token))kind='keyword';
  else if(/^\s*\(/.test(source.slice(match.index+token.length)))kind='function';
  html+=escapeHTML(source.slice(cursor,match.index))+`<span class="token-${kind}">${escapeHTML(token)}</span>`;
  cursor=match.index+token.length;
 }
 return html+escapeHTML(source.slice(cursor));
}

const JS_INLINE_PATTERN = new RegExp([
 'https?:\\/\\/[^\\s)]+',
 '[A-Za-z0-9_-]+\\.(?:html|css|js|json|mjs|exe|msi|ps1|txt|md)\\b',
 '[a-z0-9-]+\\.(?:com|org|dev)\\b(?:\\/[^\\s),.]*)?',
 '<\\/?[a-zA-Z][a-zA-Z0-9-]*(?:\\s+[^<>]*?)?>',
 '\\b(?:else\\s+if|do\\.\\.\\.while|for\\.\\.\\.of|for\\.\\.\\.in)\\b',
 '\\b(?:console|Math|JSON|Number|String|Boolean|Object|Array|Promise|Date|localStorage|document|window)\\.[A-Za-z_$][\\w$]*(?:\\([^()\\n]*\\))?',
 '\\b[a-zA-Z_$][\\w$]*\\.[A-Za-z_$][\\w$]*(?:\\.[A-Za-z_$][\\w$]*)*\\([^()\\n]*\\)',
 '\\b(?:querySelector|querySelectorAll|createElement|addEventListener|preventDefault|classList|textContent|innerHTML|setTimeout|setInterval|clearInterval|clearTimeout|stringify|parse|toLowerCase|toUpperCase|toFixed|includes|trim|split|join|push|pop|map|filter|reduce|closest|append|remove|setItem|getItem|isNaN|isFinite|floor|ceil|round|sqrt|fetch)(?=(?:ga|da|dan|dagi|ni|ning)?(?=$|[\\s.,:;!?)"\'\\]]))(?:\\([^()\\n]*\\))?',
 '\\b[a-z_][a-zA-Z0-9_$]*\\([^()\\n]{0,30}\\)',
 '===|!==|==|!=|<=|>=|=>|&&|\\|\\||\\*\\*|\\+=|-=|\\*=|\\/=|%=|\\+\\+|--|\\.\\.\\.',
 '(?<=^|[\\s(,])[+\\-*/%=<>](?=$|[\\s),])',
 '(?<=^|[\\s(])!(?=[A-Za-z_$\\s(])',
 '(?<=[A-Za-z0-9_)])[%*](?=[A-Za-z0-9_(])',
 '(?<=[A-Za-z0-9_\\]])=(?=[A-Za-z0-9_"\'\\[{\\+\\-])',
 '\\b(?:let|const|function|return|else|switch|break|continue|default|while|catch|finally|throw|typeof|async|await|import|export|true|false|null|undefined|NaN|Infinity|console|Math|JSON|Number|String|Boolean|Promise|localStorage|document|SyntaxError|ReferenceError|TypeError)(?=(?:ga|da|dan|dagi|ni|ning)?(?=$|[\\s.,:;!?)"\'\\]]))',
 '\\b(?:if|for|var|case|try|new|find)\\b'
].join('|'), 'g');

function classifyInlineToken(token) {
 if (/^(https?:\/\/|<\/?[a-zA-Z]|[A-Za-z0-9_-]+\.(?:html|css|js|json|mjs|exe|msi|ps1|txt|md)$|[a-z0-9-]+\.(?:com|org|dev))/.test(token)) {
  if (token.startsWith('<')) return 'lit';
  return null;
 }
 if (/^(?:===|!==|==|!=|<=|>=|=>|&&|\|\||\*\*|\+=|-=|\*=|\/=|%=|\+\+|--|\.\.\.|[+\-*/%=<>!])$/.test(token)) return 'op';
 if (/^(?:else\s+if|do\.\.\.while|for\.\.\.of|for\.\.\.in|let|const|var|function|return|if|else|for|while|switch|case|break|continue|default|try|catch|finally|throw|new|typeof|async|await|import|export)$/.test(token)) return 'kw';
 if (/^(?:true|false|null|undefined|NaN|Infinity|console|Math|JSON|Number|String|Boolean|Promise|localStorage|document|SyntaxError|ReferenceError|TypeError)$/.test(token)) return 'lit';
 return 'fn';
}

function highlightProseSegment(segment) {
 let cursor = 0;
 let out = '';
 for (const match of segment.matchAll(JS_INLINE_PATTERN)) {
  const token = match[0];
  const kind = classifyInlineToken(token);
  if (!kind) continue;
  out += escapeHTML(segment.slice(cursor, match.index));
  out += `<code class="inline-js inline-js-${kind}">${escapeHTML(token)}</code>`;
  cursor = match.index + token.length;
 }
 return out + escapeHTML(segment.slice(cursor));
}

export function formatInlineJS(value) {
 const source = String(value ?? '');
 if (!source) return '';
 let out = '';
 let cursor = 0;
 for (const match of source.matchAll(/`([^`]+)`|\*\*([^*]+)\*\*/g)) {
  out += highlightProseSegment(source.slice(cursor, match.index));
  if (match[1] !== undefined) {
   out += `<code class="inline-code inline-js">${highlightProseSegment(match[1])}</code>`;
  } else {
   out += `<strong>${highlightProseSegment(match[2])}</strong>`;
  }
  cursor = match.index + match[0].length;
 }
 return out + highlightProseSegment(source.slice(cursor));
}

const inlineText=value=>formatInlineJS(value);
export function renderLessonText(source,{coloredTypes=false}={}) {
 const lines=String(source).split('\n');
 const html=[];let paragraph=[];let sectionOpen=false;
 const flush=()=>{if(paragraph.length){html.push(`<p>${inlineText(paragraph.join(' '))}</p>`);paragraph=[];}};
 for(let i=0;i<lines.length;i++){
  const line=lines[i];
  if(line.startsWith('```')){
   flush();const code=[];while(++i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i]);
   html.push(`<pre class="code-sample"><code>${highlightJavaScript(code.join('\n'))}</code></pre>`);
  }else if(line.startsWith('### ')){
   flush();
   if(coloredTypes){
    if(sectionOpen)html.push('</section>');
    const type=line.match(/^### \d+\. (String|Number|Boolean|Null|Undefined)\b/i)?.[1].toLowerCase();
    html.push(type?`<section class="type-section type-${type}">`:'<section class="reading-section">');sectionOpen=true;
   }
   html.push(`<h3>${escapeHTML(line.slice(4))}</h3>`);
   }else if(line.startsWith('- ')){
   flush();const items=[line.slice(2)];
   while(i+1<lines.length&&lines[i+1].startsWith('- '))items.push(lines[++i].slice(2));
   html.push(`<ul>${items.map(x=>`<li>${inlineText(x)}</li>`).join('')}</ul>`);
  }else if(/^\d+\. /.test(line)){
   flush();const items=[line.replace(/^\d+\. /,'')];
   while(i+1<lines.length&&/^\d+\. /.test(lines[i+1]))items.push(lines[++i].replace(/^\d+\. /,''));
   html.push(`<ol>${items.map(x=>`<li>${inlineText(x)}</li>`).join('')}</ol>`);
  }else if(!line.trim())flush();else paragraph.push(line);
 }
 flush();if(sectionOpen)html.push('</section>');return html.join('');
}
