import { test,expect } from '@playwright/test';
import { lessons,exercises } from '../src/data/curriculum.js';
const KEY='js-akademiya-progress-v1';
test('all lesson examples start without runtime errors and output questions match real evaluation',async({page})=>{
 await page.goto('/');
 const failures=await page.evaluate(async lessons=>{
  const {createExecution}=await import('/src/components/codeRunner.js');
  const failures=[];
  for(const lesson of lessons){
   const startup=await new Promise(resolve=>{let run;run=createExecution({source:lesson.code,timeout:2000,onMessage:m=>{if(['ready','error','timeout'].includes(m.type)){resolve(m);run.stop();}}});});
   if(startup.type!=='ready')failures.push({id:lesson.id,stage:'example',error:startup.text});
   if(!lesson.expectedExample.expression)continue;
   const evaluated=await new Promise(resolve=>{createExecution({source:`function solve(){return (${lesson.expectedExample.expression});}`,mode:'check',tests:[{args:[]}],timeout:2000,onMessage:m=>{if(['results','error','timeout'].includes(m.type))resolve(m);}});});
   if(evaluated.type!=='results'||String(evaluated.actual[0])!==lesson.expectedExample.result)failures.push({id:lesson.id,stage:'expected output',actual:evaluated.actual,expected:lesson.expectedExample.result});
  }
  return failures;
 },lessons);
 expect(failures).toEqual([]);
});
test('all 54 lessons navigate and expose their quiz questions and practices',async({page})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto('/');
 await expect(page.locator('.nav-lesson')).toHaveCount(54);
 for(const lesson of lessons){
  await page.evaluate(id=>{location.hash='#/'+id;},lesson.id);
  await expect(page.locator('#title')).toHaveText(lesson.title);
  await expect(page.locator('#practiceTasks input')).toHaveCount(lesson.practices.length);
  await expect(page.locator('#quizPanel fieldset')).toHaveCount(lesson.quiz.length);
 }
 expect(errors).toEqual([]);
});
test('all 45 reference solutions pass their domain cases in isolated workers',async({page})=>{
 await page.goto('/');
 const results=await page.evaluate(async exercises=>{
  const {createExecution}=await import('/src/components/codeRunner.js');
  const {equalResult}=await import('/src/services/exerciseChecker.js');
  const results=[];
  for(const x of exercises){const result=await new Promise(resolve=>{createExecution({source:x.solution,mode:'check',tests:x.tests,timeout:2500,onMessage:m=>{if(['results','error','timeout'].includes(m.type))resolve(m);}});});results.push({id:x.id,ok:result.type==='results'&&x.tests.every((t,i)=>equalResult(result.actual[i],t.expected)),error:result.text});}
  return results;
 },exercises);
 expect(results.filter(x=>!x.ok)).toEqual([]);
});
test('solution stays hidden until an attempt, wrong solutions fail, correct solution and drafts persist',async({page})=>{
 await page.goto('/#/lesson-03');await page.locator('[data-tab="exercise"]').click();const card=page.locator('[data-exercise="Begin1"]');
 await expect(card.locator('[data-action="solution"]')).toBeDisabled();
 await card.locator('textarea').fill('function solve(a){ return a; }');await card.locator('[data-action="check"]').click();
 await expect(card.locator('.console')).toContainText('✕');await card.locator('[data-action="solution"]').click();await expect(card.locator('[data-solution]')).toBeVisible();
 await card.locator('textarea').fill('function solve(a){ return 4*a; }');await card.locator('[data-action="check"]').click();await expect(card.locator('.exercise-status')).toContainText('Yechilgan');
 await page.reload();await expect(card.locator('textarea')).toHaveValue('function solve(a){ return 4*a; }');await expect(card.locator('.exercise-status')).toContainText('Yechilgan');
 await card.locator('[data-input]').fill('-2');await card.locator('[data-action="check"]').click();await expect(card.locator('.console')).toContainText('Noto‘g‘ri kiritish');
});
test('infinite exercise terminates on timeout and main UI remains responsive',async({page})=>{
 await page.goto('/#/lesson-03');await page.locator('[data-tab="exercise"]').click();const card=page.locator('[data-exercise="Begin1"]');
 await card.locator('textarea').fill('function solve(a){ while(true){} }');await card.locator('[data-action="check"]').click();
 await page.locator('#themeToggle').click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await expect(card.locator('.console')).toContainText('Vaqt chegarasi',{timeout:6000});await expect(card.locator('[data-action="check"]')).toBeEnabled();
});
test('laboratory logs errors and can stop an infinite loop',async({page})=>{
 await page.goto('/#/lesson-01');await page.locator('#editor').fill('throw new Error("Sinov xatosi");');await page.locator('#runCode').click();await expect(page.locator('#output')).toContainText('Sinov xatosi');
 await page.locator('#editor').fill('while(true){}');await page.locator('#runCode').click();await page.locator('#stopCode').click();
 await page.locator('#editor').fill('console.log(42)');await page.locator('#runCode').click();await expect(page.locator('#output')).toHaveText('42\n');
});
test('DOM buttons, delegation, form input and localStorage adapter work',async({page})=>{
 await page.goto('/#/lesson-27');await page.locator('#runCode').click();await page.locator('#preview button').click();await expect(page.locator('#output')).toContainText('BOSILDI!');
 await page.goto('/#/lesson-31');await page.locator('#runCode').click();await page.locator('#preview button').click();await expect(page.locator('#preview li')).toHaveCount(0);await expect(page.locator('#output')).toContainText('O‘chirildi');
 await page.goto('/#/lesson-29');await page.locator('#editor').fill('const f=document.createElement("form");const i=document.createElement("input");const b=document.createElement("button");b.textContent="Yubor";f.append(i,b);f.addEventListener("submit",e=>{e.preventDefault();console.log(i.value.trim());});document.body.append(f);');await page.locator('#runCode').click();await page.locator('#preview input').fill('  Ali  ');await page.locator('#preview button').click();await expect(page.locator('#output')).toContainText('Ali');
 await page.goto('/#/lesson-32');await page.locator('#editor').fill('localStorage.setItem("test","saqlandi");console.log(localStorage.getItem("test"));');await page.locator('#runCode').click();await expect(page.locator('#output')).toContainText('saqlandi');await page.reload();await page.locator('#editor').fill('console.log(localStorage.getItem("test"));');await page.locator('#runCode').click();await expect(page.locator('#output')).toContainText('saqlandi');
});
test('setup requires checks and real-looking version outputs before later completion',async({page})=>{
 await page.goto('/#/setup-03');await expect(page.locator('#complete')).toBeDisabled();
 for(const input of await page.locator('[data-setup]').all())await input.check();
 await page.locator('#nodeVersion').fill('wrong');await page.locator('#npmVersion').fill('11.0.0');await expect(page.locator('#complete')).toBeDisabled();
 await page.locator('#nodeVersion').fill('v24.0.0');await expect(page.locator('#complete')).toBeEnabled();await page.locator('#complete').check();await page.reload();await expect(page.locator('#complete')).toBeChecked();
});
test('quiz feedback, mastery, notes, theme and last lesson survive reload',async({page})=>{
 await page.goto('/#/setup-03');for(const input of await page.locator('[data-setup]').all())await input.check();await page.locator('#nodeVersion').fill('v24.0.0');await page.locator('#npmVersion').fill('11.0.0');await page.locator('#complete').check();await page.goto('/#/lesson-01');
 await page.locator('[data-tab="practice"]').click();for(const input of await page.locator('[data-practice]').all())await input.check();
 await page.locator('[data-tab="quiz"]').click();const lesson=lessons.find(x=>x.id==='lesson-01');for(let i=0;i<5;i++)await page.locator(`#quizPanel input[name="q${i}"][value="${lesson.quiz[i].answer}"]`).check();
 await page.locator('#quizPanel button').click();await expect(page.locator('.quiz-summary')).toContainText('5/5');await expect(page.locator('#complete')).toBeEnabled();await page.locator('#complete').check();
 await page.locator('[data-tab="notes"]').click();await page.locator('#notes').fill('Bugun console.log ni o‘rgandim.');await page.locator('#themeToggle').click();await page.reload();await expect(page.locator('#notes')).toHaveValue('Bugun console.log ni o‘rgandim.');await expect(page.locator('html')).toHaveAttribute('data-theme','light');await expect(page.locator('#complete')).toBeChecked();
 await page.goto('/');await expect(page).toHaveURL(/lesson-01/);await expect(page.locator('#notes')).toBeVisible();
});
test('export and import restore progress and malformed files give an error',async({page})=>{
 await page.goto('/#/lesson-08');await page.locator('[data-tab="notes"]').click();await page.locator('#notes').fill('Eksport sinovi');
 const downloadPromise=page.waitForEvent('download');await page.locator('#exportBtn').click();const download=await downloadPromise;const path=await download.path();expect(path).toBeTruthy();
 await page.locator('#notes').fill('O‘zgargan');await page.locator('#importFile').setInputFiles(path);await expect(page.locator('#notes')).toHaveValue('Eksport sinovi');
 await page.locator('#importFile').setInputFiles({name:'wrong.json',mimeType:'application/json',buffer:Buffer.from('{"completed":null}')});await expect(page.locator('#toast')).toContainText('Import xatosi');
});
test('mobile layout, navigation search and absent-video message',async({page})=>{
 await page.setViewportSize({width:390,height:844});await page.goto('/');expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
 await page.locator('#menu').click();await page.locator('#search').fill('Rekursiya');await expect(page.locator('.nav-lesson')).toHaveCount(1);await page.locator('.nav-lesson').click();await expect(page.locator('#title')).toContainText('Rekursiya');
 await page.locator('[data-tab="video"]').click();await expect(page.locator('#videoMount')).toContainText('keyinchalik qo‘shiladi');await expect(page.locator('#videoMount video')).toHaveCount(0);
});
test('sandbox cannot fetch app data or navigate parent; arbitrary HTML remains inert',async({page})=>{
 await page.goto('/#/lesson-26');let leaked=false;page.on('request',request=>{if(request.url().includes('/secret-test'))leaked=true;});
 const html='<img src=x onerror=alert(1)><script>parent.location="https://example.com"</script>';
 await page.locator('#editor').fill(`fetch("http://127.0.0.1:54149/secret-test").catch(()=>console.log("blocked"));const d=document.createElement("div");d.innerHTML=${JSON.stringify(html)};document.body.append(d);`);await page.locator('#runCode').click();await expect(page.locator('#output')).toContainText('blocked');expect(leaked).toBe(false);await expect(page).toHaveURL(/lesson-26/);await expect(page.locator('#preview script')).toHaveCount(0);await expect(page.locator('#preview img')).toHaveCount(0);
});
test('capstone supports saved answers, navigation and explained results',async({page})=>{
 await page.goto('/projects/mini-test/index.html');await page.locator('#start').click();await page.locator('input[value="1"]').check();await page.reload();await expect(page.locator('input[value="1"]')).toBeChecked();await page.locator('#next').click();await page.locator('#previous').click();await expect(page.locator('input[value="1"]')).toBeChecked();await page.locator('#finish').click();await expect(page.locator('#test article')).toHaveCount(5);await expect(page.locator('#test')).toContainText('Javobsiz: 4');await page.locator('#restart').click();await expect(page.locator('#time')).toBeVisible();
});
