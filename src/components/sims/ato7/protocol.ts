/** Slide 95 — Testar no Treino Antes da Prova. Fluxo de raciocínio (consensos AIS 2025, ISSN 2021, COI 2018). Sem receita. */

export interface FlowNode {
    id: string;
    tab: string;
    q: string;
    short: string;
    /** Saída lateral (quando a resposta encerra o fluxo). */
    exit?: string;
    /** Itens que o passo confere (linha de selos). */
    chips: readonly string[];
    detail: string;
    points: readonly string[];
    source: string;
}

export const FLOW: readonly FlowNode[] = [
    {
        id: 'janela', tab: 'Janela', q: 'A prova está na janela?', short: '30 s a ~12 min', exit: 'não → outra via',
        chips: ['400–1.500 m ✓', 'remo 2.000 m ✓', 'sprint < 10 s ✗', 'força máxima ✗'],
        detail: 'O tampão serve a esforços intensos de 30 s a ~12 min; também aparece acima de 10 min (ES 0,22).',
        points: ['Sprint isolado < 60 s: sem benefício da β-alanina.', 'Força máxima: SMD −0,03 com bicarbonato.'],
        source: 'ISSN 2021 (Grgic); de Oliveira 2022; Hobson 2012; Grgic 2020.',
    },
    {
        id: 'contra', tab: 'Contraindicação', q: 'Contraindicação?', short: 'o semáforo', exit: 'sim → não usar',
        chips: ['diurético', 'doença renal', 'IC / edema', 'gestação', 'transtorno alimentar', '> 60 anos'],
        detail: 'Diurético, doença renal, insuficiência cardíaca ou edema, gestação, transtorno alimentar, idade acima de 60.',
        points: ['A dose é a mesma; o paciente, não (slide anterior).'],
        source: 'Bula Baxter; BiCARB 2020; Han 2022; Diaconu 2022.',
    },
    {
        id: 'regras', tab: 'Regras', q: 'As regras permitem?', short: 'WADA · Anvisa', exit: 'não → parar',
        chips: ['oral ✓', 'IV > 100 mL/12 h ✗', 'diurético → AUT', 'BR: β-alanina ≤ 2 g/d', 'BR: < 19 anos ✗'],
        detail: 'Oral é permitido; IV acima de 100 mL em 12 h, não. Diurético é S5 e pede AUT. No Brasil: β-alanina ≤ 2 g/d e só a partir de 19 anos.',
        points: ['Federação: pesagem, "no needle".', 'Produto: certificação por lote reduz, não elimina o risco.'],
        source: 'WADA 2026; IN 28; COI 2018; AIS 2025.',
    },
    {
        id: 'teste', tab: 'Teste', q: 'Testar no treino', short: 'GI · horário · balança',
        chips: ['1 preparação', '2 repouso', '3 treino', '4 prova menor'],
        detail: 'Plano do AIS em 4 fases: preparação → testes em repouso (HCO₃⁻ a cada 30 min) → no treino → prova de menor prioridade.',
        points: ['Horário individual: só 1 de 23 remadores tinha o pico aos 60 min.', 'Refeição pequena rica em CHO reduz o GI.'],
        source: 'AIS 2025; Boegman 2020; Carr 2011.',
    },
    {
        id: 'registrar', tab: 'Registro', q: 'Registrar', short: 'prontuário',
        chips: ['via', 'composição', 'posologia', 'justificativa', 'efeito adverso'],
        detail: 'Via, composição, posologia e justificativa no prontuário; efeito adverso se notifica.',
        points: ['Anote GI, horário e desempenho — sabendo que parte do efeito é placebo.'],
        source: 'CFN 656/2020 (art. 3º, XII); ISSN 2021; McClung & Collins 2007.',
    },
    {
        id: 'decidir', tab: 'Decisão', q: 'Decidir', short: 'usar · ajustar · largar',
        chips: ['usar', 'ajustar', 'abandonar', 'reavaliar na temporada'],
        detail: 'Usar, ajustar ou abandonar — e reavaliar na temporada seguinte. Abandonar também é um bom resultado.',
        points: ['A decisão vem do teste do atleta, não do estudo médio.'],
        source: 'COI 2018: testar sempre no treino antes da competição.',
    },
];
