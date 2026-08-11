# Arquitetura inicial

## Fluxo de dependências

```text
apps/web (HTTP/SSR) ──> packages/contracts
        │
        ├─────────────> packages/domain <── portas implementadas por packages/db
        │
        └─────────────> packages/ui (sem acesso direto ao banco)
```

O domínio não importa Next.js, React, Drizzle ou clientes externos. A camada web traduz HTTP; contratos validam fronteiras; adaptadores implementam persistência e integrações.

## Modelo conceitual proposto

O primeiro recorte preserva as entidades normativas sem criar migrações prematuras:

- `User` 1—1 `Profile`; perfil guarda objetivos e preferências, enquanto consentimentos versionados ficam separados.
- `Exam` 1—N `ExamEdition` 1—N `ExamPaper`; regras e formatos pertencem à edição anual, não ao vestibular global.
- `Subject` e `Topic` formam a taxonomia; tópicos possuem hierarquia, pré-requisitos e habilidades relacionais.
- `ContentItem` tem tipo, autoria, fonte, direitos e estado editorial; versões publicadas são imutáveis.
- `Question` possui opções/resposta conforme tipo, classificação N—N por tópico e vínculo opcional com prova oficial.
- `Attempt` registra resposta, duração, contexto e resultado sem sobrescrever a versão da questão usada.
- `StudyPlan` 1—N `StudyPlanTask`; recomendações registram motivo e evidências para serem explicáveis.
- `Mastery` agrega estimativas por usuário/tópico; `ReviewItem` agenda repetição e preserva histórico.
- `EditorialRevision` registra decisões de workflow; `AuditEvent` cobre ações sensíveis com contexto minimizado.

## Regras antes da primeira migração

1. IDs UUID/ULID estáveis e timestamps UTC.
2. Conteúdo publicado, gabaritos e resoluções recebem versões imutáveis.
3. Fonte, licença/permissão, checksum e data de acesso são obrigatórios antes de publicar material externo.
4. Exclusão de conta separa apagamento, anonimização e retenções legais; eventos de auditoria não armazenam conteúdo sensível desnecessário.
5. RBAC separa criar, revisar, aprovar, publicar, despublicar e excluir.
6. Analytics derivados não substituem tentativas brutas e permitem excluir tentativas anômalas.

## Riscos iniciais

- Direitos autorais e procedência de provas/conteúdo: bloquear publicação sem metadados de direitos.
- Menores e LGPD: revisar consentimento, retenção e responsáveis antes da Fase 1.
- Escopo acadêmico amplo: entregar primeiro uma jornada pequena com dados sintéticos e conteúdo revisado.
- Divergência frontend/backend: contrato executável antes da tela e fixtures importadas do pacote compartilhado.
- IA precoce: manter fora do núcleo até existir corpus revisado, avaliação e fallback.
- Expansões ficam em `expansion`, atrás de feature flags; redações privadas não dependem de IA, professores ou cobrança.
