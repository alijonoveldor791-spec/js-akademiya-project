import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons,mainLessons,weeks,exercises } from '../src/data/curriculum.js';
import { guides } from '../src/data/lessons/guides.js';
import { knowledge } from '../src/data/quizzes/knowledge.js';
import { annotations } from '../src/data/lessons/annotations.js';
import { equalResult,validateInput } from '../src/services/exerciseChecker.js';
import { normalizeState } from '../src/lib/storage.js';
import { completionAllowed,recordFor } from '../src/services/progressService.js';
import { calculateScore,shuffle } from '../public/projects/mini-test/score.js';
test('54 unique lessons retain all 48 original IDs and complete learning sections',()=>{
 assert.equal(lessons.length,54);assert.equal(new Set(lessons.map(l=>l.id)).size,54);
 assert.equal(mainLessons.length,48);assert.equal(guides.length,48);assert.equal(knowledge.length,48);assert.equal(annotations.length,48);
 assert.deepEqual(weeks.flatMap(w=>w.lessonIds),lessons.map(l=>l.id));
 for(const l of lessons){assert.equal(l.practices.length,l.id==='lesson-04'?6:3);assert.equal(l.quiz.length,l.id==='lesson-04'?10:5);if(l.id!=='setup-01')assert.ok(l.bug.code);assert.ok(l.webUse);assert.equal(l.lineExplanations.length,l.code?l.code.split('\n').length:0);assert.ok(Object.hasOwn(l.video,'duration'));assert.ok(Array.isArray(l.video.subtitles));for(const q of l.quiz){assert.equal(q.options.length,['setup-01','lesson-04'].includes(l.id)?4:3);assert.ok(q.answer>=0&&q.answer<q.options.length);}}
 for(let i=0;i<48;i++){assert.equal(mainLessons[i].id,`lesson-${String(i+1).padStart(2,'0')}`);assert.equal(annotations[i].length,mainLessons[i].code.split('\n').length,`Lesson ${i+1} line explanations`);}
});
test('45 source exercises are assigned once with independently checked first-case outputs',()=>{
 const expected={Begin1:20,Begin2:25,Begin3:[12,14],Begin4:Math.PI*10,Begin5:[8,24],Begin7:[Math.PI*10,Math.PI*25],Begin8:5,Begin9:6,Begin12:[5,12],Begin20:5,Begin22:[7,2],Begin23:[3,1,2],Begin29:Math.PI,Begin31:0,Integer1:2,Integer2:2,Integer3:2,Integer6:[4,7],Integer7:11,Integer8:74,Integer9:3,Integer11:14,Integer12:743,Integer15:437,Boolean1:true,Boolean2:true,Boolean3:true,Boolean4:true,Boolean5:true,Boolean6:true,Boolean7:true,Boolean8:true,Boolean9:true,Boolean10:true,For1:[7,7,7],For2:[[2,3,4,5],4],For3:[4,3,2],For4:[1000,2000,3000,4000,5000,6000,7000,8000,9000,10000],For5:[100,200,300,400,500,600,700,800,900,1000],For7:15,For8:120,For9:14,For10:1,For12:1.1,For15:32};
 assert.equal(exercises.length,45);assert.equal(Object.keys(expected).length,45);
 for(const x of exercises){assert.ok(equalResult(x.tests[0].expected,expected[x.id]),x.id);assert.equal(lessons.filter(l=>l.exerciseIds.includes(x.id)).length,1);for(const t of x.tests)assert.ok(validateInput(t.args,x.inputs),x.id);}
});
test('checker handles tolerance, arrays, invalid values and declared domains',()=>{
 assert.ok(equalResult(0.1+0.2,0.3));assert.ok(!equalResult('3',3));assert.ok(!equalResult(NaN,0));assert.ok(!equalResult([1,2],[1]));assert.ok(equalResult([[1],true],[[1],true]));
 const fields=[{integer:true,min:10,max:99}];for(const bad of [[0],[-10],[100],[10.5],['12'],[Infinity],[NaN]])assert.equal(validateInput(bad,fields),false);
 assert.equal(validateInput([10],fields),true);assert.equal(validateInput([99],fields),true);
});
test('Node setup completion blocks later completion and survives old-state migration',()=>{
 const state=normalizeState({completed:['lesson-01'],notes:{a:'note'},drafts:{a:'code'}});
 assert.equal(state.notes.a,'note');assert.ok(state.records);const setup=lessons.find(l=>l.id==='setup-03');
 state.setupChecks[setup.id]=[0,1,2];state.versions={node:'wrong',npm:'11.0.0'};assert.equal(completionAllowed(state,setup),false);
 state.versions.node='v24.0.0';assert.equal(completionAllowed(state,setup),true);
 const l=mainLessons[0],r=recordFor(state,l.id);r.practice=[0,1,2];r.quiz={score:5,answers:[0,0,0,0,0]};assert.equal(completionAllowed(state,l),false);
 state.completed.push('setup-03');assert.equal(completionAllowed(state,l),true);
});
test('capstone scores correct, wrong, unanswered and zero cases; shuffle preserves IDs without mutation',()=>{
 const q=[{id:'a',answer:0},{id:'b',answer:1},{id:'c',answer:2}];assert.deepEqual(calculateScore(q,{a:0,b:0}),{total:3,correct:1,wrong:1,unanswered:1,percent:33});assert.equal(calculateScore([],{}).percent,0);
 const source=[1,2,3,4];const result=shuffle(source,()=>0);assert.deepEqual(source,[1,2,3,4]);assert.deepEqual([...result].sort(),source);assert.notDeepEqual(result,source);
});
