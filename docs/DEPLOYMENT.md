# Implantação

## Requisitos

- Node.js 22, Corepack/pnpm, PostgreSQL 16+ e TLS no proxy.
- Variáveis de `.env.example` definidas no gerenciador de segredos; nunca no repositório.
- Object storage e Redis continuam opcionais até que mídia/jobs sejam ativados.

## Procedimento

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm check
corepack pnpm db:migrate
corepack pnpm db:seed
corepack pnpm --filter @aprendevest/web build
corepack pnpm --filter @aprendevest/web start
```

O seed é idempotente e usa somente conteúdo sintético/metadados oficiais. Em produção, defina senhas editoriais por secret ou não crie essas contas.

Antes de promover: backup verificado, migração revisada, health check `200`, smoke E2E e headers de segurança presentes. Rollback deve manter compatibilidade com a migração; mudanças destrutivas exigem estratégia expand/contract.
