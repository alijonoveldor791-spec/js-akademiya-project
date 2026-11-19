export const questions=[
 {id:'variable',text:'Qayta tayinlanadigan o‘zgaruvchi uchun qaysi kalit so‘z?',options:['const','let','fixed'],answer:1,explanation:'let bog‘lanishini yangi qiymatga tayinlash mumkin; const bog‘lanishini esa mumkin emas.'},
 {id:'type',text:'Number("12") + 3 natijasi?',options:['123','15','NaN'],answer:1,explanation:'Number matnni 12 soniga aylantiradi, 12+3=15.'},
 {id:'loop',text:'for(let i=0;i<3;i++) tanasi necha marta ishlaydi?',options:['2','3','4'],answer:1,explanation:'i=0,1,2 holatlarida tana ishlaydi; 3<3 yolg‘on.'},
 {id:'storage',text:'Massivni localStoragega yozishdan oldin nima kerak?',options:['JSON.parse','JSON.stringify','Array.clear'],answer:1,explanation:'localStorage matn saqlaydi, stringify massivni JSON matniga aylantiradi.'},
 {id:'async',text:'fetch javobida 404 holatini qayerdan bilamiz?',options:['res.ok va res.status','Faqat catch ishlaydi','res.length'],answer:0,explanation:'404 da fetch Response bilan yakunlanishi mumkin. ok va statusni alohida tekshiramiz.'}
];
