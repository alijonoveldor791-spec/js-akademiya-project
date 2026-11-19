import { bindLesson04 } from '../components/Lesson04.js';
import { formatInlineJS, renderLessonText, highlightJavaScript } from '../components/lessonText.js';
import { attachCodeEditor, formatJavaScript } from '../components/CodeEditor.js';
import { exercises } from '../data/curriculum.js';
import { renderTheory, renderSetup, renderCodeNotes, escapeHTML } from '../components/LessonViewer.js';
import { renderQuiz } from '../components/Quiz.js';
import { renderExercises } from '../components/ExerciseCard.js';
import { renderLessonProgress } from '../components/ProgressTracker.js';
import { recordFor, completionAllowed, mastery } from '../services/progressService.js';
import { lessons, getLesson, getLessonIndex, lessonURL, lessonFromHash } from '../lib/course.js';
import { renderVideo } from '../components/video.js';
import { runCode, stopCode } from '../components/codeRunner.js';
import { renderSimulatorMount, renderLabTracer, stopSimulatorTimers } from '../components/InteractiveSimulators.js';
import { renderDiagramSVG } from '../components/VisualDiagrams.js';
import { LESSON_VISUALS } from '../data/visualMedia.js';
import { renderSidebarShell, renderSidebarNav, updateSidebarProgress } from '../components/layout/Sidebar.js';
import { renderProgressBar } from '../components/ui/index.js';
import { renderFooter } from '../components/layout/Footer.js';

export function mountLearnPage(container, { state, initialLessonId, initialTab, persist, notify, onImportState, onNavigate }) {
  let lesson = initialLessonId ? getLesson(initialLessonId) : lessonFromHash();
  let query = '';
  let sidebarOpen = false;
  let outlineOpen = false;
  let currentTab = initialTab || 'lesson';

  container.innerHTML = `
    <div class="learn-subbar">
      <div class="learn-subbar-inner">
        <button type="button" id="menu" class="icon-button menu-button" aria-label="Mundarijani ochish">☰ Mundarija</button>
        <span id="breadcrumb" class="breadcrumb"></span>
      </div>
    </div>

    <div class="layout" id="layout">
      ${renderSidebarShell()}
      <div class="page">
        <div class="learn-main-grid">
          <main class="content">
            <section class="hero">
              <div class="eyebrow" id="eyebrow"></div>
              <h1 id="title"></h1>
              <p id="lead"></p>
              <div class="hero-tags"><span>Nazariya</span><span>Kod laboratoriyasi</span><span>Amaliyot</span><span>Video</span></div>
            </section>

            <div class="tabs" role="tablist" aria-label="Dars bo‘limlari">
              <button type="button" data-tab="lesson" class="tab active">Dars</button>
              <button type="button" data-tab="practice" class="tab">Amaliyot va uy vazifasi</button>
              <button type="button" data-tab="exercise" class="tab">Algoritmik masalalar</button>
              <button type="button" data-tab="quiz" class="tab">Mini-test</button>
              <button type="button" data-tab="video" class="tab">Video dars</button>
              <button type="button" data-tab="notes" class="tab">Qaydlar</button>
            </div>

            <div id="lessonPanel" class="tab-panel">
              <section class="panel" id="secTheory">
                <div class="section-heading"><span class="section-num">01</span><h2 id="topicTitle">Mavzu:</h2></div>
                <p id="concept" class="concept"></p>
                <p id="explain" class="text"></p>
                <p id="tip" class="tip"></p>
                <div id="theoryExtras"></div>
              </section>
              <div id="setupMount"></div>
              <div id="simulatorMount"></div>
              <section class="panel lab-panel" id="secLab">
                <div class="section-heading"><span class="section-num">02</span><h2>Kodni o‘zimiz sinaymiz</h2></div>
                <p class="muted">Kodni o‘zgartiring va «Ishga tushirish»ni bosing. Konsol natijasi quyida ko‘rinadi. DOM kodlari quyidagi o‘quv maydonida aks etadi.</p>
                <div class="lab-workbench">
                  <div class="editor-top">
                    <span>script.js · <span id="fileName"></span></span>
                    <div>
                      <button type="button" id="formatCode" class="ghost-button">Formatlash</button>
                      <button type="button" id="copyCode" class="ghost-button">Nusxalash</button>
                      <button type="button" id="resetCode" class="ghost-button">↻ Tiklash</button>
                      <button type="button" id="traceCodeBtn" class="ghost-button">Qadam-baqadam</button>
                      <button type="button" id="runCode" class="primary-button">▶ Ishga tushirish</button>
                      <button type="button" id="stopCode" class="ghost-button">■ To‘xtatish</button>
                    </div>
                  </div>
                  <textarea id="editor" class="editor" spellcheck="false" aria-label="JavaScript kod muharriri"></textarea>
                </div>
                <div id="labTraceMount" class="hidden"></div>
                <div class="console-title">Konsol natijasi</div>
                <pre id="output" class="console">▶ Kodni ishga tushiring</pre>
                <div id="preview"></div>
                <div id="codeNotes"></div>
                <small class="muted">Kod alohida Worker’da bajariladi; 15 soniyada to‘xtaydi. DOM o‘quv adapteri asosiy elementlar va hodisalarni qo‘llaydi. To‘liq brauzer APIlari uchun VS Code loyihangizdan foydalaning.</small>
              </section>
            </div>

            <div id="practicePanel" class="tab-panel hidden">
              <section class="panel">
                <div class="section-heading"><span class="section-num">03</span><h2>Mustaqil amaliy mashq</h2></div>
                <div class="assignment"><span class="small-label">Topshiriq</span><p id="practice"></p></div>
                <div id="practiceTasks"></div>
                <h3>O‘zingizni tekshiring</h3>
                <p id="check"></p>
              </section>
              <section class="panel">
                <div class="section-heading"><span class="section-num">04</span><h2>Mustaqil uy vazifasi</h2></div>
                <div class="assignment homework"><span class="small-label">JavaScript amaliyoti</span><p id="home"></p><div id="homeworkList"></div></div>
              </section>
            </div>

            <div id="exercisePanel" class="tab-panel hidden"></div>
            <div id="quizPanel" class="tab-panel hidden"></div>

            <div id="videoPanel" class="tab-panel hidden">
              <section class="panel">
                <div class="section-heading"><span class="section-num">05</span><h2>Video dars</h2></div>
                <div id="videoMount" class="video-mount"></div>
                <p class="muted">Video ulash bo‘yicha yo‘riqnoma: <code>docs/VIDEO_QOSHISH.md</code>. Darsni videosiz ham mustaqil o‘rganish mumkin.</p>
                <div id="videoMaterials"></div>
              </section>
            </div>

            <div id="notesPanel" class="tab-panel hidden">
              <section class="panel">
                <div class="section-heading"><span class="section-num">06</span><h2>Shaxsiy qaydlarim</h2></div>
                <p class="muted">O‘rganilgan mavzular, xatolar va uy vazifasi haqidagi fikrlarni yozing.</p>
                <textarea id="notes" class="notes" placeholder="Bugun nimalarni o‘rgandim?..."></textarea>
                <small class="muted">Qaydlar brauzeringizda localStorage orqali saqlanadi. Ularni yuqoridagi tugma bilan faylga eksport qiling.</small>
              </section>
            </div>

            <div id="bugMount"></div>
            <div id="lessonProgress"></div>

            <div class="lesson-bottom">
              <label class="complete"><input type="checkbox" id="complete" /><span>Bu darsni tushundim va amaliyotini bajardim</span></label>
              <div class="nav-buttons">
                <button type="button" id="prev" class="ghost-button">← Oldingi dars</button>
                <span id="counter" class="muted"></span>
                <button type="button" id="next" class="primary-button">Keyingi dars →</button>
              </div>
            </div>
          </main>

          <aside class="lesson-outline" id="lessonRightPanel" aria-label="Dars tarkibi va konspekt"></aside>
        </div>

        ${renderFooter()}
      </div>
    </div>
  `;

  const $ = id => container.querySelector('#' + id);

  function renderRightPanel() {
    const panel = $('lessonRightPanel');
    if (!panel) return;
    const isSetup01 = lesson.id === 'setup-01';
    const isLesson04 = lesson.id === 'lesson-04';
    const pct = mastery(state, lesson);

    const navAnchors = [
      { id: 'secTheory', label: 'Nazariya va sxemalar', show: true },
      { id: 'setupMount', label: 'Tayyorgarlik bosqichlari', show: lesson.week === 0 },
      { id: 'simulatorMount', label: 'Interaktiv model', show: !isSetup01 },
      { id: 'secLab', label: 'Amaliy tajriba maydoni', show: !isSetup01 },
      { id: 'bugMount', label: 'Xatolarni tuzatish', show: !isSetup01 && !isLesson04 },
      { id: 'lessonProgress', label: 'Yakuniy nazorat', show: true }
    ].filter(item => item.show);

    const summaryText = isSetup01
      ? escapeHTML(lesson.concept)
      : formatInlineJS(lesson.principle || lesson.concept);

    panel.innerHTML = `
      <div class="outline-sticky">
        <div class="outline-card">
          <h3>O‘zlashtirish ko‘rsatkichi</h3>
          ${renderProgressBar({ value: pct, max: 100, label: lesson.week === 0 ? 'Tayyorgarlik' : 'Joriy dars' })}
          <div class="outline-tab-shortcuts">
            ${
              lesson.week === 0
                ? `<button type="button" class="ghost-button" data-jump-tab="video">Video dars</button>
                   <button type="button" class="ghost-button" data-jump-tab="notes">Shaxsiy qaydlar</button>`
                : `<button type="button" class="ghost-button" data-jump-tab="quiz">Mini-testga o‘tish</button>
                   <button type="button" class="ghost-button" data-jump-tab="exercise">Masalalarni yechish</button>`
            }
          </div>
        </div>

        <div class="outline-card">
          <h3>Dars tarkibi</h3>
          <nav class="outline-links" aria-label="Dars bo‘limlari bo‘yicha navigatsiya">
            ${navAnchors
              .map(
                item => `<a href="#${item.id}" data-scroll-target="${item.id}">${escapeHTML(item.label)}</a>`
              )
              .join('')}
          </nav>
        </div>

        <div class="outline-card">
          <h3>Qisqa konspekt</h3>
          <p class="outline-summary">${summaryText}</p>
        </div>
      </div>
    `;

    panel.querySelectorAll('[data-scroll-target]').forEach(link => {
      link.addEventListener('click', event => {
        event.preventDefault();
        selectTab('lesson');
        const target = $(link.dataset.scrollTarget);
        target?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });

    panel.querySelectorAll('[data-jump-tab]').forEach(btn => {
      btn.addEventListener('click', () => {
        selectTab(btn.dataset.jumpTab);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function renderVideoCompanion(compEl, currentLesson) {
    if (!compEl) return;
    if (currentLesson.id === 'setup-01') {
      compEl.replaceChildren();
      return;
    }
    const f = formatInlineJS;
    const visual = LESSON_VISUALS[currentLesson.id];
    compEl.innerHTML = `<div class="video-companion">
      <h3>Video ostidagi o‘quv materiallari</h3>
      <div class="video-comp-grid">
        <div class="sim-card"><span class="visual-kicker">DARS KONSPEKTI</span><p>${f(currentLesson.concept)}</p><p class="muted">${f(currentLesson.principle || currentLesson.explain || '')}</p></div>
        <div class="sim-card"><span class="visual-kicker">ASOSIY KOD NAMUNASI</span><pre class="code-sample"><code>${highlightJavaScript(currentLesson.code || '// Amaliy bosqich')}</code></pre></div>
      </div>
      ${visual ? `<div class="diagram-stage">${renderDiagramSVG(visual.diagram, visual.alt)}</div>` : ''}
      ${
        currentLesson.week === 0
          ? ''
          : `<div class="video-comp-grid">
               <div class="sim-card"><span class="visual-kicker">AMALIY MASHQLAR</span><ul>${currentLesson.practices.map(p => `<li><b>${escapeHTML(p.level)}:</b> ${f(p.task)}</li>`).join('')}</ul></div>
               <div class="sim-card"><span class="visual-kicker">UY VAZIFASI</span><p>${f(currentLesson.home)}</p></div>
             </div>`
      }
    </div>`;
  }

  function selectTab(tab) {
    if (lesson.week === 0 && ['practice', 'exercise', 'quiz'].includes(tab)) tab = 'lesson';
    currentTab = tab;
    container.querySelectorAll('.tab').forEach(x => {
      x.classList.toggle('active', x.dataset.tab === tab);
      x.setAttribute('aria-selected', String(x.dataset.tab === tab));
    });
    for (const name of ['lesson', 'practice', 'video', 'notes', 'exercise', 'quiz']) {
      $(name + 'Panel').classList.toggle('hidden', name !== tab);
    }
    if (tab === 'video') {
      const id = lesson.id;
      renderVideo($('videoMount'), lesson.video, state.videoProgress[id], progress => {
        state.videoProgress[id] = progress;
        persist();
      });
      renderVideoCompanion($('videoMaterials'), lesson);
    }
    if (!['exercise', 'quiz'].includes(tab)) {
      $('exercisePanel').classList.add('hidden');
      $('quizPanel').classList.add('hidden');
    }
    if (tab === 'exercise') $('exercisePanel').classList.remove('hidden');
    if (tab === 'quiz') $('quizPanel').classList.remove('hidden');
    state.positions[lesson.id] = { ...state.positions[lesson.id], tab };
    persist();
  }

  function refreshLearning() {
    renderLessonProgress($('lessonProgress'), lesson, state);
    $('complete').checked = state.completed.includes(lesson.id);
    const allowed = completionAllowed(state, lesson);
    $('complete').disabled = !allowed && !state.completed.includes(lesson.id);
    $('complete').title = allowed ? 'Darsni yakunlash' : 'Yakuniy nazorat talablarini bajaring';
    if (!allowed && state.completed.includes(lesson.id) && lesson.week === 0) {
      state.completed = state.completed.filter(x => x !== lesson.id);
      $('complete').checked = false;
    }
    persist();
    updateSidebarProgress({ state, totalLessons: lessons.length });
    renderRightPanel();
  }

  function renderLesson(overrideLessonId, overrideTab) {
    stopCode();
    stopSimulatorTimers();
    $('preview').replaceChildren();
    $('labTraceMount').classList.add('hidden');
    $('labTraceMount').replaceChildren();

    if (overrideLessonId) lesson = getLesson(overrideLessonId);
    else if (location.hash.match(/^#\/((?:lesson|setup)-\d{2})$/)) lesson = lessonFromHash();

    const index = getLessonIndex(lesson.id);
    state.lastLesson = lesson.id;
    persist();

    container.querySelectorAll('[data-tab="practice"],[data-tab="exercise"],[data-tab="quiz"]').forEach(button => {
      button.classList.toggle('hidden', lesson.week === 0);
    });
    $('editor').closest('section.panel').classList.toggle('hidden', lesson.id === 'setup-01');
    $('layout').classList.toggle('lesson04', lesson.id === 'lesson-04');
    $('bugMount').classList.toggle('hidden', ['setup-01', 'lesson-04'].includes(lesson.id));
    container.querySelector('[data-tab="quiz"]').textContent = lesson.id === 'lesson-04' ? 'Bilimni tekshirish' : 'Mini-test';
    container.querySelector('#videoPanel p.muted').hidden = lesson.id === 'lesson-04';
    container.querySelector('.hero-tags span:nth-child(2)').classList.toggle('hidden', lesson.id === 'setup-01');
    container.querySelector('.hero-tags span:nth-child(3)').classList.toggle('hidden', lesson.week === 0);

    $('eyebrow').textContent = `${lesson.week === 0 ? '0-modul' : lesson.week + '-hafta'} / ${lesson.number}-dars / ~${lesson.durationMinutes} daqiqa`;
    $('title').textContent = lesson.title;
    $('topicTitle').textContent = 'Mavzu: ' + lesson.title;
    $('lead').innerHTML = formatInlineJS(lesson.concept);
    $('breadcrumb').textContent = `Kurs / ${lesson.week === 0 ? '0-modul' : lesson.week + '-hafta'} / ${lesson.number}-dars`;
    $('concept').innerHTML = ['setup-01', 'lesson-04'].includes(lesson.id) ? '' : formatInlineJS(lesson.concept);
    $('explain').innerHTML = ['setup-01', 'lesson-04'].includes(lesson.id) || lesson.reading ? '' : formatInlineJS(lesson.explain);
    $('tip').hidden = lesson.id === 'lesson-04';
    $('tip').innerHTML = lesson.id === 'setup-01' ? '' : formatInlineJS(lesson.tip || 'Koddagi har bir operatorni tushunib, natijani oldindan taxmin qilishga harakat qiling.');

    $('fileName').textContent = lesson.id + '.js';
    $('editor').value = state.drafts[lesson.id] ?? lesson.code;

    const continueNav = document.querySelector('.nav-continue-btn');
    if (continueNav) {
      continueNav.setAttribute('href', `/learn/${lesson.id}`);
      continueNav.dataset.route = `/learn/${lesson.id}`;
    }

    $('output').textContent = '▶ Kodni ishga tushiring';
    $('practice').innerHTML = formatInlineJS(lesson.practice);
    $('check').innerHTML = formatInlineJS(lesson.check);
    $('home').innerHTML = formatInlineJS(lesson.home);
    $('notes').value = state.notes[lesson.id] ?? '';
    $('complete').checked = state.completed.includes(lesson.id);
    const completeLabel = $('complete').nextElementSibling;
    if (completeLabel) {
      completeLabel.textContent = lesson.week === 0
        ? 'Bu darsdagi tayyorgarlik bosqichlarini bajardim'
        : 'Bu darsni tushundim va amaliyotini bajardim';
    }
    $('counter').textContent = `${index + 1} / ${lessons.length}`;
    $('prev').disabled = index === 0;
    $('next').disabled = index === lessons.length - 1;

    recordFor(state, lesson.id);
    for (const id of ['concept', 'explain', 'tip']) {
      $(id).classList.toggle('hidden', lesson.id === 'setup-01');
    }

    renderTheory($('theoryExtras'), lesson);
    if (lesson.id === 'lesson-04') {
      bindLesson04($('theoryExtras'), {
        notify,
        editCode: code => {
          $('editor').value = code;
          state.drafts[lesson.id] = code;
          persist();
          $('editor').focus();
          $('editor').scrollIntoView({ block: 'center', behavior: 'smooth' });
        }
      });
    }

    renderCodeNotes($('codeNotes'), lesson);
    renderSetup($('setupMount'), lesson, state, refreshLearning);
    renderSimulatorMount($('simulatorMount'), lesson);

    const record = recordFor(state, lesson.id);
    if (lesson.week === 0) {
      $('practiceTasks').replaceChildren();
      $('homeworkList').textContent = '';
      $('homeworkList').classList.add('hidden');
      $('exercisePanel').replaceChildren();
      $('quizPanel').replaceChildren();
    } else {
      $('practiceTasks').innerHTML = lesson.practices
        .map(
          (p, i) =>
            '<label class="practice-task"><input type="checkbox" data-practice="' +
            i +
            '" ' +
            (record.practice.includes(i) ? 'checked' : '') +
            '><span><b>' +
            escapeHTML(p.level) +
            '</b><br>' +
            formatInlineJS(p.task) +
            '</span></label>'
        )
        .join('');
      $('practiceTasks').querySelectorAll('[data-practice]').forEach(input => {
        input.onchange = () => {
          const idx = Number(input.dataset.practice);
          record.practice = input.checked
            ? [...new Set([...record.practice, idx])]
            : record.practice.filter(x => x !== idx);
          refreshLearning();
        };
      });

      $('homeworkList').textContent = lesson.homework.length
        ? 'Shu dars uchun tekshirilgan masalalar: ' + lesson.homework.join(', ') + '. Masalalar bo‘limida yeching.'
        : 'Qo‘shimcha amaliy mashq: mini-loyihani tugating, uchta sinov natijasini qaydlarga yozing.';
      $('homeworkList').classList.toggle('hidden', ['setup-01', 'lesson-04'].includes(lesson.id));

      renderExercises(
        $('exercisePanel'),
        exercises.filter(x => lesson.exerciseIds.includes(x.id)),
        state,
        refreshLearning
      );
      renderQuiz($('quizPanel'), lesson, state, refreshLearning);
    }

    if (lesson.id !== 'lesson-04') {
      $('bugMount').innerHTML =
        '<section class="panel"><div class="learning-label">XATOLAR LABORATORIYASI</div><h2>Xatoni toping va tuzating</h2><pre class="code-sample"><code>' +
        highlightJavaScript(lesson.bug.code) +
        '</code></pre><button type="button" id="tryBug" class="ghost-button">Muharrirga olib o‘tish</button><details><summary>Yordamchi ishora</summary><div class="bug-hint">' +
        (lesson.id === 'setup-01' ? renderLessonText(lesson.bug.hint) : formatInlineJS(lesson.bug.hint)) +
        '</div></details></section>';
      $('tryBug').onclick = () => {
        $('editor').value = lesson.bug.code;
        state.drafts[lesson.id] = lesson.bug.code;
        selectTab('lesson');
        persist();
        $('editor').focus();
        $('editor').scrollIntoView({ block: 'center' });
      };
    } else {
      $('bugMount').replaceChildren();
    }

    refreshLearning();

    const preferredTab = overrideTab || state.positions[lesson.id]?.tab;
    currentTab = ['lesson', 'practice', 'video', 'notes', 'exercise', 'quiz'].includes(preferredTab)
      ? preferredTab
      : 'lesson';

    renderSidebarNav({ navEl: $('nav'), currentLessonId: lesson.id, state, query });
    updateSidebarProgress({ state, totalLessons: lessons.length });
    selectTab(currentTab);

    sidebarOpen = false;
    $('layout').classList.remove('sidebar-open');
    requestAnimationFrame(() =>
      window.scrollTo({ top: Number(state.positions[lesson.id]?.scroll) || 0, behavior: 'instant' })
    );
  }

  // Event bindings
  $('search').addEventListener('input', e => {
    query = e.target.value.toLocaleLowerCase('uz').trim();
    renderSidebarNav({ navEl: $('nav'), currentLessonId: lesson.id, state, query });
  });

  $('menu').addEventListener('click', () => {
    sidebarOpen = !sidebarOpen;
    $('layout').classList.toggle('sidebar-open', sidebarOpen);
  });

  $('sidebarCloseBtn')?.addEventListener('click', () => {
    sidebarOpen = false;
    $('layout').classList.remove('sidebar-open');
  });

  const onToggleKonspekt = () => {
    const panel = $('lessonRightPanel');
    if (!panel) return;
    if (window.innerWidth <= 1260) {
      outlineOpen = !outlineOpen;
      panel.classList.toggle('is-mobile-open', outlineOpen);
      if (outlineOpen) panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    } else {
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      panel.classList.add('is-highlighted');
      clearTimeout(onToggleKonspekt.timer);
      onToggleKonspekt.timer = setTimeout(() => panel.classList.remove('is-highlighted'), 1200);
    }
  };
  window.addEventListener('akademiya:toggle-konspekt', onToggleKonspekt);

  container.querySelectorAll('.tab').forEach(btn =>
    btn.addEventListener('click', () => selectTab(btn.dataset.tab))
  );

  $('editor').addEventListener('input', () => {
    state.drafts[lesson.id] = $('editor').value;
    persist();
  });

  $('notes').addEventListener('input', () => {
    state.notes[lesson.id] = $('notes').value;
    persist();
  });

  $('complete').addEventListener('change', e => {
    if (e.target.checked && !completionAllowed(state, lesson)) {
      e.target.checked = false;
      notify('Avval yakuniy nazorat talablarini bajaring');
      return;
    }
    const record = recordFor(state, lesson.id);
    record.completedAt = e.target.checked ? new Date().toISOString() : null;
    state.completed = e.target.checked
      ? [...new Set([...state.completed, lesson.id])]
      : state.completed.filter(id => id !== lesson.id);
    persist();
    renderSidebarNav({ navEl: $('nav'), currentLessonId: lesson.id, state, query });
    updateSidebarProgress({ state, totalLessons: lessons.length });
    renderRightPanel();
    notify(e.target.checked ? 'Dars bajarildi deb belgilandi' : 'Dars belgisi olib tashlandi');
  });

  $('formatCode').addEventListener('click', () => {
    $('editor').value = formatJavaScript($('editor').value);
    state.drafts[lesson.id] = $('editor').value;
    persist();
    notify('Kod formatlandi');
  });

  $('traceCodeBtn').addEventListener('click', () => {
    const mount = $('labTraceMount');
    const opening = mount.classList.contains('hidden');
    mount.classList.toggle('hidden', !opening);
    if (opening) renderLabTracer(mount, $('editor').value);
    else mount.replaceChildren();
  });

  $('resetCode').addEventListener('click', () => {
    delete state.drafts[lesson.id];
    $('editor').value = lesson.code;
    persist();
    notify('Boshlang‘ich kod tiklandi');
  });

  $('copyCode').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText($('editor').value);
      notify('Kod nusxalandi');
    } catch {
      notify('Nusxalash uchun kodni belgilang va Ctrl+C bosing');
    }
  });

  $('runCode').addEventListener('click', () => {
    const id = lesson.id;
    runCode(
      $('editor').value,
      $('output'),
      $('preview'),
      value => {
        state.labStorage[id] = value;
        persist();
      },
      state.labStorage[id] || {}
    );
  });

  $('stopCode').addEventListener('click', () => {
    stopCode();
    $('preview').replaceChildren();
    notify('Kod bajarilishi to‘xtatildi');
  });

  $('prev').addEventListener('click', () => {
    const i = getLessonIndex(lesson.id);
    if (i > 0) {
      const prevId = lessons[i - 1].id;
      if (location.hash.startsWith('#/')) location.hash = lessonURL(prevId);
      else onNavigate(`/learn/${prevId}`);
    }
  });

  $('next').addEventListener('click', () => {
    const i = getLessonIndex(lesson.id);
    if (i < lessons.length - 1) {
      const nextId = lessons[i + 1].id;
      if (location.hash.startsWith('#/')) location.hash = lessonURL(nextId);
      else onNavigate(`/learn/${nextId}`);
    }
  });

  let scrollTimer;
  const onScroll = () => {
    const id = lesson.id;
    const top = window.scrollY;
    clearTimeout(scrollTimer);
    scrollTimer = setTimeout(() => {
      state.positions[id] = { ...state.positions[id], scroll: top };
      persist();
    }, 250);
  };
  const onPageHide = () => {
    state.positions[lesson.id] = { ...state.positions[lesson.id], scroll: window.scrollY };
    persist();
    stopCode();
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('pagehide', onPageHide);

  attachCodeEditor($('editor'));
  renderLesson(lesson.id, currentTab);

  return {
    updateLesson(newLessonId, newTab) {
      renderLesson(newLessonId, newTab);
    },
    destroy() {
      stopCode();
      stopSimulatorTimers();
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('pagehide', onPageHide);
      window.removeEventListener('akademiya:toggle-konspekt', onToggleKonspekt);
    }
  };
}
