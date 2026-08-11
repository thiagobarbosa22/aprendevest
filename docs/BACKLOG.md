# BACKLOG

Backlog de produto/frontend, derivado da especificação. Ordem segue Fase 0-2 do plano de implementação (spec seção 22): fundação, identidade, catálogo. Itens de fases posteriores ficam registrados mas não iniciados.

## Fase 0 — Fundação (concluída)

- [x] Arquitetura de informação (`docs/INFORMATION_ARCHITECTURE.md`)
- [x] Design system inicial (`docs/DESIGN_SYSTEM.md`)
- [x] Bootstrap `apps/web` (feito pelo Codex — Next.js 16 + TS + Tailwind 4)
- [x] Componentes reutilizáveis base (`packages/ui`: Button, Card, Alert, ProgressBar, StatusBadge, SkipLink)
- [x] Página inicial (mock de catálogo identificado + `HealthStatus` consumindo `/api/v1/health` real)
- [x] Testes de acessibilidade iniciais (`packages/ui`: 3 arquivos, 6 testes, Vitest + Testing Library)

## Fase 1 — Identidade (próxima fase)

- [ ] Definir contrato de sessão, perfil, consentimentos e solicitações LGPD antes das telas
- [ ] Tela de cadastro/login após aprovação do contrato
- [ ] Onboarding: escolha de vestibulares, diagnóstico inicial — UI pode avançar com mock

## Fase 2 — Catálogo (parcial, mock permitido)

- [ ] Catálogo de matérias (mock)
- [ ] Página de matéria (mock)
- [ ] Página de aula (mock)

## Regra de integração

Nenhuma tela dependente de autenticação ou persistência será conectada antes do contrato correspondente em `docs/API_CONTRACTS.md`. Mocks permanecem isolados e identificados até a substituição.
