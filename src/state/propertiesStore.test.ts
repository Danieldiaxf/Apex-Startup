import { describe, it, expect, beforeEach } from 'vitest';
import {
  setProperties,
  getProperties,
  setFilter,
  setSearch,
  getFilteredProperties,
  type Property
} from './propertiesStore';

const makeProperty = (overrides: Partial<Property> = {}): Property => ({
  id: '1',
  title: 'Casa no Lago',
  location: 'Lago Sul',
  price: 1000000,
  type: 'venda',
  beds: 3,
  baths: 2,
  area: 200,
  image: 'img.jpg',
  description: 'Teste',
  ...overrides
});

describe('propertiesStore', () => {
  beforeEach(() => {
    setProperties([]);
    setFilter('todos');
    setSearch('');
  });

  it('setProperties e getProperties devem armazenar a lista', () => {
    const list = [makeProperty({ id: '1' }), makeProperty({ id: '2' })];
    setProperties(list);
    expect(getProperties()).toHaveLength(2);
  });

  it('getFilteredProperties deve filtrar por tipo (venda/aluguel)', () => {
    setProperties([
      makeProperty({ id: '1', type: 'venda' }),
      makeProperty({ id: '2', type: 'aluguel' })
    ]);

    setFilter('venda');
    expect(getFilteredProperties().map((p) => p.id)).toEqual(['1']);

    setFilter('aluguel');
    expect(getFilteredProperties().map((p) => p.id)).toEqual(['2']);

    setFilter('todos');
    expect(getFilteredProperties()).toHaveLength(2);
  });

  it('getFilteredProperties deve aplicar busca em título e localização', () => {
    setProperties([
      makeProperty({ id: '1', title: 'Apartamento Centro', location: 'Plano Piloto' }),
      makeProperty({ id: '2', title: 'Casa Lago', location: 'Lago Sul' })
    ]);

    setFilter('todos');
    setSearch('lago');
    const result = getFilteredProperties();
    expect(result.map((p) => p.id)).toEqual(['2']);
  });

  it('setFilter deve cair em "todos" para valores inválidos', () => {
    setProperties([makeProperty({ id: '1', type: 'venda' })]);
    // @ts-expect-error teste de valor inválido
    setFilter('invalido');
    const result = getFilteredProperties();
    expect(result).toHaveLength(1);
  });
});


