# JavaScript Akademiya

O‘zbekcha mustaqil ta’lim platformasi: **6 tayyorgarlik darsi + 48 asosiy dars**, 45 algoritmik masala va 270 mini-test savoli. Vite va oddiy JavaScript bilan yozilgan.

## VS Code’da ishga tushirish

1. [Node.js LTS](https://nodejs.org/en/download/) va [VS Code](https://code.visualstudio.com/docs/setup/windows) o‘rnating.
2. File → Open Folder bilan loyiha papkasini oching.
3. Terminal → New Terminal oching, `node -v` va `npm -v` bilan tekshiring.

```bash
npm install
npm run dev
```

Manzil: **http://127.0.0.1:54149/**. Bu loyiha uchun alohida port tanlandi. `--strictPort` port band bo‘lsa boshqa portga yashirin o‘tishga yo‘l qo‘ymaydi. Zarur bo‘lsa `npm run dev -- --port 54150` ishlating.

PowerShell `npm.ps1` ni bloklasa `npm.cmd install`, `npm.cmd run dev` ishlating yoki Command Prompt terminalini tanlang. Platformaning 0-moduli o‘rnatishlarni bosqichma-bosqich tushuntiradi. Brauzer o‘rnatishni o‘zi aniqlay olmaydi: o‘quvchi haqiqiy terminal natijalarini kiritib tasdiqlaydi.

## O‘rganish oqimi

- Har dars: hayotiy vaziyat, maqsadlar, nazariya, qatorlar izohi, natijali misol, kod laboratoriyasi, uch darajali amaliyot, xatolar laboratoriyasi va 5 savol.
- Masalalar: formula, kirish sohasi, bosqichli yordam, mustaqil kod va avtomatik sinovlar. Yechim birinchi tekshirish urinishidan keyin ochiladi.
- Yakunlash: uch amaliy vazifani tasdiqlash, testdan kamida 4/5 olish, biriktirilgan masalalarni yechish. Amaliy veb-vazifalar o‘zini tekshirish orqali tasdiqlanadi, to‘liq veb-loyiha avtomatik baholanmaydi.
- 0.3-darsda Node.js/npm tasdiqlanmasdan keyingi darslarni tugatilgan deb belgilab bo‘lmaydi; darslarni ko‘rish ochiq.
- Qaydlar, kod/masala qoralamalari, urinishlar, test tarixi, mavzu rivoji, oxirgi dars, bo‘lim va sahifa joyi saqlanadi. Kun/tun rejimi, qidiruv, oldingi/keyingi navigatsiya va mobil ko‘rinish mavjud.

Progress localStorage’da saqlanadi. Eski v1 format o‘qiladi; eksport/import zaxira nusxa yaratadi. Xotira **protokol+host+port** bo‘yicha ajratiladi: localhost va 127.0.0.1 yoki boshqa port bir xil xotira emas. Manzilni almashtirishdan avval eksport qiling. Hozir akkaunt va qurilmalararo sinxronlash mavjud emas.

## Kod laboratoriyasi

Kod faqat tugma bosilganda ishga tushadi. Muharrir sintaksisni ranglaydi; nusxalash, tiklash va to‘xtatish bor.

Kod asosiy sahifada bajarilmaydi: `sandbox="allow-scripts"` iframe ichidagi alohida Worker’da ishlaydi. Oddiy kod uchun **15 soniya**, masala tekshiruvi uchun **2,5 soniya** chegara bor. Cheksiz sikl ham ishchi muhit olib tashlanganda tugaydi. Konsol va chiziladigan DOM hajmi cheklangan.

O‘quv DOM adapteri oddiy elementlar, textContent, asosiy style/classList, sodda querySelector, append/remove, click/input/change/submit va delegatsiyani qo‘llaydi. Natija ruxsat etilgan teg/atributlardan chiziladi. To‘liq CSS selektorlari, layout APIlari, murakkab HTML va ES modul importlari qo‘llanmaydi. alert/prompt/confirm soddalashtirilgan. Haqiqiy brauzer tajribalarini 0-moduldagi uch faylli loyihada bajaring.

Tarmoq faqat `https://jsonplaceholder.typicode.com` o‘quv API’iga ochiq; boshqa manzillar va asosiy ilova origin’i CSP orqali bloklanadi. localStorage adapteri darsga ajratilgan. Bu mahalliy ta’lim muhiti, serverda ishonchsiz kodni bajaruvchi ishlab chiqarish judge tizimi emas.

## Yakuniy loyiha

**http://127.0.0.1:54149/projects/mini-test/index.html** — ishlaydigan mustaqil mini-test. Savollar banki, saqlanadigan javoblar, oldingi/keyingi, Fisher–Yates aralashtirish, muddat bo‘yicha taymer, bir martalik yakunlash va izohli natijalar bor.

Manba: `public/projects/mini-test/`. Ma’lumotlar, hisoblash va interfeys alohida fayllarda. O‘quvchi avval o‘zi ishlab, keyin namuna bilan solishtiradi.

## Tekshiruv va build

```bash
npm run test:unit
npm test
npm run build
npm run preview
```

Playwright mahalliy Chrome mavjud bo‘lsa undan foydalanadi. Boshqa kompyuterda bir marta `npx playwright install chromium` bajaring. Testlar alohida brauzer profilida ishlaydi. `npm run build` → `dist/`. Statik hosting: build command `npm run build`, publish directory `dist`. GitHubga avtomatik push yoki deploy bajarilmaydi.

## Tuzilma

```text
src/
  main.js                  navigatsiya va ulash
  components/              LessonViewer, CodeEditor, Quiz, ExerciseCard,
                           ProgressTracker, codeRunner, video
  data/
    lessons.json           saqlangan 48 dars, video sozlamalari
    weeks.json             hafta va barqaror IDlar
    curriculum.js          umumiy standart va birlashtirish
    lessons/               setup, profiles, guides, annotations
    quizzes/knowledge.js   mavzuga xos savollar
    exercises/exercises.json 45 masala va testlar
  services/                progress, checker, worker runtime
  lib/                     navigatsiya va storage adapteri
  styles/main.css
public/projects/mini-test/  mustaqil yakuniy loyiha
tests/                     unit va brauzer sinovlari
docs/                      kontent standarti, manbalar, video
```

[Kontent standarti](docs/CONTENT_STANDARD.md), [manbalar va talqinlar](docs/SOURCES.md), [video qo‘shish](docs/VIDEO_QOSHISH.md), [keyingi ishlar](docs/ROADMAP.md).

## Video darslar

Video fayllar hozir mavjud emas. Har bir dars video ulash uchun tayyor; video bo‘lmasa tushuntirish xabari ko‘rsatiladi.
