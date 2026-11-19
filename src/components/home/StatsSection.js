const PLATFORM_STATS = [
  { value: '12 hafta', label: 'o‘quv dasturi' },
  { value: '48 ta', label: 'asosiy dars' },
  { value: '3 ta', label: 'asosiy amaliy loyiha' },
  { value: '100%', label: 'o‘zbek tilidagi ta’lim' }
];

export function renderStatsSection() {
  return `
    <section class="home-stats" aria-label="Platforma statistikasi">
      <div class="home-stats-grid">
        ${PLATFORM_STATS.map(
          item => `
          <div class="home-stat-card">
            <strong class="tabular-nums">${item.value}</strong>
            <span>${item.label}</span>
          </div>
        `
        ).join('')}
      </div>
    </section>
  `;
}
