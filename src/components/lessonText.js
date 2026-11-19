export const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// Escape source before adding the supported inline formatting. HTML stays inert.
const inlineText=value=>escapeHTML(value).replace(/`([^`]+)`/g,'<code class="inline-code">$1</code>').replace(/\*\*([^*]+)\*\*/g,'<strong>$1</strong>');
export function renderLessonText(source,{coloredTypes=false}={}) {
 const lines=String(source).split('\n');
 const html=[];let paragraph=[];let sectionOpen=false;
 const flush=()=>{if(paragraph.length){html.push(`<p>${inlineText(paragraph.join(' '))}</p>`);paragraph=[];}};
 for(let i=0;i<lines.length;i++){
  const line=lines[i];
  if(line.startsWith('```')){
   flush();const code=[];while(++i<lines.length&&!lines[i].startsWith('```'))code.push(lines[i]);
   html.push(`<pre class="code-sample"><code>${escapeHTML(code.join('\n'))}</code></pre>`);
  }else if(line.startsWith('### ')){
   flush();
   if(coloredTypes){
    if(sectionOpen)html.push('</section>');
    const type=line.match(/^### \d+\. (String|Number|Boolean|Null|Undefined)\b/i)?.[1].toLowerCase();
    html.push(type?`<section class="type-section type-${type}">`:'<section class="reading-section">');sectionOpen=true;
   }
   html.push(`<h3>${inlineText(line.slice(4))}</h3>`);
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
