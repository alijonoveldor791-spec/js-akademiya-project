import { author as configAuthor } from '../config/author.js';
import { escapeHTML } from '../components/lessonText.js';
import { renderFooter } from '../components/layout/Footer.js';

const AUTHOR_PREVIEW_KEY = 'js-akademiya-author-preview-v1';

function loadPreviewAuthor() {
  try {
    const raw = localStorage.getItem(AUTHOR_PREVIEW_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed === 'object' ? parsed : null;
  } catch {
    return null;
  }
}

function getEffectiveAuthor() {
  const preview = loadPreviewAuthor();
  if (!preview) return { data: configAuthor, isPreview: false };
  return {
    isPreview: true,
    data: {
      ...configAuthor,
      fullName: preview.fullName ?? configAuthor.fullName,
      profession: preview.profession ?? configAuthor.profession,
      shortIntro: preview.shortIntro ?? configAuthor.shortIntro,
      biography: preview.biography ?? configAuthor.biography,
      purpose: preview.purpose ?? configAuthor.purpose,
      email: preview.email ?? configAuthor.email,
      github: preview.github ?? configAuthor.github,
      telegram: preview.telegram ?? configAuthor.telegram,
      website: preview.website ?? configAuthor.website
    }
  };
}

export function renderAuthorPage(container, { notify }) {
  const { data, isPreview } = getEffectiveAuthor();

  const socialItems = [
    data.github ? { label: 'GitHub', url: data.github } : null,
    data.telegram ? { label: 'Telegram', url: data.telegram } : null,
    data.website ? { label: 'Veb-sayt', url: data.website } : null
  ].filter(Boolean);

  const hasAnyContact = Boolean(data.email || socialItems.length);

  container.innerHTML = `
    <main class="site-main page-container">
      <header class="page-header author-page-header">
        <div>
          <div class="home-kicker">Muallif</div>
          <h1>Loyiha muallifi haqida</h1>
          <p>Ushbu sahifa <code>src/config/author.js</code> konfiguratsiya fayli asosida ishlaydi. Shaxsiy ma’lumotlar oldindan to‘qib chiqarilmaydi — faqat kiritilgan haqiqiy ma’lumotlar ko‘rsatiladi.</p>
        </div>
        <button type="button" id="toggleAuthorEditorBtn" class="ghost-button">Ma’lumotlarni tahrirlash</button>
      </header>

      <section id="authorConfigEditor" class="author-editor-panel hidden">
        <h2>Mahalliy ko‘rish uchun ma’lumot kiritish</h2>
        <p class="muted">Doimiy saqlash uchun ushbu qiymatlarni <code>src/config/author.js</code> fayliga yozing. Bu forma brauzerda darhol ko‘rib chiqish imkonini beradi.</p>
        <form id="authorPreviewForm" class="author-form-grid">
          <label>To‘liq ism-familiya<input name="fullName" value="${escapeHTML(data.fullName)}" placeholder="Masalan: Ism Familiya" /></label>
          <label>Kasbi yoki mutaxassisligi<input name="profession" value="${escapeHTML(data.profession)}" placeholder="Masalan: Frontend dasturchi / o‘qituvchi" /></label>
          <label class="author-form-full">Qisqacha tanishtiruv<input name="shortIntro" value="${escapeHTML(data.shortIntro)}" placeholder="Qisqacha ta’rif..." /></label>
          <label class="author-form-full">Muallif haqida (faoliyat va tajriba)<textarea name="biography" rows="3" placeholder="Dasturlash va ta’limga oid faoliyatingiz haqida...">${escapeHTML(data.biography)}</textarea></label>
          <label class="author-form-full">Loyihani yaratishdan maqsad<textarea name="purpose" rows="2" placeholder="JavaScript Akademiyani yaratish g‘oyasi...">${escapeHTML(data.purpose)}</textarea></label>
          <label>Elektron pochta<input name="email" type="email" value="${escapeHTML(data.email)}" placeholder="email@example.com" /></label>
          <label>GitHub profili (URL)<input name="github" type="url" value="${escapeHTML(data.github)}" placeholder="https://github.com/..." /></label>
          <label>Telegram (URL)<input name="telegram" type="url" value="${escapeHTML(data.telegram)}" placeholder="https://t.me/..." /></label>
          <label>Veb-sayt (URL)<input name="website" type="url" value="${escapeHTML(data.website)}" placeholder="https://..." /></label>
          <div class="author-form-actions author-form-full">
            <button type="submit" class="primary-button">Saqlash va ko‘rish</button>
            ${isPreview ? '<button type="button" id="resetAuthorPreviewBtn" class="ghost-button">Konfiguratsiyaga qaytarish</button>' : ''}
          </div>
        </form>
      </section>

      <div class="author-layout">
        <aside class="author-card">
          <div class="author-avatar">
            ${
              data.photo
                ? `<img src="${escapeHTML(data.photo)}" alt="${escapeHTML(data.fullName || 'Loyiha muallifi')}" referrerpolicy="no-referrer" />`
                : `<svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg><span>Rasm kiritilmagan</span>`
            }
          </div>
          <h2>${data.fullName ? escapeHTML(data.fullName) : 'Ism-familiya kiritilmagan'}</h2>
          <p class="author-role">${data.profession ? escapeHTML(data.profession) : 'Mutaxassislik: src/config/author.js da belgilanadi'}</p>
          <p class="author-short-intro">${data.shortIntro ? escapeHTML(data.shortIntro) : 'Qisqacha tanishtiruv matni kiritilgach bu yerda ko‘rinadi.'}</p>

          ${
            socialItems.length
              ? `<div class="author-social-links">${socialItems
                  .map(
                    item => `<a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer" class="ghost-button">${escapeHTML(item.label)}</a>`
                  )
                  .join('')}</div>`
              : ''
          }
        </aside>

        <div class="author-details-col">
          <section class="author-section-card">
            <h2>Muallif haqida</h2>
            <p>${
              data.biography
                ? escapeHTML(data.biography)
                : 'Muallifning dasturlash va ta’limga oid faoliyati haqidagi matn hali kiritilmagan. Uni <code>src/config/author.js</code> faylidagi <code>biography</code> maydoniga yoki yuqoridagi «Ma’lumotlarni tahrirlash» tugmasi orqali kiritish mumkin.'
            }</p>
          </section>

          <section class="author-section-card">
            <h2>Loyihani yaratishdan maqsad</h2>
            <p>${
              data.purpose
                ? escapeHTML(data.purpose)
                : 'JavaScript Akademiya o‘zbek tilida tizimli dasturlash darsliklari va brauzer ichidagi interaktiv kod laboratoriyasini bitta qulay platformada birlashtirish uchun yaratilgan. Muallifning shaxsiy izohini <code>purpose</code> maydonida kengaytirish mumkin.'
            }</p>
          </section>

          <section class="author-section-card">
            <h2>Muallifning boshqa loyihalari</h2>
            ${
              Array.isArray(data.projects) && data.projects.length
                ? `<div class="author-projects-grid">${data.projects
                    .map(
                      proj => `
                    <article class="author-project-card">
                      <h3>${escapeHTML(proj.title || 'Loyiha')}</h3>
                      <p>${escapeHTML(proj.description || '')}</p>
                      ${
                        proj.url
                          ? `<a href="${escapeHTML(proj.url)}" target="_blank" rel="noopener noreferrer" class="week-open-link">Loyihani ochish →</a>`
                          : ''
                      }
                    </article>
                  `
                    )
                    .join('')}</div>`
                : `<p class="muted">Hozircha boshqa loyihalar kiritilmagan. Kelajakda ularni <code>src/config/author.js</code> dagi <code>projects</code> massiviga kartochka sifatida qo‘shish mumkin.</p>`
            }
          </section>

          <section class="author-section-card">
            <h2>Bog‘lanish</h2>
            ${
              hasAnyContact
                ? `<div class="author-contact-list">
                    ${data.email ? `<p><strong>Elektron pochta:</strong> <a href="mailto:${escapeHTML(data.email)}" class="source-link">${escapeHTML(data.email)}</a></p>` : ''}
                    ${socialItems
                      .map(
                        item => `<p><strong>${escapeHTML(item.label)}:</strong> <a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer" class="source-link">${escapeHTML(item.url)}</a></p>`
                      )
                      .join('')}
                  </div>`
                : `<p class="muted">Aloqa ma’lumotlari (<code>email</code>, <code>github</code>, <code>telegram</code>) hali kiritilmagan. Bo‘sh havolalar ko‘rsatilmaydi.</p>`
            }
          </section>
        </div>
      </div>
    </main>
    ${renderFooter()}
  `;

  const toggleBtn = container.querySelector('#toggleAuthorEditorBtn');
  const editorPanel = container.querySelector('#authorConfigEditor');
  if (toggleBtn && editorPanel) {
    toggleBtn.addEventListener('click', () => {
      editorPanel.classList.toggle('hidden');
    });
  }

  const form = container.querySelector('#authorPreviewForm');
  if (form) {
    form.addEventListener('submit', event => {
      event.preventDefault();
      const formData = new FormData(form);
      const next = Object.fromEntries(formData.entries());
      try {
        localStorage.setItem(AUTHOR_PREVIEW_KEY, JSON.stringify(next));
      } catch {
        // ignore storage quota failure
      }
      notify('Muallif ma’lumotlari ko‘rish uchun yangilandi');
      renderAuthorPage(container, { notify });
    });
  }

  const resetBtn = container.querySelector('#resetAuthorPreviewBtn');
  if (resetBtn) {
    resetBtn.addEventListener('click', () => {
      localStorage.removeItem(AUTHOR_PREVIEW_KEY);
      notify('Konfiguratsiya holatiga qaytarildi');
      renderAuthorPage(container, { notify });
    });
  }
}
