/**
 * Slide 28 — "A Dor que Vem Descendo o Morro". SCHWANE1983 (cruzado, humano, n = 7: 45 min no
 * plano a 78% VO₂máx × descida de −10% a 57%; só a descida deu DOMS e CK +351% em 24 h);
 * SAHLIN1976 (meia-vida do lactato muscular 9,5 min); ARMSTRONG1984/CHEUNG2003 (DOMS 1–5 dias).
 */

export const DOMS_STEPS = [
    {
        tab: 'Dois treinos',
        headline: 'O mais forte e o mais leve',
        text: 'Sete voluntários correram 45 minutos duas vezes: no plano, a 78% do VO₂máx, e em descida de 10%, a só 57%. O treino do plano é o mais intenso — e, por inferência, o que mais produz lactato.',
        source: 'Schwane 1983 — ensaio cruzado, humano, n = 7. Lactato não foi medido no resumo.',
    },
    {
        tab: 'Quem doeu',
        headline: 'Só a descida doeu',
        text: 'Glúteos, quadríceps e pernas doeram nos dias seguintes apenas depois da descida, e a CK subiu 351% em 24 h. O plano, mais intenso, não deu dor nem elevação enzimática. O que mudou foi a contração excêntrica.',
        source: 'Schwane 1983 (humano). Modelo do dano excêntrico: Armstrong 1984 (revisão).',
    },
    {
        tab: 'A cronologia',
        headline: 'O lactato some em minutos; a dor chega em dias',
        text: 'No músculo, o lactato cai à metade a cada 9,5 min de recuperação: em uma hora, quase nada. A dor tardia aparece de 1 a 5 dias depois. A cronologia não fecha — o réu tem álibi.',
        source: 'Meia-vida: Sahlin 1976 (humano). DOMS 1–5 dias: Armstrong 1984; Cheung 2003 (revisões).',
    },
] as const;
