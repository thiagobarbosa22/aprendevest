# Configuração local

## Requisitos

- Node.js 22 ou superior.
- Corepack (incluído no Node distribuído oficialmente).
- Docker Desktop opcional para executar o PostgreSQL local.

## Instalação

```powershell
corepack enable
corepack pnpm install
Copy-Item .env.example .env
docker compose up -d postgres
corepack pnpm db:migrate
corepack pnpm db:seed
corepack pnpm dev
```

A aplicação usa `http://localhost:3000`. Sem `DATABASE_URL`, ela ainda inicia e compila, mas o endpoint `/api/v1/health` retorna `503` com o banco marcado como `not_configured`.

## Variáveis

| Nome                     | Obrigatória em runtime | Finalidade                                                              |
| ------------------------ | ---------------------- | ----------------------------------------------------------------------- |
| `DATABASE_URL`           | Sim para prontidão     | Conexão PostgreSQL; nunca é enviada ao cliente                          |
| `DATABASE_URL_UNPOOLED`  | Somente em migrações   | Conexão direta opcional para Drizzle em bancos com pooler               |
| `APP_URL`                | Sim em produção        | URL pública dos metadados sociais; padrão local `http://localhost:3000` |
| `APP_VERSION`            | Não                    | Versão exibida no diagnóstico; padrão `0.1.0`                           |
| `SEED_EDITOR_PASSWORD`   | Somente no seed        | Senha local do editor sintético; nunca reutilizar em produção           |
| `SEED_REVIEWER_PASSWORD` | Somente no seed        | Senha local do revisor sintético; nunca reutilizar em produção          |

Segredos reais ficam fora do repositório. Novas variáveis precisam ser documentadas aqui e em `.env.example` com valor inofensivo.

## Banco e migrações

As migrações ficam em `packages/db/migrations` e são imutáveis depois de aplicadas em ambiente compartilhado.

```powershell
corepack pnpm db:generate # após alterar o schema Drizzle
corepack pnpm db:migrate  # aplica somente migrações pendentes
corepack pnpm db:seed     # catálogo e contas editoriais sintéticas
```

Docker não é obrigatório para compilar a aplicação, mas PostgreSQL é necessário para cadastro, sessão e demais dados persistentes. Se `docker` não estiver instalado, use uma instância PostgreSQL 17 compatível e ajuste `DATABASE_URL`.

No Neon, `npx neonctl@latest init` vincula o projeto e `npx -y neon env pull`
grava as conexões em `.env.local`. A aplicação usa `DATABASE_URL` com pooler;
as migrações preferem `DATABASE_URL_UNPOOLED`.

## Estrutura

```text
apps/web/             aplicação web, área do aluno, admin e handlers HTTP
packages/contracts/  schemas compartilhados nas fronteiras
packages/domain/     regras e portas independentes de framework
packages/db/         acesso PostgreSQL, schema e migrações
packages/ui/         design system sob responsabilidade frontend
docs/                decisões, contratos, operação e testes
workers/             jobs assíncronos quando forem necessários
tests/               integração, E2E e fixtures compartilhadas
```
