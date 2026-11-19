import {bindLesson04} from './components/Lesson04.js';
import { renderLessonText } from './components/lessonText.js';
import { attachCodeEditor } from './components/CodeEditor.js';
import './styles/main.css';
import './styles/lesson04.css';
import { exercises } from './data/curriculum.js';
import { renderTheory, renderSetup, renderCodeNotes, escapeHTML } from './components/LessonViewer.js';
import { renderQuiz } from './components/Quiz.js';
import { renderExercises } from './components/ExerciseCard.js';
import { renderLessonProgress } from './components/ProgressTracker.js';
import { recordFor, completionAllowed } from './services/progressService.js';
import { lessons, weeks, getLesson, getLessonIndex, lessonURL, lessonFromHash } from './lib/course.js';
import { loadState, saveState, exportProgress, importProgress } from './lib/storage.js';
import { renderVideo } from './components/video.js';
import { runCode, stopCode } from './components/codeRunner.js';

let state = loadState();
state.completed=state.completed.filter(id=>lessons.some(item=>item.id===id));
if (!location.hash && state.lastLesson) history.replaceState(null, '', '#/' + state.lastLesson);
let lesson = lessonFromHash();
let query = '';
let sidebarOpen = false;
let currentTab = 'lesson';

const root = document.querySelector('#app');
root.innerHTML = `
  <div class="layout" id="layout">
    <aside class="sidebar" id="sidebar">
      <div class="brand"><span class="brand-icon">JS</span><div><strong>JavaScript Akademiya</strong><small>0-modul + 12 hafta · 54 dars</small></div></div>
      <div class="progress-card"><div class="between"><b>O‘quv natijangiz</b><span id="progressPercent">0%</span></div><div class="progress-track"><div id="progressFill"></div></div><span id="progressText">0 / 54 dars</span><p id="globalExerciseProgress"></p></div>
      <label class="search-label" for="search">Darslarni izlash</label><input id="search" type="search" placeholder="Mavzuni qidiring..." autocomplete="off" />
      <nav id="nav" aria-label="Darslar mundarijasi"></nav>
      <div class="sidebar-footer">JavaScript amaliy mashqlari · Video qo‘shish uchun tayyor.</div>
    </aside>
    <div class="page">
      <header class="topbar"><button id="menu" class="icon-button menu-button" aria-label="Mundarijani ochish">☰</button><span id="breadcrumb" class="breadcrumb"></span><div class="top-actions"><button class="ghost-button" id="themeToggle">☾ Rejim</button><button class="ghost-button" id="exportBtn">↓ Natijani saqlash</button><label class="ghost-button import-label" for="importFile">↑ Tiklash</label><input id="importFile" type="file" accept="application/json" hidden /></div></header>
      <main class="content">
        <section class="hero"><div class="eyebrow" id="eyebrow"></div><h1 id="title"></h1><p id="lead"></p><div class="hero-tags"><span>📖 Nazariya</span><span>💻 Kod laboratoriyasi</span><span>🎯 Amaliyot</span><span>🎬 Video</span></div></section>
        <div class="tabs" role="tablist" aria-label="Dars bo‘limlari"><button data-tab="lesson" class="tab active">Dars</button><button data-tab="practice" class="tab">Amaliyot va uy vazifasi</button><button data-tab="exercise" class="tab">Algoritmik masalalar</button><button data-tab="quiz" class="tab">Mini-test</button><button data-tab="video" class="tab">Video dars</button><button data-tab="notes" class="tab">Qaydlar</button></div>
        <div id="lessonPanel" class="tab-panel">
          <section class="panel"><div class="section-heading"><span class="section-num">01</span><h2 id="topicTitle">Mavzu:</h2></div><p id="concept" class="concept"></p><p id="explain" class="text"></p><p id="tip" class="tip"></p><div id="theoryExtras"></div></section><div id="setupMount"></div>
          <section class="panel"><div class="section-heading"><span class="section-num">02</span><h2>Kodni o‘zimiz sinaymiz</h2></div><p class="muted">Kodni o‘zgartiring va «Ishga tushirish»ni bosing. Konsol natijasi quyida ko‘rinadi. DOM kodlari quyidagi o‘quv maydonida aks etadi.</p><div class="editor-top"><span>script.js · <span id="fileName"></span></span><div><button id="copyCode" class="ghost-button">Nusxalash</button><button id="resetCode" class="ghost-button">↻ Tiklash</button><button id="runCode" class="primary-button">▶ Ishga tushirish</button><button id="stopCode" class="ghost-button">■ To‘xtatish</button></div></div><textarea id="editor" class="editor" spellcheck="false" aria-label="JavaScript kod muharriri"></textarea><div class="console-title">Konsol natijasi</div><pre id="output" class="console">▶ Kodni ishga tushiring</pre><div id="preview"></div><div id="codeNotes"></div><small class="muted">Kod alohida Worker’da bajariladi; 15 soniyada to‘xtaydi. DOM o‘quv adapteri asosiy elementlar va hodisalarni qo‘llaydi. To‘liq brauzer APIlari uchun VS Code loyihangizdan foydalaning.</small></section>
        </div>
        <div id="practicePanel" class="tab-panel hidden"><section class="panel"><div class="section-heading"><span class="section-num">03</span><h2>Mustaqil amaliy mashq</h2></div><div class="assignment"><span class="small-label">Topshiriq</span><p id="practice"></p></div><div id="practiceTasks"></div><h3>O‘zingizni tekshiring</h3><p id="check"></p></section><section class="panel"><div class="section-heading"><span class="section-num">04</span><h2>Mustaqil uy vazifasi</h2></div><div class="assignment homework"><span class="small-label">JavaScript amaliyoti</span><p id="home"></p><div id="homeworkList"></div></div></section></div>
        <div id="exercisePanel" class="tab-panel hidden"></div>
        <div id="quizPanel" class="tab-panel hidden"></div>
        <div id="videoPanel" class="tab-panel hidden"><section class="panel"><div class="section-heading"><span class="section-num">🎬</span><h2>Video dars</h2></div><div id="videoMount" class="video-mount"></div><p class="muted">Video ulash bo‘yicha yo‘riqnoma: <code>docs/VIDEO_QOSHISH.md</code>. Video fayl yoki YouTube manzilini dars ma’lumotiga kiritasiz.</p></section></div>
        <div id="notesPanel" class="tab-panel hidden"><section class="panel"><div class="section-heading"><span class="section-num">✎</span><h2>Shaxsiy qaydlarim</h2></div><p class="muted">O‘rganilgan mavzular, xatolar va uy vazifasi haqidagi fikrlarni yozing.</p><textarea id="notes" class="notes" placeholder="Bugun nimalarni o‘rgandim?..."></textarea><small class="muted">Qaydlar brauzeringizda localStorage orqali saqlanadi. Ularni yuqoridagi tugma bilan faylga eksport qiling.</small></section></div>
        <div id="bugMount"></div><div id="lessonProgress"></div>
        <div class="lesson-bottom"><label class="complete"><input type="checkbox" id="complete" /><span>Bu darsni tushundim va amaliyotini bajardim</span></label><div class="nav-buttons"><button id="prev" class="ghost-button">← Oldingi dars</button><span id="counter" class="muted"></span><button id="next" class="primary-button">Keyingi dars →</button></div></div>
        <footer>JavaScript Akademiya · 54 dars · Mustaqil ta’lim. © O‘quv maqsadida.</footer>
      </main>
    </div>
  </div><div id="toast" role="status" aria-live="polite"></div>`;

const $ = id=>document.getElementById(id);
function notify(message){ $('toast').textContent=message; $('toast').classList.add('visible');clearTimeout(notify.timer);notify.timer=setTimeout(()=>$('toast').classList.remove('visible'),3000); }
function persist(){if(!saveState(state))notify('Ma’lumot saqlanmadi. Brauzer xotirasi to‘lgan bo‘lishi mumkin.');}
function setTheme(){document.documentElement.dataset.theme=state.theme;$('themeToggle').textContent=state.theme==='dark'?'☀ Yorug‘':'☾ Tungi';}
function navRender(){
  const nav=$('nav');nav.replaceChildren();
  weeks.forEach(week=>{
    const matches=week.lessonIds.map(getLesson).filter(item=>`${item.title} ${item.concept}`.toLocaleLowerCase('uz').includes(query));
    if(!matches.length)return;
    const section=document.createElement('section');section.className='week-group';
    const heading=document.createElement('h3');heading.textContent=`${week.number===0?'0-modul':week.number+'-hafta'} · ${week.title} · ${week.lessonIds.filter(id=>state.completed.includes(id)).length}/${week.lessonIds.length}`;section.append(heading);
    for (const item of matches){
      const button=document.createElement('a');button.href=lessonURL(item.id);button.className='nav-lesson'+(item.id===lesson.id?' selected':'');
      const number=document.createElement('span');number.className='lesson-number';number.textContent=String(item.number).padStart(2,'0');
      const text=document.createElement('span');text.textContent=item.title;
      const check=document.createElement('span');check.className='done-mark';check.textContent=state.completed.includes(item.id)?'✓':'';
      button.append(number,text,check);section.append(button);
    }
    nav.append(section);
  });
  if(!nav.children.length){const p=document.createElement('p');p.className='muted';p.textContent='Mos dars topilmadi.';nav.append(p);}
}
function progressRender(){const count=state.completed.length;$('progressText').textContent=`${count} / ${lessons.length} dars`;$('progressPercent').textContent=`${Math.round(count/lessons.length*100)}%`;$('progressFill').style.width=`${count/lessons.length*100}%`;$('globalExerciseProgress').textContent=`${exercises.filter(x=>state.exerciseResults[x.id]?.passed).length}/${exercises.length} masala yechilgan`;}
function selectTab(tab){
  if(lesson.id==='setup-01'&&['practice','exercise'].includes(tab))tab='lesson';
  currentTab=tab;
  document.querySelectorAll('.tab').forEach(x=>{x.classList.toggle('active',x.dataset.tab===tab);x.setAttribute('aria-selected',String(x.dataset.tab===tab));});
  for(const name of ['lesson','practice','video','notes','exercise','quiz'])$(name+'Panel').classList.toggle('hidden',name!==tab);
  if(tab==='video'){const id=lesson.id;renderVideo($('videoMount'),lesson.video,state.videoProgress[id],progress=>{state.videoProgress[id]=progress;persist();});}
  if(!['exercise','quiz'].includes(tab)){$('exercisePanel').classList.add('hidden');$('quizPanel').classList.add('hidden');}
  if(tab==='exercise')$('exercisePanel').classList.remove('hidden');
  if(tab==='quiz')$('quizPanel').classList.remove('hidden');
  state.positions[lesson.id]={...state.positions[lesson.id],tab};persist();
}
function renderLesson(){
  stopCode();$('preview').replaceChildren();lesson=lessonFromHash();const index=getLessonIndex(lesson.id);state.lastLesson=lesson.id;persist();
  document.querySelectorAll('[data-tab="practice"],[data-tab="exercise"]').forEach(button=>button.classList.toggle('hidden',lesson.id==='setup-01'));
  $('editor').closest('section.panel').classList.toggle('hidden',lesson.id==='setup-01');
  $('layout').classList.toggle('lesson04',lesson.id==='lesson-04');
  $('bugMount').classList.toggle('hidden',['setup-01','lesson-04'].includes(lesson.id));
  document.querySelector('[data-tab="quiz"]').textContent=lesson.id==='lesson-04'?'Bilimni tekshirish':'Mini-test';
  document.querySelector('#editor').closest('section').querySelector('p.muted').hidden=lesson.id==='lesson-04';
  document.querySelector('#editor').closest('section').querySelector('small.muted').hidden=lesson.id==='lesson-04';
  document.querySelector('#videoPanel p.muted').hidden=lesson.id==='lesson-04';
  document.querySelector('.hero-tags span:nth-child(2)').classList.toggle('hidden',lesson.id==='setup-01');
  $('eyebrow').textContent=`${lesson.week===0?'0-modul':lesson.week+'-hafta'} / ${lesson.number}-dars / ~${lesson.durationMinutes} daqiqa`;
  $('title').textContent=lesson.title;$('topicTitle').textContent='Mavzu: '+lesson.title;$('lead').textContent=lesson.concept;
  $('breadcrumb').textContent=`Bosh sahifa / ${lesson.week===0?'0-modul':lesson.week+'-hafta'} / ${lesson.number}-dars`;
  $('concept').textContent=['setup-01','lesson-04'].includes(lesson.id)?'':lesson.concept;$('explain').textContent=['setup-01','lesson-04'].includes(lesson.id)||lesson.reading?'':lesson.explain;
  $('tip').hidden=lesson.id==='lesson-04';$('tip').textContent=lesson.id==='setup-01'?'':lesson.tip||'Koddagi har bir operatorni tushunib, natijani oldindan taxmin qilishga harakat qiling.';
  $('fileName').textContent=lesson.id+'.js';$('editor').value=state.drafts[lesson.id]??lesson.code;
  $('output').textContent='▶ Kodni ishga tushiring';$('practice').textContent=lesson.practice;
  $('check').textContent=lesson.check;$('home').textContent=lesson.home;
  $('notes').value=state.notes[lesson.id]??'';$('complete').checked=state.completed.includes(lesson.id);
  $('counter').textContent=`${index+1} / ${lessons.length}`;$('prev').disabled=index===0;$('next').disabled=index===lessons.length-1;
  recordFor(state,lesson.id);
  for(const id of ['concept','explain','tip'])$(id).classList.toggle('hidden',lesson.id==='setup-01');
  renderTheory($('theoryExtras'),lesson);
  if(lesson.id==='lesson-04')bindLesson04($('theoryExtras'),{notify,editCode:code=>{$('editor').value=code;state.drafts[lesson.id]=code;persist();$('editor').focus();$('editor').scrollIntoView({block:'center',behavior:'smooth'});}});
  renderCodeNotes($('codeNotes'),lesson);
  renderSetup($('setupMount'),lesson,state,refreshLearning);
  const record=recordFor(state,lesson.id);
  $('practiceTasks').innerHTML=lesson.practices.map((p,i)=>'<label class="practice-task"><input type="checkbox" data-practice="'+i+'" '+(record.practice.includes(i)?'checked':'')+'><span><b>'+escapeHTML(p.level)+'</b><br>'+escapeHTML(p.task)+'</span></label>').join('');
  $('practiceTasks').querySelectorAll('[data-practice]').forEach(input=>input.onchange=()=>{const index=Number(input.dataset.practice);record.practice=input.checked?[...new Set([...record.practice,index])]:record.practice.filter(x=>x!==index);refreshLearning();});
  $('homeworkList').textContent=lesson.homework.length?'Shu dars uchun tekshirilgan masalalar: '+lesson.homework.join(', ')+'. Masalalar bo‘limida yeching.':'Qo‘shimcha amaliy mashq: mini-loyihani tugating, uchta sinov natijasini qaydlarga yozing.';
  $('homeworkList').classList.toggle('hidden',['setup-01','lesson-04'].includes(lesson.id));
  renderExercises($('exercisePanel'),exercises.filter(x=>lesson.exerciseIds.includes(x.id)),state,refreshLearning);
  renderQuiz($('quizPanel'),lesson,state,refreshLearning);
  if(lesson.id!=='lesson-04'){
  $('bugMount').innerHTML='<section class="panel"><div class="learning-label">XATOLAR LABORATORIYASI</div><h2>Xatoni toping va tuzating</h2><pre class="code-sample">'+escapeHTML(lesson.bug.code)+'</pre><button id="tryBug" class="ghost-button">Muharrirga olib o‘tish</button><details><summary>Yordamchi ishora</summary><div class="bug-hint">'+(lesson.id==='setup-01'?renderLessonText(lesson.bug.hint):escapeHTML(lesson.bug.hint))+'</div></details></section>';
  $('tryBug').onclick=()=>{$('editor').value=lesson.bug.code;state.drafts[lesson.id]=lesson.bug.code;selectTab('lesson');persist();$('editor').focus();$('editor').scrollIntoView({block:'center'});};
  }else $('bugMount').replaceChildren();
  refreshLearning();
  currentTab=['lesson','practice','video','notes','exercise','quiz'].includes(state.positions[lesson.id]?.tab)?state.positions[lesson.id].tab:'lesson';
  navRender();progressRender();selectTab(currentTab);
  sidebarOpen=false;$('layout').classList.remove('sidebar-open');requestAnimationFrame(()=>window.scrollTo({top:Number(state.positions[lesson.id]?.scroll)||0,behavior:'instant'}));
}

$('search').addEventListener('input',e=>{query=e.target.value.toLocaleLowerCase('uz').trim();navRender()});
$('menu').addEventListener('click',()=>{sidebarOpen=!sidebarOpen;$('layout').classList.toggle('sidebar-open',sidebarOpen)});
$('themeToggle').addEventListener('click',()=>{state.theme=state.theme==='dark'?'light':'dark';setTheme();persist()});
$('exportBtn').addEventListener('click',()=>exportProgress(state));
$('importFile').addEventListener('change',async e=>{
  const file=e.target.files?.[0];if(!file)return;
  try {state=await importProgress(file);state.completed=state.completed.filter(id=>lessons.some(l=>l.id===id));persist();setTheme();renderLesson();notify('Natijalar tiklandi');}
  catch(err){notify('Import xatosi: '+err.message)} e.target.value='';
});
document.querySelectorAll('.tab').forEach(btn=>btn.addEventListener('click',()=>selectTab(btn.dataset.tab)));
$('editor').addEventListener('input',()=>{state.drafts[lesson.id]=$('editor').value;persist()});
$('notes').addEventListener('input',()=>{state.notes[lesson.id]=$('notes').value;persist()});
function refreshLearning(){
  renderLessonProgress($('lessonProgress'),lesson,state);
  $('complete').checked=state.completed.includes(lesson.id);
  const allowed=completionAllowed(state,lesson);
  $('complete').disabled=!allowed&&!state.completed.includes(lesson.id);
  $('complete').title=allowed?'Darsni yakunlash':'Yakuniy nazorat talablarini bajaring';
  if(!allowed&&state.completed.includes(lesson.id)&&lesson.week===0){state.completed=state.completed.filter(x=>x!==lesson.id);$('complete').checked=false;}
  persist();progressRender();
}
$('complete').addEventListener('change',e=>{
  if(e.target.checked&&!completionAllowed(state,lesson)){e.target.checked=false;notify('Avval yakuniy nazorat talablarini bajaring');return;}
  const record=recordFor(state,lesson.id);record.completedAt=e.target.checked?new Date().toISOString():null;
  state.completed=e.target.checked?[...new Set([...state.completed,lesson.id])]:state.completed.filter(id=>id!==lesson.id);
  persist();navRender();progressRender();notify(e.target.checked?'Dars bajarildi deb belgilandi':'Dars belgisi olib tashlandi');
});
$('resetCode').addEventListener('click',()=>{delete state.drafts[lesson.id];$('editor').value=lesson.code;persist();notify('Boshlang‘ich kod tiklandi')});
$('copyCode').addEventListener('click',async()=>{try{await navigator.clipboard.writeText($('editor').value);notify('Kod nusxalandi');}catch{notify('Nusxalash uchun kodni belgilang va Ctrl+C bosing');}});
$('runCode').addEventListener('click',()=>{const id=lesson.id;runCode($('editor').value,$('output'),$('preview'),value=>{state.labStorage[id]=value;persist();},state.labStorage[id]||{});});
$('stopCode').addEventListener('click',()=>{stopCode();$('preview').replaceChildren();notify('Kod bajarilishi to‘xtatildi')});
$('prev').addEventListener('click',()=>{const i=getLessonIndex(lesson.id);if(i>0)location.hash=lessonURL(lessons[i-1].id)});
$('next').addEventListener('click',()=>{const i=getLessonIndex(lesson.id);if(i<lessons.length-1)location.hash=lessonURL(lessons[i+1].id)});
window.addEventListener('hashchange',renderLesson);
let scrollTimer;
window.addEventListener('scroll',()=>{const id=lesson.id,top=window.scrollY;clearTimeout(scrollTimer);scrollTimer=setTimeout(()=>{state.positions[id]={...state.positions[id],scroll:top};persist();},250);},{passive:true});
window.addEventListener('pagehide',()=>{state.positions[lesson.id]={...state.positions[lesson.id],scroll:window.scrollY};persist();stopCode();});
attachCodeEditor($('editor'));
setTheme();renderLesson();
