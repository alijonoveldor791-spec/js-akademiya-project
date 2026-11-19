# Dars ma’lumotlari standarti

UI `src/data/curriculum.js` dan `lessons`, `weeks`, `exercises` oladi. 48 darsning IDlari va bazaviy mazmuni `lessons.json` ichida qolgan. Yangilangan ma’lumot qatlami UI komponentlaridan tashqarida saqlanadi.

Birlashtirilgan dars maydonlari:

```js
{
  schemaVersion: 2,
  id: 'lesson-01', number: 1, week: 1,
  title: '...', durationMinutes: 90,
  intro: 'Hayotiy vaziyat', objectives: ['...'],
  concept: '...', explain: '...', principle: '...',
  guide: ['Sarlavha', 'Nazariya', 'Algoritm izohi', 'Kod', 'Natija'],
  code: 'console.log("Salom");',
  lineExplanations: [{line:1, code:'...', explanation:'...'}],
  practices: [{level:'Oson',task:'...'}, {level:'O‘rta',task:'...'}, {level:'Murakkab',task:'...'}],
  bug: {code:'...', hint:'...'},
  quiz: [{id:'q1',type:'Sintaksis',question:'...',options:['A','B','C'],answer:0,explanation:'...'}],
  exerciseIds: ['Begin1'], homework: ['Begin1'],
  webUse: 'Haqiqiy vebdagi qo‘llanish',
  video: {title:'',type:'file',src:'',poster:'',duration:null,subtitles:[],transcript:''}
}
```

`profiles.js` vaziyat, qoida, natija, xato va amaliyotni; `guides.js` kengroq nazariyani; `annotations.js` namuna qatorlari izohini; `quizzes/knowledge.js` mavzuga xos savollarni saqlaydi. Qo‘shimcha dars shu ma’lumotlar va `weeks.json` mundarijasiga qo‘shiladi. LessonViewer, Quiz yoki ExerciseCard ichiga yangi dars uchun maxsus kod yozilmaydi. IDni keyin o‘zgartirmang: progress unga bog‘langan.

Masala: `id`, `lessonId`, `statement`, `inputs`, `formula`, `starter`, `solution`, `tests`, `steps`. Har testda `args` va mustaqil hisoblangan `expected` bo‘ladi. `solve` natijani return orqali qaytaradi. `inputs` nom, butunlik va chegaralarni belgilaydi. `exercises.json` ga yangi masala qo‘shish komponentlarni o‘zgartirishni talab qilmaydi.

`scripts/create-exercises.mjs` hozirgi 45 masala bankini qayta yaratadi. Qo‘lda qo‘shilgan kontent bo‘lsa bu skriptni o‘ylamasdan qayta bajarmang: yangi masalalarni avval generatorga ham kiriting.

## Xizmatlar chegarasi

- `lib/storage.js`: mahalliy saqlash, import normalizatsiyasi va eksport.
- `services/progressService.js`: boshlash, tugatish talablari va o‘zlashtirish.
- `services/exerciseChecker.js`: natija va kirish sohasi tekshiruvlari.
- `components/codeRunner.js`: bajarish transporti, to‘xtatish va xavfsiz DOM chizish.
- `services/workerRuntime.js`: faqat Worker’da ishlaydigan muhit.

Backend qo‘shishda storage adapteri asinxron APIga almashtiriladi va UI saqlash chaqiruvlari await/navbat bilan moslashtiriladi. Hozir server, akkaunt va baza yaratilmagan. Client progress mustaqil o‘qish uchun, buzib bo‘lmaydigan attestatsiya tizimi emas.
