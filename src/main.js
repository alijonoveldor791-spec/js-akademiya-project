import './styles/variables.css';
import './styles/global.css';
import './styles/components.css';
import './styles/responsive.css';
import './styles/lesson04.css';

import { lessons } from './lib/course.js';
import { loadState, saveState, exportProgress, importProgress } from './lib/storage.js';
import { parseRoute, navigateTo, bindRouteLinks } from './lib/router.js';
import { renderNavbar, bindNavbarEvents } from './components/layout/Navbar.js';
import { renderHomePage } from './pages/HomePage.js';
import { renderCoursesPage } from './pages/CoursesPage.js';
import { renderDashboardPage } from './pages/DashboardPage.js';
import { mountLearnPage } from './pages/LearnPage.js';
import { renderAboutPage } from './pages/AboutPage.js';
import { renderAuthorPage } from './pages/AuthorPage.js';
import { stopCode } from './components/codeRunner.js';
import { stopSimulatorTimers } from './components/InteractiveSimulators.js';

let state = loadState();
state.completed = state.completed.filter(id => lessons.some(item => item.id === id));

const root = document.querySelector('#app');
root.innerHTML = `
  <div id="navbarMount"></div>
  <div id="pageMount"></div>
  <div id="toast" role="status" aria-live="polite"></div>
`;

const navbarMount = document.getElementById('navbarMount');
const pageMount = document.getElementById('pageMount');
const toastEl = document.getElementById('toast');

let activePage = null;
let learnController = null;

function notify(message) {
  toastEl.textContent = message;
  toastEl.classList.add('visible');
  clearTimeout(notify.timer);
  notify.timer = setTimeout(() => toastEl.classList.remove('visible'), 3000);
}

function persist() {
  if (!saveState(state)) {
    notify('Ma’lumot saqlanmadi. Brauzer xotirasi to‘lgan bo‘lishi mumkin.');
  }
}

function applyTheme() {
  document.documentElement.dataset.theme = state.theme === 'light' ? 'light' : 'dark';
  const toggleBtn = document.getElementById('themeToggle');
  if (toggleBtn) {
    toggleBtn.textContent = state.theme === 'dark' ? '☀ Yorug‘' : '☾ Tungi';
  }
}

function toggleTheme() {
  state.theme = state.theme === 'dark' ? 'light' : 'dark';
  applyTheme();
  persist();
}

function handleImportState(nextState) {
  state = {
    ...nextState,
    completed: nextState.completed.filter(id => lessons.some(item => item.id === id))
  };
  persist();
  applyTheme();
  if (activePage !== 'learn') {
    renderApp({ forceRemount: true });
  }
}

function updateDocumentTitle(route) {
  const titles = {
    home: 'JavaScript Akademiya | 0-modul + 48 dars',
    courses: 'Kurslar katalogi | JavaScript Akademiya',
    dashboard: 'O‘quv paneli | JavaScript Akademiya',
    learn: 'Dars muhiti | JavaScript Akademiya',
    about: 'Loyiha haqida | JavaScript Akademiya',
    author: 'Loyiha muallifi | JavaScript Akademiya'
  };
  document.title = titles[route.page] || titles.home;
}

function handleProfileUpdate(nextProfile) {
  state.profile = nextProfile;
  persist();
  renderNav(parseRoute());
  if (activePage === 'dashboard') {
    renderDashboardPage(pageMount, {
      state,
      persist,
      onImportState: handleImportState,
      notify,
      onProfileUpdated: () => renderNav(parseRoute())
    });
  }
}

function renderNav(route) {
  navbarMount.innerHTML = renderNavbar({ route, state });
  bindNavbarEvents(navbarMount, {
    route,
    state,
    notify,
    onToggleTheme: toggleTheme,
    onSaveProfile: handleProfileUpdate,
    onExport: () => exportProgress(state),
    onImportFile: async file => {
      try {
        const imported = await importProgress(file);
        handleImportState(imported);
        if (activePage === 'learn') {
          renderApp({ forceRemount: true });
        }
        notify('Natijalar tiklandi');
      } catch (err) {
        notify('Import xatosi: ' + err.message);
      }
    }
  });
}

function scrollToAnchorIfNeeded(route) {
  if (!route.anchor) {
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }
  requestAnimationFrame(() => {
    const el = document.getElementById(route.anchor);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

function renderApp({ forceRemount = false } = {}) {
  const route = parseRoute();
  updateDocumentTitle(route);
  renderNav(route);
  applyTheme();

  if (route.page === 'learn' && activePage === 'learn' && learnController && !forceRemount) {
    learnController.updateLesson(route.lessonId || state.lastLesson || 'setup-01', route.tab);
    return;
  }

  if (learnController) {
    learnController.destroy();
    learnController = null;
  }
  stopCode();
  stopSimulatorTimers();
  activePage = route.page;

  if (route.page === 'home') {
    renderHomePage(pageMount, { state, persist });
    scrollToAnchorIfNeeded(route);
    return;
  }

  if (route.page === 'courses') {
    renderCoursesPage(pageMount, { state, persist });
    scrollToAnchorIfNeeded(route);
    return;
  }

  if (route.page === 'dashboard') {
    renderDashboardPage(pageMount, {
      state,
      persist,
      onImportState: handleImportState,
      notify,
      onProfileUpdated: () => renderNav(parseRoute())
    });
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  if (route.page === 'about') {
    renderAboutPage(pageMount);
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  if (route.page === 'author') {
    renderAuthorPage(pageMount, { notify });
    window.scrollTo({ top: 0, behavior: 'instant' });
    return;
  }

  if (route.page === 'learn') {
    learnController = mountLearnPage(pageMount, {
      state,
      initialLessonId: route.lessonId || state.lastLesson || 'setup-01',
      initialTab: route.tab,
      persist,
      notify,
      onImportState: handleImportState,
      onNavigate: navigateTo
    });
  }
}

bindRouteLinks(document, target => navigateTo(target));
window.addEventListener('popstate', () => renderApp());
window.addEventListener('hashchange', () => renderApp());
window.addEventListener('akademiya:navigate', () => renderApp());

applyTheme();
renderApp();
