import { siteConfig } from '../../config/site.js';
import { escapeHTML } from '../lessonText.js';
import { openModal, closeModal } from '../ui/index.js';
import { openProfileModal } from '../ProfileModal.js';
import { lessons, exercises } from '../../data/curriculum.js';
import { navigateTo } from '../../lib/router.js';

function getInitials(name) {
  const parts = String(name || '').trim().split(/\s+/).filter(Boolean);
  if (!parts.length) return '';
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[1][0]).toUpperCase();
}

export function renderNavbar({ route, state }) {
  const isActive = item => {
    if (item.id === 'home' && route.page === 'home' && route.anchor !== 'curriculum') return true;
    if (item.id === 'curriculum' && ((route.page === 'home' && route.anchor === 'curriculum') || (route.page === 'courses' && route.anchor === 'curriculum'))) return true;
    if (item.id === 'courses' && route.page === 'courses' && route.anchor !== 'curriculum') return true;
    if (item.id === 'practice' && route.page === 'learn' && (route.tab === 'exercise' || route.tab === 'practice')) return true;
    if (item.id === 'about' && route.page === 'about') return true;
    if (item.id === 'author' && route.page === 'author') return true;
    return false;
  };

  const themeLabel = state.theme === 'dark' ? '☀ Yorug‘' : '☾ Tungi';
  const continueTarget = `/learn/${state.lastLesson || 'setup-01'}`;
  const isHome = route.page === 'home';
  const profile = state?.profile || { fullName: '', goal: '', bio: '', avatar: '' };
  const avatarSrc = profile.avatar || '';
  const profileName = profile.fullName || '';
  const initials = getInitials(profileName);
  const hasProfile = Boolean(profile.fullName || profile.avatar || profile.goal || profile.bio);

  const avatarVisual = avatarSrc
    ? `<img class="nav-profile-avatar" src="${escapeHTML(avatarSrc)}" alt="${escapeHTML(profileName || 'Profil rasmi')}" />`
    : initials
      ? `<span class="nav-profile-initials" aria-hidden="true">${escapeHTML(initials)}</span>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>`;

  return `
    <header class="site-navbar">
      <div class="site-navbar-inner">
        <div class="nav-left-group">
          <a href="/" data-route="/" class="nav-brand">
            <span class="brand-icon" aria-hidden="true">${escapeHTML(siteConfig.shortMark)}</span>
            <span class="nav-brand-name">${escapeHTML(siteConfig.name)}</span>
          </a>
          ${
            !isHome
              ? `<a href="/" data-route="/" class="nav-back-home">← Bosh sahifa</a>`
              : ''
          }
        </div>

        ${
          isHome
            ? `<nav class="nav-links" aria-label="Asosiy navigatsiya">
                ${siteConfig.navLinks
                  .map(
                    item => `<a href="${escapeHTML(item.path)}" data-route="${escapeHTML(item.path)}" class="nav-link ${isActive(item) ? 'is-active' : ''}" ${isActive(item) ? 'aria-current="page"' : ''}>${escapeHTML(item.label)}</a>`
                  )
                  .join('')}
              </nav>`
            : ''
        }

        <div class="nav-actions">
          <button type="button" id="globalSearchBtn" class="ghost-button nav-icon-btn" aria-label="Dars va masalalarni qidirish" title="Qidiruv">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            <span class="nav-search-text">Qidiruv</span>
          </button>
          <button type="button" id="themeToggle" class="ghost-button">${themeLabel}</button>
          ${
            route.page !== 'learn'
              ? `<a href="${escapeHTML(continueTarget)}" data-route="${escapeHTML(continueTarget)}" class="primary-button nav-continue-btn">O‘qishni davom ettirish</a>`
              : ''
          }
          <div class="nav-profile-wrap">
            <button
              type="button"
              id="navProfileBtn"
              class="nav-profile-btn ${route.page === 'dashboard' ? 'is-active' : ''}"
              aria-label="Profil menyusini ochish"
              aria-expanded="false"
              aria-haspopup="menu"
              title="${escapeHTML(profileName || 'Profil va o‘quv paneli')}"
            >
              ${avatarVisual}
            </button>
            <div id="navProfileMenu" class="nav-profile-menu hidden" role="menu" aria-label="Profil va boshqaruv menyusi">
              <div class="nav-profile-head">
                <div class="nav-profile-thumb">${avatarVisual}</div>
                <div class="nav-profile-meta">
                  <strong>${escapeHTML(profileName || 'O‘quvchi profili')}</strong>
                  <span>${escapeHTML(profile.goal || (hasProfile ? 'JavaScript Akademiya o‘quvchisi' : 'Profil yaratilmagan'))}</span>
                </div>
              </div>
              <button type="button" id="navEditProfileBtn" class="nav-profile-edit-btn" role="menuitem">
                ${hasProfile ? 'Profilni tahrirlash' : 'Profil yaratish'}
              </button>
              <div class="nav-profile-divider"></div>
              <a href="/dashboard" data-route="/dashboard" class="nav-profile-item ${route.page === 'dashboard' ? 'is-active' : ''}" role="menuitem">
                <span>O‘quv paneli</span>
              </a>
              <button type="button" id="navKonspektBtn" class="nav-profile-item" role="menuitem">
                <span>Konspekt</span>
              </button>
              <button type="button" id="navExportBtn" class="nav-profile-item" role="menuitem">
                <span>↓ Natijani saqlash</span>
              </button>
              <label class="nav-profile-item nav-profile-upload" for="navImportFile" role="menuitem" tabindex="0">
                <span>↑ Tiklash</span>
              </label>
              <input id="navImportFile" type="file" accept="application/json" hidden />
            </div>
          </div>
          <button type="button" id="navMobileToggle" class="icon-button nav-mobile-btn" aria-label="Menyuni ochish" aria-expanded="false">☰</button>
        </div>
      </div>

      <div id="mobileNavDrawer" class="mobile-nav-drawer hidden" aria-label="Mobil navigatsiya">
        ${
          isHome
            ? `<nav class="mobile-nav-links">
                ${siteConfig.navLinks
                  .map(
                    item => `<a href="${escapeHTML(item.path)}" data-route="${escapeHTML(item.path)}" class="mobile-nav-link ${isActive(item) ? 'is-active' : ''}">${escapeHTML(item.label)}</a>`
                  )
                  .join('')}
                <a href="/dashboard" data-route="/dashboard" class="mobile-nav-link">O‘quv paneli</a>
              </nav>`
            : `<nav class="mobile-nav-links">
                <a href="/" data-route="/" class="mobile-nav-link">← Bosh sahifa</a>
                ${route.page !== 'dashboard' ? '<a href="/dashboard" data-route="/dashboard" class="mobile-nav-link">O‘quv paneli</a>' : ''}
              </nav>`
        }
        <div class="mobile-nav-actions">
          <button type="button" id="mobileSearchBtn" class="ghost-button">Qidiruv</button>
          ${
            route.page !== 'learn'
              ? `<a href="${escapeHTML(continueTarget)}" data-route="${escapeHTML(continueTarget)}" class="primary-button">O‘qishni davom ettirish</a>`
              : ''
          }
        </div>
      </div>
    </header>
  `;
}

export function openGlobalSearchModal() {
  openModal({
    title: 'Darslar va masalalarni qidirish',
    bodyHTML: `
      <div class="search-modal-wrap">
        <label class="search-label" for="globalSearchInput">Mavzu, kalit so‘z yoki masala ID (masalan: sikl, DOM, Begin1)</label>
        <input id="globalSearchInput" type="search" placeholder="Masalan: o‘zgaruvchi, massiv, Begin5, async..." autocomplete="off" />
        <div id="globalSearchResults" class="search-results-list"></div>
      </div>
    `,
    onMount(backdrop) {
      const input = backdrop.querySelector('#globalSearchInput');
      const resultsEl = backdrop.querySelector('#globalSearchResults');

      const renderResults = q => {
        const term = q.toLocaleLowerCase('uz').trim();
        const matchedLessons = lessons
          .filter(
            l =>
              !term ||
              `${l.title} ${l.concept} ${l.id}`.toLocaleLowerCase('uz').includes(term)
          )
          .slice(0, term ? 8 : 6);

        const matchedExercises = term
          ? exercises
              .filter(ex =>
                `${ex.id} ${ex.title} ${ex.statement}`.toLocaleLowerCase('uz').includes(term)
              )
              .slice(0, 6)
          : [];

        if (!matchedLessons.length && !matchedExercises.length) {
          resultsEl.innerHTML = '<p class="muted">Mos dars yoki masala topilmadi.</p>';
          return;
        }

        const lessonHTML = matchedLessons
          .map(l => {
            const num = l.week === 0 ? '0-modul' : `${l.week}-hafta · ${l.number}-dars`;
            return `<a href="/learn/${escapeHTML(l.id)}" data-search-target="/learn/${escapeHTML(l.id)}" class="search-result-item">
              <div>
                <strong>${escapeHTML(l.title)}</strong>
                <p>${escapeHTML(l.concept)}</p>
              </div>
              <span class="search-result-meta">${escapeHTML(num)}</span>
            </a>`;
          })
          .join('');

        const exHTML = matchedExercises
          .map(
            ex => `<a href="/learn/${escapeHTML(ex.lessonId)}?tab=exercise" data-search-target="/learn/${escapeHTML(ex.lessonId)}?tab=exercise" class="search-result-item">
              <div>
                <strong>${escapeHTML(ex.id)} · ${escapeHTML(ex.title)}</strong>
                <p>${escapeHTML(ex.statement)}</p>
              </div>
              <span class="search-result-meta">Masala</span>
            </a>`
          )
          .join('');

        resultsEl.innerHTML = lessonHTML + exHTML;
      };

      renderResults('');
      input.focus();
      input.addEventListener('input', () => renderResults(input.value));
      resultsEl.addEventListener('click', event => {
        const link = event.target.closest('a[data-search-target]');
        if (!link) return;
        event.preventDefault();
        const target = link.dataset.searchTarget;
        closeModal();
        navigateTo(target);
      });
    }
  });
}

let navDocController = null;

export function bindNavbarEvents(container, { route, state, onToggleTheme, onSaveProfile, onExport, onImportFile, notify }) {
  navDocController?.abort();
  navDocController = new AbortController();
  const { signal } = navDocController;

  const themeBtn = container.querySelector('#themeToggle');
  if (themeBtn) themeBtn.addEventListener('click', onToggleTheme);

  const searchBtn = container.querySelector('#globalSearchBtn');
  if (searchBtn) searchBtn.addEventListener('click', openGlobalSearchModal);

  const mobileSearchBtn = container.querySelector('#mobileSearchBtn');
  if (mobileSearchBtn) {
    mobileSearchBtn.addEventListener('click', () => {
      const drawer = container.querySelector('#mobileNavDrawer');
      drawer?.classList.add('hidden');
      openGlobalSearchModal();
    });
  }

  const profileBtn = container.querySelector('#navProfileBtn');
  const profileMenu = container.querySelector('#navProfileMenu');
  const closeProfileMenu = () => {
    if (!profileMenu || !profileBtn) return;
    profileMenu.classList.add('hidden');
    profileBtn.setAttribute('aria-expanded', 'false');
  };

  if (profileBtn && profileMenu) {
    profileBtn.addEventListener('click', e => {
      e.stopPropagation();
      const opening = profileMenu.classList.contains('hidden');
      profileMenu.classList.toggle('hidden', !opening);
      profileBtn.setAttribute('aria-expanded', String(opening));
    });

    profileMenu.addEventListener('click', event => {
      if (event.target.closest('a')) closeProfileMenu();
    });

    document.addEventListener(
      'click',
      event => {
        if (!profileMenu.classList.contains('hidden') && !event.target.closest('.nav-profile-wrap')) {
          closeProfileMenu();
        }
      },
      { signal }
    );

    document.addEventListener(
      'keydown',
      event => {
        if (event.key === 'Escape') closeProfileMenu();
      },
      { signal }
    );
  }

  const editProfileBtn = container.querySelector('#navEditProfileBtn');
  if (editProfileBtn) {
    editProfileBtn.addEventListener('click', () => {
      closeProfileMenu();
      openProfileModal({
        profile: state?.profile,
        notify,
        onSave: nextProfile => onSaveProfile?.(nextProfile)
      });
    });
  }

  const konspektBtn = container.querySelector('#navKonspektBtn');
  if (konspektBtn) {
    konspektBtn.addEventListener('click', () => {
      closeProfileMenu();
      if (route?.page === 'learn') {
        window.dispatchEvent(new CustomEvent('akademiya:toggle-konspekt'));
      } else {
        navigateTo(`/learn/${state?.lastLesson || 'setup-01'}`);
        setTimeout(() => window.dispatchEvent(new CustomEvent('akademiya:toggle-konspekt')), 90);
      }
    });
  }

  const exportBtn = container.querySelector('#navExportBtn');
  if (exportBtn) {
    exportBtn.addEventListener('click', () => {
      closeProfileMenu();
      onExport?.();
    });
  }

  const importInput = container.querySelector('#navImportFile');
  if (importInput) {
    importInput.addEventListener('change', async event => {
      const file = event.target.files?.[0];
      if (!file) return;
      closeProfileMenu();
      await onImportFile?.(file);
      event.target.value = '';
    });
  }

  const mobileToggle = container.querySelector('#navMobileToggle');
  const drawer = container.querySelector('#mobileNavDrawer');
  if (mobileToggle && drawer) {
    mobileToggle.addEventListener('click', () => {
      const opening = drawer.classList.contains('hidden');
      drawer.classList.toggle('hidden', !opening);
      mobileToggle.setAttribute('aria-expanded', String(opening));
    });
    drawer.addEventListener('click', event => {
      if (event.target.closest('a')) {
        drawer.classList.add('hidden');
        mobileToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

