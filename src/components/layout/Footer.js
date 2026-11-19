import { siteConfig } from '../../config/site.js';
import { author } from '../../config/author.js';
import { escapeHTML } from '../lessonText.js';

export function renderFooter() {
  const year = new Date().getFullYear();
  const realSocials = [
    ...siteConfig.socialLinks.filter(item => item.url && item.url.trim()),
    ...(author.github ? [{ label: 'Muallif GitHub', url: author.github }] : []),
    ...(author.telegram ? [{ label: 'Muallif Telegram', url: author.telegram }] : [])
  ];

  // Deduplicate by URL
  const seen = new Set();
  const uniqueSocials = realSocials.filter(item => {
    if (seen.has(item.url)) return false;
    seen.add(item.url);
    return true;
  });

  return `
    <footer class="site-footer">
      <div class="site-footer-inner">
        <div class="footer-brand-col">
          <a href="/" data-route="/" class="nav-brand">
            <span class="brand-icon" aria-hidden="true">${escapeHTML(siteConfig.shortMark)}</span>
            <span class="nav-brand-name">${escapeHTML(siteConfig.name)}</span>
          </a>
          <p class="footer-tagline">${escapeHTML(siteConfig.tagline)}</p>
        </div>

        <div class="footer-links-col">
          <h3>Sahifalar</h3>
          <ul>
            ${siteConfig.footerLinks
              .map(
                item => `<li><a href="${escapeHTML(item.path)}" data-route="${escapeHTML(item.path)}">${escapeHTML(item.label)}</a></li>`
              )
              .join('')}
          </ul>
        </div>

        <div class="footer-social-col">
          <h3>Aloqa va hamjamiyat</h3>
          ${
            uniqueSocials.length
              ? `<ul>${uniqueSocials
                  .map(
                    item => `<li><a href="${escapeHTML(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(item.label)}</a></li>`
                  )
                  .join('')}</ul>`
              : `<p class="muted">Ijtimoiy tarmoq havolalari <code>src/config/site.js</code> yoki <code>src/config/author.js</code> faylida kiritilgach bu yerda ko‘rinadi.</p>`
          }
        </div>
      </div>

      <div class="site-footer-bottom">
        <span>© ${year} ${escapeHTML(siteConfig.name)}${author.fullName ? ` · Tuzuvchi: <a href="/author" data-route="/author">${escapeHTML(author.fullName)}</a>` : ''}.</span>
      </div>
    </footer>
  `;
}
