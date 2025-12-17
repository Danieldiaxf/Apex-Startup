/**
 * ui.ts - Utilitários genéricos de interface
 * 
 * Funções:
 * - toggleModal: Controla visibilidade de modais (adiciona/remove classes)
 * - showToast: Exibe notificações temporárias (info/success/error)
 * - debounce: Limita frequência de execução de funções (usado em busca)
 * - updateLucideIcons: Otimiza criação de ícones Lucide (evita chamadas redundantes)
 * 
 * Performance:
 * - updateLucideIcons usa requestAnimationFrame para agrupar atualizações
 */

export function toggleModal(id: string, show: boolean) {
  const el = document.getElementById(id);
  if (!el) return;
  if (show) {
    el.classList.remove('hidden');
    document.body.classList.add('modal-open');
  } else {
    el.classList.add('hidden');
    document.body.classList.remove('modal-open');
  }
}

export type ToastType = 'info' | 'success' | 'error';

export function showToast(msg: string, type: ToastType = 'info') {
  const toast = document.getElementById('toast');
  const msgEl = document.getElementById('toast-msg');
  if (!toast || !msgEl) return;

  msgEl.textContent = msg;
  toast.className = `fixed bottom-4 right-4 px-6 py-3 rounded-lg shadow-lg transform transition-all duration-300 z-[70] ${
    type === 'success'
      ? 'bg-emerald-600 text-white'
      : type === 'error'
      ? 'bg-red-600 text-white'
      : 'bg-zinc-800 text-white'
  }`;

  setTimeout(() => {
    toast.classList.remove('translate-y-20', 'opacity-0');
  }, 10);
  setTimeout(() => {
    toast.classList.add('translate-y-20', 'opacity-0');
  }, 3000);
}

/**
 * Cria uma função com debounce para limitar a frequência de execução
 * @param func Função a ser executada
 * @param delay Delay em milissegundos
 * @returns Função com debounce aplicado
 */
export function debounce<T extends (...args: any[]) => void>(
  func: T,
  delay: number
): (...args: Parameters<T>) => void {
  let timeoutId: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeoutId) clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
}

// Dependência global de ícones (carregada via CDN no index.html)
declare const lucide: any;

/**
 * Otimiza a criação de ícones Lucide, evitando chamadas desnecessárias
 */
let iconsInitialized = false;
let pendingIconUpdate = false;

export function updateLucideIcons(force = false) {
  if (typeof lucide === 'undefined') return;
  
  if (force || !iconsInitialized) {
    lucide.createIcons();
    iconsInitialized = true;
    pendingIconUpdate = false;
  } else {
    // Se já inicializado, marca para atualizar no próximo frame
    if (!pendingIconUpdate) {
      pendingIconUpdate = true;
      requestAnimationFrame(() => {
        lucide.createIcons();
        pendingIconUpdate = false;
      });
    }
  }
}

// Disponibiliza utilitários usados diretamente no HTML
(window as any).toggleModal = toggleModal;


