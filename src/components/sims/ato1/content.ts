/**
 * Textos e dados do Ato I · O Inquérito. Números só dos dossiês (docs/dossie/03, 01, 02, 06).
 * `ACCUSATIONS` é lido também pelo slide 97 (VerdictRecapSim): mudar aqui muda lá.
 */
import { C } from '../kit/palette';

// ─── Slide 11 · Culpado ou Inocente? ────────────────────────────────────────

/** Veredito de uma acusação: culpado = a acusação procede; inocente = não procede. */
export type Verdict = 'culpado' | 'inocente' | 'depende';

export interface Accusation {
    id: number;
    /** Quem está no banco dos réus (rótulo curto da carta). */
    suspect: string;
    /** A acusação, como a turma costuma ouvir. */
    claim: string;
    verdict: Verdict;
    /** O veredito justificado em uma ou duas frases. */
    short: string;
    /** Fonte curta (a citação completa fica no fragmento do slide). */
    source: string;
}

export const ACCUSATIONS: readonly Accusation[] = [
    {
        id: 1,
        suspect: 'ácido lático',
        claim: 'O ácido lático causa a queimação nas pernas.',
        verdict: 'depende',
        short: 'Cúmplice, não autor: H⁺ e lactato sobem juntos (inclinação 0,98), mas a sensação só surge com H⁺, ATP e lactato somados.',
        source: 'Marcinek 2010 · Pollak 2014',
    },
    {
        id: 2,
        suspect: 'lactato',
        claim: 'O lactato causa a dor muscular do dia seguinte.',
        verdict: 'inocente',
        short: 'Só a corrida em descida, mais leve, deu dor (CK +351% em 24 h). O lactato sai do músculo em minutos (meia-vida 9,5 min).',
        source: 'Schwane 1983 · Sahlin 1976',
    },
    {
        id: 3,
        suspect: 'H⁺',
        claim: 'O H⁺ é a única causa da fadiga.',
        verdict: 'inocente',
        short: 'Na doença de McArdle o pH não cai e a força cai igual. Em fibra de camundongo, o efeito na força vai de −28% (12 °C) a −10% (32 °C).',
        source: 'Cady 1989 · Westerblad 1997',
    },
    {
        id: 4,
        suspect: 'bicarbonato',
        claim: 'O bicarbonato melhora qualquer prova.',
        verdict: 'inocente',
        short: 'Nulo em 10 e 30 s, positivo em 120 e 240 s. Na força máxima, nada (DMP −0,03).',
        source: 'McNaughton 1992 · Grgic 2020',
    },
    {
        id: 5,
        suspect: 'beta-alanina',
        claim: 'A beta-alanina funciona já na primeira semana.',
        verdict: 'inocente',
        short: 'Ela age enchendo a carnosina do músculo: +42% a +64% em 4 semanas (3,2 e 6,4 g/d), +80% em 10 semanas.',
        source: 'Harris 2006 · Hill 2007',
    },
    {
        id: 6,
        suspect: 'bicarbonato',
        claim: 'Bicarbonato é doping.',
        verdict: 'depende',
        short: 'Por via oral, fora da Lista Proibida 2026. Na veia, em dose útil, viola o M2.2 pelo volume (mais de 100 mL em 12 h).',
        source: 'WADA, Lista Proibida 2026 (M2.2)',
    },
];

export interface VerdictLook {
    label: string;
    /** Leitura do veredito: o quadro julga a acusação, não a molécula. */
    gloss: string;
    /** Versão curta para a legenda do topo. */
    brief: string;
    color: string;
}

export const VERDICT_LOOK: Record<Verdict, VerdictLook> = {
    culpado: { label: 'Culpado', gloss: 'a acusação procede', brief: 'procede', color: C.risk },
    inocente: { label: 'Inocente', gloss: 'a acusação não procede', brief: 'não procede', color: C.ok },
    depende: { label: 'Depende', gloss: 'procede só em parte', brief: 'em parte', color: C.stone },
};

export const VERDICT_ORDER: readonly Verdict[] = ['culpado', 'inocente', 'depende'];

// ─── Slide 10 · Os Últimos 200 Metros ───────────────────────────────────────

export interface LastLapStep {
    tab: string;
    headline: string;
    text: string;
}

export const LAST_LAP_STEPS: readonly LastLapStep[] = [
    {
        tab: 'A prova',
        headline: 'Duas voltas no limite',
        text: 'Júlia, 24 anos, 800 m. Saída forte, primeira volta no ritmo. Aos 600 m ela ainda segura a passada. Falta a última curva.',
    },
    {
        tab: 'Os últimos 200 m',
        headline: 'O esforço é máximo, a velocidade cai',
        text: 'Na curva final a passada encurta. Ela não diminuiu o esforço: o músculo deixou de entregar a mesma potência. E o pH dentro dele escorrega.',
    },
    {
        tab: 'O que queima?',
        headline: '“As pernas queimaram.”',
        text: 'Todo mundo na arquibancada tem um suspeito. A aula é o inquérito: quem estava na cena, quem é cúmplice e quem foi acusado injustamente.',
    },
];

/** Suspeitos que aparecem na pergunta final do slide 10 (sem veredito: é só a cena do crime). */
export const SUSPECTS: readonly string[] = ['ácido lático?', 'H⁺?', 'fosfato?', 'cálcio?', 'o sinal ao cérebro?'];

// ─── Slide 12 · Quatro Atletas, um Problema ─────────────────────────────────

export type Sport = 'pista' | 'tatame' | 'remo' | 'piscina';

/** Chave estável de cada atleta da aula (usada para a cor em todos os atos). */
export type CastId = 'julia' | 'rafael' | 'carlos' | 'bianca';

export interface CastMember {
    id: CastId;
    name: string;
    meta: string;
    sport: Sport;
    event: string;
    /** Duração de um esforço, em minutos, para a barra comum (0–10 min). */
    minutes: readonly [number, number];
    durationLabel: string;
    dilemma: string;
    /** Cor do problema central do personagem (linguagem de cor da aula). */
    color: string;
    colorReason: string;
}

export const CAST: readonly CastMember[] = [
    {
        id: 'julia',
        name: 'Júlia',
        meta: '24 anos · 54 kg',
        sport: 'pista',
        event: 'Atletismo · 800 m',
        minutes: [2, 2],
        durationLabel: '~2 min, eliminatória e final em dias seguidos',
        dilemma: 'A prova cai bem no meio da janela estudada. Mas horário rígido, estômago sensível e duas provas seguidas: arriscar?',
        color: C.base,
        colorReason: 'tampão',
    },
    {
        id: 'rafael',
        name: 'Rafael',
        meta: '28 anos · 76 kg na pesagem',
        sport: 'tatame',
        event: 'Jiu-jítsu · faixa-preta, leve',
        minutes: [6, 10],
        durationLabel: 'até 5 lutas de 6–10 min no mesmo dia',
        dilemma: 'A pesagem é com quimono, imediatamente antes da 1ª luta. Sódio e água pesam na balança. Onde fica a janela?',
        color: C.sodium,
        colorReason: 'sódio',
    },
    {
        id: 'carlos',
        name: 'Carlos',
        meta: '58 anos · 82 kg',
        sport: 'remo',
        event: 'Remo master · 2.000 m',
        minutes: [7, 7],
        durationLabel: '~7 min',
        dilemma: 'Hipertenso com hidroclorotiazida + losartana, compete sob o Código Mundial Antidoping. Cabe um tampão de sódio?',
        color: C.risk,
        colorReason: 'risco',
    },
    {
        id: 'bianca',
        name: 'Bianca',
        meta: '18 anos · 60 kg',
        sport: 'piscina',
        event: 'Natação · 200 m',
        minutes: [2, 2.5],
        durationLabel: '~2–2,5 min (estimativa), duas provas no dia',
        dilemma: 'Ovolactovegetariana: menos carnosina de partida. Mas aos 18 anos a regra brasileira pode decidir antes da ciência.',
        color: C.carno,
        colorReason: 'carnosina',
    },
];

/**
 * Cor de cada atleta, definida uma vez aqui (Ato I) e importada em todos os atos que pintam o elenco:
 * a Júlia é ciano no slide 4 e continua ciano na janela de duração, no sódio e nos vereditos.
 */
export const CAST_COLOR: Readonly<Record<CastId, string>> = Object.fromEntries(
    CAST.map(m => [m.id, m.color]),
) as Record<CastId, string>;

// ─── Slide 13 · O Mapa do Inquérito ─────────────────────────────────────────

export type ChapterIcon = 'search' | 'microscope' | 'flask' | 'atom' | 'users' | 'scale' | 'gavel';

export interface Chapter {
    roman: string;
    title: string;
    question: string;
    icon: ChapterIcon;
    color: string;
}

export const CHAPTERS: readonly Chapter[] = [
    { roman: 'I', title: 'O Inquérito', question: 'A cena do crime e o que a turma já acha.', icon: 'search', color: C.caseFile },
    { roman: 'II', title: 'A Perícia', question: 'O que acontece com o H⁺ dentro e fora da fibra.', icon: 'microscope', color: C.acid },
    { roman: 'III', title: 'O Bicarbonato', question: 'Primeira testemunha: o tampão de fora. Quando ajuda e a que preço.', icon: 'flask', color: C.base },
    { roman: 'IV', title: 'A Beta-alanina', question: 'Segunda testemunha: o tampão de dentro, que leva semanas.', icon: 'atom', color: C.carno },
    { roman: 'V', title: 'Testemunhas fracas e alianças', question: 'Citrato, fosfato, água alcalina e as combinações.', icon: 'users', color: C.sodium },
    { roman: 'VI', title: 'O Contra-interrogatório', question: 'Como um estudo engana sem mentir.', icon: 'scale', color: C.co2 },
    { roman: 'VII', title: 'O Veredito', question: 'Regras, segurança e os quatro casos.', icon: 'gavel', color: C.ok },
];

export const PRIZE = {
    title: 'O tamanho do prêmio',
    lines: [
        { value: 'ES 0,17', text: 'efeito médio, 189 estudos' },
        { value: '~2%', text: 'esforços de ~60 s (COI)' },
    ],
    question: 'A pergunta da aula não é “funciona?”. É: para quem e quando?',
    source: 'Tampões extracelulares: ES 0,17 em 189 estudos (de Oliveira 2022) · ~2% em ~60 s (consenso COI, Maughan 2018)',
} as const;
