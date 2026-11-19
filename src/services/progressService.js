import { lessons } from '../data/curriculum.js';
export function recordFor(state,id){
 const r=state.records[id];
 if(!r||typeof r!=='object'||Array.isArray(r))state.records[id]={startedAt:new Date().toISOString(),practice:[],quiz:null,attempts:0};
 const record=state.records[id];if(!Array.isArray(record.practice))record.practice=[];
 const lesson=lessons.find(item=>item.id===id);
 // Only the rewritten lesson's old assessment is retired; notes and code stay intact.
 if(id==='setup-01'&&record.contentVersion!==lesson.schemaVersion){
  record.practice=[];record.quiz=null;record.quizHistory=[];record.attempts=0;record.completedAt=null;
  record.contentVersion=lesson.schemaVersion;
  state.completed=state.completed.filter(item=>item!==id);state.setupChecks[id]=[];
 }
 record.practice=[...new Set(record.practice.filter(x=>Number.isInteger(x)&&x>=0&&x<(lesson?.practices.length||3)))];
 if(!Number.isFinite(Date.parse(record.startedAt)))record.startedAt=new Date().toISOString();
 if(record.quiz){
  const q=record.quiz;
  if(!Array.isArray(q.answers)||q.answers.length!==(lesson?.quiz.length||5)||!q.answers.every((x,i)=>Number.isInteger(x)&&x>=0&&x<(lesson?.quiz[i]?.options.length||3)))record.quiz=null;
  else q.score=Math.min(lesson?.quiz.length||5,Math.max(0,Number(q.score)||0));
 }
 return record;
}
export function setupReady(state,lesson){
 if(lesson.week!==0)return true;
 const checks=state.setupChecks[lesson.id];
 const all=Array.isArray(checks)&&lesson.checks.every((_,i)=>checks.includes(i));
 if(!all)return false;
 if(lesson.id==='setup-03')return /^v\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(state.versions.node||'')&&/^\d+\.\d+\.\d+(?:[-+][\w.-]+)?$/.test(state.versions.npm||'');
 if(lesson.id==='setup-06')return state.completed.includes('setup-03');
 return true;
}
export function completionAllowed(state,lesson){
 if((lesson.week>0||Number(String(lesson.number).split('.')[1])>3)&&!state.completed.includes('setup-03'))return false;
 if(lesson.week===0)return setupReady(state,lesson);
 const record=recordFor(state,lesson.id);
 return record.practice.length>=lesson.practices.length&&(record.quiz?.score||0)>=Math.ceil(lesson.quiz.length*0.8)&&lesson.exerciseIds.every(id=>state.exerciseResults[id]?.passed);
}
export function mastery(state,lesson){
 const record=recordFor(state,lesson.id);
 const practice=record.practice.length/lesson.practices.length;
 const quiz=(record.quiz?.score||0)/lesson.quiz.length;
 const exercise=lesson.exerciseIds.length?lesson.exerciseIds.filter(id=>state.exerciseResults[id]?.passed).length/lesson.exerciseIds.length:practice;
 return Math.round((practice+quiz+exercise)/3*100);
}
