/**
 * propertiesGrid.ts - Renderização da grid de imóveis
 * 
 * Responsabilidades:
 * - Renderiza cards de imóveis em grid responsivo
 * - Gerencia estado de loading durante carregamento inicial
 * - Exibe mensagens contextuais de estado vazio
 * - Integra com propertyModal para exibir detalhes
 * 
 * Performance:
 * - Utiliza updateLucideIcons() otimizado para evitar re-renderizações desnecessárias
 * - Renderiza apenas após filtragem completa (getFilteredProperties)
 */

import { formatCurrency } from '../utils/formatters';
import { getFilteredProperties, type Property } from '../state/propertiesStore';
import { openPropertyModal } from './propertyModal';
import { updateLucideIcons } from '../utils/ui';

// Dependência global de ícones (carregada via CDN no index.html)
declare const lucide: any;

let isLoading = false;

export function setLoadingState(loading: boolean) {
  isLoading = loading;
  const grid = document.getElementById('properties-grid');
  const emptyState = document.getElementById('empty-state');
  if (!grid || !emptyState) return;

  if (loading) {
    grid.innerHTML = `
      <div class="col-span-full text-center py-10 text-zinc-400">
        <div class="animate-spin inline-block w-8 h-8 border-4 border-current border-t-transparent rounded-full" role="status"></div>
        <p class="mt-2">Carregando Imóveis...</p>
      </div>
    `;
    emptyState.classList.add('hidden');
  }
}

export function renderProperties() {
  const grid = document.getElementById('properties-grid');
  const emptyState = document.getElementById('empty-state');
  if (!grid || !emptyState) return;

  // Se estiver carregando, não renderiza ainda
  if (isLoading) return;

  const filtered = getFilteredProperties();

  grid.innerHTML = '';

  if (filtered.length === 0) {
    emptyState.classList.remove('hidden');
    // Melhora a mensagem de estado vazio baseada no filtro/busca
    const searchText = (document.getElementById('search-input') as HTMLInputElement)?.value || '';
    const filter = document.querySelector('.filter-btn.bg-black')?.getAttribute('data-filter') || 'todos';
    
    let message = 'Nenhum imóvel encontrado.';
    let suggestion = 'Tente ajustar seus filtros de busca.';
    
    if (searchText && filter !== 'todos') {
      suggestion = `Nenhum resultado para "${searchText}" em ${filter === 'venda' ? 'venda' : 'aluguel'}.`;
    } else if (searchText) {
      suggestion = `Nenhum resultado para "${searchText}".`;
    } else if (filter !== 'todos') {
      suggestion = `Nenhum imóvel disponível para ${filter === 'venda' ? 'venda' : 'aluguel'} no momento.`;
    }
    
    emptyState.innerHTML = `
      <div class="mx-auto text-zinc-300 mb-4 w-12 h-12 flex justify-center items-center">
        <i data-lucide="home" width="48"></i>
      </div>
      <h3 class="text-xl font-medium text-zinc-600">${message}</h3>
      <p class="text-zinc-500 mt-2">${suggestion}</p>
    `;
    updateLucideIcons();
  } else {
    emptyState.classList.add('hidden');
    filtered.forEach((property) => {
      const badgeColor =
        property.type === 'venda' ? 'bg-black text-white' : 'bg-emerald-600 text-white';
      const featuredBadge = property.featured
        ? `<span class="px-2 py-1 text-xs font-bold uppercase tracking-wide rounded bg-emerald-500 text-white">Destaque</span>`
        : '';

      const card = document.createElement('div');
      card.className =
        'group bg-white rounded-xl shadow-xl shadow-zinc-200 hover:shadow-2xl hover:shadow-zinc-300 hover:-translate-y-2 hover:border-emerald-400 transition-all duration-300 overflow-hidden border border-zinc-200 cursor-pointer flex flex-col h-full relative';
      card.onclick = (e) => {
        const target = e.target as HTMLElement;
        if (!target.closest('.admin-btn')) openPropertyModal(property);
      };

      card.innerHTML = `
        <div class="relative h-56 overflow-hidden">
          <img src="${property.image}" alt="${
        property.title
      }" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" onerror="this.src='https://via.placeholder.com/800x600?text=Sem+Imagem'"/>
          <div class="absolute top-3 left-3 flex gap-2">
            <span class="px-2 py-1 text-xs font-bold uppercase tracking-wide rounded ${badgeColor}">${
        property.type
      }</span>
            ${featuredBadge}
          </div>
          <div class="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
            <p class="text-white font-bold text-xl">${formatCurrency(
              property.price,
              property.type
            )}</p>
          </div>
        </div>
        <div class="p-5 flex flex-col flex-grow">
          <h3 class="text-lg font-bold text-zinc-800 mb-1 group-hover:text-emerald-700 transition-colors">${
            property.title
          }</h3>
          <div class="flex items-center text-zinc-500 text-sm mb-4">
            <i data-lucide="map-pin" width="16" class="mr-1 text-emerald-500"></i> ${
              property.location
            }
          </div>
          <div class="flex items-center justify-between mt-auto py-4 border-t border-zinc-100 text-zinc-600 text-sm">
            <span class="flex items-center gap-1"><i data-lucide="bed" width="16" class="text-emerald-600"></i> ${
              property.beds
            }</span>
            <span class="flex items-center gap-1"><i data-lucide="bath" width="16" class="text-emerald-600"></i> ${
              property.baths
            }</span>
            <span class="flex items-center gap-1"><i data-lucide="car" width="16" class="text-emerald-600"></i> ${
              property.garages || 0
            }</span>
            <span class="flex items-center gap-1"><i data-lucide="square" width="16" class="text-emerald-600"></i> ${
              property.area
            }m²</span>
          </div>
          <button class="w-full mt-2 py-2 text-emerald-700 font-semibold text-sm border border-emerald-100 rounded hover:bg-emerald-100 hover:text-emerald-800 transition-colors">Ver Detalhes</button>
        </div>
      `;
      grid.appendChild(card);
    });
    // Otimiza a criação de ícones apenas após renderizar todos os cards
    updateLucideIcons();
  }
}


