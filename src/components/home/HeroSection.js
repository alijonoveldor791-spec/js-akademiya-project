import { highlightJavaScript } from '../lessonText.js';

const HERO_SNIPPET = `const student = {
  course: "JavaScript",
  level: "Beginner",
  lessons: 48
};

console.log("Dasturlashni boshladik!");`;

export function renderHeroSection() {
  const lines = HERO_SNIPPET.split('\n');
  const highlightedLines = lines
    .map(
      (line, index) => `<div class="hero-code-line ${index === 6 ? 'is-highlighted' : ''}">
        <span class="hero-line-num">${index + 1}</span>
        <span class="hero-line-code">${line ? highlightJavaScript(line) : '&nbsp;'}</span>
      </div>`
    )
    .join('');

  return `
    <section class="home-hero">
      <div class="home-hero-grid">
        <div class="home-hero-copy">
          <div class="home-kicker">JavaScript Akademiya · Mustaqil ta’lim platformasi</div>
          <h1>JavaScript dasturlashni noldan o‘rganing!</h1>
          <p class="home-hero-lead">
            48 ta tizimli dars, interaktiv kod laboratoriyasi, algoritmik masalalar va haqiqiy veb-loyihalar yordamida dasturlashni mustaqil o‘rganing.
          </p>
          <div class="home-hero-actions">
            <a href="/learn/setup-01" data-route="/learn/setup-01" class="primary-button hero-cta-primary">O‘rganishni boshlash →</a>
            <a href="/courses" data-route="/courses" class="ghost-button hero-cta-secondary">O‘quv dasturini ko‘rish</a>
          </div>
          <div class="home-hero-notes">
            <span>0-moduldan boshlanadi</span>
            <span aria-hidden="true">·</span>
            <span>Brauzerda kod laboratoriyasi</span>
            <span aria-hidden="true">·</span>
            <span>45 ta algoritmik masala</span>
          </div>
        </div>

        <div class="home-hero-visual" aria-label="JavaScript kod muharriri namunasi">
          <div class="hero-vscode-window">
            <div class="hero-vscode-titlebar">
              <div class="hero-window-dots" aria-hidden="true">
                <span></span><span></span><span></span>
              </div>
              <span class="hero-window-tab">script.js</span>
              <span class="hero-window-lang">JavaScript</span>
            </div>
            <div class="hero-vscode-body">
              ${highlightedLines}
            </div>
            <div class="hero-vscode-terminal">
              <div class="hero-terminal-label">Konsol natijasi</div>
              <div class="hero-terminal-output" id="heroLiveOutput">&gt; Dasturlashni boshladik!</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
}
