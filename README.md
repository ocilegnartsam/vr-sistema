# VR · Sistema 2026/2027 — Dr. Vladmir Resende

Sistema visual de inteligência, estratégia e operação construído a partir do PDF
"VR - Diagnóstico e Estratégia (2026/2027)" (161 páginas). O PDF é a source of truth.

## Rodar

    npm install
    npm run dev        # http://localhost:5173
    npm run build      # dist/ (base './', funciona em qualquer subpasta)

## Arquitetura

- `src/data/types.ts` — modelo semântico (VRNode, ContentBlock, ModuleMeta).
- `src/data/blocks/b0.ts … b9.ts` — TODO o conteúdo do PDF, em 283 nós, com `pages` (rastreabilidade),
  `owner`, `status`, `related`, `tags`. Nada de conteúdo está hardcoded nas telas.
- `src/data/CONVENTIONS.md` — regras de fidelidade e mapa de ids (use para estender ou revisar).
- `src/data/index.ts` — índice, filhos, relações inversas, ancestrais.
- `src/store.ts` — rotas por hash (`#/`, `#/execucao`, `#/b/<slug>`, `…/n/<id>` abre um objeto), painel de detalhe, busca.
- `src/components/` — ExpandableObject (compacto → expandido → detalhe), DetailPanel, CommandPalette (Fuse.js),
  FlowCanvas (React Flow), Kanban (dnd-kit, posições salvas em localStorage), Content (renderer dos blocos).
- `src/views/` — uma representação por bloco:
  Atlas (Bloco 8, mapa-mãe) · Contexto · Funil (fluxo) · Prioridades (kanban) · Educação (transformação) ·
  Jornada (timeline) · Cadeia Clínica (cadeia causal) · Economia (simulador LTV) · Esteira (value ladder) ·
  Revenue Engine · Valor (matriz 2×2 + flywheel) · Execução (roadmap + kanban + pendências).

## Para evoluir com um agente

1. Conteúdo novo ou corrigido: edite apenas `src/data/blocks/*.ts` seguindo `CONVENTIONS.md`.
2. Nova visualização: crie `src/views/X.tsx` lendo nós por id (`mustNode`, `getChildren`) e registre em `App.tsx`.
3. Persistência real (CRM de stakeholders, status do Kanban por usuário): trocar `useLocal` por Supabase/Postgres.
