import { escapeHTML as e } from './lessonText.js';
import { highlightJavaScript } from './CodeEditor.js';
import { LESSON_VISUALS } from '../data/visualMedia.js';

let activeAutoTimer = null;
export function stopSimulatorTimers() {
  if (activeAutoTimer) {
    clearInterval(activeAutoTimer);
    activeAutoTimer = null;
  }
}

export function renderSimulatorMount(container, lesson) {
  stopSimulatorTimers();
  const meta = LESSON_VISUALS[lesson.id];
  if (!meta?.simulator || meta.simulator === 'step-tracer' || lesson.id === 'setup-01' || lesson.id === 'lesson-04') {
    container.replaceChildren();
    return;
  }

  const kind = meta.simulator;
  container.innerHTML = `<section class="panel simulator-panel" aria-label="Interaktiv simulyator">
    <div class="visual-kicker">INTERAKTIV TAJRIBA VA SIMULYATOR</div>
    <div id="simulatorStage"></div>
  </section>`;

  const stage = container.querySelector('#simulatorStage');
  if (kind === 'vscode-explorer') mountVSCodeExplorer(stage);
  else if (kind === 'devtools-explorer') mountDevToolsExplorer(stage);
  else if (kind === 'project-files') mountProjectFilesExplorer(stage);
  else if (kind === 'variable-box') mountVariableBox(stage);
  else if (kind === 'arithmetic-explorer') mountArithmeticExplorer(stage);
  else if (kind === 'type-converter') mountTypeConverter(stage);
  else if (kind === 'circle-math') mountCircleMath(stage);
  else if (kind === 'digit-splitter') mountDigitSplitter(stage);
  else if (kind === 'logic-sandbox') mountLogicSandbox(stage);
  else if (kind === 'condition-flow') mountConditionFlow(stage);
  else if (kind === 'switch-router') mountSwitchRouter(stage);
  else if (kind === 'loop-simulator') mountLoopSimulator(stage, lesson.id);
  else if (kind === 'function-machine') mountFunctionMachine(stage);
  else if (kind === 'array-simulator') mountArraySimulator(stage);
  else if (kind === 'dom-playground') mountDomPlayground(stage);
  else if (kind === 'async-simulator') mountAsyncSimulator(stage);
}

function mountVSCodeExplorer(stage) {
  const zones = {
    explorer: ['Explorer (Chap panel)', 'Loyiha papkasi va barcha fayllarni ko‘rsatadi. Yangi fayl tugmasi (+), yangi papka va Ctrl+B bilan yashirish/ochish mavjud.', 'Ctrl + Shift + E'],
    editor: ['Kod muharriri (Markaz)', 'Tanlangan .html, .css yoki .js faylni rangli sintaksis bilan tahrirlash maydoni. Saqlanmagan fayl yonida nuqta ko‘rinadi.', 'Ctrl + S (Saqlash)'],
    terminal: ['Ichki terminal (Pastki panel)', 'node script.js va npm run dev buyruqlarini VS Code’dan chiqmasdan ishga tushirish joyi.', 'Ctrl + ` (Terminal)'],
    extensions: ['Kengaytmalar (Extensions)', 'Prettier (formatlash) yoki Live Server kabi qo‘shimchalarni qidirib o‘rnatish bo‘limi.', 'Ctrl + Shift + X']
  };
  let current = 'explorer';
  const draw = () => {
    const [title, desc, shortcut] = zones[current];
    stage.innerHTML = `<h3>VS Code interfeysining qismlarini bosing</h3>
      <div class="sim-controls" role="tablist">
        ${Object.entries(zones).map(([k, [label]]) => `<button type="button" class="${k === current ? 'primary-button' : 'ghost-button'}" data-zone="${k}">${e(label.split(' ')[0])}</button>`).join('')}
      </div>
      <div class="sim-card">
        <div class="between"><strong>${e(title)}</strong><code class="inline-code">${e(shortcut)}</code></div>
        <p>${e(desc)}</p>
      </div>`;
    stage.querySelectorAll('[data-zone]').forEach(btn => {
      btn.onclick = () => { current = btn.dataset.zone; draw(); };
    });
  };
  draw();
}

function mountDevToolsExplorer(stage) {
  const tabs = {
    console: ['Console bo‘limi', 'console.log() natijalari va xato xabarlari shu yerda chiqadi. Qizil rangli xatoda fayl nomi va qator raqami ko‘rsatiladi.', 'Ctrl + Shift + J'],
    elements: ['Elements bo‘limi', 'Sahifadagi jonli HTML daraxtini va o‘ng tomonda CSS uslublarini ko‘rish hamda vaqtincha sinash bo‘limi.', 'Ctrl + Shift + C'],
    sources: ['Sources bo‘limi', 'Sahifa yuklagan .js fayllarni ko‘rish va kodni kerakli qatorda to‘xtatib (breakpoint) tekshirish joyi.', 'F12 → Sources']
  };
  let current = 'console';
  const draw = () => {
    const [title, desc, shortcut] = tabs[current];
    stage.innerHTML = `<h3>Developer Tools bo‘limlarini solishtiring</h3>
      <div class="sim-controls">
        ${Object.entries(tabs).map(([k, [label]]) => `<button type="button" class="${k === current ? 'primary-button' : 'ghost-button'}" data-tab="${k}">${e(label.split(' ')[0])}</button>`).join('')}
      </div>
      <div class="sim-card">
        <div class="between"><strong>${e(title)}</strong><code class="inline-code">${e(shortcut)}</code></div>
        <p>${e(desc)}</p>
      </div>`;
    stage.querySelectorAll('[data-tab]').forEach(btn => {
      btn.onclick = () => { current = btn.dataset.tab; draw(); };
    });
  };
  draw();
}

function mountProjectFilesExplorer(stage) {
  const files = {
    'index.html': ['Tuzilish (HTML)', '<!doctype html>\n<html lang="uz">\n<head>\n  <link rel="stylesheet" href="style.css">\n  <script src="script.js" defer></script>\n</head>\n<body>\n  <h1>Salom, JavaScript!</h1>\n</body>\n</html>', 'CSS <link> orqali head’ga, JS esa defer bilan ulanadi.'],
    'style.css': ['Ko‘rinish (CSS)', 'body {\n  font-family: sans-serif;\n  background: #eef4ff;\n  color: #192338;\n}', 'Sahifaning rangi, shrifti va joylashuvini boshqaradi.'],
    'script.js': ['Harakat (JavaScript)', 'console.log("Salom, JavaScript!");\nconst h1 = document.querySelector("h1");\nh1.textContent = "Loyiha ishlamoqda!";', 'Terminalda node script.js, brauzerda esa HTML orqali ishlaydi.']
  };
  let active = 'index.html';
  const draw = () => {
    const [role, code, note] = files[active];
    stage.innerHTML = `<h3>birinchi-loyiha/ papkasi fayllarini tekshiring</h3>
      <div class="sim-controls">
        ${Object.keys(files).map(name => `<button type="button" class="${name === active ? 'primary-button' : 'ghost-button'}" data-file="${name}">${e(name)}</button>`).join('')}
      </div>
      <div class="sim-card">
        <div class="between"><strong>${e(active)}</strong><span class="muted">${e(role)}</span></div>
        <pre class="code-sample"><code>${e(code)}</code></pre>
        <p class="muted">${e(note)}</p>
      </div>`;
    stage.querySelectorAll('[data-file]').forEach(btn => {
      btn.onclick = () => { active = btn.dataset.file; draw(); };
    });
  };
  draw();
}

function mountVariableBox(stage) {
  let keyword = 'let';
  let varName = 'yosh';
  let value = '16';
  let reassigned = '';

  const render = () => {
    const cleanName = (varName.replace(/[^A-Za-z0-9_$]/g, '') || 'yosh').replace(/^\d/, '_');
    const numVal = Number(value);
    const displayVal = value.trim() !== '' && !Number.isNaN(numVal) ? value : JSON.stringify(value);
    const codeLines = `${keyword} ${cleanName} = ${displayVal};` + (reassigned ? `\n${cleanName} = ${reassigned};` : '');
    const isConstError = keyword === 'const' && reassigned !== '';

    stage.innerHTML = `<h3>O‘zgaruvchi qutisini o‘zingiz boshqaring</h3>
      <div class="sim-inputs">
        <label>Kalit so‘z
          <select id="simVarKw">
            <option value="let" ${keyword === 'let' ? 'selected' : ''}>let (o‘zgartirish mumkin)</option>
            <option value="const" ${keyword === 'const' ? 'selected' : ''}>const (qayta tayinlanmaydi)</option>
          </select>
        </label>
        <label>O‘zgaruvchi nomi
          <input id="simVarName" value="${e(cleanName)}" maxlength="20">
        </label>
        <label>Boshlang‘ich qiymat
          <input id="simVarVal" value="${e(value)}" maxlength="20">
        </label>
      </div>
      <div class="sim-split">
        <div>
          <pre class="code-sample"><code>${highlightJavaScript(codeLines)}</code></pre>
          <div class="sim-controls">
            <button type="button" class="primary-button" id="simReassignBtn">Qiymatni +1 ga yangilash</button>
            <button type="button" class="ghost-button" id="simVarResetBtn">Qayta boshlash</button>
          </div>
        </div>
        <div class="memory-box ${isConstError ? 'memory-error' : ''}">
          <span class="small-label">${e(keyword)} XOTIRA QUTISI</span>
          <div class="memory-box-name">${e(cleanName)}</div>
          <div class="memory-box-val">${e(isConstError ? value : (reassigned || value))}</div>
          <small>${isConstError ? 'Xato: TypeError — const qayta tayinlanmaydi!' : (reassigned ? 'Qiymat muvaffaqiyatli yangilandi.' : 'Qiymat qutida saqlanmoqda.')}</small>
        </div>
      </div>`;

    stage.querySelector('#simVarKw').onchange = ev => { keyword = ev.target.value; render(); };
    stage.querySelector('#simVarName').oninput = ev => { varName = ev.target.value; render(); };
    stage.querySelector('#simVarVal').oninput = ev => { value = ev.target.value; reassigned = ''; render(); };
    stage.querySelector('#simReassignBtn').onclick = () => {
      const base = Number(reassigned || value);
      reassigned = Number.isNaN(base) ? '"Yangi"' : String(base + 1);
      render();
    };
    stage.querySelector('#simVarResetBtn').onclick = () => { keyword = 'let'; varName = 'yosh'; value = '16'; reassigned = ''; render(); };
  };
  render();
}

function mountArithmeticExplorer(stage) {
  let a = 10;
  let b = 4;
  const draw = () => {
    const div = b === 0 ? 'Infinity' : (a / b).toFixed(2).replace(/\.00$/, '');
    const mod = b === 0 ? 'NaN' : a % b;
    const pow = a ** Math.min(b, 6);
    stage.innerHTML = `<h3>Arifmetik operatorlar jonli kalkulyatori</h3>
      <div class="sim-inputs">
        <label>a qiymati (${a})<input type="range" id="arithA" min="1" max="25" value="${a}"></label>
        <label>b qiymati (${b})<input type="range" id="arithB" min="0" max="10" value="${b}"></label>
      </div>
      <div class="op-grid">
        <div><code>${a} + ${b}</code><strong>${a + b}</strong><span>Qo‘shish</span></div>
        <div><code>${a} - ${b}</code><strong>${a - b}</strong><span>Ayirish</span></div>
        <div><code>${a} * ${b}</code><strong>${a * b}</strong><span>Ko‘paytirish</span></div>
        <div><code>${a} / ${b}</code><strong>${div}</strong><span>Bo‘lish</span></div>
        <div><code>${a} % ${b}</code><strong>${mod}</strong><span>Qoldiq</span></div>
        <div><code>${a} ** ${Math.min(b, 6)}</code><strong>${pow}</strong><span>Daraja</span></div>
      </div>`;
    stage.querySelector('#arithA').oninput = ev => { a = Number(ev.target.value); draw(); };
    stage.querySelector('#arithB').oninput = ev => { b = Number(ev.target.value); draw(); };
  };
  draw();
}

function mountTypeConverter(stage) {
  let rawA = '12';
  let rawB = '8';
  let useNumber = true;
  const draw = () => {
    const code = useNumber
      ? `const a = Number(${JSON.stringify(rawA)});\nconst b = Number(${JSON.stringify(rawB)});\nconsole.log(a + b);`
      : `const a = ${JSON.stringify(rawA)};\nconst b = ${JSON.stringify(rawB)};\nconsole.log(a + b);`;
    const res = useNumber ? String(Number(rawA) + Number(rawB)) : JSON.stringify(rawA + rawB);
    stage.innerHTML = `<h3>Matn va son qo‘shilishini taqqoslang</h3>
      <div class="sim-inputs">
        <label>Birinchi qiymat<input id="convA" value="${e(rawA)}" maxlength="12"></label>
        <label>Ikkinchi qiymat<input id="convB" value="${e(rawB)}" maxlength="12"></label>
      </div>
      <div class="sim-controls">
        <button type="button" class="${useNumber ? 'primary-button' : 'ghost-button'}" id="convNum">Number() bilan hisoblash</button>
        <button type="button" class="${!useNumber ? 'primary-button' : 'ghost-button'}" id="convStr">Matn (+) sifatida ulash</button>
      </div>
      <pre class="code-sample"><code>${highlightJavaScript(code)}</code></pre>
      <pre class="console">Natija: ${e(res)}</pre>`;
    stage.querySelector('#convA').oninput = ev => { rawA = ev.target.value; draw(); };
    stage.querySelector('#convB').oninput = ev => { rawB = ev.target.value; draw(); };
    stage.querySelector('#convNum').onclick = () => { useNumber = true; draw(); };
    stage.querySelector('#convStr').onclick = () => { useNumber = false; draw(); };
  };
  draw();
}

function mountCircleMath(stage) {
  let r = 5;
  const draw = () => {
    const l = (2 * Math.PI * r).toFixed(2);
    const s = (Math.PI * r * r).toFixed(2);
    const px = 22 + r * 4.5;
    stage.innerHTML = `<h3>Radius (R) ni o‘zgartirib aylana hisobini ko‘ring</h3>
      <div class="sim-inputs">
        <label>Radius R = ${r} sm<input type="range" id="circleR" min="1" max="14" value="${r}"></label>
      </div>
      <div class="sim-split">
        <svg class="diagram-svg" viewBox="0 0 240 170" role="img" aria-label="Radiusi ${r} bo‘lgan aylana">
          <circle cx="120" cy="85" r="${px}" fill="var(--accentbg)" stroke="var(--accent)" stroke-width="2.5"/>
          <line x1="120" y1="85" x2="${120 + px}" y2="85" stroke="var(--fg)" stroke-width="2"/>
          <text x="${120 + px / 2}" y="77" text-anchor="middle" fill="var(--fg)" font-size="12" font-weight="700">R=${r}</text>
        </svg>
        <div class="sim-card">
          <p><code>2 * Math.PI * ${r}</code> → <strong>L = ${l}</strong></p>
          <p><code>Math.PI * ${r} ** 2</code> → <strong>S = ${s}</strong></p>
          <p class="muted"><code>Math.PI</code> ≈ 3.14159</p>
        </div>
      </div>`;
    stage.querySelector('#circleR').oninput = ev => { r = Number(ev.target.value); draw(); };
  };
  draw();
}

function mountDigitSplitter(stage) {
  let n = 347;
  const draw = () => {
    const safe = Math.max(100, Math.min(999, Math.floor(Math.abs(n) || 100)));
    const h = Math.floor(safe / 100);
    const t = Math.floor(safe / 10) % 10;
    const u = safe % 10;
    stage.innerHTML = `<h3>3 xonali sonni raqamlarga ajratish</h3>
      <div class="sim-inputs">
        <label>3 xonali son (100–999)<input type="number" id="splitNum" min="100" max="999" value="${safe}"></label>
      </div>
      <div class="op-grid">
        <div><code>Math.floor(${safe} / 100)</code><strong>${h}</strong><span>Yuzliklar</span></div>
        <div><code>Math.floor(${safe} / 10) % 10</code><strong>${t}</strong><span>O‘nliklar</span></div>
        <div><code>${safe} % 10</code><strong>${u}</strong><span>Birliklar</span></div>
        <div><code>Yig‘indi</code><strong>${h + t + u}</strong><span>${h} + ${t} + ${u}</span></div>
      </div>`;
    stage.querySelector('#splitNum').oninput = ev => { n = Number(ev.target.value); draw(); };
  };
  draw();
}

function mountLogicSandbox(stage) {
  let age = 16;
  let agreed = true;
  const draw = () => {
    const condAge = age >= 14;
    const allOk = condAge && agreed;
    const anyOk = condAge || agreed;
    stage.innerHTML = `<h3>Mantiqiy shartlarni (&&, ||, !) jonli tekshiring</h3>
      <div class="sim-inputs">
        <label>Yosh: ${age}<input type="range" id="logicAge" min="8" max="22" value="${age}"></label>
        <label class="inline-check"><input type="checkbox" id="logicAgree" ${agreed ? 'checked' : ''}> Ota-ona roziligi bor (${agreed})</label>
      </div>
      <div class="op-grid">
        <div><code>yosh >= 14</code><strong>${condAge}</strong><span>${condAge ? 'Rost' : 'Yolg‘on'}</span></div>
        <div><code>yosh >= 14 && rozilik</code><strong>${allOk}</strong><span>Ikkalasi ham kerak</span></div>
        <div><code>yosh >= 14 || rozilik</code><strong>${anyOk}</strong><span>Kamida bittasi</span></div>
        <div><code>!rozilik</code><strong>${!agreed}</strong><span>Inkor</span></div>
      </div>`;
    stage.querySelector('#logicAge').oninput = ev => { age = Number(ev.target.value); draw(); };
    stage.querySelector('#logicAgree').onchange = ev => { agreed = ev.target.checked; draw(); };
  };
  draw();
}

function mountConditionFlow(stage) {
  let ball = 76;
  const draw = () => {
    const branch = ball >= 85 ? 'if' : ball >= 60 ? 'elseif' : 'else';
    const label = branch === 'if' ? 'A’lo (85+)' : branch === 'elseif' ? 'O‘tdi (60–84)' : 'Qayta topshiradi (< 60)';
    stage.innerHTML = `<h3>Shart operatori blok-sxemasi simulyatori</h3>
      <div class="sim-inputs">
        <label>Test balli: ${ball} / 100<input type="range" id="condScore" min="0" max="100" value="${ball}"></label>
      </div>
      <div class="flow-branches">
        <div class="flow-node ${branch === 'if' ? 'flow-active' : ''}"><code>if (ball >= 85)</code><strong>A’lo natija</strong><span>${branch === 'if' ? '✓ Shu yo‘l tanlandi' : 'Tekshirildi'}</span></div>
        <div class="flow-node ${branch === 'elseif' ? 'flow-active' : ''}"><code>else if (ball >= 60)</code><strong>O‘tdi</strong><span>${branch === 'elseif' ? '✓ Shu yo‘l tanlandi' : branch === 'if' ? 'O‘tkazib yuborildi' : 'Tekshirildi'}</span></div>
        <div class="flow-node ${branch === 'else' ? 'flow-active' : ''}"><code>else</code><strong>Qayta topshiradi</strong><span>${branch === 'else' ? '✓ Shu yo‘l tanlandi' : 'O‘tkazib yuborildi'}</span></div>
      </div>
      <pre class="console">Tanlangan natija: ${label} (ball = ${ball})</pre>`;
    stage.querySelector('#condScore').oninput = ev => { ball = Number(ev.target.value); draw(); };
  };
  draw();
}

function mountSwitchRouter(stage) {
  let day = 3;
  const names = { 1: 'Dushanba', 2: 'Seshanba', 3: 'Chorshanba', 4: 'Payshanba', 5: 'Juma', 6: 'Shanba', 7: 'Yakshanba' };
  const draw = () => {
    const out = names[day] || 'Noto‘g‘ri kun (default)';
    stage.innerHTML = `<h3>switch / case yo‘nalishini sinang</h3>
      <div class="sim-controls">
        ${[1, 2, 3, 4, 5, 6, 7, 9].map(d => `<button type="button" class="${d === day ? 'primary-button' : 'ghost-button'}" data-day="${d}">${d === 9 ? '9 (xato)' : d + '-kun'}</button>`).join('')}
      </div>
      <div class="sim-card">
        <p><code>switch (${day})</code> → <strong>${e(out)}</strong></p>
        <p class="muted">${names[day] ? `case ${day} mos keldi va break sikldan/switchdan chiqardi.` : 'Birorta case mos kelmadi, shuning uchun default ishladi.'}</p>
      </div>`;
    stage.querySelectorAll('[data-day]').forEach(btn => {
      btn.onclick = () => { day = Number(btn.dataset.day); draw(); };
    });
  };
  draw();
}

function mountLoopSimulator(stage, lessonId) {
  const isAcc = lessonId === 'lesson-14';
  const isWhile = lessonId === 'lesson-15';
  let limit = 5;
  let step = 0; // 0 = initial, 1..limit = iterations, limit+1 = finished
  let playing = false;

  const stopPlay = () => {
    playing = false;
    stopSimulatorTimers();
  };

  const render = () => {
    const iVal = step === 0 ? 1 : Math.min(step, limit + 1);
    const condOk = iVal <= limit;
    const logs = [];
    let sum = 0;
    const completedIterations = Math.min(step, limit);
    for (let k = 1; k <= completedIterations; k++) {
      sum += k;
      logs.push(isAcc ? `qadam ${k}: sum = ${sum}` : `Salom, ${k}-o‘quvchi!`);
    }
    const statusText = step === 0
      ? 'Boshlanish: hisoblagich i = 1 o‘rnatildi.'
      : step <= limit
        ? `${step}-aylanish: shart (${step} <= ${limit}) = true → buyruq bajarildi, i++ (${step + 1}).`
        : `Tugadi: shart (${limit + 1} <= ${limit}) = false → sikldan chiqildi.`;

    stage.innerHTML = `<h3>${isWhile ? 'while / do...while' : isAcc ? 'Yig‘indi sikl' : 'for sikli'} qadam-baqadam simulyatori</h3>
      <div class="sim-inputs">
        <label>Sikl chegarasi N = ${limit}<input type="range" id="loopLimit" min="2" max="8" value="${limit}"></label>
      </div>
      <div class="sim-controls">
        <button type="button" class="primary-button" id="loopStep">${step > limit ? 'Qaytadan' : 'Keyingi qadam →'}</button>
        <button type="button" class="ghost-button" id="loopPlay">${playing ? '⏸ Pauza' : '▶ Avto-o‘ynatish'}</button>
        <button type="button" class="ghost-button" id="loopReset">↻ Qayta boshlash</button>
      </div>
      <div class="op-grid">
        <div><code>Hisoblagich i</code><strong>${iVal}</strong><span>Joriy qiymat</span></div>
        <div><code>Shart (i <= ${limit})</code><strong>${condOk ? 'true' : 'false'}</strong><span>${condOk ? 'Davom etadi' : 'To‘xtaydi'}</span></div>
        <div><code>${isAcc ? 'Yig‘indi (sum)' : 'Takrorlar'}</code><strong>${isAcc ? sum : completedIterations}</strong><span>Holat</span></div>
        <div><code>Bosqich</code><strong>${Math.min(step, limit + 1)} / ${limit + 1}</strong><span>Jarayon</span></div>
      </div>
      <p class="tip">${e(statusText)}</p>
      <pre class="console">${e(logs.join('\n') || 'Hali chiqish yo‘q — «Keyingi qadam»ni bosing.')}</pre>`;

    stage.querySelector('#loopLimit').oninput = ev => { stopPlay(); limit = Number(ev.target.value); step = 0; render(); };
    stage.querySelector('#loopReset').onclick = () => { stopPlay(); step = 0; render(); };
    stage.querySelector('#loopStep').onclick = () => {
      stopPlay();
      step = step > limit ? 0 : step + 1;
      render();
    };
    stage.querySelector('#loopPlay').onclick = () => {
      if (playing) { stopPlay(); render(); return; }
      if (step > limit) step = 0;
      playing = true;
      render();
      activeAutoTimer = setInterval(() => {
        step += 1;
        if (step > limit + 1) {
          stopPlay();
        }
        render();
      }, 900);
    };
  };
  render();
}

function mountFunctionMachine(stage) {
  let x = 5;
  let y = 3;
  const draw = () => {
    const res = x * x + y;
    stage.innerHTML = `<h3>Funksiya mashinasi: Argument → Parametr → return</h3>
      <div class="sim-inputs">
        <label>1-argument (x = ${x})<input type="range" id="fnX" min="1" max="12" value="${x}"></label>
        <label>2-argument (y = ${y})<input type="range" id="fnY" min="0" max="12" value="${y}"></label>
      </div>
      <div class="fn-machine-grid">
        <div class="sim-card"><strong>Kirish (Argumentlar)</strong><p><code>hisobla(${x}, ${y})</code></p></div>
        <div class="sim-card fn-core"><strong>Ichki amal (Parametrlar)</strong><p><code>x = ${x}, y = ${y}</code><br><code>return ${x} * ${x} + ${y}</code></p></div>
        <div class="sim-card"><strong>Chiqish (return)</strong><p><strong>${res}</strong></p></div>
      </div>`;
    stage.querySelector('#fnX').oninput = ev => { x = Number(ev.target.value); draw(); };
    stage.querySelector('#fnY').oninput = ev => { y = Number(ev.target.value); draw(); };
  };
  draw();
}

function mountArraySimulator(stage) {
  let items = [4, 12, 7, 18];
  let lastAction = 'Boshlang‘ich massiv tayyor.';
  let mode = 'raw'; // raw | map | filter | find | reduce

  const draw = () => {
    const viewItems = mode === 'map'
      ? items.map(x => x * 2)
      : mode === 'filter'
        ? items.filter(x => x >= 10)
        : mode === 'find'
          ? (items.find(x => x >= 10) !== undefined ? [items.find(x => x >= 10)] : [])
          : items;
    const total = items.reduce((a, b) => a + b, 0);

    stage.innerHTML = `<h3>Massiv katakchalari va metodlari simulyatori</h3>
      <div class="sim-controls">
        <button type="button" class="primary-button" id="arrPush">push(+son)</button>
        <button type="button" class="ghost-button" id="arrPop">pop()</button>
        <button type="button" class="${mode === 'raw' ? 'primary-button' : 'ghost-button'}" data-mode="raw">Asl massiv</button>
        <button type="button" class="${mode === 'map' ? 'primary-button' : 'ghost-button'}" data-mode="map">map(x =&gt; x*2)</button>
        <button type="button" class="${mode === 'filter' ? 'primary-button' : 'ghost-button'}" data-mode="filter">filter(x &gt;= 10)</button>
        <button type="button" class="${mode === 'find' ? 'primary-button' : 'ghost-button'}" data-mode="find">find(x &gt;= 10)</button>
      </div>
      <div class="array-cells-row" role="list">
        ${viewItems.length ? viewItems.map((val, idx) => `<div class="array-cell" role="listitem"><small>[${idx}]</small><strong>${val}</strong></div>`).join('') : '<p class="muted">Massiv bo‘sh []</p>'}
      </div>
      <p class="tip">${e(lastAction)} · <code>length = ${items.length}</code> · <code>reduce yig‘indi = ${total}</code></p>`;

    stage.querySelector('#arrPush').onclick = () => {
      if (items.length >= 8) { lastAction = 'Ko‘rgazma uchun maksimal 8 ta element yetarli.'; draw(); return; }
      const next = (items.length + 1) * 5;
      items = [...items, next];
      mode = 'raw';
      lastAction = `push(${next}) oxiriga qo‘shildi.`;
      draw();
    };
    stage.querySelector('#arrPop').onclick = () => {
      if (!items.length) { lastAction = 'Massiv allaqachon bo‘sh.'; draw(); return; }
      const removed = items[items.length - 1];
      items = items.slice(0, -1);
      mode = 'raw';
      lastAction = `pop() oxirgi elementni (${removed}) olib tashladi.`;
      draw();
    };
    stage.querySelectorAll('[data-mode]').forEach(btn => {
      btn.onclick = () => {
        mode = btn.dataset.mode;
        lastAction = mode === 'raw' ? 'Asl massiv ko‘rsatilmoqda.' : `${mode}() yangi ko‘rinishni hosil qildi (asl massiv saqlanadi).`;
        draw();
      };
    });
  };
  draw();
}

function mountDomPlayground(stage) {
  let heading = 'Salom, DOM!';
  let accent = false;
  let tasks = ['HTML tuzilishini o‘rganish', 'JS bilan element tanlash'];

  const draw = () => {
    stage.innerHTML = `<h3>DOM laboratoriyasi: tugma bosib sahifani o‘zgartiring</h3>
      <div class="sim-controls">
        <button type="button" class="primary-button" id="domTitleBtn">Sarlavhani almashtir</button>
        <button type="button" class="ghost-button" id="domStyleBtn">classList.toggle("active")</button>
        <button type="button" class="ghost-button" id="domAddBtn">createElement("li") + append</button>
        <button type="button" class="ghost-button" id="domResetBtn">↻ Tiklash</button>
      </div>
      <div class="sim-split">
        <div class="dom-stage ${accent ? 'dom-stage-active' : ''}">
          <h4>${e(heading)}</h4>
          <ul>${tasks.map((t, i) => `<li><span>${e(t)}</span><button type="button" class="ghost-button" data-del="${i}">O‘chirish</button></li>`).join('')}</ul>
        </div>
        <pre class="code-sample"><code>${highlightJavaScript(`// Jonli DOM daraxti\n<body>\n  <h4 class="${accent ? 'active' : ''}">${heading}</h4>\n  <ul> (${tasks.length} ta <li>) </ul>\n</body>`)}</code></pre>
      </div>`;

    stage.querySelector('#domTitleBtn').onclick = () => {
      heading = heading === 'Salom, DOM!' ? 'JavaScript sahifani yangiladi!' : 'Salom, DOM!';
      draw();
    };
    stage.querySelector('#domStyleBtn').onclick = () => { accent = !accent; draw(); };
    stage.querySelector('#domAddBtn').onclick = () => {
      if (tasks.length < 5) tasks = [...tasks, `Yangi vazifa #${tasks.length + 1}`];
      draw();
    };
    stage.querySelector('#domResetBtn').onclick = () => {
      heading = 'Salom, DOM!'; accent = false; tasks = ['HTML tuzilishini o‘rganish', 'JS bilan element tanlash']; draw();
    };
    stage.querySelectorAll('[data-del]').forEach(btn => {
      btn.onclick = () => {
        const idx = Number(btn.dataset.del);
        tasks = tasks.filter((_, i) => i !== idx);
        draw();
      };
    });
  };
  draw();
}

function mountAsyncSimulator(stage) {
  let phase = 'idle'; // idle | pending | fulfilled | rejected
  let timer = null;

  const draw = () => {
    const statusMap = {
      idle: ['Tayyor', 'fetch() so‘rovini yuborish uchun tugmani bosing.'],
      pending: ['Pending (Kutilmoqda...)', 'Brauzer javobni kutmoqda, lekin sahifa qotmaydi!'],
      fulfilled: ['Fulfilled (200 OK)', '{"id": 1, "title": "JavaScript o‘rganish", "completed": true}'],
      rejected: ['Rejected (404 / Tarmoq xatosi)', 'catch(err) xatoni ushladi: Ma’lumot topilmadi.']
    };
    const [badge, msg] = statusMap[phase];
    stage.innerHTML = `<h3>Promise va fetch() asinxron jarayon simulyatori</h3>
      <div class="sim-controls">
        <button type="button" class="primary-button" id="asyncSuccessBtn">▶ Muvaffaqiyatli so‘rov (200 OK)</button>
        <button type="button" class="ghost-button" id="asyncFailBtn">✕ Xato holati (404)</button>
        <button type="button" class="ghost-button" id="asyncResetBtn">↻ Tozalash</button>
      </div>
      <div class="flow-branches">
        <div class="flow-node ${phase === 'pending' ? 'flow-active' : ''}"><strong>1. Pending</strong><span>So‘rov yo‘lda</span></div>
        <div class="flow-node ${phase === 'fulfilled' ? 'flow-active' : ''}"><strong>2. Fulfilled</strong><span>await res.json()</span></div>
        <div class="flow-node ${phase === 'rejected' ? 'flow-active' : ''}"><strong>3. Rejected</strong><span>catch(err)</span></div>
      </div>
      <pre class="console">Holat: ${e(badge)}\n${e(msg)}</pre>`;

    const runSim = target => {
      clearTimeout(timer);
      phase = 'pending';
      draw();
      timer = setTimeout(() => { phase = target; draw(); }, 850);
    };
    stage.querySelector('#asyncSuccessBtn').onclick = () => runSim('fulfilled');
    stage.querySelector('#asyncFailBtn').onclick = () => runSim('rejected');
    stage.querySelector('#asyncResetBtn').onclick = () => { clearTimeout(timer); phase = 'idle'; draw(); };
  };
  draw();
}

// Generic step-by-step code tracer for the Code Laboratory
export function buildCodeTrace(source) {
  const lines = String(source || '').split('\n');
  const env = {};
  const steps = [];
  const logs = [];

  const safeEval = expr => {
    const keys = Object.keys(env);
    const vals = Object.values(env);
    return new Function(...keys, `"use strict"; return (${expr});`)(...vals);
  };

  for (let i = 0; i < lines.length && steps.length < 40; i++) {
    const raw = lines[i];
    const line = raw.trim();
    if (!line || line.startsWith('//')) continue;

    const decl = line.match(/^(let|const|var)\s+([A-Za-z_$][\w$]*)\s*=\s*(.+?);?$/);
    if (decl) {
      const [, kw, name, expr] = decl;
      try {
        env[name] = safeEval(expr);
        steps.push({ line: i + 1, code: line, action: `${kw} ${name} o‘zgaruvchisiga ${JSON.stringify(env[name])} qiymati berildi.`, vars: { ...env }, logs: [...logs] });
      } catch (err) {
        steps.push({ line: i + 1, code: line, action: `Baholash izohi: ${err.message}`, vars: { ...env }, logs: [...logs] });
      }
      continue;
    }

    const assign = line.match(/^([A-Za-z_$][\w$]*)\s*=\s*(.+?);?$/);
    if (assign && Object.hasOwn(env, assign[1])) {
      const [, name, expr] = assign;
      try {
        env[name] = safeEval(expr);
        steps.push({ line: i + 1, code: line, action: `${name} qiymati ${JSON.stringify(env[name])} ga yangilandi.`, vars: { ...env }, logs: [...logs] });
      } catch (err) {
        steps.push({ line: i + 1, code: line, action: `Baholash izohi: ${err.message}`, vars: { ...env }, logs: [...logs] });
      }
      continue;
    }

    const logMatch = line.match(/^console\.log\((.*)\);?$/);
    if (logMatch) {
      try {
        const out = safeEval(`[${logMatch[1]}]`).map(v => typeof v === 'string' ? v : JSON.stringify(v)).join(' ');
        logs.push(out);
        steps.push({ line: i + 1, code: line, action: `Konsolga chiqarildi: ${out}`, vars: { ...env }, logs: [...logs] });
      } catch {
        steps.push({ line: i + 1, code: line, action: `Konsolga chiqarish buyrug‘i bajarildi.`, vars: { ...env }, logs: [...logs] });
      }
      continue;
    }

    steps.push({ line: i + 1, code: line, action: `Qator bajarildi (to‘liq natija uchun «Ishga tushirish»dan foydalaning).`, vars: { ...env }, logs: [...logs] });
  }
  return steps;
}

export function renderLabTracer(container, source) {
  const steps = buildCodeTrace(source);
  if (!steps.length) {
    container.innerHTML = '<p class="muted">Kuzatish uchun muharrirda kamida bitta kod qatori bo‘lsin.</p>';
    return;
  }
  let idx = 0;
  let playing = false;
  let timer = null;

  const stop = () => { playing = false; clearInterval(timer); timer = null; };
  const draw = () => {
    const current = steps[idx];
    const entries = Object.entries(current.vars);
    container.innerHTML = `<div class="lab-tracer-box">
      <div class="between">
        <strong>Qadam-baqadam kuzatish (${idx + 1} / ${steps.length})</strong>
        <div class="sim-controls">
          <button type="button" class="ghost-button" id="tracePrev" ${idx === 0 ? 'disabled' : ''}>← Oldingi</button>
          <button type="button" class="primary-button" id="traceNext">${idx >= steps.length - 1 ? '↻ Boshidan' : 'Keyingi qadam →'}</button>
          <button type="button" class="ghost-button" id="tracePlay">${playing ? '⏸ Pauza' : '▶ O‘ynatish'}</button>
        </div>
      </div>
      <div class="trace-line-active"><span>${current.line}-qator:</span> <code>${highlightJavaScript(current.code)}</code></div>
      <p class="tip">${e(current.action)}</p>
      <div class="sim-split">
        <div class="sim-card">
          <span class="small-label">O‘ZGARUVCHILAR HOLATI</span>
          ${entries.length ? `<ul class="var-watch">${entries.map(([k, v]) => `<li><code>${e(k)}</code> = <strong>${e(JSON.stringify(v))}</strong></li>`).join('')}</ul>` : '<p class="muted">Hozircha o‘zgaruvchi yo‘q.</p>'}
        </div>
        <div class="sim-card">
          <span class="small-label">KONSOL CHIQISHI</span>
          <pre class="console">${e(current.logs.join('\n') || '(bo‘sh)')}</pre>
        </div>
      </div>
    </div>`;

    container.querySelector('#tracePrev').onclick = () => { stop(); if (idx > 0) idx--; draw(); };
    container.querySelector('#traceNext').onclick = () => { stop(); idx = idx >= steps.length - 1 ? 0 : idx + 1; draw(); };
    container.querySelector('#tracePlay').onclick = () => {
      if (playing) { stop(); draw(); return; }
      if (idx >= steps.length - 1) idx = 0;
      playing = true; draw();
      timer = setInterval(() => {
        if (idx >= steps.length - 1) { stop(); draw(); return; }
        idx++; draw();
      }, 950);
    };
  };
  draw();
}
