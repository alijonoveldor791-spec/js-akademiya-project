import { questions } from './data.js';
import { calculateScore,shuffle } from './score.js';
const KEY='js-akademiya-capstone-v1';
const mount=document.querySelector('#test');
let warning='';
function fresh(){return {order:shuffle(questions).map(q=>q.id),current:0,answers:{},end:Date.now()+180000,finished:false};}
function load(){
 try{
  const data=JSON.parse(localStorage.getItem(KEY)||'null');
  if(!data)return null;
  if(!Array.isArray(data.order)||data.order.length!==questions.length||new Set(data.order).size!==questions.length||!data.order.every(id=>questions.some(q=>q.id===id))||!Number.isInteger(data.current)||data.current<0||data.current>=questions.length||!data.answers||typeof data.answers!=='object'||!Number.isFinite(data.end))return null;
  for(const [id,answer] of Object.entries(data.answers)){const q=questions.find(q=>q.id===id);if(!q||!Number.isInteger(answer)||answer<0||answer>=q.options.length)return null;}
  return {...data,finished:!!data.finished};
 }catch{return null;}
}
let state=load();let timer=null;
function save(){try{localStorage.setItem(KEY,JSON.stringify(state));}catch{warning='Brauzer xotirasiga saqlash imkoni yo‘q. Natija faqat shu oynada qoladi.';}}
function escape(value){return String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));}
function render(){
 if(!state){mount.innerHTML='<h2>Tayyormisiz?</h2><p>Vaqt testni boshlaganingizda yuradi. Javoblar shu brauzerda saqlanadi.</p><button id="start">Testni boshlash</button>';document.querySelector('#start').onclick=start;return;}
 if(state.finished){
  const result=calculateScore(questions,state.answers);
  mount.innerHTML=`<p class="eyebrow">YAKUNIY NATIJA</p><h2>${result.percent}% — ${result.correct}/${result.total}</h2><p>Xato: ${result.wrong}. Javobsiz: ${result.unanswered}.</p>${questions.map(q=>`<article class="${state.answers[q.id]===q.answer?'correct':'wrong'}"><h3>${escape(q.text)}</h3><p>Sizning javobingiz: ${escape(q.options[state.answers[q.id]]??'Javobsiz')}</p><p>To‘g‘ri: ${escape(q.options[q.answer])}</p><p>${escape(q.explanation)}</p></article>`).join('')}<button id="restart">Yangi urinish</button>`;
  document.querySelector('#restart').onclick=start;return;
 }
 const q=questions.find(q=>q.id===state.order[state.current]);
 mount.innerHTML=`<div class="row"><b>${state.current+1}/${questions.length} savol</b><span id="time" role="timer"></span></div><progress max="${questions.length}" value="${Object.keys(state.answers).length}" aria-label="Javob berilgan savollar"></progress><h2>${escape(q.text)}</h2><fieldset><legend>Javobni tanlang</legend>${q.options.map((option,i)=>`<label><input name="answer" type="radio" value="${i}" ${state.answers[q.id]===i?'checked':''}>${escape(option)}</label>`).join('')}</fieldset><div class="row"><button id="previous" ${state.current===0?'disabled':''}>← Oldingi</button><button id="next" ${state.current===questions.length-1?'disabled':''}>Keyingi →</button></div><button class="secondary" id="finish">Testni yakunlash</button>${warning?`<p>${escape(warning)}</p>`:''}`;
 mount.querySelectorAll('[name="answer"]').forEach(input=>input.onchange=()=>{state.answers[q.id]=Number(input.value);save();mount.querySelector('progress').value=Object.keys(state.answers).length;});
 document.querySelector('#previous').onclick=()=>{if(state.current>0){state.current--;save();render();}};
 document.querySelector('#next').onclick=()=>{if(state.current<questions.length-1){state.current++;save();render();}};
 document.querySelector('#finish').onclick=finish;
 tick();
}
function start(){clearInterval(timer);state=fresh();save();render();timer=setInterval(tick,250);}
function finish(){if(!state||state.finished)return;state.finished=true;clearInterval(timer);save();render();}
function tick(){
 if(!state||state.finished)return;
 const seconds=Math.max(0,Math.ceil((state.end-Date.now())/1000));
 if(seconds===0){finish();return;}
 const el=document.querySelector('#time');if(el)el.textContent=`${Math.floor(seconds/60)}:${String(seconds%60).padStart(2,'0')}`;
}
if(state&&!state.finished&&state.end<=Date.now())state.finished=true;
render();if(state&&!state.finished)timer=setInterval(tick,250);
