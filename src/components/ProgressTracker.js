import { recordFor, mastery, completionAllowed } from '../services/progressService.js';
import { escapeHTML } from './lessonText.js';
export function renderLessonProgress(container,lesson,state){
 const record=recordFor(state,lesson.id),score=Number(record.quiz?.score)||0;
 const passed=lesson.exerciseIds.filter(id=>state.exerciseResults[id]?.passed).length;
 const failures=lesson.exerciseIds.reduce((n,id)=>n+(Number(state.exerciseResults[id]?.wrongAttempts)||0),0);
 const wrong=record.quiz?lesson.quiz.length-score:0;
 const ready=completionAllowed(state,lesson);
 const setupPending=!state.completed.includes('setup-03')&&(lesson.week>0||Number(String(lesson.number).split('.')[1])>3);
 const practiceMetrics=lesson.id==='setup-01'?'':`<div><strong>${record.practice.length}/${lesson.practices.length}</strong><span>Amaliy vazifa</span></div><div><strong>${passed}/${lesson.exerciseIds.length}</strong><span>Yechilgan masala</span></div>`;
 const exerciseHistory=lesson.id==='setup-01'?'':` Masalalarda muvaffaqiyatsiz urinishlar: ${Math.max(0,failures)}.`;
 container.innerHTML=`<section class="panel progress-summary"><div class="learning-label">YAKUNIY NAZORAT</div><h2>${lesson.week===0?'Tayyorgarlik nazorati':mastery(state,lesson)+'% o‘zlashtirish'}</h2><div class="metric-grid">${practiceMetrics}<div><strong>${score}/${lesson.quiz.length}</strong><span>Test balli</span></div><div><strong>${wrong}</strong><span>Testdagi xato</span></div></div><p class="muted">Boshlangan: ${new Date(record.startedAt).toLocaleDateString('uz-UZ')}. Test urinishlari: ${Number(record.attempts)||0}.${exerciseHistory}</p><p>${setupPending?'Avval 0.3-darsda Node.js va npm o‘rnatilganini tasdiqlang.':ready?'Nazorat talablari bajarildi. Darsni yakunlashingiz mumkin.':lesson.id==='setup-01'?escapeHTML(lesson.tip):lesson.week===0?'Kompyuterdagi amallar va barcha nazorat bandlarini bajaring. Node.js darsida ikki versiyani kiriting.':lesson.id==='lesson-04'?'Oltita mashqni bajaring va testda kamida 8/10 natija oling. Biriktirilgan masalalarni ham yeching.':'Tavsiya: uchta amaliy vazifani bajaring, mini-testda kamida 4/5 oling va biriktirilgan masalalarni yeching.'}</p></section>`;
}
