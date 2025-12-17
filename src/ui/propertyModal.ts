/**
 * propertyModal.ts - Modal de detalhes do imóvel
 * 
 * Responsabilidades:
 * - Exibe informações completas do imóvel selecionado
 * - Renderiza galeria de imagens com navegação
 * - Integra com lightbox para visualização ampliada
 * - Formata valores monetários e dados do imóvel
 */

import { formatCurrency, formatMoney } from '../utils/formatters';
import { toggleModal, updateLucideIcons } from '../utils/ui';
import { openLightbox } from './lightbox';
import type { Property } from '../state/propertiesStore';

// Dependência global de ícones (carregada via CDN no index.html)
declare const lucide: any;

let currentOpenProperty: Property | null = null;

export function openPropertyModal(property: Property) {
  currentOpenProperty = property;
  const imageEl = document.getElementById('modal-image') as HTMLImageElement | null;
  const titleEl = document.getElementById('modal-title');
  const descEl = document.getElementById('modal-description');
  const priceEl = document.getElementById('modal-price');
  const locationEl = document.getElementById('modal-location');

  const bedsEl = document.getElementById('modal-beds');
  const bathsEl = document.getElementById('modal-baths');
  const garagesEl = document.getElementById('modal-garages');
  const areaEl = document.getElementById('modal-area');
  const iptuEl = document.getElementById('modal-iptu');
  const condoEl = document.getElementById('modal-condo');
  const badge = document.getElementById('modal-badge');
  const gallerySection = document.getElementById('modal-gallery-section');
  const galleryGrid = document.getElementById('modal-gallery-grid');

  if (
    !imageEl ||
    !titleEl ||
    !descEl ||
    !priceEl ||
    !locationEl ||
    !bedsEl ||
    !bathsEl ||
    !garagesEl ||
    !areaEl ||
    !iptuEl ||
    !condoEl ||
    !badge ||
    !gallerySection ||
    !galleryGrid
  )
    return;

  imageEl.src = property.image;
  titleEl.textContent = property.title;
  descEl.textContent = property.description;
  priceEl.textContent = formatCurrency(property.price, property.type);
  locationEl.textContent = property.location;

  bedsEl.textContent = String(property.beds);
  bathsEl.textContent = String(property.baths);
  garagesEl.textContent = String(property.garages || 0);
  areaEl.textContent = `${property.area}m²`;
  iptuEl.textContent = formatMoney(property.iptu || 0);
  condoEl.textContent = formatMoney(property.condo || 0);

  badge.textContent = property.type;
  badge.className = `px-2 py-1 text-xs font-bold uppercase tracking-wide rounded ${
    property.type === 'venda' ? 'bg-black text-white' : 'bg-emerald-100 text-emerald-800'
  }`;

  galleryGrid.innerHTML = '';

  if (property.gallery && property.gallery.length > 0) {
    gallerySection.classList.remove('hidden');

    const fullGalleryList = [property.image, ...property.gallery];

    property.gallery.forEach((imgUrl: string, index: number) => {
      const imgContainer = document.createElement('div');
      imgContainer.className =
        'rounded-lg overflow-hidden h-32 md:h-40 border border-zinc-200 shadow-sm relative group cursor-pointer';

      imgContainer.onclick = () => {
        openLightbox(index + 1, fullGalleryList);
      };

      const img = document.createElement('img');
      img.src = imgUrl;
      img.className = 'w-full h-full object-cover zoom-img';
      img.alt = 'Detalhe do imóvel';

      const icon = document.createElement('div');
      icon.className =
        'absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100';
      icon.innerHTML = `<i data-lucide="maximize-2" class="text-white"></i>`;

      imgContainer.appendChild(img);
      imgContainer.appendChild(icon);
      galleryGrid.appendChild(imgContainer);
    });
    updateLucideIcons();
  } else {
    gallerySection.classList.add('hidden');
  }

  toggleModal('property-modal', true);
}

// Função auxiliar para abrir o lightbox clicando na imagem principal do modal
function openLightboxFromMain() {
  if (currentOpenProperty) {
    const fullGalleryList =
      currentOpenProperty.gallery && currentOpenProperty.gallery.length > 0
        ? [currentOpenProperty.image, ...(currentOpenProperty.gallery as string[])]
        : [currentOpenProperty.image];
    openLightbox(0, fullGalleryList);
  }
}

// Expor no window para ser usado no HTML inline
(window as any).openLightboxFromMain = openLightboxFromMain;


