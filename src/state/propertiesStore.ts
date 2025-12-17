/**
 * propertiesStore.ts - Gerenciamento de estado centralizado
 * 
 * Responsabilidades:
 * - Armazena lista de imóveis carregados do Firestore
 * - Gerencia filtros (todos/venda/aluguel)
 * - Gerencia busca por texto (título/localização)
 * - Fornece função de filtragem combinada (tipo + busca)
 * 
 * Padrão: Store simples com funções getter/setter
 * Futuro: Considerar migração para biblioteca de estado reativa (Zustand, Valtio)
 */

import { normalizeText } from '../utils/formatters';

export type PropertyType = 'venda' | 'aluguel';

export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  type: PropertyType;
  beds: number;
  baths: number;
  garages?: number;
  area: number;
  iptu?: number | null;
  condo?: number | null;
  image: string;
  gallery?: string[];
  description: string;
  featured?: boolean;
  updatedAt?: unknown;
  updatedBy?: string | null;
}

let properties: Property[] = [];
let currentFilter: 'todos' | PropertyType = 'todos';
let currentSearch = '';

export function setProperties(list: Property[]) {
  properties = list;
}

export function getProperties(): Property[] {
  return properties;
}

export function setFilter(filter: string) {
  if (filter === 'venda' || filter === 'aluguel' || filter === 'todos') {
    currentFilter = filter;
  } else {
    currentFilter = 'todos';
  }
}

export function getFilter(): 'todos' | PropertyType {
  return currentFilter;
}

export function setSearch(search: string) {
  currentSearch = search;
}

export function getSearch(): string {
  return currentSearch;
}

export function getFilteredProperties(): Property[] {
  const searchNormalized = normalizeText(currentSearch);

  return properties.filter((p) => {
    const matchesType = currentFilter === 'todos' ? true : p.type === currentFilter;

    const titleNormalized = normalizeText(p.title);
    const locationNormalized = normalizeText(p.location);

    const matchesSearch =
      titleNormalized.includes(searchNormalized) || locationNormalized.includes(searchNormalized);

    return matchesType && matchesSearch;
  });
}

