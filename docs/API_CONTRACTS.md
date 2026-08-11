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

## Próximos contratos

Fase 1: sessão, perfil, consentimentos e solicitações LGPD. Fase 2: catálogo editorial e páginas públicas. Contratos serão definidos antes das respectivas telas.
