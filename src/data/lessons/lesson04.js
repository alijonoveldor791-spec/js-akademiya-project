const example = (code, lines, result) => ({code, lines, result});

export const typeSections = [
 {id:'string', title:'String — matnli ma’lumot turi',
  paragraphs:[
   'Telefoningizda do‘stingizning ismi va familiyasi bor. Ularni dasturda qanday saqlaymiz? JavaScriptda matnlarni saqlash uchun String turidan foydalanamiz.',
   'Qo‘shtirnoqlar matnning qayerda boshlanib, qayerda tugashini bildiradi. "Ali" ham, \'Ali\' ham matn. Ochilgan tirnoq qaysi turda bo‘lsa, yopilgani ham shunday bo‘lsin. let bilan qiymat saqlanadigan o‘zgaruvchiga nom beramiz.'
  ],
  examples:[
   example('let ism = "Ali";\nlet familiya = "Karimov";\nlet shahar = "Toshkent";\n\nconsole.log(ism);',[
    'ism nomli o‘zgaruvchiga Ali matnini saqladik.', 'familiya o‘zgaruvchisiga Karimov matnini saqladik.', 'shahar o‘zgaruvchisiga Toshkent matnini saqladik.', 'Bo‘sh qator kodni o‘qishni qulay qiladi; hech narsa bajarmaydi.', 'console.log(ism) saqlangan ismni konsolga chiqaradi.'
   ],'Ali'),
   example('let ism = "Ali";\nlet familiya = "Karimov";\n\nconsole.log(ism + " " + familiya);',[
    'Ismni matn sifatida saqladik.', 'Familiyani boshqa matn sifatida saqladik.', 'Bo‘sh qator ikki qismni ajratdi.', '+ matnlarni ulaydi; " " ism bilan familiya orasiga bitta bo‘sh joy qo‘yadi.'
   ],'Ali Karimov'),
   example('let yosh = "25";\nconsole.log(yosh + "1");',[
    '25 tirnoq ichida yozildi. Shu sababli yosh son emas, matn saqlaydi.', 'Ikki matn qo‘shilganda hisoblanmaydi, yonma-yon ulanadi.'
   ],'251')
  ], task:'O‘zingizning ism va familiyangizni yozing. Ular orasidagi bo‘sh joyni olib tashlasangiz, natija qanday bo‘ladi?', interactive:'name'},
 {id:'number',title:'Number — sonli ma’lumot turi',
  paragraphs:[
   'Endi do‘konga kiraylik. Olma 10 000 so‘m, banan 15 000 so‘m turadi. Ikkalasiga qancha to‘laysiz? Hisoblash uchun matn emas, Number kerak.',
   '16 — butun son, 3.14 — kasr son. JavaScriptda kasr qismi nuqta bilan yoziladi. Sonni tirnoqsiz yozamiz. + qo‘shadi, - ayiradi, * ko‘paytiradi, / bo‘ladi.'
  ],examples:[
   example('let olma = 10000;\nlet banan = 15000;\n\nconsole.log(olma + banan);',[
    'Olmaning narxi 10000 soni sifatida saqlandi.', 'Bananning narxi 15000 soni sifatida saqlandi.', 'Bo‘sh qator hisoblashni ajratdi.', 'Ikki son qo‘shilib, umumiy narx konsolga chiqarildi.'
   ],'25000'),
   example('console.log(10 + 5);\nconsole.log("10" + "5");',[
    '10 va 5 sonlar, shuning uchun matematik yig‘indi 15 chiqadi.', '"10" va "5" matnlar, shuning uchun ular ulanib 105 chiqadi.'
   ],'15\n105'),
   example('console.log(10 - 5);\nconsole.log(10 * 5);\nconsole.log(10 / 5);\nconsole.log(3.5 + 1);',[
    '10 dan 5 ni ayiramiz: 5.', '10 ni 5 ga ko‘paytiramiz: 50.', '10 ni 5 ga bo‘lamiz: 2.', 'Kasr son bilan ham hisoblay olamiz: 4.5.'
   ],'5\n50\n2\n4.5')
  ],
  task:'Ikki mahsulot narxini o‘zgartiring va jami summani toping. Keyin 10 + 5 bilan "10" + "5" ni taqqoslang.',interactive:'sum'},
 {id:'boolean',title:'Boolean — mantiqiy ma’lumot turi',
  paragraphs:[
   'Elektron davomatda o‘quvchi darsga keldimi, deb so‘raymiz. Bu savolga uzun matn yoki narx kerakmi? Yo‘q, bizga ha yoki yo‘q javobi yetadi.',
   'Boolean faqat ikki qiymatga ega: true — rost, ya’ni ha; false — yolg‘on, ya’ni yo‘q. Ular tirnoqsiz yoziladi. "true" esa oddiy matn bo‘lib qoladi.',
   'Uy vazifasi bajarildimi, parol to‘g‘rimi, test yakunlandimi — bunday savollarning holatini ham Boolean bilan saqlash mumkin.'
  ],examples:[example('let darsgaKeldi = true;\nlet vazifaniBajardi = false;\nconsole.log(darsgaKeldi);\nconsole.log(vazifaniBajardi);',[
   'true o‘quvchi darsga kelganini bildiradi.', 'false uy vazifasi bajarilmaganini bildiradi.', 'Davomat qiymati konsolga chiqadi.', 'Vazifa holati konsolga chiqadi.'
  ],'true\nfalse')],task:'Davomat tugmasini bosing. So‘ng kodda vazifaniBajardi qiymatini true ga o‘zgartirib, natijani tekshiring.',interactive:'attendance'},
 {id:'null',title:'Null — bo‘sh qiymat',
  paragraphs:[
   'Yangi tanishingizning ismini kontaktga yozdingiz, lekin telefon raqamini hali olmadingiz. Telefon uchun joy bor, ammo raqam yo‘qligini qanday bildiramiz?',
   'null qiymat yo‘qligini ataylab belgilaydi. Bu 0 soni yoki "null" matni emas. Biz: «Hozircha telefon raqami yo‘q», deb aniq aytyapmiz.'
  ],examples:[example('let ism = "Ali";\nlet telefon = null;\nconsole.log(telefon);',[
   'Kontaktning ismi saqlanadi.', 'Raqam yo‘qligini o‘zimiz null bilan belgilaymiz.', 'Konsolda null ko‘rinadi.'
  ],'null')],task:'telefon qiymatiga "+998901234567" matnini yozing. Endi konsolda nima chiqadi?'},
 {id:'undefined',title:'Undefined — aniqlanmagan qiymat',
  paragraphs:[
   'Tasavvur qiling, qutiga «ism» deb yozdingiz, lekin ichiga hali hech narsa solmadingiz. O‘zgaruvchi yaratib, unga qiymat bermasak nima bo‘ladi?',
   'JavaScript bunday o‘zgaruvchini undefined deb ko‘rsatadi: nom mavjud, lekin unga hali qiymat berilmagan. null ni o‘zimiz ataylab yozamiz, undefined esa qiymatsiz e’lon qilingan o‘zgaruvchida paydo bo‘ladi.'
  ],examples:[example('let ism;\n\nconsole.log(ism);',[
   'ism nomli o‘zgaruvchini yaratdik, lekin unga qiymat bermadik.', 'Bo‘sh qator natijani o‘zgartirmaydi.', 'Qiymat berilmagani uchun undefined chiqadi.'
  ],'undefined')],task:'let ism; qatoridan keyin ism = "Aziza"; yozing va kodni yana ishga tushiring.',comparison:true},
 {id:'typeof',title:'typeof — ma’lumot turini aniqlaymiz',
  paragraphs:[
   'Xo‘sh, dasturchilar, o‘zgaruvchi ichidagi qiymat matnmi yoki sonmi, deb JavaScriptning o‘zidan so‘rasak bo‘ladimi? Buning uchun typeof bor. Uni qiymat yoki o‘zgaruvchi oldidan yozamiz.',
   'Keling, ism, yosh va davomat qiymatlarini tekshiramiz. typeof natijani tur nomi yozilgan matn sifatida qaytaradi.'
  ],examples:[example('let ism = "Ali";\nlet yosh = 16;\nlet darsgaKeldi = true;\n\nconsole.log(typeof ism);\nconsole.log(typeof yosh);\nconsole.log(typeof darsgaKeldi);',[
   'ism matn saqlaydi.', 'yosh son saqlaydi.', 'darsgaKeldi mantiqiy qiymat saqlaydi.', 'Bo‘sh qator tekshiruvni ajratadi.', 'Matnning turi string deb chiqadi.', 'Sonning turi number deb chiqadi.', 'Mantiqiy qiymatning turi boolean deb chiqadi.'
  ],'string\nnumber\nboolean'),example('console.log(typeof null);\nconsole.log(typeof undefined);',[
   'JavaScriptning tarixiy xususiyati sabab typeof null natijasi object chiqadi; null esa bo‘sh qiymatni bildiradi.', 'undefined qiymatining turi undefined deb chiqadi.'
  ],'object\nundefined')],task:'typeof "16" va typeof 16 natijalarini avval taxmin qiling, keyin kodda tekshiring.'}
];

export const finalCode='let ism = "Aziz";\nlet yosh = 16;\nlet oquvchi = true;\nlet telefon = null;\nlet manzil;\n\nconsole.log(typeof ism);\nconsole.log(typeof yosh);\nconsole.log(typeof oquvchi);\nconsole.log(typeof telefon);\nconsole.log(typeof manzil);';
export const finalLines=['Ism matn sifatida saqlanadi.','Yosh son sifatida saqlanadi.','O‘quvchi ekanligimiz true bilan belgilanadi.','Telefon yo‘qligi ataylab null bilan belgilanadi.','Manzil o‘zgaruvchisi yaratiladi, lekin unga qiymat berilmaydi.','Bo‘sh qator tekshiruvlarni ajratadi.','Ismning turi string.','Yoshning turi number.','O‘quvchi holatining turi boolean.','typeof null tarixiy sababli object chiqaradi.','Qiymat berilmagan manzilning turi undefined.'];

const quizItems=[
 ['Qaysi qiymat String turiga kiradi?',['25','"25"','true','null'],1,'Qo‘shtirnoq ichidagi "25" — matn.'],
 ['console.log("Ali" + " " + "Karimov") nima chiqaradi?',['AliKarimov','Ali + Karimov','Ali Karimov','undefined'],2,'" " ism va familiya orasiga bo‘sh joy qo‘yadi.'],
 ['console.log(10 + 5) natijasi qanday?',['15','105','"10 + 5"','5'],0,'Tirnoqsiz ikki son qo‘shiladi: 15.'],
 ['console.log("10" + "5") natijasi qanday?',['15','50','5','105'],3,'Ikki matn + yordamida ulanadi: 105.'],
 ['Qaysi yozuv kasr sonni to‘g‘ri saqlaydi?',['let baho = "4.5";','let baho = 4.5;','let baho = "4,5";','let baho = true;'],1,'Number uchun tirnoq yozmaymiz, kasrni nuqta bilan ajratamiz.'],
 ['Boolean qaysi ikki qiymatga ega?',['0 va null','"ha" va "yo‘q"','true va false','String va Number'],2,'Boolean qiymatlari true va false; ular tirnoqsiz yoziladi.'],
 ['let telefon = null; nimani bildiradi?',['Telefon yo‘qligi ataylab belgilangan','Telefon 0 ga teng','Telefon "null" matnini saqlaydi','O‘zgaruvchi yaratilmagan'],0,'null bilan qiymat yo‘qligini o‘zimiz belgilaymiz.'],
 ['let manzil; console.log(manzil); natijasi qanday?',['null','0','"manzil"','undefined'],3,'O‘zgaruvchi yaratilgan, lekin unga qiymat berilmagan.'],
 ['typeof "16" qanday natija qaytaradi?',['number','string','boolean','undefined'],1,'"16" tirnoq ichida, demak string.'],
 ['typeof null qanday natija qaytaradi?',['null','undefined','object','number'],2,'Tarixiy xususiyat sabab typeof null natijasi object.']
];
export const lesson04 = {
 schemaVersion:3, code:finalCode,
 concept:'Ism, narx va davomat: har bir qiymatning o‘z turi bor. Keling, ularni birga sinab ko‘ramiz.',
 practices:[
  {level:'1 · Matn',task:'Ism va familiyangizni alohida String o‘zgaruvchilarga saqlang. Ularni bo‘sh joy bilan birlashtirib konsolga chiqaring.'},
  {level:'2 · Son',task:'Ikki mahsulot narxini son sifatida saqlang va jami narxni konsolga chiqaring.'},
  {level:'3 · Taqqoslash',task:'10 + 5 va "10" + "5" natijalarini chiqaring. Nima uchun javoblar turlicha ekanini ayting.'},
  {level:'4 · Davomat',task:'let darsgaKeldi = false; yozing. Keyingi qatorda uni true ga o‘zgartiring va yangi qiymatni chiqaring.'},
  {level:'5 · Bo‘sh qiymatlar',task:'let telefon = null; va let manzil; yarating. Har ikkisining qiymatini va typeof natijasini chiqaring.'},
  {level:'6 · O‘zim haqimda',task:'Dars bo‘limidagi «Yakuniy mashq: o‘zim haqimda» kodini VS Code’da yozing. Ism va yoshni o‘zingiznikiga almashtiring. Besh tur natijasini avval taxmin qilib, so‘ng ishga tushiring.'}
 ],
 practice:'Quyidagi mashqlarni ketma-ket bajaring. Har birini tekshirgach, yoniga belgi qo‘ying. Kod yozish uchun Dars bo‘limidagi muharrirdan ham foydalanishingiz mumkin.',
 home:'Oila a’zongiz yoki do‘stingiz uchun ism, yosh, o‘quvchi holati, telefon va manzil o‘zgaruvchilarini yarating. Har birining qiymati va turini konsolga chiqaring.',
 check:'"16" va 16 ning turi nimasi bilan farq qiladi? null va undefined o‘rtasidagi farqni o‘z misolingizda ayting.',
 quiz:quizItems.map(([question,options,answer,explanation],i)=>({id:`type-${i+1}`,type:'Ma’lumot turlari',question,options,answer,explanation}))
};
