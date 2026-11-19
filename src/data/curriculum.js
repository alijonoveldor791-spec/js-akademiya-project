import {lesson04,finalLines} from './lessons/lesson04.js';
import original from './lessons.json' with { type: 'json' };
import originalWeeks from './weeks.json' with { type: 'json' };
import exerciseBank from './exercises/exercises.json' with { type: 'json' };
import { setupLessons } from './lessons/setup.js';
import { profiles } from './lessons/profiles.js';
import { knowledge } from './quizzes/knowledge.js';
import { guides } from './lessons/guides.js';
import { annotations } from './lessons/annotations.js';

function explainLine(line) {
 if (!line.trim()) return 'Bo‘sh qator kod bo‘limlarini ko‘z bilan ajratadi; natijaga ta’sir qilmaydi.';
 if (line.trim().startsWith('//')) return 'Izoh: // dan keyingi matn bajarilmaydi; u dasturchiga yo‘l-yo‘riq beradi.';
 if (line.includes('console.')) return 'Qiymat yoki ifoda hisoblanadi va konsolga yuboriladi. Matn qo‘shtirnoqda, o‘zgaruvchi nomi qo‘shtirnoqsiz yoziladi.';
 if (/\breturn\b/.test(line)) return 'Ifoda natijasi chaqiruvchiga qaytariladi. Shu chaqiruvning bajarilishi tugaydi.';
 if (/\b(for|while|do)\b/.test(line)) return 'Takrorlash qoidasi: boshlanish, davom etish sharti va qadamni kuzating. Shart bir kuni yolg‘on bo‘lishi kerak.';
 if (/\b(if|else|switch|case)\b/.test(line)) return 'Shartga ko‘ra bajariladigan yo‘l tanlanadi. Chegara qiymati va tenglik holatini alohida sinang.';
 if (/\b(const|let)\b/.test(line)) return 'Nomlangan qiymat yoki funksiya e’lon qilinadi. = o‘ngdagi natijani chapdagi nomga tayinlaydi.';
 if (/addEventListener/.test(line)) return 'Hodisa yuz berganda chaqiriladigan funksiya ulanadi. Funksiyani darhol chaqirish emas, o‘zini berish kerak.';
 if (/append|remove|textContent|style/.test(line)) return 'Sahifa elementi yoki uning matni/ko‘rinishi yangilanadi; bu amal DOM natijasida ko‘rinadi.';
 if (/^\s*[}\])];?\s*$/.test(line)) return 'Ochilgan blok, ro‘yxat yoki funksiya chegarasi yopiladi. Qavslarning juftligini tekshiring.';
 return 'Bu qatorni yuqoridagi qoida bilan bog‘lang: ishlatilgan nomlarni, kiritish qiymatini va qator bajarilgach nima o‘zgarishini ayting.';
}
function makeQuiz(p, code, check, custom) {
 const [situation,rule,expression,result,bug,task,web]=p;
 return [
  {type:'Sintaksis',question:'Qaysi namuna sintaktik jihatdan to‘g‘ri JavaScript?',options:['console.log("Salom");','console.log("Salom";','console.log("Salom);'],answer:0,explanation:'Qo‘shtirnoq va qavslar juft yopiladi; console.log usuliga argument qavs ichida uzatiladi.'},
  {type:'Natija',question:`Natijani toping: console.log(${expression});`,options:[result,'undefined','SyntaxError'],answer:0,explanation:`Bu ifoda ${JSON.stringify(result)} ko‘rinishidagi natija beradi. Uni laboratoriyada alohida sinab ko‘ring.`},
  {type:'Xatoni topish',question:`Quyidagi kodni tuzatishda qaysi qoida yordam beradi?\n${bug}`,options:[rule,'Har bir qatorni izohga aylantirish','Xato xabarini berkitish'],answer:0,explanation:rule},
  {type:'Mantiq',question:`${situation} Yechimni qanday tekshiramiz?`,options:['Oddiy misolni qo‘lda hisoblab, chegaraviy holat bilan ham solishtiramiz','Faqat kod ishga tushganini ko‘ramiz','Natijani tekshirmay nusxalaymiz'],answer:0,explanation:`Maqsad: ${task} To‘g‘ri natija va cheklovlarni avval yozib olish xatoni topishga yordam beradi.`},
  {type:'Amaliy vaziyat',question:'Ushbu dars bilimining vebdagi qo‘llanishini tanlang.',options:[web,'Kod natijasini tekshirmasdan e’lon qilish','Barcha xatolarni o‘chirib qo‘yish'],answer:0,explanation:`${web}. ${check}`}
 ].map((q,i)=>{
  if(custom&&(i===0||i===3)){const item=custom[i===0?0:1];q={...q,question:item[0],options:item.slice(1,4),answer:0,explanation:item[4]};}
  // Bir xil joydagi to‘g‘ri variantni taxmin qilishni oldini oladi.
  const offset=(i+code.length)%q.options.length;
  return {...q,id:`q${i+1}`,options:q.options.map((_,j)=>q.options[(j+offset)%q.options.length]),answer:(q.options.length-offset)%q.options.length};
 });
}
export const mainLessons=original.map((lesson,i)=>{
 const p=profiles[i];
 const exercises=exerciseBank.filter(x=>x.lessonId===lesson.id);
 const source=lesson.id==='lesson-04'?{...lesson,...lesson04}:lesson;
 return {...lesson,guide:guides[i],schemaVersion:2,intro:p[0],principle:p[1],webUse:p[6],expectedExample:{expression:p[2],result:p[3]},
  objectives:[`${lesson.title} mavzusining qoidasini misolda tushuntirish`,p[5], 'Oddiy va chegaraviy holatda natijani tekshirish'],
  lineExplanations:lesson.code.split('\n').map((line,j)=>({line:j+1,code:line,explanation:annotations[i]?.[j]||explainLine(line)})),
  practices:[{level:'Oson',task:`Namuna kodni ishga tushiring. Bir qiymatni o‘zgartiring va natijani avval taxmin qiling. ${lesson.practice}`},{level:'O‘rta',task:p[5]},{level:'Murakkab',task:`Mini-loyiha: ${p[6]}. Kirish, hisoblash va chiqish qismlarini ajrating. Kamida uch xil holat bilan tekshiring; o‘tilmagan DOM mavzusi bo‘lsa hozir natijani konsolda chiqaring.`}],
  bug:{code:p[4],hint:p[1]},quiz:makeQuiz(p,lesson.code,lesson.check,knowledge[i]),exerciseIds:exercises.map(x=>x.id),
  home:exercises.length?`${exercises.map(x=>x.id).join(', ')} masalalarini mustaqil yeching. Har biri uchun formulani izohlang va kamida uchta kirish bilan tekshiring.`:'Qo‘shimcha amaliy mashq: ushbu dars mini-loyihasini mustaqil tugating va natijalarni qaydlarga yozing.',
  homework:exercises.length?exercises.map(x=>x.id):[],
  video:{title:'',type:'file',src:'',poster:'',duration:null,subtitles:[],transcript:'',...lesson.video,type:lesson.video?.type==='none'?'file':lesson.video?.type||'file'},
  ...(lesson.id==='lesson-04'?{...lesson04,lineExplanations:source.code.split('\n').map((code,j)=>({line:j+1,code,explanation:finalLines[j]}))}:{}),
 };
});
export const lessons=[...setupLessons.map((l,i)=>({...l,schemaVersion:2,intro:l.concept,principle:l.explain,exerciseIds:[],homework:[],lineExplanations:l.code.split('\n').map((code,j)=>({line:j+1,code,explanation:explainLine(code)})),
 practices:[{level:'Oson',task:l.practice},{level:'O‘rta',task:'Bosqichlarni ko‘rsatmasiz qayta bajaring va natijani qaydlarga yozing.'},{level:'Murakkab',task:`Mini-vazifa: ${l.checks.join('; ')}. Boshqa o‘quvchiga bajarish tartibini tushuntiring.`}],
 bug:{code:'console.lgo("Salom");',hint:'Konsolga chiqarish metodining nomi log. Harflar tartibini tekshiring.'},
 expectedExample:{expression:'2 + 3',result:'5'},quiz:i===0?l.quiz:makeQuiz([l.concept,l.explain,'2 + 3','5','console.lgo("Salom");',l.practice,l.webUse],l.code,l.check).map((q,j)=>j===0?{...q,question:l.quiz[0],options:l.quiz.slice(1),answer:0,explanation:l.concept}:q),
 ...(i===0?l:{})
})),...mainLessons];
export const weeks=[{number:0,title:'Dasturlashga tayyorgarlik',lessonIds:setupLessons.map(x=>x.id)},...originalWeeks];
export const exercises=exerciseBank;
