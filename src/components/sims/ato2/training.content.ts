import type { EvidenceKind } from './ui';

/**
 * Slide 30 — "O Treino, o Primeiro Tampão". Dossiê 04 (Parte J) e 03: SHARP1986, EDGE2006(A),
 * WESTON1997, BISHOP2008, MCGINLEY2016, MEDBO1985. βm de estudos diferentes tem unidades e
 * métodos diferentes (in vivo × in vitro): o gráfico compara só a variação percentual.
 */

export interface BufferRow {
    id: string;
    label: string;
    sub: string;
    pct: number;
    /** Passo em que a linha aparece. */
    step: number;
    kind: EvidenceKind;
    kindLabel: string;
}

export const BUFFER_ROWS: readonly BufferRow[] = [
    { id: 'sharp', label: 'Sprint, 8 semanas', sub: 'Sharp 1986 · 44,7 → 61,0 slykes', pct: 37, step: 0, kind: 'humano', kindLabel: 'n = 8 destreinados' },
    { id: 'edge-int', label: 'Intervalado, 5 semanas', sub: 'Edge 2006 · 123 → 153', pct: 25, step: 1, kind: 'humano', kindLabel: 'ECR · 16 mulheres' },
    { id: 'edge-cont', label: 'Contínuo, mesmo volume', sub: 'Edge 2006 · 130 → 133', pct: 2, step: 1, kind: 'humano', kindLabel: 'ECR · 16 mulheres' },
    { id: 'weston', label: 'HIIT, só 6 sessões', sub: 'Weston 1997 · 206,6 → 240,4', pct: 16, step: 2, kind: 'humano', kindLabel: 'n = 6 ciclistas treinados' },
    { id: 'bishop', label: 'HIIT intenso demais', sub: 'Bishop 2008 · pH pós-esforço 6,81', pct: -11, step: 3, kind: 'humano', kindLabel: 'mulheres' },
];

export interface TrainingStep {
    tab: string;
    headline: string;
    text: string;
}

export const TRAINING_STEPS: readonly TrainingStep[] = [
    {
        tab: 'Sprint',
        headline: 'Oito semanas de sprint: +37% de tampão no músculo',
        text: 'Ciclistas de endurance tinham o mesmo βm que destreinados. Quem ganhou foi quem fez sprint — o tamponamento intracelular é treinável.',
    },
    {
        tab: 'Intensidade',
        headline: 'É a intensidade, não o volume',
        text: 'Com o volume total igualado, o intervalado acima do limiar subiu o βm em 25%; o contínuo, em 2%. Os dois melhoraram VO₂pico e limiar igualmente.',
    },
    {
        tab: 'Em treinados',
        headline: 'Até em quem já treina muito',
        text: 'Seis sessões de intervalado em ciclistas bem treinados: +16% de βm, e o contrarrelógio de 40 km melhorou.',
    },
    {
        tab: 'Tem limite',
        headline: 'Mais acidose no treino não é mais tampão',
        text: 'Um HIIT intenso demais reduziu o βm em 11%. E as adaptações de transportadores de um mês de HIIT sumiram em 6 semanas de destreino. O tampão do treino é perecível.',
    },
    {
        tab: 'O velocista',
        headline: 'O velocista não tampona melhor no sangue: ele aguenta mais',
        text: 'Após um esforço exaustivo de ~1 min, velocistas chegaram a pH sanguíneo mais baixo que fundistas, com a mesma capacidade tamponante do sangue. A diferença está no músculo.',
    },
];

/** Medbø 1985: pH sanguíneo mínimo e lactato de pico após corrida exaustiva de ~1 min. */
export const MEDBO = [
    { id: 'fund', label: 'fundistas', ph: 7.175, lactate: 12.5 },
    { id: 'velo', label: 'velocistas', ph: 7.065, lactate: 16.7 },
] as const;
