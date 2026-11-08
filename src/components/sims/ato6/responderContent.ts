/** Passos do "Respondedor ou Ruído?". Simulação própria + ATKINSON2015, FROIO2015, HECKSTEDEN2018, DEOLIVEIRA2020. */

export interface ResponderStep {
    tab: string;
    headline: string;
    text: string;
    /** 0 = só o efeito verdadeiro; 1 = medido com ruído. */
    noise: number;
    showControl: boolean;
    source: string;
}

export const ATHLETES = 20;
export const TRUE_EFFECT = 2;
/** Semente escolhida por ser típica: DP das mudanças parecido nos dois grupos (o caso esperado). */
export const RESP_SEED = 85;
/** Acima disto o atleta "respondeu"; até zero, "não respondeu" (rótulos de quem lê o gráfico). */
export const RESPONDER_CUT = 1;

export const NOISE_OPTIONS = [
    { value: 1, label: '1%' },
    { value: 3, label: '3%' },
    { value: 5, label: '5%' },
];

export const RESPONDER_STEPS: readonly ResponderStep[] = [
    {
        tab: 'A verdade',
        headline: 'Vinte atletas, a mesma resposta',
        text: 'Nesta simulação, cada atleta melhora exatamente 2% com o suplemento. Não existe respondedor nem não respondedor: o efeito é idêntico em todos.',
        noise: 0, showControl: false,
        source: 'Efeito verdadeiro programado: +2% para os 20.',
    },
    {
        tab: 'Agora meça',
        headline: 'O ruído inventa categorias',
        text: 'Medindo antes e depois com um teste de CV 3%, o gráfico de cascata aparece sozinho: uns "respondem" muito, outros "pioram". É a figura que vira slide de congresso.',
        noise: 1, showControl: false,
        source: 'Mudança observada = 2% + ruído do teste nas duas medidas (√2 × CV).',
    },
    {
        tab: 'O controle',
        headline: 'O placebo tem a mesma cascata',
        text: 'O grupo placebo, com efeito zero, também tem "respondedores". A pergunta certa é: o DP das mudanças no suplemento é maior que no controle? Se não for, não há resposta individual para explicar.',
        noise: 1, showControl: true,
        source: 'Atkinson G, Batterham AM. Exp Physiol 2015;100(6):577-588 — DP resposta = √(DP² supl − DP² controle).',
    },
    {
        tab: 'Quatro vezes',
        headline: 'O mesmo atleta não se repete',
        text: 'Quinze homens receberam bicarbonato em 4 sessões. A alcalose apareceu em todas; o desempenho, só às vezes. Dez melhoraram além do ruído em pelo menos uma; cinco nunca. Um teste só não rotula ninguém.',
        noise: 1, showControl: true,
        source: 'Froio de Araujo Dias G et al. PLoS One 2015 · Hecksteden A et al. J Appl Physiol 2018 · de Oliveira LF et al. MSSE 2020.',
    },
];

/** Froio 2015: trabalho total vs. placebo nas 4 sessões (todas p > 0,05). */
export const FROIO_SESSIONS = [3.6, 0.3, 2.1, 6.7] as const;
