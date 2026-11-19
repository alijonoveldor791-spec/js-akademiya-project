import { attachCodeEditor, highlightJavaScript } from './CodeEditor.js';
import { escapeHTML as e } from './LessonViewer.js';
import { formatInlineJS as f } from './lessonText.js';
import { createExecution } from './codeRunner.js';
import { equalResult, validateInput } from '../services/exerciseChecker.js';
import { getSourceMeta, renderExerciseDiagram } from './ExerciseVisuals.js';
export function renderExercises(container, exercises, state, onChange) {
    container.replaceChildren();
    if (!exercises.length) { container.innerHTML = '<p class="tip">Bu darsdagi vazifalar — qo‘shimcha amaliy mashqlar (manba kitobidan alohida). Amaliyot bo‘limidagi topshiriqlarni mustaqil bajaring.</p>'; return; }
    const intro = document.createElement('p'); intro.className = 'tip'; intro.innerHTML = f('Avval formulani qog‘ozda sinang. Tekshiruvchi solve nomli funksiyani chaqiradi: parametrlar — berilganlar, return — javob. Bu kichik o‘ram; funksiya mavzusi 17-darsda batafsil o‘rganiladi. Natijani console.log emas, return bilan qaytaring.'); container.append(intro);
    exercises.forEach(exercise => {
        const card = document.createElement('article'); card.className = 'panel exercise-card'; card.dataset.exercise = exercise.id;
        const result = state.exerciseResults[exercise.id];
        const sourceMeta = getSourceMeta(exercise.id);
        card.innerHTML = `<div class="between"><div><span class="visual-kicker">${e(sourceMeta.badge)}</span><h3>${e(exercise.id)}</h3></div><span class="exercise-status">${result?.passed ? '✓ Yechilgan' : 'Mustaqil yeching'}</span></div><p>${f(exercise.statement)}</p><div class="formula">${f(exercise.formula)}</div><div class="ex-diagram-mount">${renderExerciseDiagram(exercise, exercise.tests[0].args)}</div><details><summary>Bosqichma-bosqich yo‘riqnoma va algoritm</summary><ol>${exercise.steps.map(x => `<li>${f(x)}</li>`).join('')}</ol></details><p>Namuna: <code>${e(JSON.stringify(exercise.tests[0].args))}</code> → <code>${e(JSON.stringify(exercise.tests[0].expected))}</code></p><div class="test-inputs">${exercise.inputs.map((field, i) => `<label>${e(field.name)} ${field.integer ? '(butun son)' : ''}${field.min !== undefined ? ` ≥ ${field.min}` : ''}${field.max !== undefined ? ` ≤ ${field.max}` : ''}<input type="number" step="${field.integer ? '1' : 'any'}" data-input="${i}" value="${exercise.tests[0].args[i]}" aria-label="${e(exercise.id + ' ' + field.name)}"></label>`).join('')}</div><label class="search-label">Mustaqil yechim — JavaScript</label><textarea class="editor exercise-editor" spellcheck="false" aria-label="${e(exercise.id)} yechimi">${e(state.exerciseDrafts[exercise.id] ?? exercise.starter)}</textarea><div class="exercise-actions"><button class="primary-button" data-action="check">Tekshirish</button><button class="ghost-button" data-action="stop">To‘xtatish</button><button class="ghost-button" data-action="reset">Kodni tiklash</button><button class="ghost-button" data-action="solution" ${result?.attempts ? '' : 'disabled'}>Yechimni ko‘rsatish</button></div><p class="muted">Avval o‘zingiz urinib «Tekshirish»ni bosing. So‘ng namunaviy yechimni ochishingiz mumkin.</p><pre class="code-sample hidden" data-solution></pre><pre class="console" role="status">${result?.passed ? 'Barcha avtomatik sinovlar o‘tgan.' : 'Natija hali tekshirilmagan.'}</pre>`;
        const editor = card.querySelector('textarea'), output = card.querySelector('.console'), check = card.querySelector('[data-action="check"]'), solution = card.querySelector('[data-action="solution"]'), diagramMount = card.querySelector('.ex-diagram-mount'); let execution = null;
        attachCodeEditor(editor);
        card.querySelectorAll('[data-input]').forEach(inp => inp.addEventListener('input', () => {
            const vals = [...card.querySelectorAll('[data-input]')].map(x => Number(x.value));
            if (vals.every(v => Number.isFinite(v))) diagramMount.innerHTML = renderExerciseDiagram(exercise, vals);
        }));
        editor.oninput = () => { state.exerciseDrafts[exercise.id] = editor.value; onChange(); };
        const show = () => { const code = card.querySelector('[data-solution]'); code.innerHTML = highlightJavaScript(exercise.solution); code.classList.toggle('hidden'); }; solution.onclick = show;
        check.onclick = () => {
            execution?.stop();
            const raw = [...card.querySelectorAll('[data-input]')].map(x => x.value.trim()); const args = raw.map(Number);
            if (raw.some(x => !x) || !validateInput(args, exercise.inputs)) { output.textContent = 'Noto‘g‘ri kiritish: son turi va ko‘rsatilgan chegaralarni tekshiring.'; return; }
            if (exercise.id.startsWith('For') && exercise.inputs[0]?.name === 'a' && exercise.inputs[1]?.name === 'b' && (args[1] < args[0] || (exercise.id === 'For3' && args[0] === args[1]) || args[1] - args[0] > 10000)) { output.textContent = exercise.id === 'For3' ? 'a < b va oraliq uzunligi 10 000 dan oshmasin.' : 'a ≤ b va oraliq uzunligi 10 000 dan oshmasin.'; return; }
            const tests = exercise.tests; check.disabled = true; output.textContent = 'Sinovlar bajarilmoqda…';
            const previous = state.exerciseResults[exercise.id] || {};
            state.exerciseResults[exercise.id] = { ...previous, attempts: (Number(previous.attempts) || 0) + 1 }; solution.disabled = false; onChange();
            const finish = (passed, text) => { check.disabled = false; output.textContent = text; const old = state.exerciseResults[exercise.id]; state.exerciseResults[exercise.id] = { ...old, passed, correctAttempts: (Number(old.correctAttempts) || 0) + (passed ? 1 : 0), wrongAttempts: (Number(old.wrongAttempts) || 0) + (passed ? 0 : 1), lastAt: new Date().toISOString(), lastMessage: text }; card.querySelector('.exercise-status').textContent = passed ? '✓ Yechilgan' : 'Qayta urinib ko‘ring'; onChange(); };
            execution = createExecution({
                source: editor.value, mode: 'check', tests, timeout: 2500, onMessage: m => {
                    if (m.type === 'error' || m.type === 'timeout') finish(false, m.text);
                    if (m.type === 'results') {
                        const rows = tests.map((test, i) => ({ pass: equalResult(m.actual[i], test.expected), text: `${i + 1}. Kirish ${JSON.stringify(test.args)} → ${JSON.stringify(m.actual[i])}; kutilgan ${JSON.stringify(test.expected)}` }));
                        const passed = rows.every(x => x.pass); finish(passed, rows.map(x => (x.pass ? '✓ ' : '✕ ') + x.text).join('\n') + `\n${passed ? 'Barcha sinovlar o‘tdi!' : 'Formulani va return qiymatini tekshiring.'}`);
                        // Learner-selected valid input gets a separate run after reference cases.
                        execution = createExecution({ source: editor.value, mode: 'check', tests: [{ args }], timeout: 2500, onMessage: custom => { if (custom.type === 'results') output.textContent += '\nSizning kiritishingiz: ' + JSON.stringify(args) + ' → ' + JSON.stringify(custom.actual[0]); } });
                    }
                }
            });
        };
        card.querySelector('[data-action="stop"]').onclick = () => { execution?.stop(); check.disabled = false; output.textContent += '\nTekshiruv to‘xtatildi.'; };
        card.querySelector('[data-action="reset"]').onclick = () => { editor.value = exercise.starter; state.exerciseDrafts[exercise.id] = editor.value; onChange(); };
        container.append(card);
    });
}
