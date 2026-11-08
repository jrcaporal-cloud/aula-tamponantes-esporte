/** Passos do "A Meta-análise por Dentro". Simulação própria + INTHOUT2016, CARR2011, VONHIPPEL2015, GRGIC2021_UMB, LOHSE2020. */

export type MetaVisual = 'forest' | 'funnel' | 'certainty';

export interface MetaStep {
    tab: string;
    headline: string;
    text: string;
    visual: MetaVisual;
    showPi: boolean;
    showI2: boolean;
    showGhosts: boolean;
    source: string;
}

/** Sementes escolhidas para lembrar o bicarbonato de Carr 2011 (média ~1,7%, variação entre cenários ~1,2%). */
export const FOREST = { seed: 253, k: 10, mu: 1.7, tau: 1.2, seMin: 0.6, seMax: 1.8 } as const;
export const FUNNEL = { seed: 277, pubSeed: 1277, k: 40, mu: 0.5, tau: 0.3, seMin: 0.3, seMax: 2.6, seCut: 0.8, luck: 0.15 } as const;

export const META_STEPS: readonly MetaStep[] = [
    {
        tab: 'O losango',
        headline: 'O losango diz onde está a média',
        text: 'Dez estudos pequenos, cada um com seu intervalo. O losango resume: média positiva, IC95% longe do zero. "Funciona", diria o resumo.',
        visual: 'forest', showPi: false, showI2: false, showGhosts: false,
        source: 'Meta-análise ilustrativa (efeitos aleatórios, DerSimonian–Laird) sobre estudos simulados.',
    },
    {
        tab: 'O próximo atleta',
        headline: 'O intervalo de predição diz o que esperar',
        text: 'O IC é da média. Para o próximo cenário — o seu atleta, o seu teste — vale o intervalo de predição, que aqui cruza o zero. Em 72,4% de 479 meta-análises "significativas", o mesmo aconteceu.',
        visual: 'forest', showPi: true, showI2: false, showGhosts: false,
        source: 'IntHout J et al. BMJ Open 2016. Carr 2011 (bicarbonato): média 1,7%, ±1,2% entre cenários → ≈ −0,7% a +4,1% (cálculo).',
    },
    {
        tab: 'I²',
        headline: 'I² com poucos estudos é chute',
        text: 'Com 7 estudos e nenhuma heterogeneidade real, o I² sai em média 12 pontos acima; com heterogeneidade alta, pode sair 28 abaixo. "I² = 0%" em 11 estudos pequenos não prova concordância: peça o tau e o intervalo de predição.',
        visual: 'forest', showPi: true, showI2: true, showGhosts: false,
        source: 'von Hippel PT. BMC Med Res Methodol 2015 · I² = 0% com 11 estudos: Miller LE et al. JISSN 2025.',
    },
    {
        tab: 'O funil',
        headline: 'O funil torto',
        text: 'Cada ponto é um estudo: embaixo os pequenos, em cima os grandes. Os pequenos publicados estão quase todos do lado positivo. Onde estão os pequenos que não acharam nada?',
        visual: 'funnel', showPi: false, showI2: false, showGhosts: false,
        source: 'Simulação: estudo grande sai sempre; pequeno só sai se for significativo (ou por sorte, 15%).',
    },
    {
        tab: 'Os que faltam',
        headline: 'A gaveta dobra o efeito',
        text: 'Com os estudos da gaveta de volta, o funil fica simétrico e a média cai à metade. Por isso Carr 2011 excluiu estimativas com erro-padrão acima de 2,7%, e a revisão guarda-chuva do bicarbonato marca o viés de publicação como "fortemente suspeito".',
        visual: 'funnel', showPi: false, showI2: false, showGhosts: true,
        source: 'Egger M et al. BMJ 1997 (funil) · Carr AJ et al. Sports Med 2011 · Grgic J et al. JISSN 2021 (umbrella).',
    },
    {
        tab: 'Certeza',
        headline: 'O topo da pirâmide também tem nota',
        text: 'No GRADE, o bicarbonato chega no máximo a certeza moderada. E uma meta-análise clássica dele usa inferência baseada em magnitude (MBI), o método em que "possivelmente benéfico" pode ser falso-positivo em até 45% das vezes.',
        visual: 'certainty', showPi: false, showI2: false, showGhosts: false,
        source: 'Grgic J et al. JISSN 2021 · Lohse KR et al. PLoS One 2020 · Sainani KL. MSSE 2018.',
    },
];

export interface GradeRow { level: string; items: readonly string[] }

export const GRADE: readonly GradeRow[] = [
    { level: 'Alta', items: [] },
    { level: 'Moderada', items: ['Wingate e Yo-Yo (potência de pico e média)'] },
    { level: 'Baixa', items: ['provas de ~45 s a 8 min', 'remo 2.000 m', 'resistência muscular'] },
    { level: 'Muito baixa', items: [] },
];

export const MBI_FACTS = [
    { value: '232', label: 'artigos com MBI revisados' },
    { value: '10', label: 'atletas por grupo (mediana)' },
    { value: '15%', label: 'com cálculo amostral a priori' },
    { value: '22–45%', label: 'falso-positivo em "possível"' },
] as const;
