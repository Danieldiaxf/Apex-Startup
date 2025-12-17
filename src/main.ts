/**
 * main.ts - Ponto de entrada da aplicação Prime House
 * 
 * Responsabilidades:
 * - Inicialização e autenticação (anônima e admin)
 * - Gerenciamento de estado de autenticação
 * - Coordenação entre serviços, store e UI
 * - Event handlers para filtros, busca e menu mobile
 * - Operações administrativas (CRUD de imóveis)
 * 
 * Fluxo principal:
 * 1. DOMContentLoaded → Inicializa ícones e event listeners
 * 2. onAuthStateChanged → Autentica usuário (anônimo ou admin)
 * 3. initApp() → Subscribe Firestore → Atualiza store → Renderiza UI
 */

import {
  signInAnonymously,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  type User
} from 'firebase/auth';
import { addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import { formatMoney } from './utils/formatters';
import { toggleModal, showToast, debounce, updateLucideIcons } from './utils/ui';
import { auth, db, subscribeToImoveis } from './services/firebaseService';
import {
  type Property,
  setProperties,
  getProperties,
  setFilter,
  getFilter,
  setSearch
} from './state/propertiesStore';
import { renderProperties, setLoadingState } from './ui/propertiesGrid';
import { updateAdminUI as updateAdminUIUi, updateAdminList as updateAdminListUi, openAdminPanel as openAdminPanelUi } from './ui/adminPanel';
import { openEditModal as openEditModalUi } from './ui/adminForm';
import { setupContactForm } from './ui/contactForm';

// Dependências globais vindas via CDN em index.html
declare const lucide: any;
declare const emailjs: any;

let currentUser: User | null = null;
let isAdmin = false;

const ADMIN_HASH = 'YWRtaW5AcHJpbWVob3VzZS5jb20=';

// =========================
// Admin / Firestore Operations
// =========================
// Funções para compressão de imagens e operações CRUD de imóveis

function compressImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (event) => {
      const img = new Image();
      if (!event?.target) {
        reject(new Error('Falha ao ler imagem'));
        return;
      }
      img.src = String(event.target.result);
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          reject(new Error('Canvas não suportado'));
          return;
        }

        const MAX_WIDTH = 800;
        let width = img.width;
        let height = img.height;

        if (width > MAX_WIDTH) {
          height *= MAX_WIDTH / width;
          width = MAX_WIDTH;
        }

        canvas.width = width;
        canvas.height = height;

        ctx.drawImage(img, 0, 0, width, height);

        const dataUrl = canvas.toDataURL('image/jpeg', 0.6);
        resolve(dataUrl);
      };
      img.onerror = (err) => reject(err);
    };
    reader.onerror = (err) => reject(err);
  });
}

async function handleAdminSubmit(event: Event) {
  event.preventDefault();

  if (!isAdmin) {
    showToast('Acesso negado: Você não é administrador.', 'error');
    return;
  }

  const form = event.target as HTMLFormElement;
  const submitBtn = form.querySelector('button[type="submit"]') as HTMLButtonElement | null;
  if (!submitBtn) return;

  const originalBtnText = submitBtn.textContent || '';
  submitBtn.disabled = true;
  submitBtn.textContent = 'Processando imagens...';

  try {
    const formData = new FormData(form);
    const idInput = document.getElementById('edit-id') as HTMLInputElement | null;
    const id = idInput?.value || '';

    const fileInput = document.getElementById('image-file-input') as HTMLInputElement | null;
    const file = fileInput?.files?.[0];
    const imageUrlInput = document.getElementById('image-url-input') as HTMLInputElement | null;
    let mainImageUrl = imageUrlInput?.value || '';

    if (file) {
      submitBtn.textContent = 'Otimizando capa...';
      mainImageUrl = await compressImage(file);
    }

    if (!mainImageUrl) {
      throw new Error('É necessário enviar uma imagem principal.');
    }

    const galleryInput = document.getElementById('gallery-file-input') as HTMLInputElement | null;
    const galleryFiles = galleryInput?.files || new FileList();
    let newGalleryUrls: string[] = [];

    if (galleryFiles && galleryFiles.length > 0) {
      submitBtn.textContent = `Otimizando galeria (${galleryFiles.length} fotos)...`;
      const processPromises = Array.from(galleryFiles).map((file) => compressImage(file));
      newGalleryUrls = await Promise.all(processPromises);
    }

    let existingGallery: string[] = [];
    if (id) {
      const currentProp = getProperties().find((p) => p.id === id);
      if (currentProp && currentProp.gallery) {
        existingGallery = currentProp.gallery;
      }
    }

    const finalGallery = [...existingGallery, ...newGalleryUrls];

    const data: any = {
      title: formData.get('title'),
      location: formData.get('location'),
      price: Number(formData.get('price')),
      type: formData.get('type'),
      beds: Number(formData.get('beds')),
      baths: Number(formData.get('baths')),
      garages: Number(formData.get('garages') || 0),
      area: Number(formData.get('area')),
      iptu: Number(formData.get('iptu') || 0),
      condo: Number(formData.get('condo') || 0),
      image: mainImageUrl,
      gallery: finalGallery,
      description: formData.get('description'),
      featured: formData.get('featured') === 'on',
      updatedAt: new Date(),
      updatedBy: auth.currentUser?.email || null
    };

    submitBtn.textContent = 'Salvando no banco...';
    if (id) {
      const docRef = doc(db, 'imoveis', id);
      await updateDoc(docRef, data);
      showToast('Imóvel atualizado com sucesso!', 'success');
    } else {
      await addDoc(getCollectionRef(), data);
      showToast('Imóvel criado com sucesso!', 'success');
    }

    toggleModal('admin-modal', false);
  } catch (e: any) {
    console.error('Erro no processo:', e);
    if (e.code === 'permission-denied') {
      showToast('ERRO DE PERMISSÃO: Sua conta não tem autorização para gravar dados.', 'error');
    } else if (e.message && e.message.includes('exceeds the maximum size')) {
      showToast('Erro: Muitas fotos. O tamanho máximo foi excedido.', 'error');
    } else {
      showToast(e.message || 'Erro ao salvar.', 'error');
    }
  } finally {
    submitBtn.disabled = false;
    submitBtn.textContent = originalBtnText;
  }
}

async function deletePropertyFromDb(id: string) {
  if (!isAdmin) {
    showToast('Acesso negado.', 'error');
    return;
  }
  if (!confirm('Tem certeza que deseja excluir este imóvel?')) return;
  try {
    const docRef = doc(db, 'imoveis', id);
    await deleteDoc(docRef);
    showToast('Imóvel removido.', 'success');
  } catch (e: any) {
    console.error('Erro ao deletar', e);
    if (e.code === 'permission-denied') {
      showToast('ERRO: Somente o Administrador pode excluir.', 'error');
    } else {
      showToast('Erro ao deletar.', 'error');
    }
  }
}

async function clearGallery(id: string) {
  if (!isAdmin) return;
  if (!confirm('Isso removerá todas as fotos da galeria deste imóvel. Confirmar?')) return;
  try {
    const docRef = doc(db, 'imoveis', id);
    await updateDoc(docRef, { gallery: [] });
    showToast('Galeria limpa.', 'success');
  } catch (e) {
    console.error(e);
    showToast('Erro ao limpar galeria.', 'error');
  }
}

(window as any).handleAdminSubmit = handleAdminSubmit;
(window as any).deletePropertyFromDb = deletePropertyFromDb;
(window as any).clearGallery = clearGallery;

// =========================
// Authentication (Login / Logout)
// =========================
// Gerencia autenticação de administradores e usuários anônimos

async function handleLogin(e: Event) {
  e.preventDefault();
  const form = e.target as HTMLFormElement;
  const emailInput = document.getElementById('login-email') as HTMLInputElement | null;
  const passInput = document.getElementById('login-password') as HTMLInputElement | null;
  const btn = form.querySelector('button') as HTMLButtonElement | null;

  if (!emailInput || !passInput || !btn) return;

  const email = emailInput.value;
  const pass = passInput.value;

  try {
    btn.textContent = 'Verificando...';
    btn.disabled = true;

    await signInWithEmailAndPassword(auth, email, pass);

    toggleModal('login-modal', false);
    form.reset();
  } catch (error: any) {
    console.error('Erro login:', error);
    if (error.code === 'auth/invalid-credential' || error.code === 'auth/wrong-password') {
      showToast('Email ou senha incorretos.', 'error');
    } else {
      showToast('Erro ao entrar: ' + error.message, 'error');
    }
  } finally {
    btn.textContent = 'Entrar';
    btn.disabled = false;
  }
}

async function handleLogout() {
  try {
    await signOut(auth);
    isAdmin = false;
    updateAdminUI();
    toggleModal('admin-panel-modal', false);
    showToast('Logout realizado.', 'success');
  } catch (error) {
    console.error('Erro logout', error);
  }
}

(window as any).handleLogin = handleLogin;
(window as any).handleLogout = handleLogout;

(window as any).isAdminUser = () => isAdmin;

// =========================
// Admin UI Coordination
// =========================
// Coordena a exibição e atualização da interface administrativa

function updateAdminUI() {
  updateAdminUIUi(isAdmin);
}

function openAdminPanel() {
  openAdminPanelUi(getProperties());
}

(window as any).openAdminPanel = openAdminPanel;

function updateAdminList() {
  updateAdminListUi(getProperties());
}

function openEditModal(id: string | null = null) {
  const properties = getProperties();
  const property = id ? properties.find((p) => p.id === id) || null : null;
  const clearGalleryBtn = document.getElementById('btn-clear-gallery') as HTMLButtonElement | null;

  if (clearGalleryBtn && id) {
    clearGalleryBtn.onclick = () => clearGallery(id);
  }

  openEditModalUi(property as Property | null);
}

(window as any).openEditModal = openEditModal;

// =========================
// Filters, Search & General UI
// =========================
// Configura event listeners para filtros, busca e menu mobile

function setupFiltersAndSearch() {
  const filterBtns = document.querySelectorAll<HTMLButtonElement>('.filter-btn');
  const heroFilterSelect = document.getElementById(
    'hero-filter-select'
  ) as HTMLSelectElement | null;
  const searchInput = document.getElementById('search-input') as HTMLInputElement | null;

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      const value = target.getAttribute('data-filter') || 'todos';
      setFilter(value);
      filterBtns.forEach((b) => {
        b.classList.remove('bg-black', 'text-white', 'shadow');
        b.classList.add('text-zinc-500', 'hover:text-black');
      });
      target.classList.remove('text-zinc-500', 'hover:text-black');
      target.classList.add('bg-black', 'text-white', 'shadow');
      if (heroFilterSelect) heroFilterSelect.value = value;
      renderProperties();
    });
  });

  if (heroFilterSelect) {
    heroFilterSelect.addEventListener('change', (e) => {
      const value = (e.target as HTMLSelectElement).value;
      setFilter(value);
      const btn = document.querySelector<HTMLButtonElement>(
        `.filter-btn[data-filter="${value}"]`
      );
      if (btn) btn.click();
    });
  }

  if (searchInput) {
    // Debounce de 250ms para evitar renderizações excessivas durante a digitação
    const debouncedSearch = debounce((value: string) => {
      setSearch(value);
      renderProperties();
    }, 250);
    
    searchInput.addEventListener('input', (e) => {
      debouncedSearch((e.target as HTMLInputElement).value);
    });
  }

  const mobileMenuBtn = document.getElementById('mobile-menu-btn');
  const mobileMenu = document.getElementById('mobile-menu');
  if (mobileMenuBtn && mobileMenu) {
    mobileMenuBtn.addEventListener('click', () => {
      mobileMenu.classList.toggle('hidden');
    });
  }
}

// =========================
// Contact Form / EmailJS Integration
// =========================
// Configura máscara de telefone e envio de emails via EmailJS

function setupContactForm() {
  // Inicialização do EmailJS
  emailjs.init('yPtGfWJgxfETRB5LP');

  const phoneInput = document.getElementById('form-phone') as HTMLInputElement | null;
  const contactForm = document.getElementById('contact-form') as HTMLFormElement | null;
  const contactFormBtn = contactForm?.querySelector(
    'button[type="submit"]'
  ) as HTMLButtonElement | null;
  const checkIcon = document.getElementById('phone-check');

  if (!phoneInput || !contactForm || !contactFormBtn || !checkIcon) return;

  contactFormBtn.disabled = true;

  phoneInput.addEventListener('input', (e) => {
    let value = (e.target as HTMLInputElement).value.replace(/\D/g, '');

    if (value.length > 11) value = value.slice(0, 11);

    let formattedValue = value;
    if (value.length > 2) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2)}`;
    }
    if (value.length > 7) {
      formattedValue = `(${value.slice(0, 2)}) ${value.slice(2, 7)}-${value.slice(7)}`;
    }

    (e.target as HTMLInputElement).value = formattedValue;

    if (value.length === 11) {
      contactFormBtn.disabled = false;
      contactFormBtn.classList.remove('opacity-50', 'cursor-not-allowed');
      checkIcon.classList.remove('hidden');
    } else {
      contactFormBtn.disabled = true;
      contactFormBtn.classList.add('opacity-50', 'cursor-not-allowed');
      checkIcon.classList.add('hidden');
    }
  });

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const btn = contactFormBtn;
    const originalText = btn.textContent || '';

    btn.disabled = true;
    btn.textContent = 'Enviando...';
    btn.classList.add('opacity-75');

    const templateParams = {
      name: (document.getElementById('form-name') as HTMLInputElement | null)?.value,
      phone: (document.getElementById('form-phone') as HTMLInputElement | null)?.value,
      email: (document.getElementById('form-email') as HTMLInputElement | null)?.value,
      message: 'Interesse em um imóvel do site.'
    };

    emailjs
      .send('service_danieldiaxf', 'template_danieldiaxf', templateParams)
      .then(() => {
        showToast('Mensagem enviada com sucesso!', 'success');
        contactForm.reset();

        contactFormBtn.disabled = true;
        contactFormBtn.classList.add('opacity-50', 'cursor-not-allowed');
        checkIcon.classList.add('hidden');
      })
      .catch((error: any) => {
        console.error('FAILED...', error);
        showToast('Erro ao enviar. Tente novamente.', 'error');
      })
      .finally(() => {
        btn.textContent = originalText;
        btn.classList.remove('opacity-75');

        const rawPhone =
          (document.getElementById('form-phone') as HTMLInputElement | null)?.value.replace(
            /\D/g,
            ''
          ) || '';
        if (rawPhone.length === 11 && btn.textContent === originalText) {
          btn.disabled = false;
          btn.classList.remove('opacity-50', 'cursor-not-allowed');
        }
      });
  });
}

// =========================
// Authentication & Bootstrap
// =========================
// Inicializa a aplicação após autenticação bem-sucedida

function initApp() {
  setLoadingState(true);
  subscribeToImoveis(
    (docs) => {
      setProperties(docs as Property[]);
      setLoadingState(false);
      renderProperties();
      updateAdminList();
    },
    (error) => {
      console.error('Erro ao buscar dados:', error);
      setLoadingState(false);
      if ((error as any).code === 'permission-denied') {
        console.log('Permissão negada. Verifique as regras do Firestore.');
      }
    }
  );
}

function openLoginModal() {
  if ((window as any).isAdminUser()) {
    openAdminPanel();
  } else {
    toggleModal('login-modal', true);
  }
}

(window as any).openLoginModal = openLoginModal;

onAuthStateChanged(auth, (user) => {
  currentUser = user;

  if (user) {
    if (user.email && btoa(user.email) === ADMIN_HASH) {
      isAdmin = true;
      document.body.classList.add('is-admin');
      showToast('Modo Administrador Ativo', 'success');
    } else {
      isAdmin = false;
      document.body.classList.remove('is-admin');
    }

    initApp();
    updateAdminUI();
  } else {
    signInAnonymously(auth).catch((error) => console.error('Erro auth anônima:', error));
  }
});

// =========================
// Page Bootstrap
// =========================
// Executado quando o DOM está pronto - inicializa componentes e listeners

window.addEventListener('DOMContentLoaded', () => {
  // Inicializa ícones Lucide de forma otimizada
  updateLucideIcons(true);

  setupFiltersAndSearch();
  setupContactForm();
});


