import test from 'node:test';
import assert from 'node:assert/strict';
import { lessons,mainLessons,weeks,exercises } from '../src/data/curriculum.js';
import { guides } from '../src/data/lessons/guides.js';
import { knowledge } from '../src/data/quizzes/knowledge.js';
import { annotations } from '../src/data/lessons/annotations.js';
import { equalResult,validateInput } from '../src/services/exerciseChecker.js';
import { normalizeState } from '../src/lib/storage.js';
import { completionAllowed,mastery,recordFor } from '../src/services/progressService.js';
import { calculateScore,shuffle } from '../public/projects/mini-test/score.js';
import { LESSON_VISUALS, EDITORIAL_IMAGES } from '../src/data/visualMedia.js';
import { renderDiagramSVG } from '../src/components/VisualDiagrams.js';
import { formatJavaScript } from '../src/components/CodeEditor.js';
import { formatInlineJS } from '../src/components/lessonText.js';
import { buildCodeTrace } from '../src/components/InteractiveSimulators.js';
import { parseRoute } from '../src/lib/router.js';
import { COURSE_MODULES, getStudyPlanWeeks } from '../src/lib/course.js';
import { author } from '../src/config/author.js';
import { siteConfig } from '../src/config/site.js';
import { renderNavbar } from '../src/components/layout/Navbar.js';
import { computeCropMetrics } from '../src/components/ProfileModal.js';
test('54 unique lessons retain all 48 original IDs and complete learning sections',()=>{
 assert.equal(lessons.length,54);assert.equal(new Set(lessons.map(l=>l.id)).size,54);
 assert.equal(mainLessons.length,48);assert.equal(guides.length,48);assert.equal(knowledge.length,48);assert.equal(annotations.length,48);
 assert.deepEqual(weeks.flatMap(w=>w.lessonIds),lessons.map(l=>l.id));
 for(const l of lessons){assert.equal(l.practices.length,l.week===0?0:l.id==='lesson-04'?6:3);assert.equal(l.quiz.length,l.week===0?0:l.id==='lesson-04'?10:5);if(l.week===0){assert.equal(l.exerciseIds.length,0);assert.equal(l.homework.length,0);}if(l.id!=='setup-01')assert.ok(l.bug.code);assert.ok(l.webUse);assert.equal(l.lineExplanations.length,l.code?l.code.split('\n').length:0);assert.ok(Object.hasOwn(l.video,'duration'));assert.ok(Array.isArray(l.video.subtitles));for(const q of l.quiz){assert.equal(q.options.length,l.id==='lesson-04'?4:3);assert.ok(q.answer>=0&&q.answer<q.options.length);}}
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
test('all 54 lessons have visual diagrams, analogies, glossaries, formatter and tracer work',()=>{
 for(const l of lessons){
  const v=LESSON_VISUALS[l.id];
  assert.ok(v,l.id);
  assert.ok(v.analogy&&v.diagram&&v.alt,l.id);
  assert.equal(v.glossary.length,3,l.id);
  const svg=renderDiagramSVG(v.diagram,v.alt);
  assert.ok(svg.includes('<svg')&&svg.includes('</svg>'),l.id);
  if(v.editorial)assert.ok(EDITORIAL_IMAGES[v.editorial]?.src,l.id);
  if(v.editorialPair){assert.ok(EDITORIAL_IMAGES[v.editorialPair[0]]?.src,l.id);for(const k of v.editorialPair)assert.ok(EDITORIAL_IMAGES[k]?.src,`${l.id}:${k}`);}
 }
 assert.equal(/console|konsol|alert/i.test(JSON.stringify(LESSON_VISUALS['setup-01'])+renderDiagramSVG('setup-readiness','ok')),false);
 assert.equal(formatJavaScript('if(true){\nconsole.log(1);\n}'),'if(true){\n  console.log(1);\n}');
 const trace=buildCodeTrace('let x = 4;\nx = x + 6;\nconsole.log(x);');
 assert.equal(trace.length,3);assert.equal(trace[1].vars.x,10);assert.deepEqual(trace[2].logs,['10']);
 const inline=formatInlineJS('0-modul: let va === hamda && operatori, console.log("ok") <script>alert(1)</script>');
 assert.ok(inline.includes('0-modul:'));
 assert.ok(inline.includes('<code class="inline-js inline-js-kw">let</code>'));
 assert.ok(inline.includes('<code class="inline-js inline-js-op">===</code>'));
 assert.ok(inline.includes('<code class="inline-js inline-js-op">&amp;&amp;</code>'));
 assert.ok(inline.includes('<code class="inline-js inline-js-fn">console.log(&quot;ok&quot;)</code>'));
 assert.ok(!inline.includes('<script>'));
});
test('SPA router parses clean pages, direct lesson paths and hash links without inventing author data',()=>{
 globalThis.location=new URL('https://example.com/');
 assert.equal(parseRoute('https://example.com/').page,'home');
 assert.equal(parseRoute('https://example.com/courses').page,'courses');
 assert.equal(parseRoute('https://example.com/dashboard').page,'dashboard');
 assert.equal(parseRoute('https://example.com/about').page,'about');
 assert.equal(parseRoute('https://example.com/author').page,'author');
 assert.deepEqual(parseRoute('https://example.com/learn/lesson-04'),{page:'learn',lessonId:'lesson-04',tab:null,anchor:null,path:'/learn/lesson-04'});
 assert.deepEqual(parseRoute('https://example.com/#/setup-01'),{page:'learn',lessonId:'setup-01',tab:null,anchor:null,path:'/'});
 assert.deepEqual(parseRoute('https://example.com/learn/lesson-01?tab=exercise'),{page:'learn',lessonId:'lesson-01',tab:'exercise',anchor:null,path:'/learn/lesson-01'});
 assert.equal(author.fullName,'Eldor Alijonov');assert.equal(author.email,'');assert.deepEqual(author.projects,[]);
 assert.ok(siteConfig.navLinks.length>=5);
});
test('compact modules and 6-week/12-week study plans cover all 54 lessons and persist in state',()=>{
 assert.equal(COURSE_MODULES.length,4);
 assert.deepEqual(COURSE_MODULES.flatMap(m=>m.lessonIds),lessons.map(l=>l.id));
 const standardWeeks=getStudyPlanWeeks('standard');
 const fastWeeks=getStudyPlanWeeks('fast');
 assert.equal(standardWeeks.length,12);
 assert.equal(fastWeeks.length,6);
 assert.deepEqual(fastWeeks.flatMap(w=>w.lessonIds),mainLessons.map(l=>l.id));
 assert.equal(normalizeState({pace:'fast',curriculumView:'weeks'}).pace,'fast');
 assert.equal(normalizeState({}).curriculumView,'modules');
 const homeNav=renderNavbar({route:{page:'home',anchor:null},state:{theme:'dark',lastLesson:'setup-01'}});
 const learnNav=renderNavbar({route:{page:'learn',lessonId:'lesson-01',tab:null},state:{theme:'dark',lastLesson:'lesson-01'}});
 assert.ok(homeNav.includes('class="nav-links"'));
 assert.ok(!learnNav.includes('class="nav-links"'));
 assert.ok(learnNav.includes('← Bosh sahifa'));
});
test('Module 0 omits practices, exercises and quizzes while tracking setup checklist mastery',()=>{
 const setupLessonsList=lessons.filter(l=>l.week===0);
 assert.equal(setupLessonsList.length,6);
 for(const sl of setupLessonsList){
  assert.deepEqual(sl.practices,[]);
  assert.deepEqual(sl.quiz,[]);
  assert.deepEqual(sl.exerciseIds,[]);
 }
 const state=normalizeState({});
 const s1=setupLessonsList[0];
 assert.equal(mastery(state,s1),0);
 state.setupChecks[s1.id]=[0,1];
 assert.equal(mastery(state,s1),67);
 state.setupChecks[s1.id]=[0,1,2];
 assert.equal(mastery(state,s1),100);
});
test('learner profile sanitizes avatar URLs and computeCropMetrics clamps zoom and pan offsets',()=>{
 const bad=normalizeState({profile:{fullName:'  Ali ',goal:'Frontend',bio:'JS',avatar:'javascript:alert(1)'}});
 assert.equal(bad.profile.fullName,'  Ali ');
 assert.equal(bad.profile.avatar,'');
 const goodAvatar='data:image/jpeg;base64,/9j/4AAQSkZJRg==';
 const good=normalizeState({profile:{fullName:'Jasur',goal:'React',bio:'O‘quvchi',avatar:goodAvatar}});
 assert.equal(good.profile.avatar,goodAvatar);
 const navWithAvatar=renderNavbar({route:{page:'home',anchor:null},state:{theme:'dark',lastLesson:'setup-01',profile:good.profile}});
 assert.ok(navWithAvatar.includes('class="nav-profile-avatar"'));
 assert.ok(navWithAvatar.includes('O‘quv paneli'));
 assert.ok(navWithAvatar.includes('Konspekt'));
 assert.ok(navWithAvatar.includes('Natijani saqlash'));
 assert.ok(navWithAvatar.includes('Tiklash'));

 const fitZoom1=computeCropMetrics({imgWidth:480,imgHeight:240,zoom:1,offsetX:999,offsetY:999,stageSize:240});
 assert.equal(fitZoom1.drawW,480);
 assert.equal(fitZoom1.drawH,240);
 assert.equal(fitZoom1.offsetX,120);
 assert.equal(fitZoom1.offsetY,0);

 const zoomed=computeCropMetrics({imgWidth:240,imgHeight:240,zoom:2,offsetX:-500,offsetY:500,stageSize:240});
 assert.equal(zoomed.drawW,480);
 assert.equal(zoomed.drawH,480);
 assert.equal(zoomed.offsetX,-120);
 assert.equal(zoomed.offsetY,120);
});
