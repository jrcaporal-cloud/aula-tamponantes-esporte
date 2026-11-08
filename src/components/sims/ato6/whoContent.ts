/** Passos do "Quem é Estudado?". Números: SMITH2022, MCKAY2022, SAUNDERS2022_FEM, AIS-SB2025 (dossiê 06), MALCATA2014. */

export type WhoVisual = 'waffle' | 'tiers' | 'bicarb' | 'cast';

export interface WhoStep {
    tab: string;
    headline: string;
    text: string;
    visual: WhoVisual;
    source: string;
}

export const WHO_STEPS: readonly WhoStep[] = [
    {
        tab: 'Sexo',
        headline: 'De cada 100 participantes, 23 são mulheres',
        text: 'Uma auditoria de 1.826 estudos com suplementos de desempenho somou 34.889 participantes. Só um terço dos estudos incluiu ao menos uma mulher, e estudos só com mulheres foram de 0 a 8%.',
        visual: 'waffle',
        source: 'Smith ES et al. Nutrients 2022;14(5):953 (β-alanina, cafeína, creatina, glicerol, nitrato, bicarbonato).',
    },
    {
        tab: 'Nível',
        headline: '"Atletas" que são universitários ativos',
        text: 'Entre os estudos que permitem classificar, ~70% são de nível 0 a 2 e só 10% de elite ou classe mundial. Em 56% nem dá para saber quem foi estudado.',
        visual: 'tiers',
        source: 'Smith 2022 (soma 6 + 30 + 34,5%) · níveis de McKay AKA et al. IJSPP 2022.',
    },
    {
        tab: 'Bicarbonato',
        headline: 'No bicarbonato, a lacuna é maior',
        text: 'Dos estudos de bicarbonato, 20% incluíram alguma mulher e 7,4% as analisaram à parte. Nas 11 análises femininas, o efeito estimado é 0,37, com intervalo que cruza o zero: dado de menos para concluir que funciona igual ou diferente.',
        visual: 'bicarb',
        source: 'Saunders B et al. Eur J Sport Sci 2022 · AIS, ficha do bicarbonato (2025): 4% dos estudos com mulheres.',
    },
    {
        tab: 'Os nossos quatro',
        headline: 'Antes do resultado, pergunte: quem?',
        text: 'Nenhum dos quatro atletas da aula se parece com o participante típico: homem jovem, universitário, testado no laboratório. Isso não anula a evidência — mas diz quanto ela precisa ser extrapolada.',
        visual: 'cast',
        source: 'Personagens: casos fictícios. Variabilidade em provas de elite e esportes sem desfecho contínuo: Malcata & Hopkins 2014.',
    },
];

/** Smith 2022: distribuição dos estudos classificáveis por nível (McKay 2022). */
export const TIERS = [
    { tier: 0, name: 'sedentário', pct: 6 },
    { tier: 1, name: 'ativo', pct: 30 },
    { tier: 2, name: 'treinado', pct: 34.5 },
    { tier: 3, name: 'nacional', pct: 19.5 },
    { tier: 4, name: 'elite', pct: 9.5 },
    { tier: 5, name: 'classe mundial', pct: 0.5 },
] as const;

export const BICARB_BARS = [
    { label: 'incluíram ao menos uma mulher', pct: 20, note: 'Saunders 2022 · 30 de 149' },
    { label: 'analisaram mulheres à parte', pct: 7.4, note: 'Saunders 2022 · 11 de 149' },
    { label: 'estudos com mulheres (auditoria)', pct: 4, note: 'AIS 2025' },
] as const;

export const CAST = [
    { name: 'Júlia', who: '24 a · 800 m', gap: 'Mulher: 23% dos participantes; só 14% dos estudos com mulheres tentaram definir a fase do ciclo.' },
    { name: 'Rafael', who: '28 a · jiu-jítsu', gap: 'O perfil mais estudado — mas luta não tem desfecho contínuo como um contrarrelógio.' },
    { name: 'Carlos', who: '58 a · remo master', gap: 'Hipertenso, com diurético: vale perguntar se algum ensaio incluiu alguém assim.' },
    { name: 'Bianca', who: '18 a · natação 200 m', gap: 'Mulher e vegetariana: grupos com carnosina menor e pouco estudados (AIS 2025).' },
] as const;
