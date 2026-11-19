import { lessons, weeks } from '../data/curriculum.js';
export { lessons, weeks };

export function getLesson(id) {
  return lessons.find(item => item.id === id) || lessons[0];
}

export function getLessonIndex(id) {
  return lessons.findIndex(item => item.id === id);
}

export function lessonURL(id) {
  return `#/${id}`;
}

export function lessonFromHash() {
  const id = location.hash.match(/^#\/((?:lesson|setup)-\d{2})$/)?.[1];
  return getLesson(id);
}

export const COURSE_MODULES = [
  {
    id: 'module-0',
    number: 0,
    title: 'Dasturlashga tayyorgarlik',
    spanLabel: '0-modul',
    summary: 'VS Code, Node.js, Chrome DevTools va birinchi veb-loyihani sozlash.',
    lessonIds: weeks[0].lessonIds
  },
  {
    id: 'module-1',
    number: 1,
    title: 'JavaScript asoslari va algoritmlar',
    spanLabel: '1–4-haftalar',
    summary: 'O‘zgaruvchilar, ma’lumot turlari, arifmetik amallar, shartlar va sikllar.',
    lessonIds: weeks.slice(1, 5).flatMap(w => w.lessonIds)
  },
  {
    id: 'module-2',
    number: 2,
    title: 'Funksiyalar, obyektlar va DOM',
    spanLabel: '5–8-haftalar',
    summary: 'Funksiyalar, massivlar, matn va JSON, DOM daraxti, hodisalar va localStorage.',
    lessonIds: weeks.slice(5, 9).flatMap(w => w.lessonIds)
  },
  {
    id: 'module-3',
    number: 3,
    title: 'Zamonaviy JS, API va loyihalar',
    spanLabel: '9–12-haftalar',
    summary: 'ES6+, async/await, Fetch API, test ilovasi va yakuniy amaliy loyiha.',
    lessonIds: weeks.slice(9, 13).flatMap(w => w.lessonIds)
  }
];

export const PACE_OPTIONS = {
  standard: {
    id: 'standard',
    label: 'Odatiy reja · 12 hafta',
    shortLabel: '12 hafta',
    weeksCount: 12,
    lessonsPerWeek: 4,
    hoursPerWeek: '~6 soat/hafta',
    description: 'Haftasiga 4 ta dars (~6 soat). O‘qish yoki ish bilan parallel o‘rganish uchun qulay me’yoriy reja.'
  },
  fast: {
    id: 'fast',
    label: 'Tezkor reja · 6 hafta',
    shortLabel: '6 hafta',
    weeksCount: 6,
    lessonsPerWeek: 8,
    hoursPerWeek: '~12 soat/hafta',
    description: 'Haftasiga 8 ta dars (~12 soat). Kuniga 1–2 soat ajratib 48 ta darsni 6 haftada yakunlash rejasi.'
  }
};

export function getStudyPlanWeeks(pace = 'standard') {
  const mainWeeks = weeks.filter(w => w.number > 0);
  if (pace !== 'fast') return mainWeeks;

  const grouped = [];
  for (let i = 0; i < mainWeeks.length; i += 2) {
    const first = mainWeeks[i];
    const second = mainWeeks[i + 1];
    grouped.push({
      number: Math.floor(i / 2) + 1,
      title: second ? `${first.title} + ${second.title}` : first.title,
      lessonIds: [...first.lessonIds, ...(second ? second.lessonIds : [])],
      sourceWeeks: second ? `${first.number}–${second.number}-haftalar` : `${first.number}-hafta`
    });
  }
  return grouped;
}
