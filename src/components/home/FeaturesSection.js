import {
  COURSE_MODULES,
  PACE_OPTIONS,
  getStudyPlanWeeks,
  getLesson
} from '../../lib/course.js';
import { escapeHTML } from '../lessonText.js';
import { attachCodeEditor } from '../CodeEditor.js';
import { runCode, stopCode } from '../codeRunner.js';

const TOPICS = [
  {
    title: 'JavaScript asoslari',
    desc: 'O‘zgaruvchilar, ma’lumot turlari, operatorlar va funksiyalar.'
  },
  {
    title: 'Algoritmlar',
    desc: 'Shart operatorlari, sikllar, massivlar va masalalar.'
  },
  {
    title: 'HTML, CSS va DOM',
    desc: 'Interaktiv veb-sahifalar yaratish.'
  },
  {
    title: 'Zamonaviy JavaScript',
    desc: 'ES6+, async/await, API va JSON.'
  },
  {
    title: 'Amaliy loyihalar',
    desc: 'Kalkulyator, vazifalar ro‘yxati va test platformasi.'
  },
  {
    title: 'Git va GitHub',
    desc: 'Kodlarni boshqarish va loyihani internetga joylashtirish.'
  }
];

const STEPS = [
  {
    num: '01',
    title: 'Mavzuni o‘rganing',
    desc: 'Har bir mavzuni sodda o‘zbekcha tushuntirish, hayotiy misollar va vizual diagrammalar bilan o‘zlashtiring.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/></svg>`
  },
  {
    num: '02',
    title: 'Kod yozib mashq qiling',
    desc: 'Brauzerdagi kod laboratoriyasi, xatolarni tuzatish va 45 ta algoritmik masala yordamida amaliy tajriba to‘plang.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/></svg>`
  },
  {
    num: '03',
    title: 'Mustaqil loyiha yarating',
    desc: 'Olgan bilimlaringizni kalkulyator, vazifalar ro‘yxati va yakuniy mini-test loyihalarida qo‘llang.',
    icon: `<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="m9 12 2 2 4-4"/></svg>`
  }
];

const WEEK_SKILLS = {
  1: 'Konsol, o‘zgaruvchilar va asosiy ma’lumot turlari',
  2: 'Arifmetika, Math usullari va satrlar bilan ishlash',
  3: 'Taqqoslash, mantiqiy operatorlar va if/switch',
  4: 'for, while sikllari va takrorlanuvchi hisob-kitoblar',
  5: 'Funksiyalar, return va massiv metodlari',
  6: 'Obyektlar, matn metodlari va JSON formati',
  7: 'DOM daraxti, element tanlash va hodisalar',
  8: 'Formalar, validatsiya va localStorage',
  9: 'ES6+, destrukturizatsiya va modulli kod',
  10: 'Fetch API, Promise va async/await',
  11: 'Test ilovasini loyihalash va holat boshqaruvi',
  12: 'Yakuniy loyiha va Git/GitHub nashri'
};

export const DEMO_DEFAULT_CODE = `let ism = "Dasturchi";

console.log("Salom, " + ism + "!");`;

function renderCurriculumCards(state) {
  const pace = state?.pace === 'fast' ? 'fast' : 'standard';
  const view = state?.curriculumView === 'weeks' ? 'weeks' : 'modules';
  const paceMeta = PACE_OPTIONS[pace];

  if (view === 'modules') {
    return `
      <div class="modules-grid">
        ${COURSE_MODULES.map(mod => {
          const firstLessonId = mod.lessonIds[0];
          const doneCount = (state?.completed || []).filter(id => mod.lessonIds.includes(id)).length;
          const totalMins = mod.lessonIds.reduce((sum, id) => sum + (getLesson(id).durationMinutes || 0), 0);
          const totalHours = Math.round(totalMins / 60);
          const spanText =
            mod.number === 0
              ? '0-modul · Boshlang‘ich sozlash'
              : pace === 'fast'
                ? `${Math.ceil(mod.lessonIds.length / 8)} hafta (tezkor)`
                : mod.spanLabel;

          return `
            <article class="module-card">
              <div class="week-card-head">
                <span class="week-num tabular-nums">${mod.number}-modul</span>
                <span class="week-lessons-count tabular-nums">${mod.lessonIds.length} ta dars · ~${totalHours} soat</span>
              </div>
              <h3>${escapeHTML(mod.title)}</h3>
              <p class="module-span">${escapeHTML(spanText)}${doneCount ? ` · ${doneCount}/${mod.lessonIds.length} bajarilgan` : ''}</p>
              <p class="week-skill">${escapeHTML(mod.summary)}</p>
              <a href="/learn/${escapeHTML(firstLessonId)}" data-route="/learn/${escapeHTML(firstLessonId)}" class="week-open-link">Modulni ochish →</a>
            </article>
          `;
        }).join('')}
      </div>
    `;
  }

  const planWeeks = getStudyPlanWeeks(pace);
  return `
    <div class="weeks-grid ${pace === 'fast' ? 'weeks-grid-fast' : ''}">
      ${planWeeks
        .map(week => {
          const firstLessonId = week.lessonIds[0];
          const firstLesson = getLesson(firstLessonId);
          const skill =
            pace === 'fast'
              ? `${week.sourceWeeks} mavzulari (${paceMeta.hoursPerWeek})`
              : WEEK_SKILLS[week.number] || firstLesson.concept;
          return `
            <article class="week-card">
              <div class="week-card-head">
                <span class="week-num tabular-nums">${week.number}-hafta</span>
                <span class="week-lessons-count tabular-nums">${week.lessonIds.length} ta dars</span>
              </div>
              <h3>${escapeHTML(week.title)}</h3>
              <p class="week-skill">${escapeHTML(skill)}</p>
              <a href="/learn/${escapeHTML(firstLessonId)}" data-route="/learn/${escapeHTML(firstLessonId)}" class="week-open-link">Darslarni ochish →</a>
            </article>
          `;
        })
        .join('')}
    </div>
  `;
}

export function renderFeaturesSection(state) {
  const pace = state?.pace === 'fast' ? 'fast' : 'standard';
  const view = state?.curriculumView === 'weeks' ? 'weeks' : 'modules';
  const paceMeta = PACE_OPTIONS[pace];

  return `
    <section class="home-section">
      <div class="home-section-head">
        <h2>Nimalarni o‘rganasiz?</h2>
        <p>Nazariya, algoritmik fikrlash va amaliy veb-ishlab chiqishni qamrab olgan tizimli yo‘nalishlar.</p>
      </div>
      <div class="feature-grid">
        ${TOPICS.map(
          item => `
          <article class="feature-card">
            <h3>${escapeHTML(item.title)}</h3>
            <p>${escapeHTML(item.desc)}</p>
          </article>
        `
        ).join('')}
      </div>
    </section>

    <section class="home-section home-section-tinted">
      <div class="home-section-head">
        <h2>Qanday o‘rganasiz?</h2>
        <p>Har bir mavzuni tushunishdan haqiqiy natijaga olib boruvchi uch bosqichli metodika.</p>
      </div>
      <div class="process-grid">
        ${STEPS.map(
          step => `
          <article class="process-card">
            <div class="process-card-top">
              <span class="process-num tabular-nums">${step.num}</span>
              <span class="process-icon">${step.icon}</span>
            </div>
            <h3>${escapeHTML(step.title)}</h3>
            <p>${escapeHTML(step.desc)}</p>
          </article>
        `
        ).join('')}
      </div>
    </section>

    <section class="home-section" id="curriculum">
      <div class="home-section-head home-section-head-split">
        <div>
          <h2>O‘quv dasturi va o‘qish sur’ati</h2>
          <p>Darslar ixcham 4 ta modulga birlashtirilgan. O‘zingizga qulay sur’at va ko‘rinishni tanlang.</p>
        </div>
        <a href="/courses" data-route="/courses" class="ghost-button">Barcha 54 ta darsni ko‘rish →</a>
      </div>

      <div class="curriculum-toolbar">
        <div class="toolbar-group">
          <span class="toolbar-label">O‘qish sur’ati:</span>
          <div class="ui-segmented" role="group" aria-label="O‘qish sur’atini tanlash">
            <button type="button" class="ui-seg-btn ${pace === 'standard' ? 'is-active' : ''}" data-pace="standard">Odatiy reja · 12 hafta</button>
            <button type="button" class="ui-seg-btn ${pace === 'fast' ? 'is-active' : ''}" data-pace="fast">Tezkor reja · 6 hafta</button>
          </div>
        </div>

        <div class="toolbar-group">
          <span class="toolbar-label">Ko‘rinish:</span>
          <div class="ui-segmented" role="group" aria-label="Dastur ko‘rinishini tanlash">
            <button type="button" class="ui-seg-btn ${view === 'modules' ? 'is-active' : ''}" data-cview="modules">Ixcham modullar (4 ta)</button>
            <button type="button" class="ui-seg-btn ${view === 'weeks' ? 'is-active' : ''}" data-cview="weeks">Haftalar (${paceMeta.weeksCount} hafta)</button>
          </div>
        </div>
      </div>

      <p class="pace-summary-note" id="homePaceSummary">${escapeHTML(paceMeta.description)}</p>

      <div id="homeCurriculumMount">
        ${renderCurriculumCards(state)}
      </div>
    </section>

    <section class="home-section">
      <div class="home-lab-card">
        <div class="home-lab-copy">
          <h2>Interaktiv kod namunasi</h2>
          <p>Hech narsa o‘rnatmasdan hoziroq birinchi JavaScript kodingizni ishga tushirib ko‘ring. Ismni o‘zgartiring va natijani shu yerda kuzating.</p>
          <div class="home-lab-links">
            <a href="/learn/lesson-01" data-route="/learn/lesson-01" class="ghost-button">To‘liq laboratoriyada ochish →</a>
          </div>
        </div>

        <div class="home-lab-workbench">
          <div class="lab-workbench">
            <div class="editor-top">
              <span>demo.js</span>
              <div>
                <button type="button" id="homeDemoReset" class="ghost-button">↻ Tiklash</button>
                <button type="button" id="homeDemoRun" class="primary-button">▶ Ishga tushirish</button>
              </div>
            </div>
            <textarea id="homeDemoEditor" class="editor home-demo-editor" spellcheck="false" aria-label="Bosh sahifa kod namunasi">${escapeHTML(DEMO_DEFAULT_CODE)}</textarea>
          </div>
          <div class="console-title">Konsol natijasi</div>
          <pre id="homeDemoOutput" class="console">▶ Kodni ishga tushiring</pre>
          <div id="homeDemoPreview"></div>
        </div>
      </div>
    </section>

    <section class="home-final-cta">
      <div class="home-final-cta-inner">
        <h2>Bugun birinchi JavaScript dasturingizni yozing!</h2>
        <p>Dasturlashni o‘rganish uchun avvaldan dasturchi bo‘lish shart emas. Eng muhimi — birinchi qadamni tashlash.</p>
        <a href="/learn/setup-01" data-route="/learn/setup-01" class="primary-button hero-cta-primary">Birinchi darsni boshlash →</a>
      </div>
    </section>
  `;
}

export function bindHomeInteractiveSections(container, { state, persist }) {
  const editor = container.querySelector('#homeDemoEditor');
  const output = container.querySelector('#homeDemoOutput');
  const preview = container.querySelector('#homeDemoPreview');
  const runBtn = container.querySelector('#homeDemoRun');
  const resetBtn = container.querySelector('#homeDemoReset');
  if (editor && output && runBtn && resetBtn) {
    attachCodeEditor(editor);
    runBtn.addEventListener('click', () => {
      runCode(editor.value, output, preview);
    });
    resetBtn.addEventListener('click', () => {
      stopCode();
      editor.value = DEMO_DEFAULT_CODE;
      output.textContent = '▶ Kodni ishga tushiring';
      if (preview) preview.replaceChildren();
    });
  }

  const mount = container.querySelector('#homeCurriculumMount');
  const summaryEl = container.querySelector('#homePaceSummary');
  const weeksBtn = container.querySelector('[data-cview="weeks"]');

  const syncControls = () => {
    const pace = state.pace === 'fast' ? 'fast' : 'standard';
    const view = state.curriculumView === 'weeks' ? 'weeks' : 'modules';
    const paceMeta = PACE_OPTIONS[pace];

    container.querySelectorAll('[data-pace]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.pace === pace);
    });
    container.querySelectorAll('[data-cview]').forEach(btn => {
      btn.classList.toggle('is-active', btn.dataset.cview === view);
    });
    if (weeksBtn) weeksBtn.textContent = `Haftalar (${paceMeta.weeksCount} hafta)`;
    if (summaryEl) summaryEl.textContent = paceMeta.description;
    if (mount) mount.innerHTML = renderCurriculumCards(state);
  };

  container.querySelectorAll('[data-pace]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pace = btn.dataset.pace === 'fast' ? 'fast' : 'standard';
      persist();
      syncControls();
    });
  });

  container.querySelectorAll('[data-cview]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.curriculumView = btn.dataset.cview === 'weeks' ? 'weeks' : 'modules';
      persist();
      syncControls();
    });
  });
}
