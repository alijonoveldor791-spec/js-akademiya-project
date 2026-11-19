import { escapeHTML as e } from './LessonViewer.js';
import { formatInlineJS as f } from './lessonText.js';
import { recordFor } from '../services/progressService.js';
export function renderQuiz(container, lesson, state, onChange) {
    if (!Array.isArray(lesson.quiz) || !lesson.quiz.length) {
        container.replaceChildren();
        return;
    }
    const record = recordFor(state, lesson.id);
    const count=lesson.quiz.length;
    container.innerHTML = `<section class="panel"><div class="learning-label">${count} SAVOL · O‘ZINGIZNI SINANG</div><h2>${lesson.id==='lesson-04'?'Bilimni tekshirish':'Mini-test'}</h2><form>${lesson.quiz.map((q, i) => `<fieldset><legend>${i + 1}. ${e(q.type)} — ${f(q.question)}</legend>${q.options.map((option, j) => `<label class="quiz-option"><input type="radio" name="q${i}" value="${j}" required ${record.quiz?.answers?.[i] === j ? 'checked' : ''}><span>${f(option)}</span></label>`).join('')}<div data-feedback="${i}"></div></fieldset>`).join('')}<button class="primary-button">Javoblarni tekshirish</button></form>${lesson.id==='lesson-04'?'<button type="button" class="ghost-button quiz-retry hidden">Testni qayta ishlash</button>':''}<p class="quiz-summary" role="status"></p></section>`;
    const feedback = result => {
        container.querySelector('.quiz-retry')?.classList.remove('hidden');
        lesson.quiz.forEach((q, i) => { const el = container.querySelector(`[data-feedback="${i}"]`); el.className = result.answers[i] === q.answer ? 'correct' : 'incorrect'; el.innerHTML = f((result.answers[i] === q.answer ? 'To‘g‘ri. ' : 'Xato. ') + q.explanation); });
        container.querySelector('.quiz-summary').textContent = `${result.score}/${count} — ${Math.round(result.score/count*100)}%. ${lesson.id==='lesson-04'?`To‘g‘ri: ${result.score}. Noto‘g‘ri: ${count-result.score}. `:''}${result.score >= Math.ceil(count*0.8) ? 'Yaxshi natija. Amaliy mashqlarni yakunlang.' : 'Xato savollar izohini o‘qing va mavzuni qayta sinang.'}`;
    };
    if (record.quiz?.answers?.length === count) feedback(record.quiz);
    const retry=container.querySelector('.quiz-retry');
    if(retry)retry.onclick=()=>{record.quiz=null;onChange();renderQuiz(container,lesson,state,onChange);};
    container.querySelector('form').onsubmit = event => {
        event.preventDefault(); const data = new FormData(event.currentTarget); const answers = lesson.quiz.map((_, i) => Number(data.get('q' + i))); const score = answers.filter((a, i) => a === lesson.quiz[i].answer).length;
        record.quiz = { answers, score, at: new Date().toISOString() }; record.attempts = (Number(record.attempts) || 0) + 1;
        record.quizHistory = [...(Array.isArray(record.quizHistory) ? record.quizHistory : []).slice(-19), { score, wrong: count - score, at: record.quiz.at }];
        feedback(record.quiz); onChange();
    };
}
