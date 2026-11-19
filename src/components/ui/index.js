import { escapeHTML } from '../lessonText.js';

export function renderButton({
  id = '',
  label,
  variant = 'ghost',
  href = '',
  route = '',
  type = 'button',
  className = '',
  attrs = ''
}) {
  const cls = `ui-btn ${variant === 'primary' ? 'primary-button' : variant === 'secondary' ? 'secondary-button' : 'ghost-button'} ${className}`.trim();
  const idAttr = id ? `id="${escapeHTML(id)}"` : '';
  const routeAttr = route ? `data-route="${escapeHTML(route)}"` : '';
  if (href) {
    return `<a ${idAttr} href="${escapeHTML(href)}" ${routeAttr} class="${cls}" ${attrs}>${escapeHTML(label)}</a>`;
  }
  return `<button ${idAttr} type="${escapeHTML(type)}" ${routeAttr} class="${cls}" ${attrs}>${escapeHTML(label)}</button>`;
}

export function renderBadge(label, tone = 'neutral') {
  return `<span class="ui-badge ui-badge-${escapeHTML(tone)}">${escapeHTML(label)}</span>`;
}

export function renderCard({ kicker = '', title = '', body = '', footer = '', className = '', attrs = '' }) {
  return `
    <article class="ui-card ${className}" ${attrs}>
      ${kicker ? `<div class="ui-card-kicker">${escapeHTML(kicker)}</div>` : ''}
      ${title ? `<h3 class="ui-card-title">${escapeHTML(title)}</h3>` : ''}
      ${body ? `<div class="ui-card-body">${body}</div>` : ''}
      ${footer ? `<div class="ui-card-footer">${footer}</div>` : ''}
    </article>
  `;
}

export function renderProgressBar({ value = 0, max = 100, label = '', showPercent = true }) {
  const pct = max > 0 ? Math.min(100, Math.max(0, Math.round((value / max) * 100))) : 0;
  return `
    <div class="ui-progress">
      ${label || showPercent ? `<div class="ui-progress-head"><span>${escapeHTML(label)}</span>${showPercent ? `<span class="tabular-nums">${pct}%</span>` : ''}</div>` : ''}
      <div class="progress-track" role="progressbar" aria-valuenow="${pct}" aria-valuemin="0" aria-valuemax="100">
        <div style="width:${pct}%"></div>
      </div>
    </div>
  `;
}

export function renderSearchInput({ id, placeholder = 'Qidirish...', label = '', value = '' }) {
  return `
    <div class="ui-search-field">
      ${label ? `<label class="search-label" for="${escapeHTML(id)}">${escapeHTML(label)}</label>` : ''}
      <input id="${escapeHTML(id)}" type="search" value="${escapeHTML(value)}" placeholder="${escapeHTML(placeholder)}" autocomplete="off" />
    </div>
  `;
}

export function renderTabs({ items = [], activeId = '', ariaLabel = 'Bo‘limlar' }) {
  return `
    <div class="tabs" role="tablist" aria-label="${escapeHTML(ariaLabel)}">
      ${items
        .map(
          item => `<button type="button" class="tab ${item.id === activeId ? 'active' : ''}" role="tab" aria-selected="${item.id === activeId}" data-tab="${escapeHTML(item.id)}">${escapeHTML(item.label)}</button>`
        )
        .join('')}
    </div>
  `;
}

export function renderAccordion(items = []) {
  return `
    <div class="ui-accordion">
      ${items
        .map(
          (item, index) => `
          <details class="ui-accordion-item" ${item.open ? 'open' : ''}>
            <summary class="ui-accordion-trigger">
              <span>${escapeHTML(item.title)}</span>
              ${item.meta ? `<span class="ui-accordion-meta">${escapeHTML(item.meta)}</span>` : ''}
            </summary>
            <div class="ui-accordion-panel" data-accordion-index="${index}">
              ${item.content}
            </div>
          </details>
        `
        )
        .join('')}
    </div>
  `;
}

export function renderLessonCard({ lesson, completed = false, isCurrent = false }) {
  const numLabel = lesson.week === 0 ? `0.${String(lesson.number).split('.')[1] || lesson.number}` : String(lesson.number).padStart(2, '0');
  return `
    <a href="/learn/${escapeHTML(lesson.id)}" data-route="/learn/${escapeHTML(lesson.id)}" class="ui-lesson-card ${completed ? 'is-completed' : ''} ${isCurrent ? 'is-current' : ''}">
      <div class="ui-lesson-card-top">
        <span class="lesson-number">${escapeHTML(numLabel)}</span>
        <span class="ui-lesson-card-meta">${escapeHTML(lesson.durationMinutes)} daqiqa</span>
        ${completed ? '<span class="done-mark" aria-label="Bajarilgan">✓</span>' : ''}
      </div>
      <h4>${escapeHTML(lesson.title)}</h4>
      <p>${escapeHTML(lesson.concept)}</p>
    </a>
  `;
}

export function renderCourseCard(course) {
  return `
    <article class="ui-course-card">
      <div class="ui-course-cover">
        <img src="${escapeHTML(course.coverImage)}" alt="${escapeHTML(course.coverAlt || course.title)}" referrerpolicy="no-referrer" loading="lazy" onerror="this.style.display='none';this.nextElementSibling.classList.remove('hidden');" />
        <div class="image-fallback hidden">
          <span class="fallback-mark">JS</span>
          <strong>${escapeHTML(course.title)}</strong>
        </div>
      </div>
      <div class="ui-course-body">
        <div class="ui-course-meta-line">
          <span>${escapeHTML(course.level)}</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHTML(course.weeksCount)} hafta</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHTML(course.lessonsCount)} asosiy dars</span>
          <span aria-hidden="true">·</span>
          <span>${escapeHTML(course.language)}</span>
        </div>
        <h2>${escapeHTML(course.title)}</h2>
        <p class="ui-course-desc">${escapeHTML(course.description)}</p>
        <div class="ui-course-facts">
          <div><span>Davomiyligi</span><strong>${escapeHTML(course.estimatedDuration)}</strong></div>
          <div><span>Amaliyot</span><strong>${escapeHTML(course.exercisesCount)} ta masala · ${escapeHTML(course.projectsCount)} ta loyiha</strong></div>
        </div>
        ${
          Array.isArray(course.outcomes) && course.outcomes.length
            ? `<ul class="ui-course-outcomes">${course.outcomes.map(item => `<li>${escapeHTML(item)}</li>`).join('')}</ul>`
            : ''
        }
        <div class="ui-course-actions">
          <a href="${escapeHTML(course.route)}" data-route="${escapeHTML(course.route)}" class="primary-button">Kursga o‘tish →</a>
          <a href="/courses#curriculum" data-route="/courses#curriculum" class="ghost-button">Darslar ro‘yxati</a>
        </div>
      </div>
    </article>
  `;
}

let activeModal = null;

export function closeModal() {
  if (!activeModal) return;
  activeModal.remove();
  activeModal = null;
  document.body.style.overflow = '';
}

export function openModal({ title, bodyHTML, onMount }) {
  closeModal();
  const backdrop = document.createElement('div');
  backdrop.className = 'ui-modal-backdrop';
  backdrop.setAttribute('role', 'dialog');
  backdrop.setAttribute('aria-modal', 'true');
  backdrop.setAttribute('aria-label', title);
  backdrop.innerHTML = `
    <div class="ui-modal">
      <div class="ui-modal-header">
        <h2>${escapeHTML(title)}</h2>
        <button type="button" class="icon-button" data-close-modal aria-label="Yopish">✕</button>
      </div>
      <div class="ui-modal-body">${bodyHTML}</div>
    </div>
  `;
  backdrop.addEventListener('click', event => {
    if (event.target === backdrop || event.target.closest('[data-close-modal]')) closeModal();
  });
  const onKeyDown = event => {
    if (event.key === 'Escape') {
      closeModal();
      window.removeEventListener('keydown', onKeyDown);
    }
  };
  window.addEventListener('keydown', onKeyDown);
  document.body.append(backdrop);
  document.body.style.overflow = 'hidden';
  activeModal = backdrop;
  if (typeof onMount === 'function') onMount(backdrop);
  return backdrop;
}
