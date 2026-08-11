# AprendeVest

Plataforma web de preparação para vestibulares, construída em fases a partir de `especificacao_aprendevest.docx`.

## Estado atual

As Fases 0–4 estabelecem identidade, catálogo/CMS, aulas, progresso, banco de questões, correção e caderno de erros. Provas, planejamento e simulados são adicionados nos próximos incrementos.

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

Consulte [docs/SETUP.md](docs/SETUP.md) para configuração detalhada e [docs/TESTING.md](docs/TESTING.md) para os critérios dos testes.
