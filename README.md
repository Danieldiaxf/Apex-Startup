# Prime House - Imobiliária

Sistema web para exibição e gerenciamento de imóveis, desenvolvido com TypeScript, Vite e Firebase.

## 🚀 Tecnologias

- **TypeScript** - Tipagem estática para maior segurança e produtividade
- **Vite** - Build tool moderna e rápida
- **Firebase** - Autenticação e Firestore para dados em tempo real
- **EmailJS** - Envio de emails do formulário de contato
- **Tailwind CSS** - Framework CSS utility-first (via CDN)
- **Lucide Icons** - Biblioteca de ícones (via CDN)
- **Vitest** - Framework de testes unitários

## 📁 Estrutura do Projeto

```
src/
├── main.ts                 # Ponto de entrada da aplicação
├── services/               # Serviços externos
│   ├── firebaseService.ts  # Configuração e operações Firebase
│   └── emailService.ts     # Integração EmailJS
├── state/                  # Gerenciamento de estado
│   └── propertiesStore.ts  # Store de imóveis, filtros e busca
├── ui/                     # Componentes de interface
│   ├── propertiesGrid.ts   # Grid de imóveis
│   ├── propertyModal.ts    # Modal de detalhes do imóvel
│   ├── adminPanel.ts       # Painel administrativo
│   ├── adminForm.ts        # Formulário de criação/edição
│   ├── lightbox.ts         # Visualizador de imagens
│   └── contactForm.ts      # Formulário de contato
└── utils/                  # Utilitários
    ├── formatters.ts       # Formatação de dados (moeda, texto)
    └── ui.ts               # Utilitários de UI (modais, toasts, debounce)
```

## 🛠️ Instalação e Execução

### Pré-requisitos

- Node.js 18+ e npm

### Instalação

```bash
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse `http://localhost:5173` no navegador.

### Build para Produção

```bash
npm run build
```

Os arquivos compilados estarão em `dist/`.

### Preview da Build

```bash
npm run preview
```

### Testes

```bash
npm test
```

## 🔐 Autenticação e Administração

O sistema utiliza Firebase Authentication com dois tipos de acesso:

1. **Usuário Anônimo**: Acesso padrão para visualização de imóveis
2. **Administrador**: Acesso com email específico para gerenciar imóveis

O email do administrador é verificado através de um hash base64 (`ADMIN_HASH` em `main.ts`).

## 📊 Funcionalidades

### Públicas

- ✅ Visualização de imóveis em grid responsivo
- ✅ Filtro por tipo (Venda/Aluguel/Todos)
- ✅ Busca por título ou localização
- ✅ Modal com detalhes completos do imóvel
- ✅ Galeria de imagens com lightbox
- ✅ Formulário de contato integrado com EmailJS
- ✅ Design responsivo (mobile-first)

### Administrativas

- ✅ Login com email e senha
- ✅ Painel administrativo
- ✅ Criação de novos imóveis
- ✅ Edição de imóveis existentes
- ✅ Exclusão de imóveis
- ✅ Upload e compressão de imagens
- ✅ Gerenciamento de galeria de fotos

## 🏗️ Arquitetura

### Padrões Utilizados

- **Modularização**: Código organizado por responsabilidade
- **Separação de Concerns**: Lógica, UI e serviços separados
- **State Management**: Store centralizado para estado da aplicação
- **Service Layer**: Abstração de serviços externos (Firebase, EmailJS)

### Fluxo de Dados

1. **Inicialização**: `main.ts` → Autenticação anônima → Subscribe Firestore
2. **Atualização**: Firestore → `propertiesStore` → `propertiesGrid` → DOM
3. **Interação**: Usuário → Event Handlers → Store/Service → UI Update

## 🔒 Segurança

### Implementado

- ✅ Compressão de imagens no cliente (reduz tamanho)
- ✅ Validação de permissões no cliente
- ✅ Sanitização de inputs (normalização de texto)

### Recomendações Futuras

- ⚠️ **Firestore Security Rules**: Configurar regras no Firebase Console para validar permissões no servidor
- ⚠️ **Cloud Storage**: Migrar imagens base64 para Firebase Storage com URLs
- ⚠️ **HTTPS**: Garantir HTTPS em produção
- ⚠️ **Rate Limiting**: Implementar limites de requisições

## 📝 Scripts Disponíveis

- `npm run dev` - Inicia servidor de desenvolvimento
- `npm run build` - Gera build de produção
- `npm run preview` - Preview da build de produção
- `npm test` - Executa testes unitários

## 🧪 Testes

Os testes estão localizados em `src/**/*.test.ts` e utilizam Vitest.

**Cobertura atual:**
- ✅ Formatters (`formatCurrency`, `formatMoney`, `normalizeText`)
- ✅ Properties Store (filtros, busca, setters/getters)

## 🚧 Melhorias Futuras

### Curto Prazo
- [ ] Refinar tipagem TypeScript (strict mode)
- [ ] Adicionar mais testes unitários
- [ ] Implementar debounce em outros campos de busca
- [ ] Melhorar acessibilidade (ARIA labels, navegação por teclado)

### Médio Prazo
- [ ] Migrar imagens para Firebase Storage
- [ ] Implementar paginação na lista de imóveis
- [ ] Adicionar cache local (localStorage/IndexedDB)
- [ ] Componentização mais granular (Web Components ou framework)

### Longo Prazo
- [ ] PWA (Progressive Web App)
- [ ] Internacionalização (i18n)
- [ ] Dashboard de analytics
- [ ] Sistema de favoritos

## 📄 Licença

Projeto privado - Prime House Imobiliária

## 👥 Contato

Para dúvidas ou suporte, entre em contato através do WhatsApp: [Prime House](https://w.app/primehouse)

