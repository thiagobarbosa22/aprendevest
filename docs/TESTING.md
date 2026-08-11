# Estratégia e execução de testes

## Gate da Fase 0

Execute:

```powershell
corepack pnpm lint
corepack pnpm typecheck
corepack pnpm test
corepack pnpm build
```

O gate só está verde quando todos os comandos terminam com código `0`. `corepack pnpm check` também valida a formatação e executa a sequência completa. O workflow `.github/workflows/ci.yml` repete esse gate em cada pull request e push para `main`, com instalação congelada pelo lockfile.

## Cobertura atual

- **Contratos:** aceita a resposta pública documentada e rejeita estados ou datas inválidos.
- **Domínio:** converte o estado do banco em `ok` ou `degraded` e usa relógio injetável.
- **Build:** valida integração entre app, contratos, domínio e banco, além de gerar as rotas Next.js.

## Evolução obrigatória

- Fase 1 adiciona integração de sessão/RBAC e E2E de cadastro, login, privacidade e exclusão.
- Cada fluxo acadêmico adiciona teste unitário de regra, integração de persistência/API e E2E do caminho principal.
- Acessibilidade combina lint, axe/Playwright e verificação manual de teclado, foco, contraste, leitor de tela e mídia.
- Testes de conteúdo validam fonte, direitos, versão, gabarito e links antes da publicação.

Não considere permanência de tela como aprendizagem e não use fixtures que reproduzam conteúdo protegido.

## Última execução da Fase 0

Em 2026-08-11, `corepack pnpm check` concluiu lint, typecheck, testes e build com código `0`. O runtime respondeu `200` em `/`; sem banco configurado, `/api/v1/health` respondeu o `503 degraded/not_configured` previsto no contrato. A página renderizada contém idioma `pt-BR`, link de salto, região `main` e um único `h1`.
