/**
 * Kelajakdagi videolar uchun uch usul:
 * { type: 'none' }
 * { type: 'file', src: '/videos/lesson-01.mp4', poster: '/posters/lesson-01.jpg', title: '...' }
 * { type: 'youtube', src: 'https://www.youtube.com/watch?v=VIDEO_ID', title: '...' }
 * YouTube URLni faqat ID orqali embed qilish: ixtiyoriy boshqa manzilga iframe ruxsat berilmaydi.
 */
function youtubeId(src) {
  try {
    const u = new URL(src);
    if (['youtube.com', 'www.youtube.com', 'm.youtube.com'].includes(u.hostname)) {
      if (u.pathname === '/watch') return (u.searchParams.get('v') || '').match(/^[\w-]{11}$/)?.[0];
      if (u.pathname.startsWith('/shorts/')) return u.pathname.split('/')[2]?.match(/^[\w-]{11}$/)?.[0];
    }
    if (u.hostname === 'youtu.be') return u.pathname.slice(1).match(/^[\w-]{11}$/)?.[0];
  } catch { return null; }
  return null;
}
export function renderVideo(container, video, progress = {}, onProgress = () => { }) {
  container.replaceChildren();
  if (!video || video.type === 'none' || !video.src) {
    const p = document.createElement('p'); p.className = 'empty-video'; p.textContent = 'Bu dars uchun video keyinchalik qo‘shiladi.'; container.append(p); return;
  }
  if (video.type === 'file') {
    const el = document.createElement('video'); el.controls = true; el.preload = 'metadata'; el.playsInline = true;
    el.src = video.src; if (video.poster) el.poster = video.poster;
    el.setAttribute('aria-label', video.title || 'Video dars');
    for (const subtitle of video.subtitles || []) { const track = document.createElement('track'); track.kind = 'subtitles'; track.src = subtitle.src; track.srclang = subtitle.lang || 'uz'; track.label = subtitle.label || 'O‘zbekcha'; el.append(track); }
    el.addEventListener('loadedmetadata', () => { const time = Number(progress?.time) || 0; if (time > 0 && time < el.duration) el.currentTime = time; });
    let saved = 0;
    const save = () => onProgress({ time: el.currentTime, duration: Number.isFinite(el.duration) ? el.duration : null, completed: el.ended || !!progress?.completed });
    el.addEventListener('timeupdate', () => { if (Date.now() - saved > 2000) { saved = Date.now(); save(); } }); el.addEventListener('pause', save); el.addEventListener('ended', save);
    container.append(el); if (video.transcript) { const p = document.createElement('p'); p.className = 'transcript'; p.textContent = video.transcript; container.append(p); } return;
  }
  if (video.type === 'youtube') {
    const id = youtubeId(video.src);
    if (!id) { container.textContent = 'Video manzili noto‘g‘ri'; return; }
    const iframe = document.createElement('iframe'); iframe.src = `https://www.youtube-nocookie.com/embed/${id}`;
    iframe.title = video.title || 'Video dars'; iframe.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture'; iframe.allowFullscreen = true;
    iframe.referrerPolicy = 'strict-origin-when-cross-origin'; container.append(iframe); return;
  }
  container.textContent = 'Noma’lum video turi.';
}
