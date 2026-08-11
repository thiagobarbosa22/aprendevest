# Design system — AprendeVest (v0)

Base: especificação seção 15. Tokens aqui são fonte de verdade até virarem `packages/ui/tokens`.

## Personalidade

Organizado, confiável, claro, motivador sem pressão, fácil de usar, focado em estudo — nunca infantil, nunca alarmista. Sem culpa/medo/pressão artificial. Nunca promete aprovação.

## Cor

| Token                 | Uso                                              | Hex (base)                                                                       |
| --------------------- | ------------------------------------------------ | -------------------------------------------------------------------------------- |
| `color-primary`       | ações principais, links, foco                    | Azul profundo `#1E3A8A`                                                          |
| `color-secondary`     | progresso, sucesso, domínio                      | Verde-petróleo `#0F766E`                                                         |
| `color-accent`        | destaques, badges, alertas de atenção (não erro) | Âmbar `#D97706`                                                                  |
| `color-danger`        | erro, ação destrutiva                            | Vermelho `#DC2626`                                                               |
| `color-success`       | confirmação, acerto                              | Verde `#16A34A` (distinto de secondary p/ não confundir "progresso" com "certo") |
| `color-bg`            | fundo padrão                                     | `#FFFFFF` / dark `#0B1220`                                                       |
| `color-surface`       | cards, painéis                                   | `#F8FAFC` / dark `#111827`                                                       |
| `color-surface-muted` | fundo de item em lista, hover sutil              | `#EEF2F7` / dark `#182235`                                                       |
| `color-text`          | texto principal                                  | `#0F172A` / dark `#E2E8F0`                                                       |
| `color-text-muted`    | texto secundário                                 | `#475569` / dark `#94A3B8`                                                       |

Regra: nenhum estado (erro/sucesso/pendente) depende só de cor — sempre ícone + texto também (spec: "não depender apenas de cores").
Contraste mínimo AA (4.5:1 texto normal, 3:1 texto grande) — validar todo par texto/fundo antes de shippar.

## Tipografia

- Família: sans-serif de alta legibilidade (ex.: Inter ou similar), boa renderização de números/fórmulas.
- Escala: `text-xs` 12 · `sm` 14 · `base` 16 · `lg` 18 · `xl` 20 · `2xl` 24 · `3xl` 30 · `4xl` 36.
- Line-height generoso em corpo de texto (1.5+) — sessões de leitura longas.
- Hierarquia: h1 único por página, headings sequenciais (sem pular nível) por acessibilidade.

## Espaçamento

Escala base 4px: `1=4 2=8 3=12 4=16 6=24 8=32 12=48 16=64`. Componentes usam múltiplos dessa escala, nunca valores soltos.

## Componentes base (v0)

| Componente           | Estados obrigatórios                                              |
| -------------------- | ----------------------------------------------------------------- |
| Button               | default, hover, focus-visible, active, disabled, loading          |
| Input/Field          | default, focus, error (com mensagem), disabled, com hint          |
| Card                 | default, hover (quando clicável), selecionado                     |
| Nav (topo/sidebar)   | ativo, hover, focus, colapsado (mobile)                           |
| Modal                | abertura com foco preso (focus trap), fechável por ESC e botão    |
| Alert/Banner         | info, sucesso, atenção, erro — sempre ícone + texto               |
| ProgressBar/Ring     | com label numérico visível, não só visual                         |
| Gráfico (desempenho) | equivalente em tabela/texto para leitor de tela                   |
| Table                | cabeçalho fixado em listas longas, responsivo (empilha em mobile) |

## Estados de tela (obrigatório em toda página com dado assíncrono)

Loading (skeleton quando fizer sentido) · Vazio (com próxima ação sugerida) · Erro (recuperável, nunca barra infinita sem explicação) · Sucesso.
Ações destrutivas sempre confirmadas, com opção de desfazer quando possível.

## Responsividade

Mobile-first. Breakpoints sugeridos: `sm=640 md=768 lg=1024 xl=1280`.
Exceção: simulados e painel admin devem ser otimizados para desktop também (uso prolongado, tabelas densas).

## Acessibilidade (meta WCAG 2.2 AA)

- Navegação 100% por teclado, foco sempre visível (`focus-visible`, nunca `outline: none` sem substituto).
- Labels associados a todo campo, erros anunciados (`aria-live` onde aplicável).
- Vídeo: legenda + transcrição sempre disponíveis, não opcionais.
- Mapas mentais: alternativa em texto equivalente, não só imagem.
- Sem texto em maiúsculas/animação que prejudique leitura; respeitar `prefers-reduced-motion`.

## Tom de voz (textos de interface)

Português do Brasil, direto, sem jargão. Erros explicados de forma educativa (o que houve + o que fazer), nunca culpabilizando o estudante. Mensagens de progresso descrevem fato, não pressão ("Você concluiu 3 de 5 módulos" — não "Você está atrasado!").
