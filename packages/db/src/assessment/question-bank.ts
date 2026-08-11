import type { SubjectSlug } from "../content/lesson-videos";

export type BankQuestion = {
  slug: string;
  difficulty: 1 | 2 | 3;
  prompt: string;
  options: Array<{ id: string; text: string }>;
  correctAnswer: string;
  resolution: string;
  commonError: string;
};

export const difficultyLabel: Record<1 | 2 | 3, string> = {
  1: "Fácil",
  2: "Médio",
  3: "Difícil",
};

/**
 * Platform-authored multiple-choice bank, 1 question per difficulty level
 * per subject — original content, not reproduced from any copyrighted exam.
 */
export const questionBankBySubject: Partial<
  Record<SubjectSlug, BankQuestion[]>
> = {
  matematica: [
    {
      slug: "porcentagem-facil",
      difficulty: 1,
      prompt: "Qual é o resultado de 15% de 200?",
      options: [
        { id: "a", text: "20" },
        { id: "b", text: "30" },
        { id: "c", text: "40" },
        { id: "d", text: "45" },
      ],
      correctAnswer: "b",
      resolution: "15% de 200 = 0,15 × 200 = 30.",
      commonError:
        "Multiplicar 200 por 15 sem converter a porcentagem em decimal antes.",
    },
    {
      slug: "funcao-1grau-medio",
      difficulty: 2,
      prompt: "Se f(x) = 3x − 5, qual é o valor de x para que f(x) = 10?",
      options: [
        { id: "a", text: "3" },
        { id: "b", text: "5" },
        { id: "c", text: "15" },
        { id: "d", text: "-5" },
      ],
      correctAnswer: "b",
      resolution: "3x − 5 = 10 → 3x = 15 → x = 5.",
      commonError: "Dividir 10 por 3 diretamente, sem antes somar 5.",
    },
    {
      slug: "poligono-dificil",
      difficulty: 3,
      prompt:
        "A soma dos ângulos internos de um polígono convexo é 1440°. Quantos lados esse polígono tem?",
      options: [
        { id: "a", text: "8" },
        { id: "b", text: "9" },
        { id: "c", text: "10" },
        { id: "d", text: "12" },
      ],
      correctAnswer: "c",
      resolution: "(n − 2) × 180 = 1440 → n − 2 = 8 → n = 10.",
      commonError:
        "Esquecer de somar 2 de volta depois de dividir 1440 por 180.",
    },
  ],
  "lingua-portuguesa": [
    {
      slug: "plural-facil",
      difficulty: 1,
      prompt:
        "Assinale a alternativa em que o plural das palavras está correto:",
      options: [
        { id: "a", text: "pães, mães, cidadões" },
        { id: "b", text: "pães, mães, cidadãos" },
        { id: "c", text: "pães, mãos, cidadãos" },
        { id: "d", text: "pães, mães, cidadães" },
      ],
      correctAnswer: "b",
      resolution: 'O plural de "mãe" é "mães" e o de "cidadão" é "cidadãos".',
      commonError:
        'Aplicar a terminação -ões (de "pão/pães") também a "cidadão", gerando "cidadões".',
    },
    {
      slug: "crase-medio",
      difficulty: 2,
      prompt: "Assinale a frase com o uso correto da crase:",
      options: [
        { id: "a", text: "Cheguei à escola às 8 horas." },
        { id: "b", text: "Cheguei a escola às 8 horas." },
        { id: "c", text: "Cheguei à escola as 8 horas." },
        { id: "d", text: "Cheguei a à escola às 8 horas." },
      ],
      correctAnswer: "a",
      resolution:
        '"à escola" funde a preposição "a" com o artigo feminino "a"; "às 8 horas" leva crase por indicar hora determinada.',
      commonError:
        'Esquecer a crase antes de palavra feminina regida por preposição "a".',
    },
    {
      slug: "figura-linguagem-dificil",
      difficulty: 3,
      prompt:
        'Em "Suas palavras cortaram como facas", a figura de linguagem predominante é:',
      options: [
        { id: "a", text: "Metáfora" },
        { id: "b", text: "Comparação (símile)" },
        { id: "c", text: "Metonímia" },
        { id: "d", text: "Hipérbole" },
      ],
      correctAnswer: "b",
      resolution:
        'O conectivo "como" caracteriza uma comparação explícita (símile) entre palavras e facas.',
      commonError:
        "Confundir com metáfora, que aproxima os termos sem conectivo comparativo.",
    },
  ],
  biologia: [
    {
      slug: "mitocondria-facil",
      difficulty: 1,
      prompt:
        "Qual organela é responsável pela respiração celular e produção de ATP?",
      options: [
        { id: "a", text: "Ribossomo" },
        { id: "b", text: "Mitocôndria" },
        { id: "c", text: "Complexo de Golgi" },
        { id: "d", text: "Lisossomo" },
      ],
      correctAnswer: "b",
      resolution:
        "A mitocôndria realiza a respiração celular aeróbica, produzindo ATP.",
      commonError:
        "Confundir com o cloroplasto (fotossíntese) ou com o ribossomo (síntese de proteínas).",
    },
    {
      slug: "genetica-medio",
      difficulty: 2,
      prompt:
        "No cruzamento entre um indivíduo heterozigoto (Aa) e outro homozigoto recessivo (aa), qual a proporção esperada de descendentes com fenótipo dominante?",
      options: [
        { id: "a", text: "25%" },
        { id: "b", text: "50%" },
        { id: "c", text: "75%" },
        { id: "d", text: "100%" },
      ],
      correctAnswer: "b",
      resolution:
        "Aa × aa gera 1/2 Aa (dominante) e 1/2 aa (recessivo) — 50% para cada fenótipo.",
      commonError:
        "Aplicar a proporção 3:1, típica do cruzamento Aa × Aa, a este cruzamento diferente.",
    },
    {
      slug: "cadeia-respiratoria-dificil",
      difficulty: 3,
      prompt:
        "Na cadeia respiratória mitocondrial, o aceptor final de elétrons é:",
      options: [
        { id: "a", text: "Glicose" },
        { id: "b", text: "NADH" },
        { id: "c", text: "Oxigênio" },
        { id: "d", text: "Piruvato" },
      ],
      correctAnswer: "c",
      resolution:
        "O oxigênio é o aceptor final de elétrons na cadeia respiratória, formando água.",
      commonError: "Confundir o NADH (doador de elétrons) com o aceptor final.",
    },
  ],
  historia: [
    {
      slug: "brasilia-facil",
      difficulty: 1,
      prompt:
        "A transferência da capital do Brasil do Rio de Janeiro para Brasília ocorreu durante o governo de:",
      options: [
        { id: "a", text: "Getúlio Vargas" },
        { id: "b", text: "Juscelino Kubitschek" },
        { id: "c", text: "João Goulart" },
        { id: "d", text: "Castelo Branco" },
      ],
      correctAnswer: "b",
      resolution:
        "Brasília foi inaugurada em 21 de abril de 1960, no governo de Juscelino Kubitschek.",
      commonError:
        "Confundir com Getúlio Vargas, associado a outras grandes reformas do período.",
    },
    {
      slug: "lei-aurea-medio",
      difficulty: 2,
      prompt:
        "A Lei Áurea, que aboliu a escravidão no Brasil, foi assinada em:",
      options: [
        { id: "a", text: "1822" },
        { id: "b", text: "1850" },
        { id: "c", text: "1888" },
        { id: "d", text: "1891" },
      ],
      correctAnswer: "c",
      resolution: "Assinada pela Princesa Isabel em 13 de maio de 1888.",
      commonError:
        "Confundir com a Lei Eusébio de Queirós (1850, fim do tráfico) ou com a Proclamação da República (1889).",
    },
    {
      slug: "tratado-versalhes-dificil",
      difficulty: 3,
      prompt:
        "O acordo que encerrou formalmente a Primeira Guerra Mundial, impondo pesadas sanções à Alemanha, ficou conhecido como:",
      options: [
        { id: "a", text: "Tratado de Versalhes" },
        { id: "b", text: "Congresso de Viena" },
        { id: "c", text: "Tratado de Tordesilhas" },
        { id: "d", text: "Pacto de Varsóvia" },
      ],
      correctAnswer: "a",
      resolution:
        "O Tratado de Versalhes (1919) impôs reparações e restrições territoriais e militares à Alemanha.",
      commonError:
        "Confundir com o Congresso de Viena (1815), que reorganizou a Europa pós-Napoleão.",
    },
  ],
  quimica: [
    {
      slug: "numero-atomico-facil",
      difficulty: 1,
      prompt: "Qual é o número atômico do elemento Oxigênio?",
      options: [
        { id: "a", text: "6" },
        { id: "b", text: "7" },
        { id: "c", text: "8" },
        { id: "d", text: "16" },
      ],
      correctAnswer: "c",
      resolution: "O oxigênio tem 8 prótons, logo número atômico 8.",
      commonError: "Confundir número atômico com massa atômica (≈16).",
    },
    {
      slug: "estequiometria-medio",
      difficulty: 2,
      prompt:
        "Na combustão completa de 1 mol de metano (CH4 + 2O2 → CO2 + 2H2O), quantos mols de água são produzidos?",
      options: [
        { id: "a", text: "1" },
        { id: "b", text: "2" },
        { id: "c", text: "3" },
        { id: "d", text: "4" },
      ],
      correctAnswer: "b",
      resolution:
        "Pelos coeficientes balanceados, 1 mol de CH4 produz 2 mols de H2O.",
      commonError:
        "Não observar o coeficiente estequiométrico 2 diante da água.",
    },
    {
      slug: "concentracao-molar-dificil",
      difficulty: 3,
      prompt:
        "Uma solução aquosa tem concentração 0,5 mol/L de NaOH em um volume de 2 L. Quantos mols de NaOH estão presentes?",
      options: [
        { id: "a", text: "0,25" },
        { id: "b", text: "0,5" },
        { id: "c", text: "1" },
        { id: "d", text: "2" },
      ],
      correctAnswer: "c",
      resolution: "n = C × V = 0,5 mol/L × 2 L = 1 mol.",
      commonError: "Dividir a concentração pelo volume em vez de multiplicar.",
    },
  ],
  fisica: [
    {
      slug: "unidade-forca-facil",
      difficulty: 1,
      prompt: "Qual é a unidade de medida da força no Sistema Internacional?",
      options: [
        { id: "a", text: "Joule" },
        { id: "b", text: "Newton" },
        { id: "c", text: "Watt" },
        { id: "d", text: "Pascal" },
      ],
      correctAnswer: "b",
      resolution: "A força é medida em Newton (N) no SI.",
      commonError: "Confundir com Joule (energia) ou Watt (potência).",
    },
    {
      slug: "segunda-lei-newton-medio",
      difficulty: 2,
      prompt:
        "Um objeto de massa 2 kg está sujeito a uma força resultante de 10 N. Qual é a sua aceleração?",
      options: [
        { id: "a", text: "2 m/s²" },
        { id: "b", text: "5 m/s²" },
        { id: "c", text: "10 m/s²" },
        { id: "d", text: "20 m/s²" },
      ],
      correctAnswer: "b",
      resolution: "Pela 2ª Lei de Newton, a = F/m = 10/2 = 5 m/s².",
      commonError: "Multiplicar F × m em vez de dividir.",
    },
    {
      slug: "queda-livre-dificil",
      difficulty: 3,
      prompt:
        "Um corpo em queda livre, partindo do repouso, percorre qual distância aproximada após 2 segundos (g ≈ 10 m/s²)?",
      options: [
        { id: "a", text: "10 m" },
        { id: "b", text: "20 m" },
        { id: "c", text: "40 m" },
        { id: "d", text: "5 m" },
      ],
      correctAnswer: "b",
      resolution: "d = ½ · g · t² = 0,5 × 10 × 2² = 20 m.",
      commonError:
        "Esquecer o fator ½ e calcular g × t² diretamente, chegando a 40 m.",
    },
  ],
};
