import { escapeHTML } from './lessonText.js';
import { openModal, closeModal } from './ui/index.js';

const CROP_SIZE = 240;
const EXPORT_SIZE = 256;

export function computeCropMetrics({ imgWidth, imgHeight, zoom = 1, offsetX = 0, offsetY = 0, stageSize = CROP_SIZE }) {
  const safeW = Math.max(1, Number(imgWidth) || 1);
  const safeH = Math.max(1, Number(imgHeight) || 1);
  const safeZoom = Math.min(3, Math.max(1, Number(zoom) || 1));
  const baseScale = Math.max(stageSize / safeW, stageSize / safeH);
  const drawW = safeW * baseScale * safeZoom;
  const drawH = safeH * baseScale * safeZoom;
  const maxX = Math.max(0, (drawW - stageSize) / 2);
  const maxY = Math.max(0, (drawH - stageSize) / 2);
  const clampedX = Math.min(maxX, Math.max(-maxX, Number(offsetX) || 0));
  const clampedY = Math.min(maxY, Math.max(-maxY, Number(offsetY) || 0));
  return {
    drawW,
    drawH,
    maxX,
    maxY,
    offsetX: clampedX,
    offsetY: clampedY,
    x: (stageSize - drawW) / 2 + clampedX,
    y: (stageSize - drawH) / 2 + clampedY
  };
}

export function openProfileModal({ profile, onSave, notify }) {
  const current = {
    fullName: profile?.fullName || '',
    goal: profile?.goal || '',
    bio: profile?.bio || '',
    avatar: profile?.avatar || ''
  };

  openModal({
    title: current.fullName || current.avatar ? 'O‘quvchi profilini tahrirlash' : 'O‘quvchi profilini yaratish',
    bodyHTML: `
      <form id="learnerProfileForm" class="profile-modal-form">
        <div class="profile-avatar-editor">
          <div class="cropper-stage-wrap">
            <div class="cropper-stage" id="cropperStage" aria-label="Rasmni surish va joylashtirish maydoni">
              <canvas id="avatarCropCanvas" width="${CROP_SIZE}" height="${CROP_SIZE}"></canvas>
              <div id="cropperEmpty" class="cropper-empty ${current.avatar ? 'hidden' : ''}">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                <span>Rasm tanlanmagan</span>
              </div>
              <div class="cropper-circle-mask" aria-hidden="true"></div>
            </div>
            <p class="cropper-hint" id="cropperHint">${current.avatar ? 'Rasmni kerakli joyiga suring va o‘lchamini sozlang' : 'JPG, PNG yoki WebP rasm yuklang'}</p>
          </div>

          <div class="cropper-controls">
            <div class="cropper-upload-row">
              <label class="primary-button cropper-file-btn" for="avatarFileInput">Rasm yuklash</label>
              <input id="avatarFileInput" type="file" accept="image/*" hidden />
              <button type="button" id="removeAvatarBtn" class="ghost-button ${current.avatar ? '' : 'hidden'}">Rasmni o‘chirish</button>
            </div>

            <div class="cropper-zoom-box ${current.avatar ? '' : 'is-disabled'}" id="cropperZoomBox">
              <div class="between">
                <label for="avatarZoomSlider">Rasm o‘lchami (kattalashtirish)</label>
                <span id="avatarZoomValue" class="tabular-nums">100%</span>
              </div>
              <div class="cropper-zoom-row">
                <button type="button" id="zoomOutBtn" class="icon-button" aria-label="Kichiklashtirish">−</button>
                <input id="avatarZoomSlider" type="range" min="1" max="3" step="0.05" value="1" />
                <button type="button" id="zoomInBtn" class="icon-button" aria-label="Kattalashtirish">+</button>
              </div>
              <div class="cropper-pan-buttons">
                <button type="button" id="centerAvatarBtn" class="ghost-button">Markazga qaytarish</button>
              </div>
            </div>
          </div>
        </div>

        <div class="profile-fields-grid">
          <label>Ism-familiya (yoki taxallus)
            <input id="profileNameInput" name="fullName" type="text" maxlength="80" value="${escapeHTML(current.fullName)}" placeholder="Masalan: Jasur Karimov" required />
          </label>
          <label>O‘quv maqsadim
            <input id="profileGoalInput" name="goal" type="text" maxlength="120" value="${escapeHTML(current.goal)}" placeholder="Masalan: Frontend dasturchi bo‘lish" />
          </label>
          <label class="profile-field-full">Qisqacha o‘zim haqimda
            <textarea id="profileBioInput" name="bio" rows="3" maxlength="300" placeholder="Hozirgi darajangiz yoki qiziqishlaringiz...">${escapeHTML(current.bio)}</textarea>
          </label>
        </div>

        <div class="profile-modal-actions">
          <button type="button" class="ghost-button" data-close-modal>Bekor qilish</button>
          <button type="submit" class="primary-button">Profilni saqlash</button>
        </div>
      </form>
    `,
    onMount(backdrop) {
      const form = backdrop.querySelector('#learnerProfileForm');
      const canvas = backdrop.querySelector('#avatarCropCanvas');
      const ctx = canvas.getContext('2d');
      const stage = backdrop.querySelector('#cropperStage');
      const emptyEl = backdrop.querySelector('#cropperEmpty');
      const hintEl = backdrop.querySelector('#cropperHint');
      const fileInput = backdrop.querySelector('#avatarFileInput');
      const removeBtn = backdrop.querySelector('#removeAvatarBtn');
      const zoomBox = backdrop.querySelector('#cropperZoomBox');
      const zoomSlider = backdrop.querySelector('#avatarZoomSlider');
      const zoomValEl = backdrop.querySelector('#avatarZoomValue');
      const zoomOutBtn = backdrop.querySelector('#zoomOutBtn');
      const zoomInBtn = backdrop.querySelector('#zoomInBtn');
      const centerBtn = backdrop.querySelector('#centerAvatarBtn');

      let activeImg = null;
      let zoom = 1;
      let offsetX = 0;
      let offsetY = 0;
      let imageDirty = false;
      let imageRemoved = false;

      const draw = () => {
        ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
        if (!activeImg) return;
        const m = computeCropMetrics({
          imgWidth: activeImg.naturalWidth || activeImg.width,
          imgHeight: activeImg.naturalHeight || activeImg.height,
          zoom,
          offsetX,
          offsetY,
          stageSize: CROP_SIZE
        });
        offsetX = m.offsetX;
        offsetY = m.offsetY;
        ctx.drawImage(activeImg, m.x, m.y, m.drawW, m.drawH);
      };

      const setZoom = nextZoom => {
        zoom = Math.min(3, Math.max(1, Number(nextZoom) || 1));
        zoomSlider.value = String(zoom);
        zoomValEl.textContent = `${Math.round(zoom * 100)}%`;
        imageDirty = true;
        draw();
      };

      const enableControls = enabled => {
        emptyEl.classList.toggle('hidden', enabled);
        removeBtn.classList.toggle('hidden', !enabled);
        zoomBox.classList.toggle('is-disabled', !enabled);
        zoomSlider.disabled = !enabled;
        zoomOutBtn.disabled = !enabled;
        zoomInBtn.disabled = !enabled;
        centerBtn.disabled = !enabled;
        hintEl.textContent = enabled
          ? 'Rasmni sichqoncha yoki barmoq bilan suring, o‘lchamini slaydordan sozlang'
          : 'JPG, PNG yoki WebP rasm yuklang';
      };

      const loadImageSrc = (src, markDirty) => {
        const img = new Image();
        img.onload = () => {
          activeImg = img;
          zoom = 1;
          offsetX = 0;
          offsetY = 0;
          imageRemoved = false;
          imageDirty = markDirty;
          zoomSlider.value = '1';
          zoomValEl.textContent = '100%';
          enableControls(true);
          draw();
        };
        img.src = src;
      };

      if (current.avatar) {
        loadImageSrc(current.avatar, false);
      } else {
        enableControls(false);
      }

      fileInput.addEventListener('change', event => {
        const file = event.target.files?.[0];
        if (!file) return;
        if (!file.type.startsWith('image/')) {
          notify('Faqat rasm faylini tanlang (JPG, PNG, WebP)');
          return;
        }
        if (file.size > 10 * 1024 * 1024) {
          notify('Rasm hajmi 10 MB dan kichik bo‘lsin');
          return;
        }
        const reader = new FileReader();
        reader.onload = () => {
          if (typeof reader.result === 'string') {
            loadImageSrc(reader.result, true);
          }
        };
        reader.readAsDataURL(file);
        event.target.value = '';
      });

      removeBtn.addEventListener('click', () => {
        activeImg = null;
        imageRemoved = true;
        imageDirty = false;
        ctx.clearRect(0, 0, CROP_SIZE, CROP_SIZE);
        enableControls(false);
      });

      zoomSlider.addEventListener('input', () => setZoom(zoomSlider.value));
      zoomOutBtn.addEventListener('click', () => setZoom(zoom - 0.15));
      zoomInBtn.addEventListener('click', () => setZoom(zoom + 0.15));
      centerBtn.addEventListener('click', () => {
        offsetX = 0;
        offsetY = 0;
        imageDirty = true;
        draw();
      });

      // Mouse and touch drag to pan image inside the crop circle
      let dragging = false;
      let dragStartX = 0;
      let dragStartY = 0;
      let baseOffsetX = 0;
      let baseOffsetY = 0;

      stage.addEventListener('pointerdown', e => {
        if (!activeImg) return;
        dragging = true;
        dragStartX = e.clientX;
        dragStartY = e.clientY;
        baseOffsetX = offsetX;
        baseOffsetY = offsetY;
        stage.classList.add('is-dragging');
        stage.setPointerCapture?.(e.pointerId);
      });

      stage.addEventListener('pointermove', e => {
        if (!dragging || !activeImg) return;
        offsetX = baseOffsetX + (e.clientX - dragStartX);
        offsetY = baseOffsetY + (e.clientY - dragStartY);
        imageDirty = true;
        draw();
      });

      const stopDrag = () => {
        if (!dragging) return;
        dragging = false;
        stage.classList.remove('is-dragging');
      };
      stage.addEventListener('pointerup', stopDrag);
      stage.addEventListener('pointercancel', stopDrag);

      stage.addEventListener(
        'wheel',
        e => {
          if (!activeImg) return;
          e.preventDefault();
          const delta = e.deltaY < 0 ? 0.1 : -0.1;
          setZoom(zoom + delta);
        },
        { passive: false }
      );

      form.addEventListener('submit', e => {
        e.preventDefault();
        const fullName = backdrop.querySelector('#profileNameInput').value.trim();
        const goal = backdrop.querySelector('#profileGoalInput').value.trim();
        const bio = backdrop.querySelector('#profileBioInput').value.trim();

        let nextAvatar = current.avatar;
        if (imageRemoved) {
          nextAvatar = '';
        } else if (activeImg && imageDirty) {
          const outCanvas = document.createElement('canvas');
          outCanvas.width = EXPORT_SIZE;
          outCanvas.height = EXPORT_SIZE;
          const outCtx = outCanvas.getContext('2d');
          outCtx.fillStyle = '#FFFFFF';
          outCtx.fillRect(0, 0, EXPORT_SIZE, EXPORT_SIZE);
          const m = computeCropMetrics({
            imgWidth: activeImg.naturalWidth || activeImg.width,
            imgHeight: activeImg.naturalHeight || activeImg.height,
            zoom,
            offsetX,
            offsetY,
            stageSize: CROP_SIZE
          });
          const ratio = EXPORT_SIZE / CROP_SIZE;
          outCtx.drawImage(activeImg, m.x * ratio, m.y * ratio, m.drawW * ratio, m.drawH * ratio);
          nextAvatar = outCanvas.toDataURL('image/jpeg', 0.86);
        }

        onSave({ fullName, goal, bio, avatar: nextAvatar });
        closeModal();
        notify('O‘quvchi profili saqlandi');
      });
    }
  });
}
