export const EDITORIAL_IMAGES = {
  workspace: {
    src: '/images/setup/workspace.jpg',
    alt: 'Dasturchi ish stoli: kod muharriri, brauzer oynasi va o‘quv daftari birgalikda ko‘rsatilgan illyustratsiya',
    caption: 'Amaliy ish muhiti: kod muharriri, brauzer natijasi va qaydlar daftari bir tizim sifatida ishlaydi.'
  },
  vscode: {
    src: '/images/setup/vscode-workbench.jpg',
    alt: 'VS Code ishchi oynasining to‘rt asosiy qismi: Explorer fayl daraxti, kod muharriri, terminal va kengaytmalar paneli',
    caption: 'Tasviriy sxema: VS Code oynasining 4 asosiy hududi — Explorer, Muharrir, Terminal va Extensions.'
  },
  vscodeLogo: {
    src: '/images/setup/vscode-logo.jpg',
    alt: 'Visual Studio Code dasturining rasmiy ko‘k lentali logotipi',
    caption: 'Visual Studio Code (VS Code) logotipi — ish stolida va Start menyusida shu belgi orqali dastur ishga tushiriladi.'
  },
  vscodeOpened: {
    src: '/assets/aistudio/image_2a71b5a0.png',
    alt: 'Haqiqiy VS Code oynasi: chap Explorer panelida javascript-darslari papkasida app.js va index.html fayllari, markazda app.js kodi, pastda esa PowerShell terminali ochilgan',
    caption: 'Haqiqiy VS Code ko‘rinishi: chap Explorer panelida javascript-darslari papkasi (app.js va index.html), markazda JavaScript kodi, pastda PowerShell terminali va Windows vazifalar panelida VS Code belgisi.'
  },
  nodejs: {
    src: '/images/setup/nodejs-runtime.jpg',
    alt: 'Brauzer muhiti va Node.js terminal muhitini taqqoslovchi arxitektura diagrammasi',
    caption: 'Brauzer sahifa elementlarini boshqaradi; Node.js esa JavaScriptni terminal va fayllar bilan ishlatadi.'
  },
  devtools: {
    src: '/images/setup/devtools-inspector.jpg',
    alt: 'Brauzer Developer Tools paneli: Elements HTML daraxti, Console natijalari va Sources tekshiruv bo‘limi',
    caption: 'Developer Tools uch asosiy bo‘limdan iborat: Elements (tuzilish), Console (natija/xato), Sources (fayllar).'
  },
  api: {
    src: '/images/setup/api-client-server.jpg',
    alt: 'Brauzer mijoz va bulutli server orasida JSON ma’lumot almashinuvi va asinxron HTTP so‘rov-javob sxemasi',
    caption: 'Brauzer HTTP so‘rov yuboradi, server esa JSON formatidagi javobni asinxron tarzda qaytaradi.'
  }
};

// Every lesson gets a tailored analogy, glossary, diagram type, optional simulator, and visual caption.
export const LESSON_VISUALS = {
  'setup-01': {
    editorial: 'workspace',
    diagram: 'setup-readiness',
    analogy: 'Oshpaz ishni eng qimmat pechdan emas, toza stol, retsept daftari va aniq rejadagi masalliqlardan boshlaydi. Dasturchi ham avval ish joyi, vaqt rejasi va kichik maqsaddan boshlaydi.',
    glossary: [
      ['Brauzer', 'Veb-sahifalar va o‘quv platformalarini ochuvchi asosiy dastur (masalan, Chrome).'],
      ['Kod muharriri', 'Dastur matnini tartibli yozish va saqlash uchun maxsus matn dasturi.'],
      ['Mantiqiy fikrlash', 'Katta muammoni kichik, ketma-ket bajariladigan qadamlarga ajratish ko‘nikmasi.']
    ],
    alt: 'Dasturchi ish stoli illyustratsiyasi va o‘qish rejasining uch ustuni'
  },
  'setup-02': {
    editorialPair: ['vscodeLogo', 'vscodeOpened'],
    diagram: 'vscode-workbench',
    simulator: 'vscode-explorer',
    analogy: 'VS Code duradgor ustaxonasiga o‘xshaydi: chapda materiallar javoni (Explorer), o‘rtada ish stoli (Muharrir), pastda sinov dastgohi (Terminal), o‘ngda esa qo‘shimcha asboblar (Extensions) turadi.',
    glossary: [
      ['Explorer', 'Loyiha papkasi va ichidagi fayllarni daraxt shaklida ko‘rsatuvchi chap panel.'],
      ['PATH', 'Terminalga dastur nomini yozganda tizim uni qaysi papkadan topishini belgilovchi yo‘l.'],
      ['Workspace Trust', 'Faqat o‘zingiz yaratgan yoki ishongan papkalardagi skriptlarga ruxsat berish himoyasi.']
    ],
    alt: 'VS Code interfeysi va Windows o‘rnatish ketma-ketligi diagrammasi'
  },
  'setup-03': {
    editorial: 'nodejs',
    diagram: 'nodejs-compare',
    analogy: 'Avtomobil dvigateli faqat bitta korpusda emas, har xil transportda ishlashi mumkin. JavaScript dvigateli ham brauzerda sahifani, Node.js ichida esa kompyuter terminali va serverni boshqaradi.',
    glossary: [
      ['Node.js', 'JavaScript kodini brauzersiz, to‘g‘ridan-to‘g‘ri kompyuterda bajaradigan muhit.'],
      ['npm', 'Tayyor JavaScript kutubxonalari va loyiha paketlarini o‘rnatuvchi boshqaruvchi.'],
      ['LTS', 'Long-Term Support — barqaror, uzoq muddat qo‘llab-quvvatlanadigan tavsiya etilgan versiya.']
    ],
    alt: 'Brauzer va Node.js bajarish muhitlari taqqoslama diagrammasi'
  },
  'setup-04': {
    editorial: 'devtools',
    diagram: 'devtools-panels',
    simulator: 'devtools-explorer',
    analogy: 'Mashina kapotini ochib dvigatel ishini tekshirgandek, F12 tugmasi veb-sahifaning ichki tuzilishini (Elements), xabar va xatolarini (Console) hamda kod fayllarini (Sources) ko‘rsatadi.',
    glossary: [
      ['Console', 'JavaScript buyruqlarini sinash va xato xabarlarini ko‘rish oynasi.'],
      ['Elements', 'Brauzer sahifada chizayotgan jonli HTML elementlari daraxti.'],
      ['ReferenceError', 'Hali e’lon qilinmagan o‘zgaruvchi nomi ishlatilganda chiqadigan xato turi.']
    ],
    alt: 'Chrome Developer Tools panelining asosiy bo‘limlari diagrammasi'
  },
  'setup-05': {
    editorial: 'vscode',
    diagram: 'extensions-map',
    analogy: 'Smartfon o‘zi qo‘ng‘iroq va xabar uchun yetarli, ilovalar esa qulaylik qo‘shadi. VS Code ham kengaytmalarsiz ishlaydi, Prettier va ESLint esa kodni tartibli saqlashga yordam beradi.',
    glossary: [
      ['Prettier', 'Kodni yagona uslubda bo‘shliq va qatorlar bo‘yicha avtomatik tekislovchi formatter.'],
      ['ESLint', 'Kod ichidagi shubhali joylar va qoida buzilishlarini topuvchi tahlilchi (linter).'],
      ['Live Server / Vite', 'HTML, CSS va JS fayllarini lokal manzilda brauzerda ko‘rsatuvchi ishlab chiqish serveri.']
    ],
    alt: 'VS Code kengaytmalari vazifalari taqsimoti diagrammasi'
  },
  'setup-06': {
    editorial: 'workspace',
    diagram: 'first-project-tree',
    simulator: 'project-files',
    analogy: 'Uy qurishda devor (HTML), bo‘yoq va bezak (CSS) hamda elektr tizimi (JavaScript) uch alohida chizmada, lekin bitta loyiha papkasida saqlanadi.',
    glossary: [
      ['index.html', 'Sahifa skeleti: sarlavha, matn va bog‘langan CSS/JS fayllari manzili.'],
      ['style.css', 'Sahifa ranglari, shriftlari va joylashuvini belgilovchi uslub fayli.'],
      ['defer', 'HTML daraxti to‘liq o‘qilgandan keyin JavaScript faylini ishga tushirish atributi.']
    ],
    alt: 'birinchi-loyiha papkasining index.html, style.css va script.js bog‘lanish diagrammasi'
  },
  'lesson-01': {
    diagram: 'web-trio',
    simulator: 'step-tracer',
    analogy: 'Teatr sahnasida dekoratsiya (HTML), chiroq va liboslar (CSS), aktyorlarning harakati (JavaScript) birgalikda jonli tomosha yaratadi.',
    glossary: [
      ['console.log()', 'Qiymat yoki matnni dasturchi konsoliga chiqaruvchi asosiy buyruq.'],
      ['Izoh (Comment)', '// bilan boshlanadigan, kompyuter bajarmaydigan, faqat inson o‘qiydigan qayd.'],
      ['Ketma-ketlik', 'Ko‘rsatmalarning yuqoridan pastga qatorma-qator bajarilish tartibi.']
    ],
    alt: 'HTML, CSS, JavaScript hamkorligi va console.log sintaksisi sxemasi'
  },
  'lesson-02': {
    diagram: 'io-dialog',
    simulator: 'step-tracer',
    analogy: 'Bankomat avval ekranda savol chiqaradi (prompt), siz kiritgan qiymatni qabul qiladi va keyin javob xabarini ko‘rsatadi (alert / console.log).',
    glossary: [
      ['prompt()', 'Foydalanuvchidan matn kiritishni so‘raydigan brauzer oynasi; Cancel bosilsa null qaytaradi.'],
      ['alert()', 'Ekranda qisqa ogohlantirish yoki xabar oynasini ko‘rsatuvchi funksiya.'],
      ['Konkatenatsiya', 'Ikki matnni + belgisi orqali bitta satrga ulash amali.']
    ],
    alt: 'Kirish (prompt) va chiqish (console.log, alert) ma’lumot oqimi diagrammasi'
  },
  'lesson-03': {
    diagram: 'variable-box',
    simulator: 'variable-box',
    analogy: 'O‘zgaruvchi — ustiga yorliq yopishtirilgan saqlash qutisi. let qutining ichidagi narsani almashtirishga ruxsat beradi, const esa qutini muhrlab qo‘yadi.',
    glossary: [
      ['let', 'Qiymatini keyinchalik qayta tayinlash mumkin bo‘lgan o‘zgaruvchi kalit so‘zi.'],
      ['const', 'Bir marta qiymat berilgach qayta tayinlab bo‘lmaydigan o‘zgarmas bog‘lanish.'],
      ['= (tayinlash)', 'O‘ng tomondagi hisoblangan qiymatni chap tomondagi nomga saqlash operatori.']
    ],
    alt: 'let yosh = 16 o‘zgaruvchi qutisi va let/const taqqoslash diagrammasi'
  },
  'lesson-04': {
    diagram: 'data-types',
    analogy: 'Do‘kon chekida mahsulot nomi matn (String), narxi son (Number), to‘lov qilindimi degan belgi mantiqiy qiymat (Boolean), chegirma yo‘qligi esa bo‘sh (null) bo‘ladi.',
    glossary: [
      ['String / Number / Boolean', 'Asosiy uch tur: qo‘shtirnoqdagi matn, arifmetik son va true/false mantiq.'],
      ['null vs undefined', 'null — ataylab berilgan bo‘sh qiymat; undefined — qiymat hali tayinlanmagan holat.'],
      ['typeof', 'Qiymatning ma’lumot turini matn ko‘rinishida qaytaruvchi operator.']
    ],
    alt: 'JavaScript ma’lumot turlari kartochkalari va typeof natijalari diagrammasi'
  },
  'lesson-05': {
    diagram: 'arithmetic-ops',
    simulator: 'arithmetic-explorer',
    analogy: 'Kassir chek hisoblaganda avval ko‘paytirish (narx × soni), keyin qo‘shishni bajaradi; qoldiq (%) esa 10 ta olmani 4 kishiga bo‘lganda ortib qolgan 2 ta olmani beradi.',
    glossary: [
      ['% (Modulo)', 'Butun bo‘lishdan keyin qoladigan qoldiqni hisoblaydigan operator.'],
      ['** (Daraja)', 'Sonni berilgan darajaga ko‘tarish operatori (masalan, 2 ** 3 === 8).'],
      ['Ustuvorlik', 'Qavslar (), daraja **, ko‘paytirish/bo‘lish (* / %), so‘ng qo‘shish/ayirish (+ -) tartibi.']
    ],
    alt: 'Arifmetik operatorlar (+, -, *, /, %, **) va ustuvorlik sxemasi'
  },
  'lesson-06': {
    diagram: 'type-conversion',
    simulator: 'type-converter',
    analogy: 'Qog‘ozga yozilgan "12" soni ko‘rinishidan raqam bo‘lsa ham, kompyuter uni matn deb biladi. Number("12") esa matnni haqiqiy hisoblanadigan songa aylantiradi.',
    glossary: [
      ['Number(x)', 'Matn yoki boshqa qiymatni songa aylantiruvchi funksiya; xato matnda NaN beradi.'],
      ['NaN', 'Not-a-Number — muvaffaqiyatsiz matematik amal natijasi; Number.isNaN() bilan tekshiriladi.'],
      ['String birikishi', '"12" + 8 ifodasida + belgisi sonni matnga aylantirib "128" hosil qiladi.']
    ],
    alt: 'Matndan songa o‘tkazish va "12" + "8" vs Number("12") + Number("8") diagrammasi'
  },
  'lesson-07': {
    diagram: 'math-geometry',
    simulator: 'circle-math',
    analogy: 'Arxitektor aylana maydon yuzini hisoblashda o‘zgarmas π (Math.PI) va kvadrat ildiz (Math.sqrt) asboblaridan foydalanadi.',
    glossary: [
      ['Math.PI', 'Doira hisoblarida ishlatiladigan ≈ 3.14159265 o‘zgarmas son.'],
      ['Math.sqrt(x)', 'Manfiy bo‘lmagan x sonining kvadrat ildizini qaytaradi.'],
      ['Math.round / floor / ceil', 'Eng yaqinga, pastga va yuqoriga yaxlitlash metodlari.']
    ],
    alt: 'Math kutubxonasi va doira/uchburchak geometrik formulalar diagrammasi'
  },
  'lesson-08': {
    diagram: 'digit-split',
    simulator: 'digit-splitter',
    analogy: '347 so‘m pulni 100 so‘mlik (3 ta), 10 so‘mlik (4 ta) va 1 so‘mlik (7 ta) tangalarga ajratish — sonni xonalarga ajratish bilan aynan bir xil.',
    glossary: [
      ['n % 10', 'Musbat butun sonning eng oxirgi (birliklar) raqamini ajratib oladi.'],
      ['Math.floor(n / 10)', 'Sonning oxirgi raqamini olib tashlab, chap qismini qoldiradi.'],
      ['Xona qiymati', 'Uch xonali sonda yuzlik = Math.floor(n/100), o‘nlik = Math.floor(n/10)%10.']
    ],
    alt: '347 sonini yuzlik, o‘nlik va birlik raqamlariga ajratish blok-sxemasi'
  },
  'lesson-09': {
    diagram: 'logic-gates',
    simulator: 'logic-sandbox',
    analogy: 'Eshik ochilishi uchun ham karta (&&), ham parol to‘g‘ri bo‘lishi kerak; liftga chiqish uchun esa naqd pul YOKI karta (||) kifoya.',
    glossary: [
      ['=== vs ==', '=== ham qiymatni, ham ma’lumot turini qat’iy solishtiradi; == esa yashirin aylantiradi.'],
      ['&& (VA)', 'Ikkala shart ham true bo‘lgandagina natija true bo‘ladi.'],
      ['|| (YOKI) va !', '|| kamida bitta true bo‘lsa true beradi; ! mantiqiy qiymatni teskarisiga o‘giradi.']
    ],
    alt: 'Taqqoslash va &&, ||, ! mantiqiy operatorlari jadval diagrammasi'
  },
  'lesson-10': {
    diagram: 'if-else-flow',
    simulator: 'condition-flow',
    analogy: 'Svetofor chorrahasiga kelganda: yashil bo‘lsa yurasiz (if), sariq bo‘lsa tayyorlanasiz (else if), aks holda to‘xtaysiz (else).',
    glossary: [
      ['if (shart)', 'Shart true bo‘lganda bajariladigan asosiy kod bloki.'],
      ['else if', 'Oldingi shartlar false bo‘lganda tekshiriladigan navbatdagi shart tarmog‘i.'],
      ['else', 'Yuqoridagi birorta ham shart bajarilmaganda ishlaydigan yakuniy tarmoq.']
    ],
    alt: 'if / else if / else algoritmik blok-sxemasi va tarmoqlanish diagrammasi'
  },
  'lesson-11': {
    diagram: 'ternary-syntax',
    simulator: 'condition-flow',
    analogy: 'Chipta narxi yorlig‘i: "Talabami? Ha bo‘lsa 5000, yo‘q bo‘lsa 10000" — bitta qisqa savol va ikkita tayyor javob.',
    glossary: [
      ['Ternary (?:)', 'shart ? rostQiymat : yolgonQiymat ko‘rinishidagi qisqa shartli ifoda.'],
      ['Chegara holat', 'Oraliqning boshlanish va tugash nuqtalari (masalan, 0, 60, 100).'],
      ['Ichma-ich shart', 'Bir nechta shart ketma-ket tekshiriladigan murakkab qaror daraxti.']
    ],
    alt: 'Ternary operator sintaksisi va qiymat tanlash sxemasi'
  },
  'lesson-12': {
    diagram: 'switch-routing',
    simulator: 'switch-router',
    analogy: 'Televizor pultidagi 1, 2, 3 tugmalari: har bir raqam o‘ziga mos kanalni (case) ochadi, noto‘g‘ri raqam bosilsa "Kanal topilmadi" (default) chiqadi.',
    glossary: [
      ['switch (qiymat)', 'Bitta qiymatni bir nechta aniq variantlar bilan === orqali solishtiruvchi tuzilma.'],
      ['break', 'Mos kelgan case bajarilgach, keyingi case’larga o‘tib ketishni to‘xtatuvchi kalit so‘z.'],
      ['default', 'Birorta case mos kelmaganda ishlaydigan zaxira bo‘lim.']
    ],
    alt: 'switch / case / break / default yo‘naltirish diagrammasi'
  },
  'lesson-13': {
    diagram: 'for-loop-flow',
    simulator: 'loop-simulator',
    analogy: 'Tasavvur qiling, siz 100 ta o‘quvchiga bir xil xabar yubormoqchisiz. Har biriga alohida kod yozasizmi? Yo‘q! Sikl bitta qoidani avtomatik takrorlaydi.',
    glossary: [
      ['Boshlanish (let i = 1)', 'Sikl hisoblagichining dastlabki qiymatini o‘rnatish (faqat 1 marta ishlaydi).'],
      ['Davom etish sharti', 'Har aylanishdan oldin tekshiriladi; true bo‘lsa tana bajariladi.'],
      ['Qadam (i++)', 'Har aylanish oxirida hisoblagichni yangilab, siklni yakunga yaqinlashtiradi.']
    ],
    alt: 'for siklining boshlanish, shart, tana va qadam siklik blok-sxemasi'
  },
  'lesson-14': {
    diagram: 'accumulator-flow',
    simulator: 'loop-simulator',
    analogy: 'Hamyonga har kuni tanga tashlab borish — yig‘indi (sum = 0 dan boshlanadi); zanjir halqalarini bir-biriga ko‘paytirib ulash esa ko‘paytma (prod = 1 dan boshlanadi).',
    glossary: [
      ['Accumulator (sum)', 'Natijani har qadamda jamlab boruvchi o‘zgaruvchi; yig‘indida 0 dan boshlanadi.'],
      ['Ko‘paytma / Faktorial', '1 dan boshlanadigan ko‘paytirish jamg‘armasi (n! = 1×2×...×n).'],
      ['+= va *=', 'Avvalgi qiymatga qo‘shish yoki ko‘paytirib qayta saqlash qisqa operatorlari.']
    ],
    alt: 'Yig‘indi (sum += i) va faktorial (prod *= i) qadamma-qadam o‘zgarish diagrammasi'
  },
  'lesson-15': {
    diagram: 'while-compare',
    simulator: 'loop-simulator',
    analogy: 'while — avval chiptani tekshirib, keyin avtobusga chiqish; do...while — avtobusga bir marta chiqib, keyin keyingi bekatda davom etish-etmaslikni tekshirish.',
    glossary: [
      ['while', 'Shart boshida tekshiriladigan sikl; shart boshidan false bo‘lsa 0 marta ishlaydi.'],
      ['do...while', 'Tana kamida 1 marta bajarilgandan so‘ng shart tekshiriladigan sikl.'],
      ['Cheksiz sikl', 'Shart hech qachon false bo‘lmaydigan xato holat; laboratoriya uni avtomatik to‘xtatadi.']
    ],
    alt: 'while va do...while blok-sxemalarini taqqoslash diagrammasi'
  },
  'lesson-16': {
    diagram: 'nested-break',
    simulator: 'step-tracer',
    analogy: 'Shaxmat taxtasida har bir qator (tashqi sikl) uchun 8 ta ustun (ichki sikl) tekshiriladi; kerakli figura topilsa qidiruv darhol to‘xtaydi (break).',
    glossary: [
      ['break', 'Joriy siklni muddatidan oldin butunlay to‘xtatib chiqib ketadi.'],
      ['continue', 'Joriy qadamning qolgan qismini tashlab, darhol keyingi aylanishga o‘tadi.'],
      ['Ichma-ich sikl', 'Tashqi siklning har 1 qadamida ichki sikl to‘liq aylanib chiqadigan tuzilma.']
    ],
    alt: 'break, continue va 2D jadval uchun ichma-ich sikl diagrammasi'
  },
  'lesson-17': {
    diagram: 'function-machine',
    simulator: 'function-machine',
    analogy: 'Sharbat chiqargichga meva (argument) solasiz, ichida mexanizm uni qayta ishlaydi va tayyor sharbat (return) chiqadi. Har safar yangi mexanizm yasash shart emas.',
    glossary: [
      ['Parametr', 'Funksiya e’lonida kiruvchi ma’lumot uchun qo‘yilgan o‘rin egallovchi nom.'],
      ['Argument', 'Funksiyani chaqirganda unga uzatiladigan haqiqiy qiymat.'],
      ['return', 'Funksiyadan natijani tashqariga qaytarish va uning bajarilishini yakunlash buyrug‘i.']
    ],
    alt: 'Funksiya mashinasi: kirish argumenti → parametr → ishlov → return natija diagrammasi'
  },
  'lesson-18': {
    diagram: 'scope-arrow',
    simulator: 'function-machine',
    analogy: 'Xona ichidagi daftar (lokal scope) faqat shu xonada ko‘rinadi; koridordagi e’lonlar taxtasi (global scope) esa hamma xonalardan ko‘rinadi.',
    glossary: [
      ['Arrow function (=>)', 'Qisqa yozuvli funksiya shakli; bitta ifodada avtomatik return qiladi.'],
      ['Scope (Ko‘rinish hududi)', 'O‘zgaruvchi nomi qaysi blok {} yoki funksiya ichida mavjudligini belgilaydi.'],
      ['Callback', 'Boshqa funksiyaga argument sifatida beriladigan funksiya.']
    ],
    alt: 'Arrow funksiya sintaksisi va blok/funksiya scope chegaralari diagrammasi'
  },
  'lesson-19': {
    diagram: 'array-cells',
    simulator: 'array-simulator',
    analogy: 'Poyezd vagonlari tartib bilan 0, 1, 2 raqamlangan: istalgan vagonga indeks orqali murojaat qilasiz, oxiriga yangi vagon ulaysiz (push) yoki uzasiz (pop).',
    glossary: [
      ['Indeks (0 dan)', 'Massivdagi elementning tartib raqami; birinchi element doim [0] da turadi.'],
      ['.length', 'Massivdagi jami elementlar sonini ko‘rsatuvchi xususiyat.'],
      ['push() / pop()', 'Massiv oxiriga element qo‘shish va oxirgi elementni olib tashlash metodlari.']
    ],
    alt: 'Indekslangan massiv katakchalari [0..n-1] va push/pop harakati diagrammasi'
  },
  'lesson-20': {
    diagram: 'array-loop',
    simulator: 'array-simulator',
    analogy: 'Sinf jurnalidagi barcha baholarni boshidan oxirigacha o‘qib, jami ballni topish va eng yuqori bahoni aniqlash.',
    glossary: [
      ['for...of', 'Massivning har bir qiymatini indeks yozmasdan ketma-ket olish sikli.'],
      ['O‘rtacha qiymat', 'Elementlar yig‘indisini .length ga bo‘lish; bo‘sh massivda 0 ga bo‘lishdan saqlaning.'],
      ['Maksimum / Minimum', 'Birinchi elementni boshlang‘ich nomzod deb olib, qolganlari bilan solishtirish.']
    ],
    alt: 'Massiv elementlari bo‘ylab sikl yurishi va yig‘indi/o‘rtacha hisoblash sxemasi'
  },
  'lesson-21': {
    diagram: 'array-methods',
    simulator: 'array-simulator',
    analogy: 'Konveyer lentasi: map har bir mahsulotni qayta o‘raydi, filter faqat sifatlisini qoldiradi, find birinchi mosini topadi, reduce hammasini bitta qutiga jamlaydi.',
    glossary: [
      ['map()', 'Har bir elementni o‘zgartirib, xuddi shu uzunlikdagi yangi massiv qaytaradi.'],
      ['filter()', 'Shartga mos kelgan elementlardan iborat yangi massiv tuzadi.'],
      ['find() / reduce()', 'find birinchi mos elementni, reduce esa barcha elementlardan bitta yakuniy qiymat beradi.']
    ],
    alt: 'map, filter, find va reduce metodlari konveyer oqimi diagrammasi'
  },
  'lesson-22': {
    diagram: 'string-methods',
    simulator: 'step-tracer',
    analogy: 'Foydalanuvchi ism yozganda boshiga-oxiriga bo‘shliq qo‘shib qo‘ysa, trim() uni qaychidek kesib tozalaydi, split() esa gapni so‘zlarga bo‘ladi.',
    glossary: [
      ['trim()', 'Matnning boshi va oxiridagi ortiqcha bo‘sh joylarni olib tashlaydi.'],
      ['includes() / toLowerCase()', 'Qidirilayotgan matn borligini tekshirish va harflarni bir xil kichik registrga keltirish.'],
      ['split() / join()', 'Matnni belgi bo‘yicha massivga bo‘lish va massivni yana matnga birlashtirish.']
    ],
    alt: 'String metodlari: trim, toLowerCase, includes va split ishlash sxemasi'
  },
  'lesson-23': {
    diagram: 'object-map',
    simulator: 'step-tracer',
    analogy: 'Pasport sahifasi kabi: har bir ma’lumot indeks bilan emas, "ism", "yosh", "ball" kabi aniq kalit nomi bilan saqlanadi.',
    glossary: [
      ['Kalit–qiymat juftligi', 'Obyekt ichidagi xususiyat nomi (key) va uning qiymati (value).'],
      ['Nuqta vs [] murojaat', 'obj.ism aniq nom uchun; obj[kalit] dinamik o‘zgaruvchi nomi uchun.'],
      ['Metod', 'Obyekt ichida xususiyat sifatida saqlanadigan funksiya.']
    ],
    alt: 'Obyekt kalit–qiymat xaritasi va xususiyatlarga murojaat diagrammasi'
  },
  'lesson-24': {
    diagram: 'json-bridge',
    simulator: 'step-tracer',
    analogy: 'Obyektlar massivini pochta orqali jo‘natish uchun avval yassi matnga o‘rash (JSON.stringify), manzilga yetgach yana ochish (JSON.parse) kerak.',
    glossary: [
      ['JSON', 'JavaScript Object Notation — ma’lumotlarni saqlash va tarmoqda uzatish uchun matn formati.'],
      ['JSON.stringify()', 'JavaScript obyekt yoki massivini JSON matniga aylantiradi.'],
      ['JSON.parse()', 'To‘g‘ri JSON matnini qayta JavaScript qiymatiga o‘giradi.']
    ],
    alt: 'JS obyektlar massivi ↔ JSON matni konversiya diagrammasi'
  },
  'lesson-25': {
    diagram: 'first-project-tree',
    simulator: 'project-files',
    analogy: 'HTML sahifaning devorlarini quradi, <link> CSS bezaklarini kiygizadi, <script defer> esa sahifa chizilib bo‘lgach JavaScript mantiqini ishga tushiradi.',
    glossary: [
      ['<link rel="stylesheet">', 'CSS faylini HTML hujjatning <head> qismiga ulaydi.'],
      ['<script src="..." defer>', 'JS faylini yuklaydi va HTML daraxti tayyor bo‘lgach bajaradi.'],
      ['Fayl yo‘li', 'Faylning papka ichidagi aniq manzili; kichik-katta harf ham ahamiyatli.']
    ],
    alt: 'HTML, CSS va JavaScript fayllarini bitta sahifaga ulash sxemasi'
  },
  'lesson-26': {
    diagram: 'dom-tree',
    simulator: 'dom-playground',
    analogy: 'DOM — oila shajarasi yoki daraxtga o‘xshaydi: ildizda document, shoxlarda body, section, ul, barglarda esa h1, li, button elementlari joylashadi.',
    glossary: [
      ['DOM', 'Document Object Model — brauzer HTML hujjatdan yaratadigan jonli obyektlar daraxti.'],
      ['querySelector()', 'CSS selektori (#id, .sinf, teg) bo‘yicha mos birinchi elementni topadi.'],
      ['textContent', 'Element ichidagi matnni xavfsiz o‘qish va o‘zgartirish xususiyati.']
    ],
    alt: 'HTML elementlarining DOM daraxti va querySelector tanlash diagrammasi'
  },
  'lesson-27': {
    diagram: 'event-flow',
    simulator: 'dom-playground',
    analogy: 'Eshik qo‘ng‘irog‘i: siz qo‘ng‘iroqni o‘rnatasiz (addEventListener("click", fn)), kimdir tugmani bosmaguncha funksiya kutib turadi.',
    glossary: [
      ['Hodisa (Event)', 'Foydalanuvchi harakati: click, input, submit, keydown va boshqalar.'],
      ['addEventListener()', 'Elementga hodisa ro‘y berganda bajariladigan funksiyani ulaydi.'],
      ['Funksiya havolasi', 'addEventListener ichida fn() emas, fn (qavssiz) berilishi shart.']
    ],
    alt: 'Hodisalar tinglovchisi (addEventListener) kutish va reaksiya diagrammasi'
  },
  'lesson-28': {
    diagram: 'dom-style',
    simulator: 'dom-playground',
    analogy: 'Kiyim almashtirish kabi: classList bilan tayyor CSS uslub to‘plamini (masalan, .active yoki .dark) bir bosishda yoqib-o‘chirasiz.',
    glossary: [
      ['classList.add / remove / toggle', 'Elementga CSS sinflarini qo‘shish, olish yoki holatini almashtirish.'],
      ['element.style', 'Alohida CSS xususiyatini camelCase nom bilan (backgroundColor) o‘zgartirish.'],
      ['Holat va ko‘rinish', 'Rang bilan birga matn yoki belgi ham o‘zgarishi qulaylik (accessibility) beradi.']
    ],
    alt: 'classList va style yordamida element ko‘rinishini boshqarish diagrammasi'
  },
  'lesson-29': {
    diagram: 'form-validation',
    simulator: 'step-tracer',
    analogy: 'Elchixona hujjat qabuli kabi: forma yuborilishidan oldin (submit) sahifa yangilanishini to‘xtatib (preventDefault), maydon bo‘sh emasligini (.trim()) tekshiramiz.',
    glossary: [
      ['submit hodisasi', 'Forma yuborilganda (tugma bosilganda yoki Enter’da) ishga tushadi.'],
      ['event.preventDefault()', 'Brauzerning sahifani qayta yuklab yuborish odatiy harakatini to‘xtatadi.'],
      ['Validatsiya', 'Kiritilgan ma’lumot bo‘sh, noto‘g‘ri yoki chegaradan tashqari emasligini tekshirish.']
    ],
    alt: 'Forma yuborish, preventDefault va kirish tekshiruvi blok-sxemasi'
  },
  'lesson-30': {
    diagram: 'dom-create',
    simulator: 'dom-playground',
    analogy: 'Yangi blok yasash: avval g‘ishtni quyasiz (createElement), ustiga yozuv yozasiz (textContent), so‘ng devorga o‘rnatasiz (append).',
    glossary: [
      ['document.createElement()', 'Xotirada yangi HTML element tugunini yaratadi (hali sahifada ko‘rinmaydi).'],
      ['append()', 'Yaratilgan elementni ota element ichiga ulab ekranga chiqaradi.'],
      ['remove()', 'Elementni DOM daraxtidan va sahifadan olib tashlaydi.']
    ],
    alt: 'createElement → textContent → append → remove hayot sikli diagrammasi'
  },
  'lesson-31': {
    diagram: 'event-delegation',
    simulator: 'dom-playground',
    analogy: '100 ta xonadonning har biriga alohida qo‘riqchi qo‘yish o‘rniga, bino kirishida bitta navbatchi turadi va kim qaysi xonadondan kelganini (e.target.closest) aniqlaydi.',
    glossary: [
      ['Event Bubbling', 'Ichki elementda sodir bo‘lgan hodisaning ota elementlarga ko‘tarilishi.'],
      ['Delegatsiya', 'Ko‘p bolali ro‘yxat uchun faqat ota elementda bitta tinglovchi o‘rnatish usuli.'],
      ['e.target.closest()', 'Bosilgan joydan yuqoriga qarab eng yaqin mos ajdod elementni topadi.']
    ],
    alt: 'Event delegation: child button click → ota ul tinglovchisi → closest() diagrammasi'
  },
  'lesson-32': {
    diagram: 'localstorage-flow',
    simulator: 'step-tracer',
    analogy: 'Daftar javoni: sahifani yopib qayta ochsangiz ham brauzerning origin bo‘yicha saqlanadigan xotirasidan ma’lumot JSON ko‘rinishida qayta o‘qiladi.',
    glossary: [
      ['localStorage', 'Brauzerda kalit–qiymat ko‘rinishida faqat matn (string) saqlaydigan doimiy xotira.'],
      ['setItem / getItem', 'Ma’lumot yozish va o‘qish metodlari; topilmasa null qaytaradi.'],
      ['try / catch bilan parse', 'Buzilgan JSON matni dasturni to‘xtatib qo‘ymasligi uchun xavfsiz o‘qish usuli.']
    ],
    alt: 'JS State → JSON.stringify → localStorage → JSON.parse tiklash diagrammasi'
  },
  'lesson-33': {
    diagram: 'spread-destruct',
    simulator: 'step-tracer',
    analogy: 'Chamadan ochish (destructuring) — kerakli narsalarni nomlab stolga qo‘yish; nusxa ko‘chirish (spread ...) esa original hujjatni buzmay ko‘paytirish.',
    glossary: [
      ['Destructuring', 'Obyekt yoki massiv ichidagi qiymatlarni to‘g‘ridan-to‘g‘ri o‘zgaruvchilarga ajratish.'],
      ['Spread (...)', 'Massiv yoki obyekt elementlarini yangi nusxa ichiga yoyib beruvchi operator.'],
      ['Rest (...args)', 'Qolgan barcha argumentlarni bitta massivga yig‘uvchi parametr.']
    ],
    alt: 'Destructuring va spread (...) nusxalash hamda rest (...) yig‘ish sxemasi'
  },
  'lesson-34': {
    diagram: 'try-catch-flow',
    simulator: 'step-tracer',
    analogy: 'Xavfsizlik yostiqchasi: xavfli amalni try ichida bajarasiz; agar kutilmagan xato yuz bersa, dastur qulamaydi, catch uni ushlab tushunarli xabar beradi.',
    glossary: [
      ['try / catch', 'Xato chiqishi mumkin bo‘lgan kodni sinab, xatoni ushlab qolish bloki.'],
      ['throw new Error()', 'Shart buzilganda ataylab aniq tavsifli xato yaratish va uzatish.'],
      ['finally', 'Xato bo‘lsa ham, bo‘lmasa ham oxirida albatta bajariladigan yakuniy blok.']
    ],
    alt: 'try → (xato yo‘q / xato bor → catch) → finally xatolarni boshqarish blok-sxemasi'
  },
  'lesson-35': {
    diagram: 'timers-timeline',
    simulator: 'step-tracer',
    analogy: 'setTimeout — 5 daqiqadan keyin 1 marta chalinadigan budilnik; setInterval — har soniyada urib turadigan metronom (clearInterval bilan to‘xtatiladi).',
    glossary: [
      ['setTimeout(fn, ms)', 'Belgilangan millisekunddan keyin funksiyani bir marta ishga tushiradi.'],
      ['setInterval(fn, ms)', 'Har ms oraliqda funksiyani takroran chaqirib turadi.'],
      ['clearTimeout / clearInterval', 'Rejalashtirilgan taymerni bekor qilib, xotira oqishini oldini oladi.']
    ],
    alt: 'Vaqt chizig‘ida setTimeout (bir martalik) va setInterval (takroriy) diagrammasi'
  },
  'lesson-36': {
    diagram: 'recursion-modules',
    simulator: 'step-tracer',
    analogy: 'Matryoshka qo‘g‘irchoqlari: eng kichik qo‘g‘irchoqqa (bazaviy shartga) yetganda ochish to‘xtaydi. Modullar esa katta oshxonani alohida bo‘limlarga ajratishga o‘xshaydi.',
    glossary: [
      ['Rekursiya', 'Funksiyaning kichikroq masala bilan o‘zini o‘zi chaqirishi.'],
      ['Bazaviy shart', 'Rekursiyani to‘xtatadigan eng sodda holat; busiz chaqiruvlar to‘lib ketadi.'],
      ['export / import', 'Kodni alohida JS fayllarga ajratib, funksiyalarni ulash tizimi.']
    ],
    alt: 'Rekursiya chaqiruvlar stek daraxti va ES modullar (export/import) sxemasi'
  },
  'lesson-37': {
    editorial: 'api',
    diagram: 'promise-states',
    simulator: 'async-simulator',
    analogy: 'Kafeda buyurtma berib raqamli chek olasiz (Promise — Pending): taom tayyor bo‘lsa olasiz (Fulfilled), masalliq tugagan bo‘lsa xabar beriladi (Rejected).',
    glossary: [
      ['Promise', 'Kelajakda tugaydigan asinxron amalning natijasi yoki xatosini ifodalovchi obyekt.'],
      ['3 ta holat', 'Pending (kutilmoqda), Fulfilled (bajarildi), Rejected (rad etildi).'],
      ['async / await', 'Promise natijasini sahifani qotirmasdan, qatorma-qator o‘qiladigan tarzda kutish sintaksisi.']
    ],
    alt: 'Promise holatlari (Pending → Fulfilled / Rejected) va async/await oqimi diagrammasi'
  },
  'lesson-38': {
    editorial: 'api',
    diagram: 'fetch-http',
    simulator: 'async-simulator',
    analogy: 'Kuryer pochta bo‘limiga so‘rov (fetch) olib boradi: javob qutisi kelgach, avval quti butunligini (res.ok) tekshiramiz, keyin ichidan JSON xatni (await res.json()) ochamiz.',
    glossary: [
      ['fetch(url)', 'Tarmoq orqali HTTP so‘rov yuborib, Response Promise qaytaruvchi funksiya.'],
      ['res.ok', 'HTTP status kodi 200–299 oralig‘ida ekanini bildiruvchi mantiqiy belgi.'],
      ['await res.json()', 'Javob tanasini JSON formatidan JavaScript obyektiga aylantirish.']
    ],
    alt: 'Brauzer fetch() → Server HTTP 200/404 → res.ok → res.json() sxemasi'
  },
  'lesson-39': {
    editorial: 'api',
    diagram: 'api-to-cards',
    simulator: 'async-simulator',
    analogy: 'Serverdan kelgan xom JSON ro‘yxat — ombordagi tovarlar; JavaScript ularni toza kartochkalar ko‘rinishida vitrinaga (DOMga) terib chiqadi.',
    glossary: [
      ['Ma’lumot va ko‘rinish', 'API obyektlarini avval tayyorlab, keyin DOM elementlariga aylantirish tamoyili.'],
      ['textContent xavfsizligi', 'Tashqi API matnini innerHTMLga emas, textContentga yozish XSS hujumidan himoya qiladi.'],
      ['Kartochka shabloni', 'Har bir yozuv uchun createElement bilan bir xil tuzilmali UI blok yaratish.']
    ],
    alt: 'JSON obyektlar massivi → map/forEach → xavfsiz DOM kartochkalari diagrammasi'
  },
  'lesson-40': {
    editorial: 'api',
    diagram: 'ui-4states',
    simulator: 'async-simulator',
    analogy: 'Po‘lat ko‘prik barcha ob-havo uchun tayyor bo‘lganidek, veb-ilova ham 4 holatga tayyor bo‘lishi kerak: Yuklanmoqda, Bo‘sh, Xato va Muvaffaqiyat.',
    glossary: [
      ['Loading holati', 'So‘rov ketayotganda foydalanuvchiga jarayon davom etayotganini bildiruvchi ko‘rsatkich.'],
      ['Empty holati', 'Server bo‘sh massiv [] qaytarganda tushunarli xabar ko‘rsatish.'],
      ['Error + Qayta urinish', 'Tarmoq uzilganda sahifa qulamasligi va foydalanuvchi qayta so‘rov bera olishi.']
    ],
    alt: 'Asinxron interfeysning 4 holati: Loading, Empty, Error va Success diagrammasi'
  },
  'lesson-41': {
    diagram: 'project-architecture',
    analogy: 'Maktab binosida kutubxona, buxgalteriya va sinf xonalari alohida bo‘lganidek, mini-test loyihasida ham data.js, score.js va app.js alohida mas’uliyatga ega.',
    glossary: [
      ['data.js', 'Faqat savollar bankini saqlaydigan ma’lumot moduli.'],
      ['score.js', 'Ball, foiz va Fisher–Yates aralashtirishni bajaradigan sof mantiq moduli.'],
      ['app.js', 'DOM chizish, taymer, hodisalar va localStorage saqlashni boshqaradigan modul.']
    ],
    alt: 'Mini-test loyihasi modullari (data.js, score.js, app.js) arxitektura diagrammasi'
  },
  'lesson-42': {
    diagram: 'question-schema',
    analogy: 'Kutubxonadagi har bir kitobda noyob inventar raqami bo‘lganidek, har bir test savolida barqaror id, variantlar ro‘yxati va to‘g‘ri javob indeksi bo‘ladi.',
    glossary: [
      ['Barqaror id', 'Savollar tartibi almashganda ham javobni adashmasdan topish uchun noyob kalit.'],
      ['0-indeksli javob', 'options[0] birinchi variant, options[answer] esa to‘g‘ri javob.'],
      ['Izoh (explanation)', 'O‘quvchiga nima uchun shu javob to‘g‘ri ekanini tushuntiruvchi matn.']
    ],
    alt: 'Savollar banki JSON obyekt strukturasi va indeks chegarasi diagrammasi'
  },
  'lesson-43': {
    diagram: 'state-restore',
    analogy: 'Imtihon varaqasida oldingi savolga qaytganingizda belgilagan javobingiz o‘chib ketmasligi kerak — holat ID bo‘yicha saqlanadi.',
    glossary: [
      ['answers[question.id]', 'Javobni tartib raqami emas, savolning noyob IDsi ostida saqlash.'],
      ['Oldingi / Keyingi chegara', 'Indeks 0 dan kichik yoki savollar sonidan katta bo‘lib ketishini cheklash.'],
      ['checked tiklash', 'Savol qayta chizilganda avval tanlangan radio tugmani avtomatik belgilash.']
    ],
    alt: 'Savollar navigatsiyasi va tanlangan javob holatini tiklash diagrammasi'
  },
  'lesson-44': {
    diagram: 'score-math',
    analogy: 'Shaffof imtihon hisoboti: nechta to‘g‘ri, nechta xato, nechta javobsiz qolgani alohida ko‘rinadi; 0 ta savol bo‘lganda ham 0 ga bo‘linish xatosi chiqmaydi.',
    glossary: [
      ['Sof funksiya', 'DOMga tegmasdan faqat kirish ma’lumotidan natija hisoblab qaytaruvchi funksiya.'],
      ['Foiz formulasi', 'total === 0 ? 0 : Math.round((correct / total) * 100).'],
      ['Javobsiz hisobi', 'total - correct - wrong orqali belgilanmagan savollar sonini topish.']
    ],
    alt: 'Ball va foiz hisoblash formulasi hamda 0-chegara himoyasi diagrammasi'
  },
  'lesson-45': {
    diagram: 'timer-deadline',
    analogy: 'Sekundomerni shunchaki 1 ga kamaytirish o‘rniga tugash vaqtini (Date.now() + 180000) belgilash — brauzer oynasi sekinlashsa ham aniq qolgan vaqtni beradi.',
    glossary: [
      ['Deadline (endsAt)', 'Test tugashi kerak bo‘lgan aniq vaqt nuqtasi (millisekund).'],
      ['Bir martalik yakunlash', 'finish() funksiyasi takror chaqirilsa ham natijani ikki marta hisoblamasligi.'],
      ['Math.max(0, qolgan)', 'Qolgan soniyalar manfiy qiymatga tushib ketishini oldini olish.']
    ],
    alt: 'Deadline asosidagi aniq taymer va avtomatik yakunlash oqimi diagrammasi'
  },
  'lesson-46': {
    diagram: 'fisher-yates',
    simulator: 'array-simulator',
    analogy: 'Kartalarni adolatli aralashtirish: oxirgi kartadan boshlab tasodifiy oldingi karta bilan almashtiramiz — har bir tartib teng ehtimolda chiqadi.',
    glossary: [
      ['Fisher–Yates algoritmi', 'Oxirdan boshga yurib i va tasodifiy j ∈ [0, i] elementlarni almashtirish.'],
      ['Immutability (Nusxa)', 'Asl savollar massivini o‘zgartirmaslik uchun [...array] nusxasi ustida ishlash.'],
      ['ID bog‘liqligi', 'Tartib almashsa ham javoblar savol IDsi bilan bog‘langani uchun buzilmaydi.']
    ],
    alt: 'Fisher–Yates aralashtirish algoritmining qadamma-qadam almashuv diagrammasi'
  },
  'lesson-47': {
    diagram: 'testing-matrix',
    analogy: 'Samolyot uchishidan oldin oddiy parvozdan tashqari bo‘sh yoqilg‘i, kuchli shamol va chekka holatlar (edge cases) alohida tekshiriladi.',
    glossary: [
      ['Unit test', 'Kichik funksiyani (masalan, calculateScore) alohida mustaqil sinovdan o‘tkazish.'],
      ['Edge case', '0 ta savol, bo‘sh satr, manfiy son yoki maksimal chegara kabi nozik holatlar.'],
      ['Regressiya', 'Yangi o‘zgarish kiritilganda avval ishlagan funksiyaning buzilib qolishi.']
    ],
    alt: 'Oddiy, nol, chegara va xato holatlarini testlash matritsasi diagrammasi'
  },
  'lesson-48': {
    diagram: 'git-deploy',
    analogy: 'Kitob nashri kabi: qo‘lyozmani saqlaysiz (Git commit), nashriyot omboriga yuborasiz (GitHub push), so‘ng o‘quvchilar uchun chop etasiz (Build & Deploy).',
    glossary: [
      ['Git / Commit', 'Loyiha fayllaridagi o‘zgarishlar tarixini mahalliy saqlash nuqtasi.'],
      ['vite build (dist/)', 'Kodlarni siqib, brauzer uchun tayyor yakuniy statik fayllarni yig‘ish.'],
      ['Deploy', 'Tayyor ilovani internetda hamma ochishi mumkin bo‘lgan manzilga joylash.']
    ],
    alt: 'Mahalliy kod → Git commit → GitHub push → Build (dist/) → Deploy sxemasi'
  }
};
