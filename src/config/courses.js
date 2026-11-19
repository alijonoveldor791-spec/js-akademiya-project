import jsCourseCover from '../assets/images/course_js_cover_1795082510350.jpg';

// Yangi kurslar qo‘shish uchun shu massivga yangi obyekt kiriting.
// Hozircha faqat to‘liq tayyor bo‘lgan JavaScript kursi ko‘rsatiladi.
export const courses = [
  {
    id: 'javascript-akademiya',
    title: 'JavaScript dasturlashni noldan o‘rganish',
    subtitle: '0-modul + 12 haftalik tizimli o‘quv dasturi',
    level: 'Boshlang‘ich daraja',
    weeksCount: 12,
    lessonsCount: 48,
    setupLessonsCount: 6,
    exercisesCount: 45,
    projectsCount: 3,
    estimatedDuration: '12 hafta · haftasiga 4–6 soat',
    language: 'O‘zbek tili',
    coverImage: jsCourseCover,
    coverAlt: 'JavaScript dasturlash kursi muqova tasviri',
    status: 'active',
    route: '/learn/setup-01',
    description:
      'Dasturlash muhitini o‘rnatishdan boshlab o‘zgaruvchilar, algoritmik masalalar, DOM boshqaruvi, ES6+, asinxron JavaScript va 3 ta amaliy loyihagacha bo‘lgan to‘liq o‘quv kursi.',
    outcomes: [
      'VS Code, Node.js va Chrome DevTools bilan ishlash',
      '45 ta algoritmik masalani JavaScriptda yechish',
      'Interaktiv DOM sahifalar va localStorage ilovalar yaratish',
      'ES6+, API, JSON va yakuniy test ilovasini qurish'
    ]
  }
];
