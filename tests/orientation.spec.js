import { test,expect } from '@playwright/test';
import { lessons } from '../src/data/curriculum.js';
const lesson=lessons.find(x=>x.id==='setup-01');

test('orientation omits practice, algorithm and quiz tabs, restores to lesson, and leaves other lessons intact',async({page})=>{
 await page.addInitScript(()=>{localStorage.setItem('js-akademiya-progress-v1',JSON.stringify({positions:{'setup-01':{tab:'quiz'}}}));});
 await page.goto('/#/setup-01');
 await expect(page.locator('[data-tab="practice"]')).toBeHidden();
 await expect(page.locator('[data-tab="exercise"]')).toBeHidden();
 await expect(page.locator('[data-tab="quiz"]')).toBeHidden();
 await expect(page.locator('#practicePanel')).toBeHidden();
 await expect(page.locator('#exercisePanel')).toBeHidden();
 await expect(page.locator('#quizPanel')).toBeHidden();
 await expect(page.locator('#lessonPanel')).toBeVisible();
 await page.evaluate(()=>{location.hash='#/lesson-01';});
 await expect(page.locator('[data-tab="practice"]')).toBeVisible();
 await expect(page.locator('[data-tab="exercise"]')).toBeVisible();
 await expect(page.locator('[data-tab="quiz"]')).toBeVisible();
 await expect(page.locator('#editor')).toBeVisible();
 await expect(page.locator('#bugMount')).toBeVisible();
 await page.locator('[data-tab="practice"]').click();await expect(page.locator('#practicePanel')).toBeVisible();
 await page.evaluate(()=>{location.hash='#/setup-01';});
 await expect(page.locator('[data-tab="practice"]')).toBeHidden();
 await expect(page.locator('[data-tab="quiz"]')).toBeHidden();
 await expect(page.locator('#practicePanel')).toBeHidden();
});

test('orientation only teaches preparation, tools and study habits without console content',async({page})=>{
 await page.goto('/#/setup-01');
 await expect(page.locator('#eyebrow')).toContainText('~35 daqiqa');
 await expect(page.locator('#lessonProgress')).not.toContainText('Node.js');
 await expect(page.locator('#theoryExtras > ul > li')).toHaveCount(3);
 const text=await page.locator('main.content').innerText();
 expect(text).not.toMatch(/console|konsol|alert|console\.log/i);
 expect(JSON.stringify(lesson)).not.toMatch(/console|konsol|alert/i);
 expect(await page.locator('#theoryExtras h3').allTextContents()).toEqual([
  'Dars maqsadi',lesson.intro,'Dasturchi nima qiladi?','Qanday vositalar kerak?',
  'Qaysi odatlar yordam beradi?','Matematika va ingliz tili shartmi?','O‘qish rejasini qanday tuzaman?'
 ]);
 await expect(page.locator('#theoryExtras pre')).toHaveCount(0);
 await expect(page.locator('.concept-flow')).toHaveCount(0);
 await expect(page.locator('.setup-steps > li')).toHaveCount(3);
 await expect(page.locator('.classification-table')).toHaveCount(0);
 for(const step of await page.locator('.setup-steps > li').all()){
  const result=await step.locator('p.muted').textContent();
  expect(result).toContain('Tekshiruv:');expect(result.length).toBeGreaterThan(70);
 }
 await expect(page.locator('#editor')).toBeHidden();
 await expect(page.locator('#runCode')).toBeHidden();
 await expect(page.locator('#codeNotes')).toBeHidden();
 await expect(page.locator('#bugMount')).toBeHidden();
 expect(await page.locator('body').innerText()).not.toContain('Kodni o‘zimiz sinaymiz');
 expect(await page.locator('body').innerText()).not.toContain('XATOLAR LABORATORIYASI');
});

test('setup checklist progress updates and survives reload without practice or quiz counters',async({page})=>{
 await page.goto('/#/setup-01');
 await expect(page.locator('#lessonProgress .metric-grid strong').nth(0)).toHaveText('0/3');
 await expect(page.locator('#lessonProgress')).not.toContainText('Amaliy vazifa');
 await expect(page.locator('#lessonProgress')).not.toContainText('Test balli');
 await expect(page.locator('[data-setup]')).toHaveCount(3);
 for(const chk of await page.locator('[data-setup]').all())await chk.check();
 await expect(page.locator('#lessonProgress .metric-grid strong').nth(0)).toHaveText('3/3');
 await page.reload();
 await expect(page.locator('#lessonProgress .metric-grid strong').nth(0)).toHaveText('3/3');
});

test('obsolete assessment resets once while notes and code drafts remain',async({page})=>{
 await page.addInitScript(()=>{
  const key='js-akademiya-progress-v1';if(localStorage.getItem(key))return;
  localStorage.setItem(key,JSON.stringify({completed:['setup-01','lesson-02'],notes:{'setup-01':'Shaxsiy qayd'},drafts:{'setup-01':'console.log("Qoralama");'},records:{'setup-01':{practice:[0,1,2],quiz:{answers:[0,0,0,0,0],score:5},attempts:1}},setupChecks:{'setup-01':[0,1,2]}}));
 });
 await page.goto('/#/setup-01');
 await expect(page.locator('#editor')).toHaveValue('console.log("Qoralama");');
 await expect(page.locator('#lessonProgress .metric-grid strong').nth(0)).toHaveText('0/3');
 await page.locator('[data-tab="notes"]').click();await expect(page.locator('#notes')).toHaveValue('Shaxsiy qayd');
 expect(await page.evaluate(()=>JSON.parse(localStorage.getItem('js-akademiya-progress-v1')).completed)).toEqual(['lesson-02']);
 await page.setViewportSize({width:390,height:844});await page.locator('[data-tab="lesson"]').click();
 expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
});
