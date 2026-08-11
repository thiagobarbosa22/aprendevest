# AprendeVest

Plataforma web de preparação para vestibulares, construída em fases a partir de `especificacao_aprendevest.docx`.

## Estado atual

As Fases 0–9 entregam a jornada integrada de identidade, catálogo/CMS, aulas, questões, provas, plano adaptativo, revisão, desempenho, simulados, qualidade operacional e redação protegida por feature flag.

## Início rápido

Requisitos: Node.js 22+, Corepack e, para o diagnóstico completo do banco, Docker.

```bash
corepack enable
corepack pnpm install
Copy-Item .env.example .env
docker compose up -d postgres
corepack pnpm dev
```

Abra `http://localhost:3000`. O diagnóstico técnico fica em `http://localhost:3000/api/v1/health`.

## Comandos

```bash
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
corepack pnpm check
```

Consulte [docs/SETUP.md](docs/SETUP.md) para configuração, [docs/TESTING.md](docs/TESTING.md) para testes, [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) para implantação e [docs/OPERATIONS.md](docs/OPERATIONS.md) para backup/incidentes.

O inventário final, limitações e próximos passos estão em [docs/FINAL_REPORT.md](docs/FINAL_REPORT.md).
