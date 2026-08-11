# Decisões do projeto

Este documento registra decisões duráveis. Conversas e bloqueios momentâneos pertencem ao Overclock.

## ADR-001 — Monorepo modular com pnpm

- **Status:** aceita em 2026-08-10.
- **Decisão:** usar workspaces pnpm com `apps/web`, `packages/contracts`, `packages/domain`, `packages/db`, `packages/ui`, `workers` e `tests` conforme os módulos forem necessários.
- **Motivo:** contratos, regras e infraestrutura permanecem independentes da interface, sem introduzir um orquestrador de build antes de haver necessidade mensurada.

## ADR-002 — Next.js e TypeScript estrito

- **Status:** aceita em 2026-08-10.
- **Decisão:** Next.js com App Router, React e TypeScript estrito. Route Handlers são a camada HTTP inicial; regras de negócio vivem em `packages/domain`.
- **Motivo:** atende SSR/SSG, SEO e aplicação responsiva, preservando a opção de extrair uma API Node quando escala ou operação justificarem.

## ADR-003 — PostgreSQL e Drizzle

- **Status:** aceita em 2026-08-10.
- **Decisão:** PostgreSQL como fonte transacional e de busca textual inicial; Drizzle para schema e migrações.
- **Motivo:** tipagem explícita, migrações revisáveis e menor acoplamento. A primeira migração só será criada depois da revisão do modelo conceitual e das regras de retenção/LGPD.

## ADR-004 — Contratos validados na fronteira

- **Status:** aceita em 2026-08-10.
- **Decisão:** schemas Zod em `packages/contracts`; handlers validam respostas e entradas. Erros usam código estável, mensagem em português e `requestId` quando disponível.
- **Motivo:** impede divergência silenciosa entre frontend e backend e permite fixtures tipadas.

## ADR-005 — Autenticação adiada para a Fase 1

- **Status:** aceita em 2026-08-10.
- **Decisão:** escolher e integrar sessões seguras durante a Fase 1, após modelar consentimentos, menores, revogação, exportação e exclusão. Nenhuma credencial simulada será apresentada como autenticação real.
- **Motivo:** evita fixar um provedor antes dos requisitos de identidade e LGPD estarem cobertos por testes.

## ADR-006 — TypeScript 7 com API de compatibilidade do TypeScript 6

- **Status:** aceita em 2026-08-10.
- **Decisão:** usar o compilador nativo TypeScript 7 pelo alias `@typescript/native` no gate explícito e expor `@typescript/typescript6` como `typescript` para ferramentas que ainda dependem da API JavaScript, como `typescript-eslint`. O build do Next usa essa API de compatibilidade e continua executando seu próprio typecheck.
- **Motivo:** é a estratégia oficial de transição do TypeScript 7 e preserva tanto o compilador atual usado pelo Next.js quanto o lint recomendado.

## Fronteiras de arquivos na colaboração inicial

- **Codex:** raiz e configuração; `docs`; `packages/contracts`; `packages/domain`; `packages/db`; `apps/web/src/app/api`; infraestrutura e testes de integração.
- **Claude:** `packages/ui`; componentes visuais; páginas e layouts em `apps/web/src/app`, exceto `api`; estilos, textos, responsividade e acessibilidade.
- **Compartilhados sob coordenação:** `apps/web/package.json`, `apps/web/src/app/layout.tsx`, `apps/web/src/app/globals.css`, tokens públicos e contratos. Alterações nesses arquivos devem ser avisadas antes.
