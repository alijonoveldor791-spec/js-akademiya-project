import { escapeHTML as e, formatInlineJS as f } from './lessonText.js';
import { EDITORIAL_IMAGES, LESSON_VISUALS } from '../data/visualMedia.js';

function svgShell(title, viewBox, body) {
  return `<svg class="diagram-svg" viewBox="${viewBox}" role="img" aria-label="${e(title)}" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <marker id="diag-arrow" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="6" markerHeight="6" orient="auto-start-reverse">
        <path d="M 0 1.5 L 8.5 5 L 0 8.5 z" fill="currentColor" opacity="0.75"/>
      </marker>
    </defs>
    ${body}
  </svg>`;
}

function box(x, y, w, h, title, sub = '', accent = false) {
  const fill = accent ? 'var(--accentbg)' : 'var(--panel)';
  const stroke = accent ? 'var(--accent)' : 'var(--border)';
  const titleFill = accent ? 'var(--accent)' : 'var(--fg)';
  return `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="${fill}" stroke="${stroke}" stroke-width="1.6"/>
    <text x="${x + w / 2}" y="${y + (sub ? h * 0.42 : h * 0.54)}" text-anchor="middle" fill="${titleFill}" font-size="14" font-weight="700">${e(title)}</text>
    ${sub ? `<text x="${x + w / 2}" y="${y + h * 0.72}" text-anchor="middle" fill="var(--muted)" font-size="11.5">${e(sub)}</text>` : ''}`;
}

function arrow(x1, y1, x2, y2, label = '') {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  return `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="var(--accent)" stroke-width="2" marker-end="url(#diag-arrow)"/>
    ${label ? `<text x="${mx}" y="${my - 6}" text-anchor="middle" fill="var(--muted)" font-size="11" font-weight="600">${e(label)}</text>` : ''}`;
}

export function renderEditorialFigure(editorialKey, extraClass = '') {
  const item = EDITORIAL_IMAGES[editorialKey];
  if (!item) return '';
  return `<figure class="editorial-figure${extraClass ? ' ' + extraClass : ''}">
    <div class="editorial-media-frame">
      <img src="${e(item.src)}" alt="${e(item.alt)}" loading="lazy" referrerpolicy="no-referrer" onerror="this.hidden=true;this.nextElementSibling.hidden=false;">
      <div class="image-fallback" hidden>
        <span class="fallback-mark">JS</span>
        <strong>${e(item.caption)}</strong>
      </div>
    </div>
    <figcaption>${e(item.caption)}</figcaption>
  </figure>`;
}

export function renderEditorialPair(keys = []) {
  if (!Array.isArray(keys) || !keys.length) return '';
  return `<div class="editorial-showcase-grid">
    ${keys.map((key, idx) => renderEditorialFigure(key, idx === 0 ? 'editorial-logo-card' : 'editorial-screen-card')).join('')}
  </div>`;
}

export function renderDiagramSVG(kind, alt = 'Mavzu diagrammasi') {
  switch (kind) {
    case 'setup-readiness':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 28, 200, 94, '1. Kompyuter va brauzer', 'Darsni ochish va sinash', true)}
        ${arrow(220, 75, 256, 75)}
        ${box(260, 28, 200, 94, '2. Haftalik vaqt rejasi', '3 kun · 35 daqiqadan')}
        ${arrow(460, 75, 496, 75)}
        ${box(500, 28, 200, 94, '3. Kichik amaliy maqsad', 'Bosqichma-bosqich o‘sish', true)}
        <text x="360" y="160" text-anchor="middle" fill="var(--muted)" font-size="12">Muntazam amaliyot + qaydlar = barqaror natija</text>
      `);

    case 'vscode-workbench':
      return svgShell(alt, '0 0 720 240', `
        <rect x="20" y="16" width="680" height="206" rx="14" fill="var(--panel2)" stroke="var(--border)" stroke-width="1.6"/>
        <rect x="20" y="16" width="680" height="30" rx="14" fill="var(--panel)" stroke="var(--border)"/>
        <text x="42" y="36" fill="var(--muted)" font-size="11.5" font-weight="700">VS CODE OYNA TUZILISHI — BIRINCHI-LOYIHA</text>
        ${box(34, 58, 155, 150, 'Explorer', 'Papka va fayllar', false)}
        ${box(200, 58, 330, 88, 'Muharrir (Editor)', 'script.js kodini yozish', true)}
        ${box(200, 154, 330, 54, 'Terminal', 'node script.js buyruqlari', false)}
        ${box(542, 58, 144, 150, 'Extensions', 'Prettier, ESLint', false)}
      `);

    case 'nodejs-compare':
      return svgShell(alt, '0 0 720 200', `
        ${box(24, 24, 305, 148, 'Brauzer muhiti (Chrome)', 'DOM + sahifa + F12 Console', true)}
        <text x="360" y="92" text-anchor="middle" fill="var(--accent)" font-size="18" font-weight="800">⇄</text>
        <text x="360" y="114" text-anchor="middle" fill="var(--muted)" font-size="11">Bir xil JS tili</text>
        ${box(391, 24, 305, 148, 'Node.js muhiti (Terminal)', 'Fayllar + npm + node script.js', false)}
      `);

    case 'devtools-panels':
      return svgShell(alt, '0 0 720 200', `
        ${box(20, 26, 210, 140, 'Elements', 'HTML daraxti va CSS uslubi', false)}
        ${box(255, 26, 210, 140, 'Console', 'Natija, xatolar va JS sinov', true)}
        ${box(490, 26, 210, 140, 'Sources', 'Yuklangan fayllar va debug', false)}
      `);

    case 'extensions-map':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 28, 210, 128, 'Prettier', 'Kod ko‘rinishini tekislaydi', true)}
        ${box(255, 28, 210, 128, 'ESLint', 'Shubhali qoidalarni tekshiradi', false)}
        ${box(490, 28, 210, 128, 'Live Server / Vite', 'Lokal veb-serverda ko‘rsatadi', false)}
      `);

    case 'first-project-tree':
      return svgShell(alt, '0 0 720 230', `
        ${box(24, 20, 220, 44, 'birinchi-loyiha/', 'Loyiha bosh papkasi', true)}
        <line x1="64" y1="64" x2="64" y2="196" stroke="var(--border)" stroke-width="2"/>
        <line x1="64" y1="95" x2="110" y2="95" stroke="var(--border)" stroke-width="2"/>
        <line x1="64" y1="145" x2="110" y2="145" stroke="var(--border)" stroke-width="2"/>
        <line x1="64" y1="195" x2="110" y2="195" stroke="var(--border)" stroke-width="2"/>
        ${box(112, 74, 175, 42, 'index.html', 'Sahifa skeleti', false)}
        ${box(112, 124, 175, 42, 'style.css', 'Rang va bezak', false)}
        ${box(112, 174, 175, 42, 'script.js', 'Mantiq va harakat', true)}
        ${arrow(288, 95, 345, 95, '<link>')}
        ${arrow(288, 195, 345, 195, 'defer')}
        ${box(348, 74, 348, 142, 'Brauzerda yagona sahifa', 'HTML tuziladi → CSS bezaydi → JS jonlantiradi', true)}
      `);

    case 'web-trio':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 32, 195, 110, 'HTML', 'Tuzilish (skelet)')}
        ${arrow(215, 87, 255, 87, '+')}
        ${box(260, 32, 195, 110, 'CSS', 'Dizayn va rang')}
        ${arrow(455, 87, 495, 87, '+')}
        ${box(500, 32, 200, 110, 'JavaScript', 'Mantiq va console.log()', true)}
      `);

    case 'io-dialog':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 36, 200, 108, 'Kirish (prompt)', 'Foydalanuvchi matn kiritadi', false)}
        ${arrow(220, 90, 260, 90, 'saqlash')}
        ${box(264, 36, 192, 108, 'const ism = ...', 'Xotirada saqlanadi', true)}
        ${arrow(456, 90, 496, 90, 'chiqarish')}
        ${box(500, 36, 200, 108, 'Chiqish', 'console.log() / alert()', false)}
      `);

    case 'variable-box':
      return svgShell(alt, '0 0 720 225', `
        ${box(35, 22, 145, 76, 'let', 'O‘zgaruvchi e’lon qilish', true)}
        ${box(195, 22, 155, 76, 'yosh', 'Quti nomi (identifikator)', false)}
        ${box(365, 22, 120, 76, '=', 'Qiymat berish', false)}
        ${box(500, 22, 185, 76, '16', 'Saqlanayotgan qiymat', true)}
        <line x1="272" y1="98" x2="272" y2="128" stroke="var(--accent)" stroke-width="2" marker-end="url(#diag-arrow)"/>
        <line x1="592" y1="98" x2="450" y2="136" stroke="var(--accent)" stroke-width="2" marker-end="url(#diag-arrow)"/>
        <rect x="210" y="132" width="300" height="72" rx="14" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/>
        <text x="360" y="156" text-anchor="middle" fill="var(--muted)" font-size="12" font-weight="700">XOTIRA QUTISI: yosh</text>
        <text x="360" y="186" text-anchor="middle" fill="var(--fg)" font-size="22" font-weight="800">16</text>
      `);

    case 'data-types':
      return svgShell(alt, '0 0 720 190', `
        ${box(14, 30, 130, 120, 'String', '"Ali" · Matn', true)}
        ${box(154, 30, 130, 120, 'Number', '16, 3.14 · Son', false)}
        ${box(294, 30, 130, 120, 'Boolean', 'true / false', true)}
        ${box(434, 30, 130, 120, 'null', 'Ataylab bo‘sh', false)}
        ${box(574, 30, 132, 120, 'undefined', 'Qiymatsiz', false)}
      `);

    case 'arithmetic-ops':
      return svgShell(alt, '0 0 720 205', `
        ${box(18, 20, 215, 74, '+ va -', '10 + 4 = 14 · 10 - 4 = 6', false)}
        ${box(252, 20, 215, 74, '* va /', '10 * 4 = 40 · 10 / 4 = 2.5', true)}
        ${box(486, 20, 215, 74, '% (Qoldiq)', '10 % 4 = 2', true)}
        ${box(18, 110, 328, 74, '** (Daraja)', '10 ** 2 = 100 · 2 ** 3 = 8', false)}
        ${box(374, 110, 328, 74, 'Qavslar () ustuvorligi', '(2 + 3) * 4 = 20 · 2 + 3 * 4 = 14', true)}
      `);

    case 'type-conversion':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 30, 195, 116, '"12" + "8"', 'Natija: "128" (matn)', false)}
        ${arrow(215, 88, 265, 88, 'Number()')}
        ${box(270, 30, 190, 116, 'Number("12")', 'Matndan → 12 soniga', true)}
        ${arrow(460, 88, 505, 88, '+')}
        ${box(510, 30, 190, 116, '12 + 8 = 20', 'Haqiqiy arifmetika', true)}
      `);

    case 'math-geometry':
      return svgShell(alt, '0 0 720 200', `
        <circle cx="135" cy="100" r="68" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.2"/>
        <line x1="135" y1="100" x2="203" y2="100" stroke="var(--fg)" stroke-width="2"/>
        <text x="169" y="92" text-anchor="middle" fill="var(--fg)" font-size="13" font-weight="700">R</text>
        <text x="135" y="185" text-anchor="middle" fill="var(--muted)" font-size="12">Doira: L = 2·π·R, S = π·R²</text>
        ${box(260, 24, 210, 70, 'Math.PI', '≈ 3.14159265', true)}
        ${box(490, 24, 210, 70, 'Math.sqrt(81)', 'Natija: 9', false)}
        ${box(260, 110, 440, 70, 'Math.round / floor / ceil', 'Yaxlitlash hisoblash yakunida bajariladi', false)}
      `);

    case 'digit-split':
      return svgShell(alt, '0 0 720 205', `
        ${box(250, 16, 220, 56, 'Son: n = 347', 'Uch xonali butun son', true)}
        ${arrow(290, 72, 120, 118, 'Math.floor(n/100)')}
        ${arrow(360, 72, 360, 118, 'Math.floor(n/10)%10')}
        ${arrow(430, 72, 600, 118, 'n % 10')}
        ${box(30, 122, 180, 66, 'Yuzlik: 3', '3 × 100')}
        ${box(270, 122, 180, 66, 'O‘nlik: 4', '4 × 10')}
        ${box(510, 122, 180, 66, 'Birlik: 7', '7 × 1', true)}
      `);

    case 'logic-gates':
      return svgShell(alt, '0 0 720 190', `
        ${box(18, 28, 162, 124, '===', 'Qiymat va tur teng', true)}
        ${box(194, 28, 162, 124, '&& (VA)', 'Ikkalasi ham true', false)}
        ${box(370, 28, 162, 124, '|| (YOKI)', 'Kamida bittasi true', true)}
        ${box(546, 28, 156, 124, '! (INKOR)', 'true ⇄ false', false)}
      `);

    case 'if-else-flow':
      return svgShell(alt, '0 0 720 220', `
        ${box(260, 14, 200, 48, 'Shart: ball >= 60?', 'Taqqoslash natijasi', true)}
        ${arrow(280, 62, 165, 115, 'true (Rost)')}
        ${arrow(440, 62, 555, 115, 'false (Yolg‘on)')}
        ${box(45, 118, 240, 76, 'if { "O‘tdi" }', 'Birinchi blok bajariladi', true)}
        ${box(435, 118, 240, 76, 'else { "Qayta urin" }', 'Muqobil blok bajariladi', false)}
      `);

    case 'ternary-syntax':
      return svgShell(alt, '0 0 720 185', `
        ${box(22, 34, 210, 96, '1. Shart', 'n % 2 === 0', true)}
        <text x="255" y="88" text-anchor="middle" fill="var(--accent)" font-size="24" font-weight="800">?</text>
        ${box(280, 34, 185, 96, '2. Rost bo‘lsa', '"juft"', false)}
        <text x="488" y="88" text-anchor="middle" fill="var(--accent)" font-size="24" font-weight="800">:</text>
        ${box(512, 34, 185, 96, '3. Yolg‘on bo‘lsa', '"toq"', false)}
      `);

    case 'switch-routing':
      return svgShell(alt, '0 0 720 210', `
        ${box(24, 65, 175, 76, 'switch (kun)', 'Qat’iy === solishtirish', true)}
        ${arrow(199, 80, 275, 42)}
        ${arrow(199, 103, 275, 103)}
        ${arrow(199, 126, 275, 164)}
        ${box(280, 16, 220, 48, 'case 1: "Dushanba"', 'break → chiqish', false)}
        ${box(280, 79, 220, 48, 'case 2: "Seshanba"', 'break → chiqish', true)}
        ${box(280, 142, 220, 48, 'default: "Noma’lum"', 'Mos kelmasa ishlaydi', false)}
        ${arrow(500, 103, 545, 103)}
        ${box(550, 65, 148, 76, 'Davom etish', 'Swithdan chiqildi', false)}
      `);

    case 'for-loop-flow':
      return svgShell(alt, '0 0 720 215', `
        ${box(18, 65, 150, 74, '1. Boshlanish', 'let i = 1', false)}
        ${arrow(168, 102, 204, 102)}
        ${box(208, 65, 155, 74, '2. Shart', 'i <= n ?', true)}
        ${arrow(363, 102, 405, 102, 'true')}
        ${box(408, 65, 150, 74, '3. Tana', 'console.log(i)', false)}
        ${arrow(483, 139, 483, 168)}
        ${box(350, 154, 190, 46, '4. Qadam: i++', 'Shartga qaytadi', true)}
        <path d="M 350 177 L 285 177 L 285 142" fill="none" stroke="var(--accent)" stroke-width="2" marker-end="url(#diag-arrow)"/>
        ${arrow(285, 65, 285, 25, 'false → Chiqish')}
        ${box(582, 65, 120, 74, 'Tugadi', 'Sikl yakuni', false)}
      `);

    case 'accumulator-flow':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 195, 110, 'sum = 0', 'Yig‘indi 0 dan boshlanadi', false)}
        ${arrow(215, 89, 255, 89, 'sum += i')}
        ${box(260, 34, 200, 110, 'Har qadamda jamla', '0 + 1 + 2 + 3 + ...', true)}
        ${arrow(460, 89, 500, 89, 'prod *= i')}
        ${box(505, 34, 195, 110, 'prod = 1', 'Ko‘paytma 1 dan boshlanadi', false)}
      `);

    case 'while-compare':
      return svgShell(alt, '0 0 720 200', `
        ${box(24, 24, 316, 150, 'while (shart) { ... }', 'Avval shart tekshiriladi → 0+ marta', true)}
        ${box(380, 24, 316, 150, 'do { ... } while (shart)', 'Avval tana bajariladi → 1+ marta', false)}
      `);

    case 'nested-break':
      return svgShell(alt, '0 0 720 195', `
        ${box(20, 28, 215, 128, 'break', 'Butun siklni darhol to‘xtatadi', false)}
        ${box(252, 28, 215, 128, 'continue', 'Faqat joriy qadamni tashlaydi', true)}
        ${box(484, 28, 215, 128, 'Ichma-ich sikl', 'Qator (i) × Ustun (j) jadvali', false)}
      `);

    case 'function-machine':
      return svgShell(alt, '0 0 720 200', `
        ${box(20, 52, 170, 92, 'Argument', 'Masalan: (5)', false)}
        ${arrow(190, 98, 240, 98, 'kirish')}
        ${box(245, 28, 230, 140, 'function kvadrat(x)', 'Parametr x → return x * x', true)}
        ${arrow(475, 98, 525, 98, 'return')}
        ${box(530, 52, 170, 92, 'Natija', '25 qaytarildi', false)}
      `);

    case 'scope-arrow':
      return svgShell(alt, '0 0 720 205', `
        <rect x="20" y="18" width="680" height="168" rx="14" fill="var(--panel2)" stroke="var(--border)" stroke-width="1.6"/>
        <text x="42" y="42" fill="var(--muted)" font-size="12" font-weight="700">GLOBAL SCOPE — hamma joyda ko‘rinadi</text>
        ${box(44, 58, 290, 108, 'const ikki = x => x * 2;', 'Qisqa arrow funksiya (avto return)', true)}
        ${box(370, 58, 305, 108, 'Blok { let maxfiy = 1; }', 'Faqat shu blok ichida mavjud (Scope)', false)}
      `);

    case 'array-cells':
      return svgShell(alt, '0 0 720 195', `
        <text x="360" y="30" text-anchor="middle" fill="var(--muted)" font-size="12" font-weight="700">MASSIV INDEKSLARI (0 DAN BOSHLANADI) · length = 4</text>
        ${box(40, 48, 145, 76, '"Olma"', 'indeks [0]', true)}
        ${box(198, 48, 145, 76, '"Banan"', 'indeks [1]', false)}
        ${box(356, 48, 145, 76, '"Uzum"', 'indeks [2]', false)}
        ${box(514, 48, 165, 76, 'push() / pop()', 'Oxiriga qo‘shish / olish', true)}
        <text x="360" y="164" text-anchor="middle" fill="var(--muted)" font-size="12">Birinchi element: a[0] · Oxirgi element: a[a.length - 1]</text>
      `);

    case 'array-loop':
      return svgShell(alt, '0 0 720 190', `
        ${box(24, 34, 150, 108, '[5, 4, 3]', 'Baholar massivi', false)}
        ${arrow(174, 88, 224, 88, 'for...of')}
        ${box(228, 34, 240, 108, 'Har bir elementni o‘qi', 'sum += baho', true)}
        ${arrow(468, 88, 514, 88, '/ length')}
        ${box(518, 34, 178, 108, 'O‘rtacha: 4', 'Bo‘sh massivni tekshir!', false)}
      `);

    case 'array-methods':
      return svgShell(alt, '0 0 720 205', `
        ${box(18, 22, 162, 148, 'map()', 'Har birini o‘zgartir → yangi massiv', true)}
        ${box(192, 22, 162, 148, 'filter()', 'Moslarini tanla → qisqa massiv', false)}
        ${box(366, 22, 162, 148, 'find()', 'Birinchi mosini top → bitta qiymat', false)}
        ${box(540, 22, 162, 148, 'reduce()', 'Hammasini bitta natijaga jamla', true)}
      `);

    case 'string-methods':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 32, 170, 112, '"  Ali Vali  "', 'Asl matn', false)}
        ${arrow(190, 88, 232, 88, '.trim()')}
        ${box(236, 32, 200, 112, '"Ali Vali"', 'Bo‘shliq tozalandi', true)}
        ${arrow(436, 88, 482, 88, '.split(" ")')}
        ${box(486, 32, 214, 112, '["Ali", "Vali"]', 'So‘zlar massivi', false)}
      `);

    case 'object-map':
      return svgShell(alt, '0 0 720 195', `
        ${box(40, 26, 230, 138, 'const oquvchi = {...}', 'Kalit–qiymat tuzilmasi', true)}
        ${arrow(270, 55, 340, 55)}
        ${arrow(270, 95, 340, 95)}
        ${arrow(270, 135, 340, 135)}
        ${box(345, 32, 335, 38, 'ism : "Ali"', 'oquvchi.ism')}
        ${box(345, 78, 335, 38, 'ball : 88', 'oquvchi.ball')}
        ${box(345, 124, 335, 38, 'salom() : fn', 'Obyekt metodi', true)}
      `);

    case 'json-bridge':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 210, 112, 'JS Obyekt / Massiv', '[{ ism: "Ali", ball: 90 }]', true)}
        ${arrow(230, 68, 470, 68, 'JSON.stringify() → matnga')}
        ${arrow(470, 116, 230, 116, '← JSON.parse() obyektga')}
        ${box(475, 34, 225, 112, 'JSON matni', '\'[{"ism":"Ali","ball":90}]\'', false)}
      `);

    case 'dom-tree':
      return svgShell(alt, '0 0 720 230', `
        ${box(270, 14, 180, 44, 'document', 'DOM daraxti ildizi', true)}
        <line x1="360" y1="58" x2="360" y2="82" stroke="var(--accent)" stroke-width="2"/>
        ${box(270, 82, 180, 42, '<body>', 'Sahifa tanasi', false)}
        <line x1="360" y1="124" x2="140" y2="156" stroke="var(--border)" stroke-width="2"/>
        <line x1="360" y1="124" x2="360" y2="156" stroke="var(--border)" stroke-width="2"/>
        <line x1="360" y1="124" x2="580" y2="156" stroke="var(--border)" stroke-width="2"/>
        ${box(45, 158, 190, 52, '<h1 id="title">', 'querySelector("#title")', true)}
        ${box(265, 158, 190, 52, '<ul class="list">', 'Ota element', false)}
        ${box(485, 158, 190, 52, '<button>', 'Bosiladigan tugma', false)}
      `);

    case 'event-flow':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 36, 200, 108, '1. Hodisa', 'Foydalanuvchi click bosdi', false)}
        ${arrow(220, 90, 260, 90)}
        ${box(264, 36, 200, 108, '2. addEventListener', 'Ro‘yxatdagi funksiyani chaqiradi', true)}
        ${arrow(464, 90, 504, 90)}
        ${box(508, 36, 192, 108, '3. DOM yangilanadi', 'Matn yoki hisob o‘zgaradi', false)}
      `);

    case 'dom-style':
      return svgShell(alt, '0 0 720 190', `
        ${box(24, 34, 210, 112, 'classList.toggle()', 'Tayyor CSS sinfini yoqib-o‘chiradi', true)}
        ${box(256, 34, 210, 112, 'element.style', 'Alohida camelCase uslub beradi', false)}
        ${box(488, 34, 208, 112, 'Matn + rang', 'Holat faqat rang bilan emas', true)}
      `);

    case 'form-validation':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 165, 112, 'submit hodisasi', 'Forma yuborildi', false)}
        ${arrow(185, 90, 218, 90)}
        ${box(222, 34, 175, 112, 'preventDefault()', 'Sahifa yangilanmasin', true)}
        ${arrow(397, 90, 430, 90)}
        ${box(434, 34, 266, 112, 'value.trim() tekshiruvi', 'Bo‘sh bo‘lsa xato xabar, aks holda qabul', false)}
      `);

    case 'dom-create':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 195, 112, '1. createElement("li")', 'Xotirada tugun yaratish', false)}
        ${arrow(215, 90, 255, 90)}
        ${box(260, 34, 195, 112, '2. textContent = ...', 'Matnini xavfsiz yozish', true)}
        ${arrow(455, 90, 495, 90)}
        ${box(500, 34, 200, 112, '3. ul.append(li)', 'Sahifaga ko‘rinadigan qo‘shish', false)}
      `);

    case 'event-delegation':
      return svgShell(alt, '0 0 720 205', `
        ${box(30, 24, 210, 146, 'Child <button>', 'Foydalanuvchi bosadi', false)}
        ${arrow(240, 97, 290, 97, 'Bubbling ↑')}
        ${box(294, 24, 200, 146, 'Ota <ul> tinglovchi', 'Bitta addEventListener', true)}
        ${arrow(494, 97, 534, 97)}
        ${box(538, 24, 160, 146, 'e.target.closest()', 'Qaysi <li> o‘chiriladi?', false)}
      `);

    case 'localstorage-flow':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 200, 112, 'JS Holati (State)', 'Massiv yoki obyekt', false)}
        ${arrow(220, 90, 260, 90, 'stringify')}
        ${box(264, 34, 200, 112, 'localStorage', 'Origin bo‘yicha saqlanadi', true)}
        ${arrow(464, 90, 504, 90, 'parse')}
        ${box(508, 34, 192, 112, 'Reloaddan keyin', 'Ma’lumot qayta tiklanadi', false)}
      `);

    case 'spread-destruct':
      return svgShell(alt, '0 0 720 190', `
        ${box(24, 34, 210, 112, 'Destructuring', 'const { ism, ball } = oquvchi', true)}
        ${box(256, 34, 210, 112, 'Spread (...)', 'const nusxa = [...asl]', false)}
        ${box(488, 34, 208, 112, 'Rest (...args)', 'Qolgan argumentlar massivi', true)}
      `);

    case 'try-catch-flow':
      return svgShell(alt, '0 0 720 200', `
        ${box(24, 62, 175, 76, 'try { ... }', 'Xavfli amalni sinash', true)}
        ${arrow(199, 82, 280, 44, 'Xato yo‘q')}
        ${arrow(199, 118, 280, 152, 'Xato / throw')}
        ${box(284, 18, 200, 54, 'Davom etadi', 'Natija tayyor', false)}
        ${box(284, 124, 200, 54, 'catch (err)', 'Xato xavfsiz ushlanadi', true)}
        ${arrow(484, 45, 535, 86)}
        ${arrow(484, 151, 535, 114)}
        ${box(540, 62, 158, 76, 'finally', 'Ilova ishda qoladi', false)}
      `);

    case 'timers-timeline':
      return svgShell(alt, '0 0 720 190', `
        ${box(24, 30, 320, 120, 'setTimeout(fn, 1000)', '1 soniyadan keyin 1 marta → clearTimeout', false)}
        ${box(376, 30, 320, 120, 'setInterval(fn, 1000)', 'Har 1 soniyada takror → clearInterval', true)}
      `);

    case 'recursion-modules':
      return svgShell(alt, '0 0 720 200', `
        ${box(24, 28, 324, 138, 'Rekursiya: f(3) → 3 × f(2) → 1', 'Bazaviy shart: if (n <= 1) return 1;', true)}
        ${box(372, 28, 324, 138, 'ES Modullar: export ↔ import', 'math.js (hisob) + app.js (UI)', false)}
      `);

    case 'promise-states':
      return svgShell(alt, '0 0 720 205', `
        ${box(30, 62, 195, 78, 'Pending', 'Natija kutilmoqda...', true)}
        ${arrow(225, 84, 320, 46, 'resolve()')}
        ${arrow(225, 118, 320, 154, 'reject()')}
        ${box(325, 18, 190, 56, 'Fulfilled (Bajarildi)', 'await qiymat beradi', true)}
        ${box(325, 126, 190, 56, 'Rejected (Xato)', 'catch(err) ushlaydi', false)}
        ${arrow(515, 46, 558, 86)}
        ${arrow(515, 154, 558, 114)}
        ${box(560, 62, 138, 78, 'UI tayyor', 'Sahifa qotmaydi', false)}
      `);

    case 'fetch-http':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 165, 112, 'fetch(url)', 'HTTP GET so‘rov', true)}
        ${arrow(185, 90, 222, 90)}
        ${box(226, 34, 175, 112, 'if (!res.ok)', '404/500 holatini tekshir', false)}
        ${arrow(401, 90, 438, 90)}
        ${box(442, 34, 258, 112, 'await res.json()', 'JSON javobni JS obyektiga o‘girish', true)}
      `);

    case 'api-to-cards':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 200, 112, 'JSON Array', '[{ id: 1, title: "..." }]', false)}
        ${arrow(220, 90, 260, 90, 'for...of')}
        ${box(264, 34, 210, 112, 'createElement + textContent', 'XSS xavfsiz yozish', true)}
        ${arrow(474, 90, 514, 90)}
        ${box(518, 34, 182, 112, 'UI Kartochkalar', 'Sahifada ko‘rinadi', false)}
      `);

    case 'ui-4states':
      return svgShell(alt, '0 0 720 190', `
        ${box(18, 30, 162, 120, '1. Loading', 'Yuklanmoqda...', true)}
        ${box(192, 30, 162, 120, '2. Empty', 'Ma’lumot topilmadi', false)}
        ${box(366, 30, 162, 120, '3. Error', 'Xato + Qayta urinish', false)}
        ${box(540, 30, 162, 120, '4. Success', 'Tayyor ma’lumotlar', true)}
      `);

    case 'project-architecture':
      return svgShell(alt, '0 0 720 195', `
        ${box(20, 30, 205, 120, 'data.js', 'Savollar banki (ma’lumot)', false)}
        ${arrow(225, 90, 260, 90)}
        ${box(264, 30, 195, 120, 'score.js', 'Ball, foiz, shuffle (mantiq)', true)}
        ${arrow(459, 90, 494, 90)}
        ${box(498, 30, 202, 120, 'app.js', 'DOM, taymer, hodisalar (UI)', false)}
      `);

    case 'question-schema':
      return svgShell(alt, '0 0 720 190', `
        ${box(24, 32, 155, 112, 'id: "q1"', 'Barqaror kalit', true)}
        ${box(194, 32, 165, 112, 'question', 'Savol matni', false)}
        ${box(374, 32, 165, 112, 'options: [...]', '0-indeksli variantlar', false)}
        ${box(554, 32, 144, 112, 'answer + izoh', '0 ≤ answer < length', true)}
      `);

    case 'state-restore':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 210, 112, 'Tanlov (radio)', 'answers[q.id] = 1', true)}
        ${arrow(230, 90, 270, 90)}
        ${box(274, 34, 195, 112, 'Navigatsiya', 'Oldingi / Keyingi chegara', false)}
        ${arrow(469, 90, 509, 90)}
        ${box(513, 34, 187, 112, 'Qayta chizish', 'checked avtomatik tiklanadi', true)}
      `);

    case 'score-math':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 200, 112, 'To‘g‘ri / Xato / Bo‘sh', 'Har savol ID bo‘yicha tekshiriladi', false)}
        ${arrow(220, 90, 265, 90)}
        ${box(270, 34, 215, 112, 'total === 0 ? 0 : ...', '0 ga bo‘linishdan himoya', true)}
        ${arrow(485, 90, 525, 90)}
        ${box(530, 34, 170, 112, 'Math.round(%)', 'Aniq foiz hisoboti', false)}
      `);

    case 'timer-deadline':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 205, 112, 'endsAt = now + 180s', 'Tugash vaqtini belgilash', true)}
        ${arrow(225, 90, 265, 90)}
        ${box(270, 34, 205, 112, 'Math.max(0, qolgan)', 'Manfiy sekundga tushmaydi', false)}
        ${arrow(475, 90, 515, 90)}
        ${box(520, 34, 180, 112, 'finish() × 1', 'Bir marta yakunlanadi', true)}
      `);

    case 'fisher-yates':
      return svgShell(alt, '0 0 720 190', `
        ${box(20, 34, 195, 112, 'Nusxa: [...items]', 'Asl massiv buzilmaydi', false)}
        ${arrow(215, 90, 255, 90)}
        ${box(260, 34, 225, 112, 'i = n-1 dan 1 gacha', 'Tasodifiy j ∈ [0, i] bilan almashtir', true)}
        ${arrow(485, 90, 520, 90)}
        ${box(524, 34, 176, 112, 'Adolatli tartib', 'Har variant teng ehtimol', false)}
      `);

    case 'testing-matrix':
      return svgShell(alt, '0 0 720 190', `
        ${box(18, 30, 162, 120, 'Oddiy holat', '3/4 → 75%', true)}
        ${box(192, 30, 162, 120, 'Nol holati', '0/0 → 0%', false)}
        ${box(366, 30, 162, 120, 'Chegara', '100% va 0%', false)}
        ${box(540, 30, 162, 120, 'Noto‘g‘ri kirish', 'NaN / bo‘sh himoya', true)}
      `);

    case 'git-deploy':
    default:
      return svgShell(alt, '0 0 720 190', `
        ${box(18, 34, 155, 112, '1. Git commit', 'O‘zgarishlarni saqlash', false)}
        ${arrow(173, 90, 204, 90)}
        ${box(208, 34, 155, 112, '2. GitHub push', 'Masofaviy ombor', true)}
        ${arrow(363, 90, 394, 90)}
        ${box(398, 34, 145, 112, '3. vite build', 'dist/ papkasini yig‘ish', false)}
        ${arrow(543, 90, 574, 90)}
        ${box(578, 34, 124, 112, '4. Deploy', 'Ochiq veb-manzil', true)}
      `);
  }
}

export function renderLessonVisualDeck(lesson) {
  const meta = LESSON_VISUALS[lesson.id];
  if (!meta) return '';

  const isOrientation = lesson.id === 'setup-01';
  const headingTag = isOrientation ? 'h4' : 'h3';

  const editorialBlock = meta.editorialPair
    ? renderEditorialPair(meta.editorialPair)
    : (meta.editorial ? renderEditorialFigure(meta.editorial) : '');
  const diagramBlock = `
    <figure class="diagram-figure">
      <div class="diagram-caption-head">
        <span class="visual-kicker">VIZUAL DIAGRAMMA VA SXEMA</span>
        <${headingTag}>${e(meta.alt)}</${headingTag}>
      </div>
      <div class="diagram-stage">${renderDiagramSVG(meta.diagram, meta.alt)}</div>
      <figcaption>${e(meta.alt)}</figcaption>
    </figure>`;

  const analogyBlock = `
    <div class="visual-analogy">
      <span class="visual-kicker">QIZIQARLI VAZIYAT VA HAYOTIY MISOL</span>
      <p>${f(meta.analogy)}</p>
    </div>`;

  const glossaryBlock = Array.isArray(meta.glossary) && meta.glossary.length ? `
    <div class="visual-glossary">
      <span class="visual-kicker">ATAMALAR LUG‘ATI VA VIZUAL ESLATMA</span>
      <dl class="glossary-grid">
        ${meta.glossary.map(([term, def]) => `<div class="glossary-item"><dt>${f(term)}</dt><dd>${f(def)}</dd></div>`).join('')}
      </dl>
    </div>` : '';

  return `<section class="lesson-visual-deck" aria-label="Darsning vizual materiallari">
    ${analogyBlock}
    ${editorialBlock}
    ${diagramBlock}
    ${glossaryBlock}
  </section>`;
}
