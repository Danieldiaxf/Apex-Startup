/**
 * adminPanel.ts - Painel administrativo
 * 
 * Responsabilidades:
 * - Controla visibilidade do botão de admin (baseado em autenticação)
 * - Renderiza lista de imóveis no painel administrativo
 * - Abre modal do painel com ações de edição/exclusão
 */

import { formatCurrency } from '../utils/formatters';
import { updateLucideIcons } from '../utils/ui';
import type { Property } from '../state/propertiesStore';

// Dependência global de ícones (CDN)
declare const lucide: any;

export function updateAdminUI(isAdmin: boolean) {
  const btn = document.getElementById('admin-panel-btn');
  if (!btn) return;
  if (isAdmin) btn.classList.remove('hidden');
  else btn.classList.add('hidden');
}

export function updateAdminList(properties: Property[]) {
  const list = document.getElementById('admin-list-body');
  if (!list) return;
  list.innerHTML = '';

  properties.forEach((p) => {
    const tr = document.createElement('tr');
    tr.className = 'border-b border-zinc-200 hover:bg-zinc-100 transition-colors';
    tr.innerHTML = `
      <td class="py-3 pl-2 font-medium text-zinc-700">${p.title}</td>
      <td class="py-3 text-zinc-500">${formatCurrency(p.price, p.type)}</td>
      <td class="py-3"><span class="text-xs font-bold uppercase bg-zinc-200 text-zinc-600 px-2 py-1 rounded">${p.type}</span></td>
      <td class="py-3 pr-2 text-right gap-2">
        <button onclick='openEditModal("${p.id}")' class="text-emerald-600 hover:text-emerald-800 mr-3 font-medium text-xs admin-btn">Editar</button>
        <button onclick='window.deletePropertyFromDb("${p.id}")' class="text-red-500 hover:text-red-700 font-medium text-xs admin-btn">Excluir</button>
      </td>
    `;
    list.appendChild(tr);
  });

  updateLucideIcons();
}

export function openAdminPanel(properties: Property[]) {
  updateAdminList(properties);
  const modal = document.getElementById('admin-panel-modal');
  if (!modal) return;
  modal.classList.remove('hidden');
  document.body.classList.add('modal-open');
}


