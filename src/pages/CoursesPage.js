import { courses } from '../config/courses.js';
import { COURSE_MODULES, PACE_OPTIONS, getStudyPlanWeeks, getLesson } from '../lib/course.js';
import { escapeHTML } from '../components/lessonText.js';
import { renderCourseCard, renderAccordion } from '../components/ui/index.js';
import { renderFooter } from '../components/layout/Footer.js';

function buildAccordionItems(state) {
  const pace = state.pace === 'fast' ? 'fast' : 'standard';
  const view = state.curriculumView === 'weeks' ? 'weeks' : 'modules';

  if (view === 'modules') {
    return COURSE_MODULES.map(mod => {
      const completedCount = mod.lessonIds.filter(id => state.completed.includes(id)).length;
      const listHTML = `
        <p class="muted" style="margin:4px 0 12px">${escapeHTML(mod.summary)}</p>
        <div class="course-week-lessons">
          ${mod.lessonIds
            .map(id => {
              const lesson = getLesson(id);
              const done = state.completed.includes(id);
              const num =
                lesson.week === 0
                  ? `0.${String(lesson.number).split('.')[1] || lesson.number}`
                  : String(lesson.number).padStart(2, '0');
              return `
                <a href="/learn/${escapeHTML(lesson.id)}" data-route="/learn/${escapeHTML(lesson.id)}" class="course-lesson-row ${done ? 'is-completed' : ''}">
                  <span class="lesson-number">${escapeHTML(num)}</span>
                  <div class="course-lesson-info">
                    <strong>${escapeHTML(lesson.title)}</strong>
                    <span>${escapeHTML(lesson.concept)}</span>
                  </div>
                  <span class="course-lesson-duration tabular-nums">${escapeHTML(lesson.durationMinutes)} daq</span>
                  ${done ? '<span class="done-mark" aria-label="Bajarilgan">✓</span>' : '<span class="course-lesson-arrow">→</span>'}
                </a>
              `;
            })
            .join('')}
        </div>
      `;

      return {
        title: `${mod.number}-modul · ${mod.title}`,
        meta: `${completedCount}/${mod.lessonIds.length} bajarilgan`,
        open: mod.number <= 1,
        content: listHTML
      };
    });
  }

  const setupModule = COURSE_MODULES[0];
  const planWeeks = getStudyPlanWeeks(pace);
  const groups = [
    { number: 0, title: `0-modul · ${setupModule.title}`, lessonIds: setupModule.lessonIds },
    ...planWeeks.map(w => ({
      number: w.number,
      title: `${w.number}-hafta · ${w.title}`,
      lessonIds: w.lessonIds
    }))
  ];

  return groups.map(group => {
    const isSetup = group.number === 0;
    const completedCount = group.lessonIds.filter(id => state.completed.includes(id)).length;
    const listHTML = `
      <div class="course-week-lessons">
        ${group.lessonIds
          .map(id => {
            const lesson = getLesson(id);
            const done = state.completed.includes(id);
            const num =
              lesson.week === 0
                ? `0.${String(lesson.number).split('.')[1] || lesson.number}`
                : String(lesson.number).padStart(2, '0');
            return `
              <a href="/learn/${escapeHTML(lesson.id)}" data-route="/learn/${escapeHTML(lesson.id)}" class="course-lesson-row ${done ? 'is-completed' : ''}">
                <span class="lesson-number">${escapeHTML(num)}</span>
                <div class="course-lesson-info">
                  <strong>${escapeHTML(lesson.title)}</strong>
                  <span>${escapeHTML(lesson.concept)}</span>
                </div>
                <span class="course-lesson-duration tabular-nums">${escapeHTML(lesson.durationMinutes)} daq</span>
                ${done ? '<span class="done-mark" aria-label="Bajarilgan">✓</span>' : '<span class="course-lesson-arrow">→</span>'}
              </a>
            `;
          })
          .join('')}
      </div>
    `;

    return {
      title: group.title,
      meta: `${completedCount}/${group.lessonIds.length} bajarilgan`,
      open: isSetup || group.number === 1,
      content: listHTML
    };
  });
}

export function renderCoursesPage(container, { state, persist }) {
  const pace = state.pace === 'fast' ? 'fast' : 'standard';
  const view = state.curriculumView === 'weeks' ? 'weeks' : 'modules';
  const paceMeta = PACE_OPTIONS[pace];

  const dynamicCourses = courses.map(c =>
    c.id === 'javascript-akademiya'
      ? {
          ...c,
          weeksCount: paceMeta.weeksCount,
          estimatedDuration: `${paceMeta.weeksCount} hafta · ${paceMeta.hoursPerWeek}`
        }
      : c
  );

  container.innerHTML = `
    <main class="site-main page-container">
      <header class="page-header">
        <div class="home-kicker">Kurslar katalogi</div>
        <h1>Mavjud dasturlash kurslari</h1>
        <p>JavaScript Akademiya hozirda noldan amaliy veb-dasturlashgacha olib boruvchi to‘liq JavaScript kursini taqdim etadi. Kelajakdagi yangi yo‘nalishlar alohida ma’lumotlar moduli orqali kengaytiriladi.</p>
      </header>

      <section class="courses-catalog">
        ${dynamicCourses.map(renderCourseCard).join('')}
      </section>

      <section class="courses-extensible-note">
        <h2>Kelajakdagi kurslar arxitekturasi</h2>
        <p class="muted">Yangi dasturlash kurslari <code>src/config/courses.js</code> faylida modulli obyekt sifatida qo‘shish uchun tayyorlangan. Hali ishlab chiqilmagan kurslar tayyor kurs sifatida ko‘rsatilmaydi.</p>
      </section>

      <section class="courses-curriculum-section" id="curriculum">
        <div class="home-section-head">
          <h2>To‘liq o‘quv dasturi (54 ta dars)</h2>
          <p>O‘quv rejasini ixcham modullar yoki haftalik sur’at bo‘yicha ko‘rib, istalgan darsni bevosita ochishingiz mumkin.</p>
        </div>

        <div class="curriculum-toolbar">
          <div class="toolbar-group">
            <span class="toolbar-label">O‘qish sur’ati:</span>
            <div class="ui-segmented" role="group" aria-label="Kurs sur’ati">
              <button type="button" class="ui-seg-btn ${pace === 'standard' ? 'is-active' : ''}" data-course-pace="standard">Odatiy · 12 hafta</button>
              <button type="button" class="ui-seg-btn ${pace === 'fast' ? 'is-active' : ''}" data-course-pace="fast">Tezkor · 6 hafta</button>
            </div>
          </div>

          <div class="toolbar-group">
            <span class="toolbar-label">Guruhlash:</span>
            <div class="ui-segmented" role="group" aria-label="Dastur guruhlashi">
              <button type="button" class="ui-seg-btn ${view === 'modules' ? 'is-active' : ''}" data-course-view="modules">Modullar (4 ta)</button>
              <button type="button" class="ui-seg-btn ${view === 'weeks' ? 'is-active' : ''}" data-course-view="weeks">Haftalar (${paceMeta.weeksCount})</button>
            </div>
          </div>
        </div>

        ${renderAccordion(buildAccordionItems(state))}
      </section>
    </main>
    ${renderFooter()}
  `;

  container.querySelectorAll('[data-course-pace]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pace = btn.dataset.coursePace === 'fast' ? 'fast' : 'standard';
      persist();
      renderCoursesPage(container, { state, persist });
    });
  });

  container.querySelectorAll('[data-course-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.curriculumView = btn.dataset.courseView === 'weeks' ? 'weeks' : 'modules';
      persist();
      renderCoursesPage(container, { state, persist });
    });
  });
}
