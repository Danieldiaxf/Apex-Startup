/**
 * firebaseService.ts - Serviço de integração com Firebase
 * 
 * Responsabilidades:
 * - Configuração e inicialização do Firebase App
 * - Exporta instâncias de Auth e Firestore
 * - Subscribe em tempo real à coleção de imóveis
 * - Abstrai operações de banco de dados
 * 
 * Nota: Este arquivo foi parcialmente migrado. Funções de CRUD (saveProperty, deleteProperty)
 * e autenticação (adminLogin, adminLogout) ainda estão em main.ts e devem ser migradas aqui.
 */

import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, collection, onSnapshot, query, type Firestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: 'AIzaSyDEPXe6IU8Q58xAaJTGT0FFSFEte_zppY8',
  authDomain: 'prime-house-fa7b0.firebaseapp.com',
  projectId: 'prime-house-fa7b0',
  storageBucket: 'prime-house-fa7b0.firebasestorage.app',
  messagingSenderId: '58174312256',
  appId: '1:58174312256:web:a23faa5f5f69dbeb7c34a5',
  measurementId: 'G-YRN20D8ZFX'
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db: Firestore = getFirestore(app);

export function getCollectionRef() {
  return collection(db, 'imoveis');
}

export function subscribeToImoveis(
  onChange: (docs: any[]) => void,
  onError?: (error: unknown) => void
) {
  const q = query(getCollectionRef());
  return onSnapshot(
    q,
    (snapshot) => {
      const docs = snapshot.docs.map((d) => ({
        id: d.id,
        ...d.data()
      }));
      onChange(docs);
    },
    (error) => {
      if (onError) onError(error);
      else console.error('Erro ao buscar dados:', error);
    }
  );
}


