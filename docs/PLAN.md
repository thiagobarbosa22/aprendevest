# Plano técnico por fases

## Fase 0 — Fundação (concluída em 2026-08-11)

- Monorepo, Next.js/TypeScript, Tailwind, contratos, limites de domínio e PostgreSQL.
- Endpoint de diagnóstico, documentação, lint, tipos, testes e build.
- Design tokens e shell acessível em colaboração com o Claude.
- **Saída demonstrada:** instalação reproduzível, CI versionado, formatação/lint/tipos/testes/build verdes, endpoint de diagnóstico e preview navegável.

## Fase 1 — Identidade (concluída em 2026-08-11)

- Sessões opacas persistidas, senha com scrypt, cadastro/login, perfil, RBAC e base LGPD.
- Jornada mínima: conta → consentimento → objetivo → área do estudante.
- Exportação estruturada, solicitação de exclusão, auditoria e proteção para menores por faixa etária.
- **Saída demonstrada:** migração versionada, contratos, permissões, senha e ações de conta cobertos por testes; build gera rotas públicas e protegidas.

## Fase 2 — Catálogo e CMS básico (concluída em 2026-08-11)

- Vestibulares versionados, matérias, tópicos, habilidades, pré-requisitos, workflow editorial e páginas públicas.
- CMS separa criação, envio para revisão, aprovação e publicação; cada transição gera snapshot e auditoria.
- Seed sintético cria catálogo e papéis editor/revisor sem reproduzir material protegido.
- **Saída demonstrada:** editor publica um vestibular rastreável sem editar código; páginas públicas leem o repositório e têm fallback demonstrativo sem banco.

## Fase 3 — Conteúdo e progresso

- Aula multimodal, retomada, anotações, resumo e mapa mental acessível.
- **Saída:** estudante conclui e retoma um módulo em outro dispositivo.

## Fases 4–7 — Prática completa

- Questões/tentativas/caderno de erros; provas autorizadas; diagnóstico/plano/revisão; simulados/autosave/análise.
- Cada fase fecha um caminho E2E e só então amplia cobertura.

## Fase 8 — Qualidade operacional

- Segurança, acessibilidade, performance, observabilidade, backups e plano de incidente.

## Fase 9 — Expansões protegidas por feature flag

- Redação, tutor com IA, professores, pagamentos e novos exames, sem dependência para o núcleo.

## Escopo imediato compartilhado

- Codex finaliza o diagnóstico, contratos e gate técnico.
- Claude cria arquitetura de informação da primeira jornada, design tokens, shell e componentes base acessíveis sem consumir APIs ainda não documentadas.
- Integração ocorre após revisão de arquivos alterados e execução do gate completo.
