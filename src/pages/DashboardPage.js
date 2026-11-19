import {
  lessons,
  COURSE_MODULES,
  PACE_OPTIONS,
  getStudyPlanWeeks,
  getLesson
} from '../lib/course.js';
import { exercises } from '../data/curriculum.js';
import { mastery } from '../services/progressService.js';
import { exportProgress, importProgress } from '../lib/storage.js';
import { escapeHTML } from '../components/lessonText.js';
import { renderProgressBar } from '../components/ui/index.js';
import { renderFooter } from '../components/layout/Footer.js';
import { openProfileModal } from '../components/ProfileModal.js';

function getInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function renderDashboardPage(container, { state, persist, onImportState, notify, onProfileUpdated }) {
  const totalLessons = lessons.length;
  const completedCount = state.completed.length;
  const remainingCount = Math.max(0, totalLessons - completedCount);
  const overallPercent = totalLessons ? Math.round((completedCount / totalLessons) * 100) : 0;

  const pace = state.pace === 'fast' ? 'fast' : 'standard';
  const view = state.curriculumView === 'weeks' ? 'weeks' : 'modules';
  const paceMeta = PACE_OPTIONS[pace];
  const remainingMain = lessons.filter(l => l.week > 0 && !state.completed.includes(l.id)).length;
  const estimatedWeeksLeft = remainingMain === 0 ? 0 : Math.ceil(remainingMain / paceMeta.lessonsPerWeek);

  const hasStarted =
    completedCount > 0 ||
    Object.keys(state.records || {}).length > 0 ||
    Object.keys(state.exerciseResults || {}).length > 0;

  const lastLesson = getLesson(state.lastLesson || 'setup-01');
  const lastLessonMastery = mastery(state, lastLesson);

  const solvedExercises = exercises.filter(ex => state.exerciseResults[ex.id]?.passed);
  const unsolvedExercises = exercises.filter(ex => !state.exerciseResults[ex.id]?.passed);

  const recommendations = [];
  if (!hasStarted) {
    recommendations.push({
      title: 'O‘qishni 0-moduldan boshlang',
      reason: 'Hali birorta dars natijasi qayd etilmagan. Dasturlash muhiti va o‘qish rejasini 0.1-darsdan boshlash tavsiya etiladi.',
      target: '/learn/setup-01',
      actionLabel: '0.1-darsni ochish'
    });
  } else {
    if (!state.completed.includes('setup-03')) {
      recommendations.push({
        title: 'Node.js va npm o‘rnatishni tasdiqlang',
        reason: 'Keyingi haftalardagi darslarni yakunlangan deb belgilash uchun 0.3-darsdagi tekshiruvlarni bajarish kerak.',
        target: '/learn/setup-03',
        actionLabel: '0.3-darsga o‘tish'
      });
    }

    for (const item of lessons) {
      if (item.week === 0) continue;
      if (state.completed.includes(item.id)) continue;
      const rec = state.records?.[item.id];
      if (!rec) continue;
      const score = rec.quiz?.score;
      const requiredScore = Math.ceil(item.quiz.length * 0.8);
      if (rec.quiz && score < requiredScore) {
        recommendations.push({
          title: `${item.title} — mini-testni qayta ko‘rib chiqing`,
          reason: `Joriy natija ${score}/${item.quiz.length}. Yakunlash uchun kamida ${requiredScore}/${item.quiz.length} ball tavsiya etiladi.`,
          target: `/learn/${item.id}?tab=quiz`,
          actionLabel: 'Testni qayta ishlash'
        });
      }
      const failedEx = item.exerciseIds.filter(
        exId => !state.exerciseResults[exId]?.passed && (state.exerciseResults[exId]?.wrongAttempts || 0) > 0
      );
      if (failedEx.length) {
        recommendations.push({
          title: `${item.title} — algoritmik masalalarni yakunlang`,
          reason: `${failedEx.join(', ')} masalalarida urinishlar qayd etilgan, lekin hali yechilmagan.`,
          target: `/learn/${item.id}?tab=exercise`,
          actionLabel: 'Masalaga qaytish'
        });
      }
      if (recommendations.length >= 4) break;
    }

    if (!recommendations.length && remainingCount > 0) {
      const nextLesson = lessons.find(l => !state.completed.includes(l.id)) || lastLesson;
      recommendations.push({
        title: `Navbatdagi dars: ${nextLesson.title}`,
        reason: 'Hozirgacha boshlangan bo‘limlarda jiddiy xatolar aniqlanmadi. Keyingi dars bilan davom eting.',
        target: `/learn/${nextLesson.id}`,
        actionLabel: 'Darsni ochish'
      });
    }
  }

  const progressRowsHTML =
    view === 'modules'
      ? COURSE_MODULES.map(mod => {
          const done = mod.lessonIds.filter(id => state.completed.includes(id)).length;
          const firstId = mod.lessonIds[0];
          return `
            <a href="/learn/${escapeHTML(firstId)}" data-route="/learn/${escapeHTML(firstId)}" class="dash-week-row">
              <div class="dash-week-meta">
                <strong>${mod.number}-modul · ${escapeHTML(mod.title)}</strong>
                <span class="tabular-nums">${done} / ${mod.lessonIds.length}</span>
              </div>
              ${renderProgressBar({ value: done, max: mod.lessonIds.length, showPercent: false })}
            </a>
          `;
        }).join('')
      : [
          { number: 0, title: 'Dasturlashga tayyorgarlik', lessonIds: COURSE_MODULES[0].lessonIds },
          ...getStudyPlanWeeks(pace)
        ]
          .map(week => {
            const done = week.lessonIds.filter(id => state.completed.includes(id)).length;
            const firstId = week.lessonIds[0];
            return `
              <a href="/learn/${escapeHTML(firstId)}" data-route="/learn/${escapeHTML(firstId)}" class="dash-week-row">
                <div class="dash-week-meta">
                  <strong>${week.number === 0 ? '0-modul' : week.number + '-hafta'} · ${escapeHTML(week.title)}</strong>
                  <span class="tabular-nums">${done} / ${week.lessonIds.length}</span>
                </div>
                ${renderProgressBar({ value: done, max: week.lessonIds.length, showPercent: false })}
              </a>
            `;
          })
          .join('');

  const profile = state.profile || { fullName: '', goal: '', bio: '', avatar: '' };
  const hasProfile = Boolean(profile.fullName || profile.avatar || profile.goal || profile.bio);
  const initials = getInitials(profile.fullName);

  container.innerHTML = `
    <main class="site-main page-container">
      <header class="page-header dashboard-header">
        <div>
          <div class="home-kicker">Shaxsiy o‘quv paneli</div>
          <h1>${profile.fullName ? `Xush kelibsiz, ${escapeHTML(profile.fullName)}!` : 'Xush kelibsiz — O‘qishni davom ettiring!'}</h1>
          <p>Natijalar brauzeringiz xotirasida (<code>localStorage</code>) xavfsiz saqlanadi. O‘zingizga mos o‘qish sur’atini tanlashingiz mumkin.</p>
        </div>
        <div class="dashboard-backup-actions">
          <button type="button" id="dashExportBtn" class="ghost-button">↓ Natijani saqlash</button>
          <label class="ghost-button import-label" for="dashImportFile">↑ Tiklash</label>
          <input id="dashImportFile" type="file" accept="application/json" hidden />
        </div>
      </header>

      <section class="dash-profile-card" aria-label="O‘quvchi profili">
        <div class="dash-profile-main">
          <div class="dash-profile-avatar">
            ${
              profile.avatar
                ? `<img src="${escapeHTML(profile.avatar)}" alt="${escapeHTML(profile.fullName || 'O‘quvchi rasmi')}" />`
                : initials
                  ? `<span class="dash-profile-initials">${escapeHTML(initials)}</span>`
                  : `<svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.75" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`
            }
          </div>
          <div class="dash-profile-info">
            <div class="dash-profile-title-row">
              <h2>${profile.fullName ? escapeHTML(profile.fullName) : 'O‘quvchi profili yaratilmagan'}</h2>
              ${profile.goal ? `<span class="dash-profile-goal">${escapeHTML(profile.goal)}</span>` : ''}
            </div>
            ${
              profile.bio
                ? `<p class="dash-profile-bio">${escapeHTML(profile.bio)}</p>`
                : `<p class="dash-profile-bio muted">${
                    hasProfile
                      ? 'O‘zingiz haqingizda qisqacha ma’lumot qo‘shishingiz mumkin.'
                      : 'Ismingiz, o‘quv maqsadingiz va shaxsiy rasmingizni yuklab, o‘lchamini hamda joylashuvini sozlang.'
                  }</p>`
            }
          </div>
        </div>
        <div class="dash-profile-actions">
          <button type="button" id="openProfileModalBtn" class="${hasProfile ? 'ghost-button' : 'primary-button'}">${hasProfile ? 'Profilni tahrirlash' : 'Profil yaratish'}</button>
        </div>
      </section>

      <section class="dash-pace-bar">
        <div>
          <strong>Tanlangan o‘qish sur’ati: ${escapeHTML(paceMeta.label)}</strong>
          <p class="muted">${escapeHTML(paceMeta.hoursPerWeek)} · Asosiy kursni yakunlashga taxminan <b>${estimatedWeeksLeft} hafta</b> qoldi.</p>
        </div>
        <div class="ui-segmented" role="group" aria-label="O‘qish sur’atini almashtirish">
          <button type="button" class="ui-seg-btn ${pace === 'standard' ? 'is-active' : ''}" data-dash-pace="standard">Odatiy · 12 hafta</button>
          <button type="button" class="ui-seg-btn ${pace === 'fast' ? 'is-active' : ''}" data-dash-pace="fast">Tezkor · 6 hafta</button>
        </div>
      </section>

      <section class="dashboard-stats-grid" aria-label="Asosiy o‘zlashtirish ko‘rsatkichlari">
        <div class="dash-stat-card">
          <span>Bajarilgan darslar</span>
          <strong class="tabular-nums">${completedCount} / ${totalLessons}</strong>
        </div>
        <div class="dash-stat-card">
          <span>Qolgan darslar</span>
          <strong class="tabular-nums">${remainingCount}</strong>
        </div>
        <div class="dash-stat-card">
          <span>Umumiy rivojlanish</span>
          <strong class="tabular-nums">${overallPercent}%</strong>
        </div>
        <div class="dash-stat-card">
          <span>Oxirgi o‘rganilgan mavzu</span>
          <strong class="dash-stat-text">${hasStarted ? escapeHTML(lastLesson.title) : 'Hali boshlanmagan'}</strong>
        </div>
      </section>

      <section class="dashboard-continue-card">
        <div class="dash-continue-copy">
          <div class="home-kicker">${lastLesson.week === 0 ? '0-modul' : `${lastLesson.week}-hafta`} · ${escapeHTML(String(lastLesson.number))}-dars</div>
          <h2>${escapeHTML(lastLesson.title)}</h2>
          <p>${escapeHTML(lastLesson.concept)}</p>
          ${
            hasStarted
              ? renderProgressBar({
                  value: lastLessonMastery,
                  max: 100,
                  label: 'Ushbu dars bo‘yicha o‘zlashtirish'
                })
              : `<p class="muted">O‘qish hali boshlanmagan. Birinchi darsga o‘tish uchun quyidagi tugmani bosing.</p>`
          }
        </div>
        <div class="dash-continue-action">
          <a href="/learn/${escapeHTML(lastLesson.id)}" data-route="/learn/${escapeHTML(lastLesson.id)}" class="primary-button">${hasStarted ? 'O‘qishni davom ettirish →' : 'Birinchi darsni boshlash →'}</a>
        </div>
      </section>

      <div class="dashboard-columns">
        <section class="dash-panel">
          <div class="dash-panel-head">
            <h2>${view === 'modules' ? 'Modullar bo‘yicha rivojlanish' : 'Haftalik rivojlanish'}</h2>
            <div class="ui-segmented" role="group" aria-label="Progress ko‘rinishi">
              <button type="button" class="ui-seg-btn ${view === 'modules' ? 'is-active' : ''}" data-dash-view="modules">Modullar</button>
              <button type="button" class="ui-seg-btn ${view === 'weeks' ? 'is-active' : ''}" data-dash-view="weeks">Haftalar</button>
            </div>
          </div>
          <div class="dash-weeks-list">
            ${progressRowsHTML}
          </div>
        </section>

        <div class="dashboard-side-stack">
          <section class="dash-panel">
            <div class="dash-panel-head">
              <h2>Amaliy mashqlar</h2>
              <span class="muted tabular-nums">${solvedExercises.length} / ${exercises.length} yechilgan</span>
            </div>
            ${renderProgressBar({
              value: solvedExercises.length,
              max: exercises.length,
              label: 'Algoritmik masalalar'
            })}
            <div class="dash-exercises-summary">
              <div>
                <h3>Keyingi yechilmagan masalalar</h3>
                ${
                  unsolvedExercises.length
                    ? `<ul class="dash-ex-list">${unsolvedExercises
                        .slice(0, 5)
                        .map(
                          ex => `<li>
                            <a href="/learn/${escapeHTML(ex.lessonId)}?tab=exercise" data-route="/learn/${escapeHTML(ex.lessonId)}?tab=exercise">
                              <strong>${escapeHTML(ex.id)}</strong> — ${escapeHTML(ex.title)}
                            </a>
                          </li>`
                        )
                        .join('')}</ul>`
                    : `<p class="correct">Barcha ${exercises.length} ta algoritmik masala yechilgan!</p>`
                }
              </div>
              <div>
                <h3>Oxirgi yechilganlar</h3>
                ${
                  solvedExercises.length
                    ? `<ul class="dash-ex-list">${solvedExercises
                        .slice(-4)
                        .reverse()
                        .map(
                          ex => `<li>
                            <a href="/learn/${escapeHTML(ex.lessonId)}?tab=exercise" data-route="/learn/${escapeHTML(ex.lessonId)}?tab=exercise">
                              <strong>✓ ${escapeHTML(ex.id)}</strong> — ${escapeHTML(ex.title)}
                            </a>
                          </li>`
                        )
                        .join('')}</ul>`
                    : `<p class="muted">Hali yechilgan masalalar yo‘q. 1-haftadan boshlab masalalar ochiladi.</p>`
                }
              </div>
            </div>
          </section>

          <section class="dash-panel">
            <div class="dash-panel-head">
              <h2>Tavsiyalar</h2>
            </div>
            <div class="dash-rec-list">
              ${recommendations
                .map(
                  rec => `
                <article class="dash-rec-item">
                  <h3>${escapeHTML(rec.title)}</h3>
                  <p>${escapeHTML(rec.reason)}</p>
                  <a href="${escapeHTML(rec.target)}" data-route="${escapeHTML(rec.target)}" class="week-open-link">${escapeHTML(rec.actionLabel)} →</a>
                </article>
              `
                )
                .join('')}
            </div>
          </section>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  const profileBtn = container.querySelector('#openProfileModalBtn');
  if (profileBtn) {
    profileBtn.addEventListener('click', () => {
      openProfileModal({
        profile: state.profile,
        notify,
        onSave: nextProfile => {
          state.profile = nextProfile;
          persist();
          onProfileUpdated?.();
          renderDashboardPage(container, { state, persist, onImportState, notify, onProfileUpdated });
        }
      });
    });
  }

  container.querySelectorAll('[data-dash-pace]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.pace = btn.dataset.dashPace === 'fast' ? 'fast' : 'standard';
      persist();
      renderDashboardPage(container, { state, persist, onImportState, notify, onProfileUpdated });
    });
  });

  container.querySelectorAll('[data-dash-view]').forEach(btn => {
    btn.addEventListener('click', () => {
      state.curriculumView = btn.dataset.dashView === 'weeks' ? 'weeks' : 'modules';
      persist();
      renderDashboardPage(container, { state, persist, onImportState, notify, onProfileUpdated });
    });
  });

  const exportBtn = container.querySelector('#dashExportBtn');
  if (exportBtn) exportBtn.addEventListener('click', () => exportProgress(state));

  const importInput = container.querySelector('#dashImportFile');
  if (importInput) {
    importInput.addEventListener('change', async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      try {
        const imported = await importProgress(file);
        onImportState(imported);
        notify('Natijalar tiklandi');
      } catch (err) {
        notify('Import xatosi: ' + err.message);
      }
      event.target.value = '';
    });
  }
}
