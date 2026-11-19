import { renderHeroSection } from '../components/home/HeroSection.js';
import { renderStatsSection } from '../components/home/StatsSection.js';
import { renderFeaturesSection, bindHomeInteractiveSections } from '../components/home/FeaturesSection.js';
import { renderFooter } from '../components/layout/Footer.js';

export function renderHomePage(container, { state, persist }) {
  container.innerHTML = `
    <main class="site-main home-page">
      ${renderHeroSection()}
      ${renderStatsSection()}
      ${renderFeaturesSection(state)}
    </main>
    ${renderFooter()}
  `;

  bindHomeInteractiveSections(container, { state, persist });
}
