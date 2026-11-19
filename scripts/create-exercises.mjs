import fs from 'node:fs';
const records=[];
function add(id,lesson,page,statement,fields,formula,expression,samples){
 const inputs=fields.split(',').map(s=>{const [name,min,max,integer]=s.split(':');return {name,...(min!==''&&min!==undefined?{min:Number(min)}:{}),...(max!==''&&max!==undefined?{max:Number(max)}:{}),integer:integer==='i'};});
 const fn=new Function(...inputs.map(x=>x.name),`return ${expression}`);
 records.push({id,lessonId:`lesson-${String(lesson).padStart(2,'0')}`,statement,inputs,formula,starter:`function solve(${inputs.map(x=>x.name).join(', ')}) {\n  // Hisoblang va return bilan natijani qaytaring.\n}`,solution:`function solve(${inputs.map(x=>x.name).join(', ')}) {\n  return ${expression};\n}`,tests:samples.map(args=>({args,expected:fn(...args)})),steps:[`Berilganlar: ${inputs.map(x=>x.name).join(', ')}. Qiymatlar va o‘lchov birliklarini yozib oling.`,`Formula: ${formula}. Har bir amalning tartibini qog‘ozda tekshiring.`,`solve funksiyasi kirish qiymatlarini parametr sifatida oladi. Funksiya — nomlangan, qayta chaqiriladigan kod.`,`Natijani return orqali qaytaring. Bir nechta natija kerak bo‘lsa [birinchi, ikkinchi] massivini qaytaring.`,`Namuna qiymatlarni formulaga qo‘yib qo‘lda hisoblang, so‘ng «Tekshirish»ni bosing.`,`Yechimdagi qiymatlarni o‘zgartiring, keyin yechimni yopib kodni mustaqil qayta yozing.`]});
}
add('Begin1',3,12,'Kvadratning tomoni a. Perimetrini toping.','a:0','P = 4a','4*a',[[5],[0],[1.5],[100]]);
add('Begin2',3,12,'Kvadratning tomoni a. Yuzasini toping.','a:0','S = a²','a**2',[[5],[0],[2.5],[100]]);
add('Begin3',5,12,'To‘g‘ri to‘rtburchak yuzasi va perimetrini [S, P] shaklida qaytaring.','a:0,b:0','S = ab; P = 2(a+b)','[a*b,2*(a+b)]',[[3,4],[0,4],[1.5,2],[100,20]]);
add('Begin4',5,12,'Diametr d. Aylana uzunligini toping.','d:0','L = πd','Math.PI*d',[[10],[0],[1.5]]);
add('Begin5',5,12,'Kub tomoni a. Hajm va to‘la sirtni [V, S] ko‘rinishida qaytaring.','a:0','V = a³; S = 6a²','[a**3,6*a*a]',[[2],[0],[1.5]]);
add('Begin7',7,12,'Doira radiusi R. Uzunlik va yuzani [L, S] qaytaring.','R:0','L = 2πR; S = πR²','[2*Math.PI*R,Math.PI*R**2]',[[5],[0],[1.25]]);
add('Begin8',5,12,'Ikkita sonning o‘rta arifmetigini toping.','a,b','M = (a+b)/2','(a+b)/2',[[2,8],[-4,2],[0,0],[1.5,2.5]]);
add('Begin9',7,12,'Manfiy bo‘lmagan ikki sonning o‘rta geometrigini toping.','a:0,b:0','G = √(ab)','Math.sqrt(a*b)',[[4,9],[0,10],[1.5,6]]);
add('Begin12',7,13,'Katetlar a va b. Gipotenuza va perimetrni [c, P] qaytaring.','a:0,b:0','c = √(a²+b²); P = a+b+c','[Math.hypot(a,b),a+b+Math.hypot(a,b)]',[[3,4],[0,0],[5,12]]);
add('Begin20',7,13,'Tekislikdagi ikki nuqta orasidagi masofani toping.','x1,y1,x2,y2','D = √((x₂−x₁)²+(y₂−y₁)²)','Math.hypot(x2-x1,y2-y1)',[[0,0,3,4],[-1,-1,2,3],[2,2,2,2]]);
add('Begin22',3,13,'A va B qiymatlarini almashtirib [A, B] qaytaring.','A,B','A ← eski B; B ← eski A','[B,A]',[[2,7],[-1,0],[3,3]]);
add('Begin23',3,13,'Qiymatlarni A → B → C → A yo‘nalishida almashtiring. [A, B, C] qaytaring.','A,B,C','A ← eski C; B ← eski A; C ← eski B','[C,A,B]',[[1,2,3],[-2,0,4],[0,0,0]]);
add('Begin29',6,13,'Gradusdagi burchakni radianga aylantiring.','a','rad = aπ/180','a*Math.PI/180',[[180],[0],[-90],[45]]);
add('Begin31',6,13,'Farengeyt haroratini Selsiyga aylantiring.','F','C = (F−32)·5/9','(F-32)*5/9',[[32],[212],[-40],[0]]);
add('Integer1',8,23,'Santimetrdagi uzunlikdan to‘liq metrlar sonini toping.','L:0::i','m = floor(L/100)','Math.floor(L/100)',[[250],[0],[99],[100]]);
add('Integer2',8,23,'Kilogrammdagi og‘irlikdan to‘liq tonnalar sonini toping.','M:0::i','t = floor(M/1000)','Math.floor(M/1000)',[[2500],[0],[999],[1000]]);
add('Integer3',8,23,'Baytlardagi hajmdan to‘liq kilobaytlar sonini toping. Bu mashqda 1 KB = 1024 bayt.','B:0::i','KB = floor(B/1024)','Math.floor(B/1024)',[[2049],[0],[1023],[1024]]);
add('Integer6',8,23,'Ikki xonali sonning [o‘nlik, birlik] raqamlarini ajrating.','n:10:99:i','o‘nlik = floor(n/10); birlik = n%10','[Math.floor(n/10),n%10]',[[47],[10],[99]]);
add('Integer7',8,23,'Ikki xonali son raqamlari yig‘indisini toping.','n:10:99:i','S = floor(n/10)+n%10','Math.floor(n/10)+n%10',[[47],[10],[99]]);
add('Integer8',8,23,'Ikki xonali son raqamlarini almashtiring.','n:10:99:i','N = (n%10)·10+floor(n/10)','n%10*10+Math.floor(n/10)',[[47],[10],[99]]);
add('Integer9',8,23,'Uch xonali sonning yuzlik raqamini toping.','n:100:999:i','Y = floor(n/100)','Math.floor(n/100)',[[347],[100],[999]]);
add('Integer11',8,23,'Uch xonali son raqamlari yig‘indisini toping.','n:100:999:i','S = floor(n/100)+floor(n/10)%10+n%10','Math.floor(n/100)+Math.floor(n/10)%10+n%10',[[347],[100],[999]]);
add('Integer12',8,23,'Uch xonali son raqamlarini teskari yozing; boshlang‘ich nol saqlanmaydi.','n:100:999:i','N = birlik·100+o‘nlik·10+yuzlik','n%10*100+Math.floor(n/10)%10*10+Math.floor(n/100)',[[347],[100],[909]]);
add('Integer15',8,23,'Uch xonali sonning yuzlik va o‘nlik raqamlarini almashtiring.','n:100:999:i','N = o‘nlik·100+yuzlik·10+birlik','Math.floor(n/10)%10*100+Math.floor(n/100)*10+n%10',[[347],[100],[999]]);
const bool=[
 ['A musbatmi?','A:::i','A > 0','A>0',[[1],[0],[-1]]],
 ['A toqmi?','A:::i','A % 2 ≠ 0','A%2!==0',[[3],[0],[-3],[4]]],
 ['A juftmi?','A:::i','A % 2 = 0','A%2===0',[[4],[0],[-2],[3]]],
 ['A > 2 va B ≤ 3 sharti rostmi?','A:::i,B:::i','A > 2 ∧ B ≤ 3','A>2&&B<=3',[[3,3],[2,3],[3,4],[-1,0]]],
 ['A ≥ 0 yoki B < −2 sharti rostmi?','A:::i,B:::i','A ≥ 0 ∨ B < −2','A>=0||B < -2',[[0,0],[-1,-3],[-1,-2]]],
 ['A ≤ B ≤ C sharti rostmi?','A:::i,B:::i,C:::i','A ≤ B ∧ B ≤ C','A<=B&&B<=C',[[1,2,3],[0,0,0],[3,2,1],[-3,-2,0]]],
 ['B soni A va C orasida qat’iy joylashganmi?','A:::i,B:::i,C:::i','(A < B < C) ∨ (C < B < A)','(A<B&&B<C)||(C<B&&B<A)',[[1,2,3],[3,2,1],[1,1,3],[-3,-2,0]]],
 ['A va B ikkalasi ham toqmi?','A:::i,B:::i','toq(A) ∧ toq(B)','A%2!==0&&B%2!==0',[[1,3],[-1,3],[0,3],[2,4]]],
 ['A va B dan kamida bittasi toqmi?','A:::i,B:::i','toq(A) ∨ toq(B)','A%2!==0||B%2!==0',[[1,2],[-3,0],[0,2],[1,3]]],
 ['A va B dan faqat bittasi toqmi?','A:::i,B:::i','toq(A) ≠ toq(B)','(A%2!==0)!==(B%2!==0)',[[1,2],[-1,3],[0,0],[-3,-2]]]
];
bool.forEach((b,i)=>add(`Boolean${i+1}`,i<5?9:10,29,...b));
add('For1',13,53,'k sonini n marta takrorlab massiv qaytaring.','k,n:1:100:i','[k, …, k] — n ta element','(()=>{const out=[];for(let i=0;i<n;i++)out.push(k);return out;})()',[[7,3],[0,1],[-2,4]]);
add('For2',13,53,'a dan b gacha (chegaralar ham kiradi) sonlarni va sonini [massiv, soni] qaytaring. a ≤ b.','a:::i,b:::i','N = b−a+1','(()=>{const out=[];for(let i=a;i<=b;i++)out.push(i);return [out,out.length];})()',[[2,5],[0,0],[-2,1]]);
add('For3',13,53,'a < b. a va b orasidagi sonlarni chegaralarsiz kamayish tartibida massiv qaytaring.','a:::i,b:::i','b−1, b−2, …, a+1','(()=>{const out=[];for(let i=b-1;i>a;i--)out.push(i);return out;})()',[[1,5],[1,2],[-3,1]]);
add('For4',13,53,'1 kg narxi p. 1–10 kg narxlarini massiv qaytaring.','p:0','narx = p·kg','(()=>{const out=[];for(let i=1;i<=10;i++)out.push(p*i);return out;})()',[[1000],[0],[2.5]]);
add('For5',13,53,'1 kg narxi p. 0,1; 0,2; …; 1 kg narxlarini massiv qaytaring.','p:0','narx = p·i/10, i = 1…10','(()=>{const out=[];for(let i=1;i<=10;i++)out.push(p*i/10);return out;})()',[[1000],[0],[3.5]]);
add('For7',14,53,'a ≤ b. a dan b gacha butun sonlar yig‘indisini toping.','a:::i,b:::i','S = a+(a+1)+…+b','(()=>{let s=0;for(let i=a;i<=b;i++)s+=i;return s;})()',[[1,5],[0,0],[-3,2]]);
add('For8',14,53,'a ≤ b. a dan b gacha butun sonlar ko‘paytmasini toping.','a:::i,b:::i','P = a·(a+1)·…·b','(()=>{let p=1;for(let i=a;i<=b;i++)p*=i;return p;})()',[[1,5],[0,2],[-3,-1]]);
add('For9',14,53,'a ≤ b. Sonlar kvadratlari yig‘indisini toping.','a:::i,b:::i','S = a²+(a+1)²+…+b²','(()=>{let s=0;for(let i=a;i<=b;i++)s+=i*i;return s;})()',[[1,3],[0,0],[-2,2]]);
add('For10',14,53,'n ta hadli garmonik yig‘indini toping.','n:1:1000:i','S = 1+1/2+…+1/n','(()=>{let s=0;for(let i=1;i<=n;i++)s+=1/i;return s;})()',[[1],[5],[10]]);
add('For12',14,53,'1,1 dan boshlab 0,1 qadamli n ta had ko‘paytmasini toping.','n:1:100:i','P = ∏(1+i/10), i=1…n','(()=>{let p=1;for(let i=1;i<=n;i++)p*=1+i/10;return p;})()',[[1],[3],[10]]);
add('For15',14,53,'a ning n-darajasini sikl orqali toping.','a,n:0:100:i','aⁿ = a·a·…·a; a⁰ = 1','(()=>{let p=1;for(let i=0;i<n;i++)p*=a;return p;})()',[[2,5],[0,3],[-2,3],[5,0]]);
fs.writeFileSync('src/data/exercises/exercises.json',JSON.stringify(records,null,2)+'\n');
console.log(`${records.length} ta amaliy masala yozildi`);
