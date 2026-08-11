# Contratos de API

Base atual: Route Handlers do Next.js sob `/api/v1`. Os schemas executáveis ficam em `packages/contracts`.

## Convenções

- JSON em UTF-8; timestamps ISO 8601 em UTC.
- Identificadores serão estáveis e opacos.
- Entradas inválidas retornam `400`; ausência de autenticação `401`; falta de permissão `403`; recurso inexistente `404`; conflito `409`; limite `429`; erro inesperado `500`.
- O formato de erro será `{ "error": { "code", "message", "requestId?", "details?" } }`.
- Listagens futuras usarão cursor opaco; não inventar paginação por página antes do contrato específico.
- Submissões e importações mutáveis exigirão chave de idempotência em seus contratos específicos.

## GET `/api/v1/health`

Diagnóstico de prontidão da aplicação e do PostgreSQL. Não exige autenticação e não expõe credenciais, host ou mensagens internas.

Resposta `200` quando todas as dependências obrigatórias estão disponíveis:

```json
{
  "status": "ok",
  "service": "web",
  "version": "0.1.0",
  "timestamp": "2026-08-10T23:00:00.000Z",
  "checks": { "database": "ok" }
}
```

Resposta `503` quando o banco está ausente ou indisponível. O corpo mantém o mesmo schema; `status` será `degraded` e `checks.database` será `not_configured` ou `unavailable`.

## GET `/api/v1/privacy/export`

Exige sessão válida e retorna, como anexo JSON sem cache, os dados de conta, perfil e histórico de consentimentos do titular. Nunca inclui senha ou tokens.

O catálogo público é servido por Server Components sobre o mesmo repositório usado pelo CMS. Mutações editoriais usam Server Actions com schemas compartilhados, RBAC, concorrência otimista e auditoria.

## `/api/v1/progress/content/:contentId`

- `GET` retorna o progresso do titular autenticado e nunca usa cache compartilhado.
- `PUT` recebe `{ percent, positionSeconds, complete }`, valida limites e preserva o maior avanço já sincronizado.

## `/api/v1/progress/content/:contentId/notes`

- `GET` lista somente anotações do titular.
- `POST` cria anotação de até 4.000 caracteres, opcionalmente associada a um timestamp.
