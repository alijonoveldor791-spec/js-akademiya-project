import { lessons, weeks } from '../data/curriculum.js';
export { lessons, weeks };
export function getLesson(id) { return lessons.find(item => item.id === id) || lessons[0]; }
export function getLessonIndex(id) { return lessons.findIndex(item => item.id === id); }
export function lessonURL(id) { return `#/${id}`; }
export function lessonFromHash() { const id = location.hash.match(/^#\/((?:lesson|setup)-\d{2})$/)?.[1]; return getLesson(id); }
