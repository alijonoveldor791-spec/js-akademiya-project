import { renderFooter } from '../components/layout/Footer.js';

const ROADMAP_ITEMS = [
  {
    title: 'Video darslar',
    desc: 'Har bir mavzu uchun o‘zbek tilidagi qisqa amaliy video tushuntirishlar va subtitrlar.'
  },
  {
    title: 'Yangi dasturlash kurslari',
    desc: 'Frontend chuqurlashtirilgan moduli, TypeScript, Node.js backend va ma’lumotlar bazalari.'
  },
  {
    title: 'Shaxsiy kabinet',
    desc: 'Qurilmalar o‘rtasida o‘zlashtirish natijalari va yechilgan kodlarni sinxronlashtirish.'
  },
  {
    title: 'Sertifikatlash tizimi',
    desc: 'Yakuniy loyiha va nazorat imtihonlari asosida verifikatsiya qilinadigan bitiruv hujjati.'
  },
  {
    title: 'Kengaytirilgan masalalar banki',
    desc: 'Qo‘shimcha algoritmik masalalar, murakkablik tahlili va bosqichli sinov to‘plamlari.'
  }
];

export function renderAboutPage(container) {
  container.innerHTML = `
    <main class="site-main page-container">
      <header class="page-header">
        <div class="home-kicker">Platforma haqida</div>
        <h1>JavaScript Akademiya haqida</h1>
        <div class="about-lead-copy">
          <p>JavaScript Akademiya — dasturlashni mutlaqo boshlang‘ich darajadan mustaqil o‘rganishni istaganlar uchun ishlab chiqilayotgan interaktiv ta’lim loyihasi.</p>
          <p>Platformaning maqsadi dasturlash nazariyasini sodda tushuntirish, algoritmik fikrlashni rivojlantirish va olingan bilimlarni haqiqiy veb-loyihalarda qo‘llashga yordam berishdir.</p>
          <p>Kurs o‘zbek tilida tashkil etilgan bo‘lib, nazariy darslar, amaliy misollar, algoritmik masalalar, interaktiv kod laboratoriyasi va loyihaviy topshiriqlarni o‘z ichiga oladi.</p>
          <p><strong>Loyiha tuzuvchisi:</strong> <a href="/author" data-route="/author" class="source-link">Eldor Alijonov</a></p>
        </div>
      </header>

      <div class="about-grid">
        <section class="about-card">
          <h2>Loyihaning maqsadi</h2>
          <p>O‘zbek tilida sifatli, tartibli va amaliyotga yo‘naltirilgan JavaScript o‘quv muhitini yaratish. Har bir o‘quvchi nazariyani o‘qib qolmasdan, uni darhol kodda sinab ko‘rishi va mantiqiy fikrlashini bosqichma-bosqich kuchaytirishi kerak.</p>
        </section>

        <section class="about-card">
          <h2>Kimlar uchun mo‘ljallangan?</h2>
          <ul>
            <li>Dasturlashni mutlaqo noldan boshlayotgan o‘quvchilar va talabalar uchun.</li>
            <li>Mustaqil ravishda aniq reja asosida frontend asoslarini o‘rganishni istaganlar uchun.</li>
            <li>Algoritmik masalalar yechish va DOM amaliyotini bir joyda mustahkamlamoqchi bo‘lganlar uchun.</li>
          </ul>
        </section>

        <section class="about-card">
          <h2>Ta’lim metodikasi</h2>
          <p>Har bir mavzu to‘rt asosiy qismga tayanadi: tushunarli nazariya va hayotiy o‘xshatishlar, vizual diagramma va simulyatorlar, brauzerdagi kod laboratoriyasi hamda mustaqil test va amaliy masalalar.</p>
        </section>

        <section class="about-card">
          <h2>12 haftalik dastur</h2>
          <p>O‘qish 0-modul (VS Code, Node.js, Chrome DevTools va birinchi loyiha) bilan boshlanib, 12 hafta davomida 48 ta asosiy dars, 45 ta algoritmik masala va 3 ta yakuniy amaliy loyihani qamrab oladi.</p>
          <a href="/courses" data-route="/courses" class="week-open-link">To‘liq dasturni ko‘rish →</a>
        </section>

        <section class="about-card about-card-wide">
          <h2>Interaktiv o‘rganish usuli</h2>
          <p>Brauzerdagi kod laboratoriyasi alohida Web Worker muhitida ishlaydi: o‘quvchi xavfsiz tarzda kod yozadi, natijani darhol konsolda va DOM maydonida ko‘radi, qadam-baqadam bajarilish treyseri orqali o‘zgaruvchilar qiymatini kuzatadi hamda xatolarni tuzatish mashqlarini bajaradi.</p>
        </section>
      </div>

      <section class="about-roadmap-section">
        <div class="home-section-head">
          <h2>Kelajakdagi rivojlanish rejalari</h2>
          <p>Quyidagi yo‘nalishlar platformaning navbatdagi bosqichlari uchun rejalashtirilgan va hozircha ishlab chiqish rejasida turibdi.</p>
        </div>
        <div class="roadmap-grid">
          ${ROADMAP_ITEMS.map(
            item => `
            <article class="roadmap-card">
              <div class="roadmap-card-head">
                <h3>${item.title}</h3>
                <span class="ui-badge ui-badge-planned">Rejalashtirilgan</span>
              </div>
              <p>${item.desc}</p>
            </article>
          `
          ).join('')}
        </div>
      </section>
    </main>
    ${renderFooter()}
  `;
}
