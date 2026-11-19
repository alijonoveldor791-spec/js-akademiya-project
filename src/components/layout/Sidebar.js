import { weeks, getLesson } from '../../lib/course.js';
import { exercises } from '../../data/curriculum.js';

export function renderSidebarShell() {
  return `
    <aside class="sidebar" id="sidebar" aria-label="Kurs mundarijasi">
      <div class="sidebar-head">
        <strong>Kurs mundarijasi</strong>
        <button type="button" id="sidebarCloseBtn" class="icon-button sidebar-close-btn" aria-label="Mundarijani yopish">✕</button>
      </div>
      <div class="progress-card">
        <div class="between"><b>O‘quv natijangiz</b><span id="progressPercent">0%</span></div>
        <div class="progress-track"><div id="progressFill"></div></div>
        <span id="progressText">0 / 54 dars</span>
        <p id="globalExerciseProgress"></p>
      </div>
      <label class="search-label" for="search">Darslarni izlash</label>
      <input id="search" type="search" placeholder="Mavzuni qidiring..." autocomplete="off" />
      <nav id="nav" aria-label="Darslar mundarijasi"></nav>
      <div class="sidebar-footer">JavaScript amaliy mashqlari · 0-modul + 48 asosiy dars.</div>
    </aside>
  `;
}

export function renderSidebarNav({ navEl, currentLessonId, state, query }) {
  if (!navEl) return;
  navEl.replaceChildren();
  const normalizedQuery = (query || '').toLocaleLowerCase('uz').trim();

  weeks.forEach(week => {
    const matches = week.lessonIds
      .map(getLesson)
      .filter(item =>
        !normalizedQuery ||
        `${item.title} ${item.concept}`.toLocaleLowerCase('uz').includes(normalizedQuery)
      );
    if (!matches.length) return;

    const section = document.createElement('section');
    section.className = 'week-group';

    const heading = document.createElement('h3');
    const doneInWeek = week.lessonIds.filter(id => state.completed.includes(id)).length;
    heading.textContent = `${week.number === 0 ? '0-modul' : week.number + '-hafta'} · ${week.title} · ${doneInWeek}/${week.lessonIds.length}`;
    section.append(heading);

    for (const item of matches) {
      const link = document.createElement('a');
      link.href = `#/${item.id}`;
      link.className = 'nav-lesson' + (item.id === currentLessonId ? ' selected' : '');
      const number = document.createElement('span');
      number.className = 'lesson-number';
      number.textContent = String(item.number).padStart(2, '0');
      const text = document.createElement('span');
      text.textContent = item.title;
      const check = document.createElement('span');
      check.className = 'done-mark';
      check.textContent = state.completed.includes(item.id) ? '✓' : '';
      link.append(number, text, check);
      section.append(link);
    }
    navEl.append(section);
  });

  if (!navEl.children.length) {
    const p = document.createElement('p');
    p.className = 'muted';
    p.textContent = 'Mos dars topilmadi.';
    navEl.append(p);
  }
}

export function updateSidebarProgress({ state, totalLessons }) {
  const count = state.completed.length;
  const pctEl = document.getElementById('progressPercent');
  const fillEl = document.getElementById('progressFill');
  const textEl = document.getElementById('progressText');
  const exEl = document.getElementById('globalExerciseProgress');
  if (pctEl) pctEl.textContent = `${Math.round((count / totalLessons) * 100)}%`;
  if (fillEl) fillEl.style.width = `${(count / totalLessons) * 100}%`;
  if (textEl) textEl.textContent = `${count} / ${totalLessons} dars`;
  if (exEl) {
    const solved = exercises.filter(x => state.exerciseResults[x.id]?.passed).length;
    exEl.textContent = `${solved}/${exercises.length} masala yechilgan`;
  }
}
