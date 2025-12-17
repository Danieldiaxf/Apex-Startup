/**
 * lightbox.ts - Visualizador de imagens em tela cheia
 * 
 * Responsabilidades:
 * - Exibe imagens em modal fullscreen
 * - Navegação entre imagens (anterior/próxima)
 * - Suporte a teclado (ESC, setas)
 * - Contador de imagens (X / Y)
 * 
 * Nota: Funções são expostas globalmente (window) para uso em onclick do HTML
 */

let lightboxImages: string[] = [];
let lightboxIndex = 0;

function updateLightboxUI() {
  const imgEl = document.getElementById('lightbox-img') as HTMLImageElement | null;
  const counterEl = document.getElementById('lightbox-counter');
  if (!imgEl || !counterEl) return;

  imgEl.src = lightboxImages[lightboxIndex];
  counterEl.textContent = `${lightboxIndex + 1} / ${lightboxImages.length}`;
}

function handleLightboxKeys(e: KeyboardEvent) {
  if (e.key === 'Escape') closeLightbox();
  if (e.key === 'ArrowRight') navigateLightbox(1);
  if (e.key === 'ArrowLeft') navigateLightbox(-1);
}

export function openLightbox(index: number, imagesArray: string[]) {
  if (!imagesArray || imagesArray.length === 0) return;

  lightboxImages = imagesArray;
  lightboxIndex = index;

  updateLightboxUI();

  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  modal.classList.remove('hidden');

  document.addEventListener('keydown', handleLightboxKeys);
}

export function closeLightbox() {
  const modal = document.getElementById('lightbox-modal');
  if (!modal) return;
  modal.classList.add('hidden');
  document.removeEventListener('keydown', handleLightboxKeys);
}

export function navigateLightbox(step: number) {
  lightboxIndex += step;

  if (lightboxIndex >= lightboxImages.length) {
    lightboxIndex = 0;
  } else if (lightboxIndex < 0) {
    lightboxIndex = lightboxImages.length - 1;
  }

  updateLightboxUI();
}

// Disponibiliza funções usadas diretamente no HTML
(window as any).closeLightbox = closeLightbox;
(window as any).navigateLightbox = navigateLightbox;


