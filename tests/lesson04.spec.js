import {test,expect} from '@playwright/test';
import {typeSections,finalCode,finalLines,lesson04} from '../src/data/lessons/lesson04.js';
import {lessons} from '../src/data/curriculum.js';

const current=lessons.find(x=>x.id==='lesson-04');
const key='js-akademiya-progress-v1';

test('lesson 04 experiments, editable examples, Dark+ palette and clipboard work',async({page,context})=>{
 const errors=[];page.on('pageerror',e=>errors.push(e.message));
 await context.grantPermissions(['clipboard-read','clipboard-write']);
 await page.goto('/#/lesson-04');
 await expect(page.locator('.lesson04-welcome')).toHaveText('Salom, dasturchilar!');
 await expect(page.locator('#bugMount')).toBeHidden();
 await expect(page.locator('#theoryExtras')).not.toContainText('Dars maqsadi');
 await expect(page.locator('#tip')).toBeHidden();
 await page.locator('#typeName').fill('Aziza');await page.locator('#typeSurname').fill('Aliyeva');
 await expect(page.locator('#nameResult')).toHaveText('Aziza Aliyeva');
 await page.locator('#typeName').fill('<img src=x onerror=alert(1)>');
 await expect(page.locator('#nameCode img')).toHaveCount(0);
 await expect(page.locator('#sumResult')).toHaveText('15');
 await page.locator('#typeMode').selectOption('string');await expect(page.locator('#sumResult')).toHaveText('105');
 await page.locator('#typeA').fill('12');await expect(page.locator('#sumResult')).toHaveText('125');
 await page.locator('#typeMode').selectOption('number');await expect(page.locator('#sumResult')).toHaveText('17');
 await page.locator('#typeA').fill('');await expect(page.locator('#sumResult')).toContainText('kiriting');
 await page.locator('#attendanceToggle').click();await expect(page.locator('#attendanceResult')).toHaveText('false');
 await expect(page.locator('#attendanceToggle')).toHaveAttribute('aria-pressed','false');
 await page.locator('[data-copy-sample="0"]').click();
 expect((await page.evaluate(()=>navigator.clipboard.readText())).replace(/\r\n/g,'\n')).toBe(typeSections[0].examples[0].code);
 await page.locator('[data-edit-sample="1"]').click();
 await expect(page.locator('#editor')).toHaveValue(typeSections[0].examples[1].code);
 await page.locator('#runCode').click();await expect(page.locator('#output')).toHaveText('Ali Karimov\n');
 const palette={keyword:'rgb(86, 156, 214)',string:'rgb(206, 145, 120)',number:'rgb(181, 206, 168)',variable:'rgb(156, 220, 254)',function:'rgb(220, 220, 170)',comment:'rgb(106, 153, 85)'};
 await page.locator('#editor').fill('let ism = "Ali";\nlet yosh = 16;\nconsole.log(ism); // izoh');
 for(const [token,color] of Object.entries(palette))await expect(page.locator(`#editor`).locator('..').locator(`.token-${token}`).first()).toHaveCSS('color',color);
 await expect(page.locator('#editor').locator('..').locator('pre')).toHaveCSS('background-color','rgb(30, 30, 30)');
 await page.reload();await expect(page.locator('#editor')).toHaveValue('let ism = "Ali";\nlet yosh = 16;\nconsole.log(ism); // izoh');
 await page.locator('#themeToggle').click();await expect(page.locator('html')).toHaveAttribute('data-theme','light');
 await expect(page.locator('#editor').locator('..').locator('.token-string').first()).toHaveCSS('color',palette.string);
 await page.locator('#next').click();await expect(page.locator('#layout')).not.toHaveClass(/lesson04/);
 await expect(page.locator('#bugMount')).toBeVisible();
 expect(errors).toEqual([]);
});

test('10-question quiz waits for submit, explains mistakes, retries, and persists 6 practices and completion',async({page})=>{
 await page.addInitScript(({key,ids})=>{if(!localStorage.getItem(key))localStorage.setItem(key,JSON.stringify({completed:['setup-03'],exerciseResults:Object.fromEntries(ids.map(id=>[id,{passed:true}]))}));},{key,ids:current.exerciseIds});
 await page.goto('/#/lesson-04');await page.locator('[data-tab="quiz"]').click();
 await expect(page.locator('#quizPanel fieldset')).toHaveCount(10);
 for(let i=0;i<10;i++){
  await expect(page.locator(`#quizPanel input[name=q${i}]`)).toHaveCount(4);
  await page.locator(`#quizPanel input[name=q${i}][value="${i===0?(lesson04.quiz[i].answer+1)%4:lesson04.quiz[i].answer}"]`).check();
 }
 await expect(page.locator('.quiz-summary')).toBeEmpty();
 await expect(page.locator('[data-feedback="0"]')).toBeEmpty();
 await page.getByRole('button',{name:'Javoblarni tekshirish',exact:true}).click();
 await expect(page.locator('.quiz-summary')).toContainText('9/10');
 await expect(page.locator('.quiz-summary')).toContainText('Noto‘g‘ri: 1');
 await expect(page.locator('[data-feedback="0"]')).toContainText('Qo‘shtirnoq');
 await page.reload();await expect(page.locator('.quiz-summary')).toContainText('9/10');
 await page.getByRole('button',{name:'Testni qayta ishlash'}).click();
 await expect(page.locator('#quizPanel input:checked')).toHaveCount(0);await expect(page.locator('.quiz-summary')).toBeEmpty();
 for(let i=0;i<10;i++)await page.locator(`#quizPanel input[name=q${i}][value="${lesson04.quiz[i].answer}"]`).check();
 await page.getByRole('button',{name:'Javoblarni tekshirish',exact:true}).click();
 await expect(page.locator('.quiz-summary')).toContainText('10/10');
 await page.locator('[data-tab="practice"]').click();
 for(const input of await page.locator('#practiceTasks input').all())await input.check();
 await page.reload();await expect(page.locator('#practiceTasks input:checked')).toHaveCount(6);
 await expect(page.locator('#complete')).toBeEnabled();await page.locator('#complete').check();
 await page.reload();await expect(page.locator('#complete')).toBeChecked();
 await expect(page.locator('#lessonProgress')).toContainText('100%');
});

test('all teaching examples match actual JavaScript output and line descriptions',async({page})=>{
 await page.goto('/#/lesson-04');
 const examples=[...typeSections.flatMap(s=>s.examples),{code:finalCode,lines:finalLines,result:'string\nnumber\nboolean\nobject\nundefined'}];
 for(const example of examples)expect(example.lines).toHaveLength(example.code.split('\n').length);
 const results=await page.evaluate(async examples=>{
  const {createExecution}=await import('/src/components/codeRunner.js');const results=[];
  for(const x of examples){
   const output=await new Promise(resolve=>{const lines=[];let execution;execution=createExecution({source:x.code,timeout:3000,onMessage:m=>{if(m.type==='log')lines.push(m.text);if(['ready','error','timeout'].includes(m.type)){resolve(m.type==='ready'?lines.join('\n'):m.text);execution.stop();}}});});
   results.push(output);
  }return results;
 },examples);
 expect(results).toEqual(examples.map(x=>x.result));
});

test('lesson 04 fits mobile, tablet, desktop and both themes',async({page},testInfo)=>{
 await page.goto('/#/lesson-04');
 for(const width of [390,768,1440]){
  await page.setViewportSize({width,height:900});
  for(const theme of ['dark','light']){
   await page.evaluate(theme=>document.documentElement.dataset.theme=theme,theme);
   expect(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth)).toBe(true);
   await expect(page.locator('.lesson04-welcome')).toBeVisible();
   await page.screenshot({path:testInfo.outputPath(`lesson04-${width}-${theme}.png`)});
  }
 }
});
