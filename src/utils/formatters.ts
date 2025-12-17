/**
 * formatters.ts - Utilitários de formatação de dados
 * 
 * Funções:
 * - formatCurrency: Formata valores monetários com prefixo (R$ ou Aluguel)
 * - formatMoney: Formata números como moeda brasileira (R$ X.XXX,XX)
 * - normalizeText: Remove acentos e converte para minúsculas (busca case-insensitive)
 * 
 * Testes: src/utils/formatters.test.ts
 */

export const formatCurrency = (value: number, type: string) => {
  return (
    new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
      maximumFractionDigits: 0
    }).format(value) + (type === 'aluguel' ? '/mês' : '')
  );
};

export const formatMoney = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0
  }).format(value);
};

export const normalizeText = (text: string | undefined | null) => {
  return (text || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};


