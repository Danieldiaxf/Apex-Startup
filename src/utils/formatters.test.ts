import { describe, it, expect } from 'vitest';
import { formatCurrency, formatMoney, normalizeText } from './formatters';

describe('formatters', () => {
  it('formatCurrency deve formatar valor de venda em BRL sem sufixo', () => {
    const result = formatCurrency(1000000, 'venda');
    expect(result).toContain('R$');
    expect(result.endsWith('/mês')).toBe(false);
  });

  it('formatCurrency deve adicionar /mês para aluguel', () => {
    const result = formatCurrency(2500, 'aluguel');
    expect(result).toContain('R$');
    expect(result.endsWith('/mês')).toBe(true);
  });

  it('formatMoney deve formatar valores em BRL', () => {
    const result = formatMoney(123456);
    expect(result).toContain('R$');
  });

  it('normalizeText deve remover acentos e deixar minúsculo', () => {
    const original = 'Água DoçE Çedilha';
    const normalized = normalizeText(original);
    expect(normalized).toBe('agua doce cedilha');
  });

  it('normalizeText deve lidar com null/undefined', () => {
    // @ts-expect-error teste de parâmetro nulo
    const normalizedNull = normalizeText(null);
    expect(normalizedNull).toBe('');
    // @ts-expect-error teste de parâmetro indefinido
    const normalizedUndefined = normalizeText(undefined);
    expect(normalizedUndefined).toBe('');
  });
});


