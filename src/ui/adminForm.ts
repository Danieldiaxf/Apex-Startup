/**
 * adminForm.ts - Formulário de criação/edição de imóveis
 * 
 * Responsabilidades:
 * - Gerencia formulário de criação/edição de imóveis
 * - Preenche campos com dados existentes (modo edição)
 * - Controla estado de botões e badges (contagem de galeria)
 * - Abre modal do formulário
 * 
 * Nota: A submissão do formulário (handleAdminSubmit) está em main.ts
 * e deve ser migrada para este módulo no futuro.
 */

import type { Property } from '../state/propertiesStore';
import { toggleModal } from '../utils/ui';

export function openEditModal(property: Property | null) {
  const form = document.getElementById('property-form') as HTMLFormElement | null;
  const title = document.getElementById('form-title');
  const galleryBadge = document.getElementById('gallery-count-badge');
  const clearGalleryBtn = document.getElementById('btn-clear-gallery') as HTMLButtonElement | null;
  const editIdInput = document.getElementById('edit-id') as HTMLInputElement | null;
  const imageFileInput = document.getElementById('image-file-input') as HTMLInputElement | null;
  const galleryFileInput = document.getElementById('gallery-file-input') as HTMLInputElement | null;
  const imageUrlInput = document.getElementById('image-url-input') as HTMLInputElement | null;
  const imagePreviewStatus = document.getElementById('image-preview-status');

  if (
    !form ||
    !title ||
    !galleryBadge ||
    !clearGalleryBtn ||
    !editIdInput ||
    !imageFileInput ||
    !galleryFileInput ||
    !imageUrlInput ||
    !imagePreviewStatus
  )
    return;

  imageFileInput.value = '';
  galleryFileInput.value = '';

  if (property) {
    editIdInput.value = property.id;
    title.textContent = 'Editar Imóvel';

    (form.elements.namedItem('title') as HTMLInputElement).value = property.title;
    (form.elements.namedItem('location') as HTMLInputElement).value = property.location;
    (form.elements.namedItem('price') as HTMLInputElement).value = String(property.price);
    (form.elements.namedItem('type') as HTMLSelectElement).value = property.type;
    (form.elements.namedItem('beds') as HTMLInputElement).value = String(property.beds);
    (form.elements.namedItem('baths') as HTMLInputElement).value = String(property.baths);
    (form.elements.namedItem('garages') as HTMLInputElement).value = String(property.garages || 0);
    (form.elements.namedItem('area') as HTMLInputElement).value = String(property.area);
    (form.elements.namedItem('iptu') as HTMLInputElement).value = String(property.iptu || 0);
    (form.elements.namedItem('condo') as HTMLInputElement).value = String(property.condo || 0);

    imageUrlInput.value = property.image;
    if (property.image && property.image.length > 50) {
      imagePreviewStatus.innerHTML = `Imagem atual salva (Base64)`;
    } else {
      imagePreviewStatus.innerHTML = `Imagem atual: <a href="${property.image}" target="_blank" class="text-emerald-600 hover:underline">Ver link</a>`;
    }

    const galleryCount = property.gallery ? property.gallery.length : 0;
    galleryBadge.textContent = `${galleryCount} fotos atuais`;
    galleryBadge.classList.remove('hidden');

    if (galleryCount > 0) {
      clearGalleryBtn.classList.remove('hidden');
      // o onclick específico é configurado em main.ts com o id correto
    } else {
      clearGalleryBtn.classList.add('hidden');
    }

    (form.elements.namedItem('description') as HTMLTextAreaElement).value = property.description;
    (form.elements.namedItem('featured') as HTMLInputElement).checked = !!property.featured;
  } else {
    editIdInput.value = '';
    title.textContent = 'Novo Imóvel';

    imageUrlInput.value = '';
    imagePreviewStatus.innerHTML = '';

    galleryBadge.classList.add('hidden');
    clearGalleryBtn.classList.add('hidden');

    form.reset();
  }

  toggleModal('admin-modal', true);
}


