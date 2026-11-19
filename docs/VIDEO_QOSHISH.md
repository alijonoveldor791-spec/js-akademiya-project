# Video qo‘shish

48 asosiy dars uchun `src/data/lessons.json`, tayyorgarlik uchun `src/data/lessons/setup.js` ichidagi video ma’lumotini o‘zgartiring. Asosiy komponentlarni tahrirlash shart emas.

```json
{
  "video": {
    "title": "1-dars",
    "type": "file",
    "src": "/videos/lesson-01.mp4",
    "poster": "",
    "duration": null,
    "subtitles": [{"src":"/videos/lesson-01.uz.vtt","lang":"uz","label":"O‘zbekcha"}],
    "transcript": "Video konspekti"
  }
}
```

Faylni `public/videos/lesson-01.mp4` ga joylang. Subtitr VTT formatida bo‘ladi. MP4/WebM vaqtini davom ettirish, ko‘rilgan holatni saqlash, subtitr va konspekt qo‘llanadi. Saqlash har ikki soniyada, pause va ended hodisalarida bajariladi.

YouTube uchun type ni `youtube`, src ni `https://www.youtube.com/watch?v=HAQIQIY_ID` qilib yozing. ID 11 belgili bo‘lsin. Faqat YouTube domenlari qabul qilinib youtube-nocookie.com orqali ochiladi. YouTube uchun Player API integratsiyasi hali yo‘q: davom ettirish/ko‘rish holatini avtomatik saqlash hozir faqat fayl videolarida bor.

src bo‘sh bo‘lsa «Bu dars uchun video keyinchalik qo‘shiladi» xabari ko‘rinadi. Video yuklash admin paneli yo‘q; fayllar loyiha orqali ulanadi. Kelajakda backend/CMS/CDN adapteri qo‘shish mumkin.
