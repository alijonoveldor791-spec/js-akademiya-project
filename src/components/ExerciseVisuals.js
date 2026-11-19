import { escapeHTML as e } from './lessonText.js';

export function getSourceMeta(id) {
  if (id.startsWith('Begin')) return { section: 'Begin bo‘limi (Chiziqli algoritmlar)', badge: 'Manba: Katta C++ Kitobi · Begin' };
  if (id.startsWith('Integer')) return { section: 'Integer bo‘limi (Butun sonlar)', badge: 'Manba: Katta C++ Kitobi · Integer' };
  if (id.startsWith('Boolean')) return { section: 'Boolean bo‘limi (Mantiqiy ifodalar)', badge: 'Manba: Katta C++ Kitobi · Boolean' };
  if (id.startsWith('For')) return { section: 'For bo‘limi (Parametrli sikllar)', badge: 'Manba: Katta C++ Kitobi · For' };
  return { section: 'Algoritmik mashq', badge: 'Mustaqil topshiriq' };
}

export function renderExerciseDiagram(exercise, args = []) {
  const id = exercise.id;
  const vals = args.length ? args : exercise.tests[0].args;
  const a = vals[0] ?? 5;
  const b = vals[1] ?? 4;
  const c = vals[2] ?? 3;

  let shapeSvg = '';
  if (['Begin1', 'Begin2'].includes(id)) {
    const res = id === 'Begin1' ? 4 * a : a * a;
    shapeSvg = `<svg class="ex-svg" viewBox="0 0 320 155" role="img" aria-label="Tomoni ${a} bo‘lgan kvadrat diagrammasi">
      <rect x="38" y="25" width="94" height="94" rx="4" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.2"/>
      <text x="85" y="18" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">a = ${e(a)}</text>
      <text x="20" y="76" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">a</text>
      <text x="85" y="77" text-anchor="middle" fill="var(--accent)" font-size="13" font-weight="800">${id === 'Begin1' ? 'P = 4×a' : 'S = a²'}</text>
      <text x="165" y="54" fill="var(--fg)" font-size="12.5" font-weight="700">Berilgan: a = ${e(a)}</text>
      <text x="165" y="78" fill="var(--muted)" font-size="12">Formula: ${e(exercise.formula)}</text>
      <text x="165" y="104" fill="var(--accent)" font-size="13" font-weight="800">Natija: ${Number.isFinite(res) ? Number(res.toFixed(4)) : '—'}</text>
    </svg>`;
  } else if (id === 'Begin3') {
    shapeSvg = `<svg class="ex-svg" viewBox="0 0 320 155" role="img" aria-label="To‘g‘ri to‘rtburchak ${a} va ${b} diagrammasi">
      <rect x="28" y="34" width="124" height="78" rx="4" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.2"/>
      <text x="90" y="25" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">b = ${e(b)}</text>
      <text x="16" y="77" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">a=${e(a)}</text>
      <text x="90" y="77" text-anchor="middle" fill="var(--accent)" font-size="12" font-weight="700">S = a×b</text>
      <text x="172" y="56" fill="var(--fg)" font-size="12" font-weight="700">S = ${e(Number((a * b).toFixed(4)))}</text>
      <text x="172" y="82" fill="var(--fg)" font-size="12" font-weight="700">P = ${e(Number((2 * (a + b)).toFixed(4)))}</text>
      <text x="172" y="106" fill="var(--muted)" font-size="11.5">Qaytarish: [S, P]</text>
    </svg>`;
  } else if (['Begin4', 'Begin7'].includes(id)) {
    const label = id === 'Begin4' ? `d = ${a}` : `R = ${a}`;
    shapeSvg = `<svg class="ex-svg" viewBox="0 0 320 155" role="img" aria-label="Aylana va doira diagrammasi">
      <circle cx="82" cy="78" r="50" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.2"/>
      <line x1="${id === 'Begin4' ? 32 : 82}" y1="78" x2="132" y2="78" stroke="var(--fg)" stroke-width="2"/>
      <text x="${id === 'Begin4' ? 82 : 107}" y="70" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">${e(label)}</text>
      <text x="155" y="58" fill="var(--fg)" font-size="12" font-weight="700">Formula: ${e(exercise.formula)}</text>
      <text x="155" y="84" fill="var(--muted)" font-size="11.5">π ≈ Math.PI (3.14159...)</text>
      <text x="155" y="108" fill="var(--accent)" font-size="11.5" font-weight="700">Natija: haqiqiy son</text>
    </svg>`;
  } else if (id === 'Begin12') {
    shapeSvg = `<svg class="ex-svg" viewBox="0 0 320 155" role="img" aria-label="To‘g‘ri burchakli uchburchak">
      <polygon points="36,120 36,34 140,120" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.2"/>
      <text x="24" y="80" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">a=${e(a)}</text>
      <text x="88" y="136" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">b=${e(b)}</text>
      <text x="102" y="68" text-anchor="middle" fill="var(--accent)" font-size="12" font-weight="700">c</text>
      <text x="165" y="64" fill="var(--fg)" font-size="12" font-weight="700">c = Math.hypot(a, b)</text>
      <text x="165" y="90" fill="var(--muted)" font-size="11.5">P = a + b + c</text>
    </svg>`;
  } else if (id.startsWith('Integer')) {
    shapeSvg = `<svg class="ex-svg" viewBox="0 0 320 155" role="img" aria-label="Butun sonlar amali diagrammasi">
      <rect x="20" y="34" width="122" height="82" rx="10" fill="var(--panel2)" stroke="var(--accent)" stroke-width="2"/>
      <text x="81" y="64" text-anchor="middle" fill="var(--muted)" font-size="11">Kirish qiymat(lar)</text>
      <text x="81" y="94" text-anchor="middle" fill="var(--fg)" font-size="18" font-weight="800">${e(vals.join(', '))}</text>
      <line x1="142" y1="75" x2="176" y2="75" stroke="var(--accent)" stroke-width="2"/>
      <rect x="178" y="34" width="124" height="82" rx="10" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2"/>
      <text x="240" y="64" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="700">Butun bo‘lish / qoldiq</text>
      <text x="240" y="92" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">Math.floor() &amp; %</text>
    </svg>`;
  } else if (id.startsWith('Boolean')) {
    shapeSvg = `<svg class="ex-svg" viewBox="0 0 320 155" role="img" aria-label="Mantiqiy tekshiruv diagrammasi">
      <rect x="18" y="28" width="128" height="92" rx="10" fill="var(--panel2)" stroke="var(--border)" stroke-width="1.8"/>
      <text x="82" y="60" text-anchor="middle" fill="var(--muted)" font-size="11">Kirishlar</text>
      <text x="82" y="88" text-anchor="middle" fill="var(--fg)" font-size="14" font-weight="700">${e(vals.join(', '))}</text>
      <line x1="146" y1="74" x2="178" y2="74" stroke="var(--accent)" stroke-width="2"/>
      <rect x="180" y="28" width="124" height="92" rx="10" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2"/>
      <text x="242" y="62" text-anchor="middle" fill="var(--accent)" font-size="11.5" font-weight="700">Mantiqiy javob</text>
      <text x="242" y="92" text-anchor="middle" fill="var(--fg)" font-size="14" font-weight="800">true / false</text>
    </svg>`;
  } else if (id.startsWith('For')) {
    shapeSvg = `<svg class="ex-svg" viewBox="0 0 320 155" role="img" aria-label="For sikl diagrammasi">
      <rect x="18" y="28" width="88" height="92" rx="10" fill="var(--panel2)" stroke="var(--border)" stroke-width="1.8"/>
      <text x="62" y="64" text-anchor="middle" fill="var(--muted)" font-size="11">Boshlanish</text>
      <text x="62" y="88" text-anchor="middle" fill="var(--fg)" font-size="13" font-weight="700">${e(a)}</text>
      <line x1="106" y1="74" x2="128" y2="74" stroke="var(--accent)" stroke-width="2"/>
      <rect x="130" y="28" width="86" height="92" rx="10" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2"/>
      <text x="173" y="64" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="700">Takror</text>
      <text x="173" y="88" text-anchor="middle" fill="var(--fg)" font-size="13" font-weight="700">i++</text>
      <line x1="216" y1="74" x2="238" y2="74" stroke="var(--accent)" stroke-width="2"/>
      <rect x="240" y="28" width="66" height="92" rx="10" fill="var(--panel2)" stroke="var(--border)" stroke-width="1.8"/>
      <text x="273" y="64" text-anchor="middle" fill="var(--muted)" font-size="11">Chegara</text>
      <text x="273" y="88" text-anchor="middle" fill="var(--fg)" font-size="13" font-weight="700">${e(vals[1] ?? a)}</text>
    </svg>`;
  } else {
    shapeSvg = `<svg class="ex-svg" viewBox="0 0 320 155" role="img" aria-label="${e(id)} formula diagrammasi">
      <rect x="18" y="28" width="128" height="92" rx="10" fill="var(--panel2)" stroke="var(--border)" stroke-width="1.8"/>
      <text x="82" y="62" text-anchor="middle" fill="var(--muted)" font-size="11">Berilganlar</text>
      <text x="82" y="88" text-anchor="middle" fill="var(--fg)" font-size="13" font-weight="700">${e(vals.join(', '))}</text>
      <line x1="146" y1="74" x2="178" y2="74" stroke="var(--accent)" stroke-width="2"/>
      <rect x="180" y="28" width="124" height="92" rx="10" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2"/>
      <text x="242" y="62" text-anchor="middle" fill="var(--accent)" font-size="11" font-weight="700">Formula</text>
      <text x="242" y="88" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">${e(exercise.formula.slice(0, 18))}</text>
    </svg>`;
  }

  const flowSvg = `<svg class="ex-svg" viewBox="0 0 320 155" role="img" aria-label="${e(id)} algoritm blok-sxemasi">
    <rect x="65" y="10" width="190" height="34" rx="17" fill="var(--panel2)" stroke="var(--border)" stroke-width="1.5"/>
    <text x="160" y="31" text-anchor="middle" fill="var(--fg)" font-size="11.5" font-weight="700">1. Kirish: (${e(exercise.inputs.map(x => x.name).join(', '))})</text>
    <line x1="160" y1="44" x2="160" y2="58" stroke="var(--accent)" stroke-width="2"/>
    <rect x="35" y="59" width="250" height="38" rx="8" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="1.8"/>
    <text x="160" y="82" text-anchor="middle" fill="var(--fg)" font-size="11.5" font-weight="700">2. Hisoblash: ${e(exercise.formula.slice(0, 26))}</text>
    <line x1="160" y1="97" x2="160" y2="111" stroke="var(--accent)" stroke-width="2"/>
    <rect x="65" y="112" width="190" height="34" rx="17" fill="var(--panel2)" stroke="var(--border)" stroke-width="1.5"/>
    <text x="160" y="133" text-anchor="middle" fill="var(--accent)" font-size="11.5" font-weight="700">3. return javob</text>
  </svg>`;

  return `<div class="ex-visual-grid">${shapeSvg}${flowSvg}</div>`;
}
