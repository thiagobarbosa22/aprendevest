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

## Fase 3 — Conteúdo e progresso (concluída em 2026-08-11)

- Módulos, aulas estruturadas, objetivos, fonte/direitos, texto acessível, notas e retomada.
- CMS de conteúdo segue o mesmo workflow versionado do catálogo.
- API autenticada persiste avanço monotônico, posição, conclusão e anotações por usuário.
- **Saída demonstrada:** estudante conclui e retoma uma aula em outro dispositivo; contratos, regra de progresso e handler autenticado têm testes.

## Fase 4 — Questões (concluída em 2026-08-11)

- Questões classificadas, tentativas idempotentes, correção objetiva e resolução passo a passo.
- Erros entram automaticamente no caderno e são resolvidos por acerto posterior.
- **Saída demonstrada:** prática autenticada completa com contrato, regra de correção e persistência versionada.

## Fase 5 — Provas (concluída em 2026-08-11)

- Repositório com link oficial, checksum, direitos, composição versionada e modo online.
- Aplicação autenticada tem autosave, retomada, cronômetro e finalização imutável.
- **Saída demonstrada:** prova sintética/autorizada pode ser filtrada, aberta e resolvida online.

## Fases 6–7 — Plano e simulados

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
