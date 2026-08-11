# Arquitetura de informação — AprendeVest

Base: especificação seções 7 (jornada), 8 (arquitetura de informação e páginas), 11 (personalização).

## 1. Navegação pública (topo, visitante)

Início · Vestibulares · Matérias · Provas anteriores · Banco de questões · Simulados · Redação

- Busca global no header, resultados agrupados por: aula, tema, questão, prova, vestibular.
- Rodapé institucional: Metodologia, Equipe, Preços, Ajuda, Contato, Termos, Privacidade.
- Todo conteúdo público é indexável (SEO), sem expor dados pessoais ou respostas de outros usuários.

## 2. Navegação da área logada (sidebar/tab bar)

Hoje · Meu plano · Aulas · Prática · Simulados · Desempenho · Favoritos · Perfil

| Página     | Elementos essenciais                                                |
| ---------- | ------------------------------------------------------------------- |
| Hoje       | Sessão recomendada, tempo disponível, pendências, progresso semanal |
| Meu plano  | Calendário, metas, replanejamento, carga por disciplina             |
| Aulas      | Player, texto, anexos, notas, progresso, próxima atividade          |
| Prática    | Questões, filtros, listas, caderno de erros, revisão                |
| Simulados  | Configuração, aplicação, resultado, análise                         |
| Desempenho | Domínio, evolução, tempo, precisão, recomendações                   |
| Favoritos  | Aulas, mapas, questões, provas, anotações salvas                    |
| Perfil     | Objetivos, vestibulares, preferências, acessibilidade, privacidade  |

## 3. Páginas de conteúdo (rotas dinâmicas)

- `/vestibulares/[slug]` — visão geral, edital, calendário, formato, matérias, provas, notícias editoriais, trilha sugerida.
- `/materias/[slug]` — mapa de conteúdos, domínio, aulas, mapas mentais, listas, incidência por prova.
- `/materias/[slug]/aulas/[aulaSlug]` — objetivos, pré-requisitos, mídia, teoria, exemplos, material de apoio, prática, revisão.
- `/provas/[slug]` — metadados, arquivos oficiais, modo online, gabarito, resoluções.
- `/questoes/[id]` — enunciado, resposta do aluno, resolução, classificação, estatísticas, itens relacionados.
- `/simulados/[id]` — regras, cronômetro, navegação, autosave, finalização, correção, análise.

## 4. Sitemap resumido

```
/                                (Início)
/vestibulares
/vestibulares/[slug]
/materias
/materias/[slug]
/materias/[slug]/aulas/[aulaSlug]
/provas
/provas/[slug]
/questoes
/questoes/[id]
/simulados
/simulados/[id]
/redacao
/metodologia /equipe /precos /ajuda /contato /termos /privacidade

/app/hoje                        (logado)
/app/plano
/app/aulas
/app/pratica
/app/simulados
/app/desempenho
/app/favoritos
/app/perfil
/app/redacao
/app/tutor
/app/caderno-de-erros
/admin/...                       (painel administrativo, papéis restritos)
```

## 5. Jornada principal (fluxo crítico do MVP)

1. Criar conta **ou** explorar com limitação, sem cadastro.
2. Selecionar vestibulares, curso, nível atual, disponibilidade semanal.
3. Diagnóstico curto (ou importar desempenho anterior).
4. Receber plano semanal (teoria + prática + revisão + simulado).
5. Estudar aula → resumo / mapa mental / flashcards conforme preferência.
6. Resolver questões → feedback → registro automático no caderno de erros.
7. Revisar itens agendados (repetição espaçada).
8. Acompanhar domínio por matéria, plano se reajusta.

### Estados de sistema a cobrir em cada tela do fluxo

Sem diagnóstico · Atrasado no plano · Muitos erros · Pouco tempo disponível · Conteúdo concluído · Prova próxima (spec 7.1) — cada um muda o comportamento da página "Hoje" e do plano, nunca é tratado como erro.

## 6. Fluxos prioritários do MVP (critério de aceite por fluxo, spec seção 23)

| Fluxo               | Aceite                                                                                     |
| ------------------- | ------------------------------------------------------------------------------------------ |
| Descoberta          | Visitante encontra matéria, vestibular, aula e prova por navegação ou busca, sem cadastro. |
| Cadastro + objetivo | Usuário cria conta, define objetivo, recebe trilha inicial.                                |
| Estudo de aula      | Aluno assiste/lê aula, progresso salvo, retomável em outro dispositivo.                    |
| Prática             | Aluno resolve questões, recebe resolução, item entra no caderno de erros quando errado.    |
| Prova               | Prova autorizada é filtrável, abre e resolve online com salvamento automático.             |
| Desempenho          | Painel mostra domínio e recomendações explicáveis — nunca promete aprovação.               |
| Editorial (admin)   | Editor cria, revisa, publica, versiona conteúdo sem tocar em código.                       |

Ordem de construção segue o backlog: primeiro descoberta + cadastro + uma aula + uma questão (jornada pequena e completa), só depois amplia cobertura — nunca construir tudo em paralelo (regra do prompt mestre, spec 22.1).

## Notas de escopo

- Nenhuma rota acima está implementada ainda; isto é o mapa que orienta a Fase 0/1 do frontend.
- Rotas sob `/app` e `/admin` dependem de autenticação/RBAC do CODEX — ver `docs/AGENT_STATUS.md` para bloqueios.
