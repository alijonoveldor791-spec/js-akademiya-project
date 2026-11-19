import {renderLesson04} from './Lesson04.js';
import { escapeHTML, formatInlineJS, renderLessonText } from './lessonText.js';
import { highlightJavaScript } from './CodeEditor.js';
import { renderLessonVisualDeck } from './VisualDiagrams.js';
export { escapeHTML };
export function renderTheory(container,lesson){
 const e=escapeHTML;
 const f=formatInlineJS;
 if(lesson.id==='lesson-04'){
  renderLesson04(container);
  container.insertAdjacentHTML('beforeend', renderLessonVisualDeck(lesson));
  return;
 }
 if(lesson.id==='setup-01'){
  container.innerHTML=`<h3>Dars maqsadi</h3><ul>${lesson.objectives.map(x=>`<li>${f(x)}</li>`).join('')}</ul><h3>${e(lesson.intro)}</h3>${renderLessonText(lesson.explain)}${renderLessonVisualDeck(lesson)}<div class="web-use"><span>VEBDAGI QO‘LLANISH</span><p>${f(lesson.webUse)}</p></div>`;
  return;
 }
 const sampleCode = `console.log(${lesson.expectedExample.expression});\n// Natija: ${lesson.expectedExample.result}`;
 container.innerHTML=`<h3>Dars maqsadi</h3><ul>${lesson.objectives.map(x=>`<li>${f(x)}</li>`).join('')}</ul><div class="tip">${f(lesson.principle)}</div>${renderLessonVisualDeck(lesson)}${lesson.reading?`<article class="lesson-reading" aria-label="Mavzu matni">${renderLessonText(lesson.reading,{coloredTypes:true})}</article>`:''}${lesson.guide?`<h3>${e(lesson.guide[0])}</h3><p>${f(lesson.guide[1])}</p><p>${f(lesson.guide[2])}</p><pre class="code-sample"><code>${highlightJavaScript(lesson.guide[3])}</code></pre><p><b>Kutilgan natija:</b></p><pre class="console">${e(lesson.guide[4])}</pre>`:''}<h3>Sintaksis va kutilgan natija</h3><pre class="code-sample"><code>${highlightJavaScript(sampleCode)}</code></pre><details><summary>Namuna kodni qatorma-qator tushunamiz</summary><ol class="line-guide">${lesson.lineExplanations.map(x=>`<li><code>${x.code?highlightJavaScript(x.code):'∅'}</code><p>${f(x.explanation)}</p></li>`).join('')}</ol></details><div class="web-use"><span>VEBDAGI QO‘LLANISH</span><p>${f(lesson.webUse)}</p>${lesson.week>=11?'<a class="source-link" href="/projects/mini-test/index.html" target="_blank" rel="noopener">Yakuniy mini-test loyihasini ochish ↗</a>':''}</div><div class="lesson-summary"><h3>Bugun nimalarni o‘rgandik:</h3><p>${f(lesson.intro)}</p><ul>${lesson.objectives.map(x=>`<li>${f(x)}</li>`).join('')}</ul></div>`;
}
export function renderCodeNotes(container,lesson){
 container.classList.toggle('hidden',lesson.id!=='setup-01');
 if(lesson.id!=='setup-01'){container.replaceChildren();return;}
 const e=escapeHTML,f=formatInlineJS;
 container.innerHTML=`<h3>${e(lesson.guide[0])}</h3><p>${f(lesson.guide[1])}</p><ol class="line-guide">${lesson.lineExplanations.map(x=>`<li><code>${e(x.code)}</code><p>${f(x.explanation)}</p></li>`).join('')}</ol><h3>Kutilgan konsol natijasi</h3><pre class="console">${e(lesson.guide[4])}</pre><p class="tip">${f(lesson.guide[2])}</p>`;
}
function renderStep(lesson,title,text,result,index){
 const e=escapeHTML,f=formatInlineJS;
 if(lesson.id!=='setup-01')return `<li><h3>${e(title)}</h3><p>${f(text)}</p><div class="step-visual" role="img" aria-label="${e(title)} — ko‘rsatma sxemasi"><span>${index+1}</span><b>${e(title)}</b><small>Kutilgan ko‘rinish: ${f(result)}</small></div><p class="muted">Tekshiruv: ${f(result)}</p></li>`;
 const [task,check]=text.split('\nTekshiruv: ');
 const expected=index===1&&result.includes(' | ')?`<table class="classification-table"><caption>Kutilgan natija jadvali</caption><thead><tr><th scope="col">Texnologiya</th><th scope="col">Xususiyatlar</th></tr></thead><tbody>${result.split('\n').map(row=>{const [technology,features]=row.split(' | ');return `<tr><th scope="row">${e(technology)}</th><td>${f(features)}</td></tr>`;}).join('')}</tbody></table>`:`<p><b>Kutilgan ko‘rinish:</b> ${f(result)}</p>`;
 return `<li><h3>${e(title)}</h3><p>${f(task)}</p>${expected}<p class="muted"><b>Tekshiruv:</b> ${f(check)}</p></li>`;
}
export function renderSetup(container,lesson,state,onChange){
 if(lesson.week!==0){container.replaceChildren();return;}
 const e=escapeHTML,f=formatInlineJS;
 const checks=Array.isArray(state.setupChecks[lesson.id])?state.setupChecks[lesson.id]:[];
 container.innerHTML=`<section class="panel setup-panel"><div class="learning-label">0-MODUL · KOMPYUTERDA BAJARING</div>${lesson.id==='setup-01'&&lesson.code?'<div class="concept-flow"><span>HTML<br><b>Tuzilish</b></span><span>→</span><span>CSS<br><b>Ko‘rinish</b></span><span>→</span><span>JS<br><b>Harakat</b></span></div>':''}${lesson.id==='setup-01'?'<h2>Bosqichma-bosqich mashqlar</h2>':''}<ol class="setup-steps">${lesson.steps.map(([title,text,result],i)=>renderStep(lesson,title,text,result,i)).join('')}</ol>${lesson.html?`<h3>index.html</h3><pre class="code-sample">${e(lesson.html)}</pre>`:''}${lesson.links.map(([title,url])=>`<a class="source-link" href="${e(url)}" target="_blank" rel="noopener noreferrer">${e(title)} ↗</a>`).join('')}${lesson.id==='setup-03'?`<div class="version-fields"><label>node -v natijasi<input id="nodeVersion" placeholder="v24.0.0 (namuna)" value="${e(state.versions.node)}"></label><label>npm -v natijasi<input id="npmVersion" placeholder="11.0.0 (namuna)" value="${e(state.versions.npm)}"></label></div><p class="muted">Bu o‘zingiz kiritgan tasdiq. Brauzer kompyuteringizdagi Node.js’ni avtomatik tekshirmaydi.</p>`:''}<h3>${lesson.id==='setup-06'?'Muhit tayyor!':'Bosqich nazorati'}</h3><div class="setup-checks">${lesson.checks.map((x,i)=>`<label><input type="checkbox" data-setup="${i}" ${checks.includes(i)?'checked':''}><span>${f(x)}</span></label>`).join('')}</div><p class="muted">Barcha bandlar bajarilgandan keyin darsni tugatilgan deb belgilang.</p></section>`;
 container.querySelectorAll('[data-setup]').forEach(input=>input.onchange=()=>{const index=Number(input.dataset.setup);const values=state.setupChecks[lesson.id]||[];state.setupChecks[lesson.id]=input.checked?[...new Set([...values,index])]:values.filter(x=>x!==index);onChange();});
 for(const [id,key] of [['nodeVersion','node'],['npmVersion','npm']]){const input=container.querySelector('#'+id);if(input)input.oninput=()=>{state.versions[key]=input.value.trim();onChange();};}
}
