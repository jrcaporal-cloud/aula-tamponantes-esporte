import type { Signal } from './shared';

/** Slide 94 — Quatro Casos, Quatro Vereditos. Personagens FICTÍCIOS (dossiê 06, Parte 5). */

/** Pictograma do esporte do personagem. */
export type Sport = 'corrida' | 'jiu-jitsu' | 'remo' | 'natação';

export interface CaseVerdict {
    id: string;
    name: string;
    sport: Sport;
    /** Duração do esforço em segundos [de, até] — a mesma do texto `effort`, para a régua. */
    effortSec: readonly [number, number];
    /** Palavra do carimbo (resumo do veredito). */
    stamp: string;
    profile: string;
    effort: string;
    dilemma: string;
    math: string;
    evidence: readonly string[];
    traps: readonly string[];
    signal: Signal;
    headline: string;
    reasoning: readonly string[];
}

export const CASES: readonly CaseVerdict[] = [
    {
        id: 'julia', name: 'Júlia', sport: 'corrida', effortSec: [120, 120], stamp: 'Candidata', profile: '24 anos · 800 m · 54 kg', effort: '~2 min de esforço',
        dilemma: 'Eliminatória e final em dias seguidos. Nunca usou bicarbonato.',
        math: '0,3 g/kg = 16,2 g · 4,4 g de Na',
        evidence: [
            'Prova de ~2 min, no centro da janela: ES 0,18 em 0,5–10 min (de Oliveira 2022).',
            '800 m: 2,9 s mais rápidos em 6 corredores (Wilkes 1983).',
            'Mulheres: só 4% dos estudos de bicarbonato (auditoria AIS).',
        ],
        traps: [
            'GI com pico ~90 min, numa prova de horário rígido.',
            'Duas cargas em dias seguidos e controle de doping na final.',
            'β-alanina: o rótulo brasileiro para em 2 g/d.',
        ],
        signal: 'verde', headline: 'Candidata — se o teste vier antes da prova',
        reasoning: [
            'Testar dose e horário no treino e numa prova menor.',
            'Planejar os dois dias juntos: GI, sódio e a urina do controle.',
            'β-alanina só com ≥ 4 semanas pela frente — e a conversa rótulo × literatura.',
        ],
    },
    {
        id: 'rafael', name: 'Rafael', sport: 'jiu-jitsu', effortSec: [360, 600], stamp: 'Sem dose aguda', profile: '28 anos · jiu-jítsu leve · 76 kg', effort: 'até 5 lutas de 6–10 min',
        dilemma: 'Pesagem com quimono imediatamente antes da 1ª luta. Corta peso.',
        math: '0,3 g/kg = 22,8 g · 6,2 g de Na · ~760 mL',
        evidence: [
            'Combate: lactato sobe, desempenho agrupado não (Miranda 2022, 8 estudos).',
            'Judô melhorou nas séries finais (Artioli 2007); BJJ, nada na preensão (Ragone 2020).',
            'Dose progressiva por 10 dias ajudou lutadores homens (Durkalec-Michalski 2020).',
        ],
        traps: [
            'Carregar antes da pesagem põe água e sódio na balança.',
            'Corte de peso com diurético: S5 e hipocalemia.',
            'Compulsão depois da pesagem + bicarbonato: risco de ruptura gástrica.',
        ],
        signal: 'amarelo', headline: 'O dia de luta decide contra a dose aguda',
        reasoning: [
            'Sem janela entre balança e luta, e com chave imprevisível, a dose aguda perde o sentido.',
            'β-alanina crônica é a opção menos arriscada no dia.',
            'Antes de qualquer tampão: olhar o corte de peso e a relação com a comida.',
        ],
    },
    {
        id: 'carlos', name: 'Carlos', sport: 'remo', effortSec: [420, 420], stamp: 'Médico primeiro', profile: '58 anos · remo master · 82 kg', effort: '2.000 m em ~7 min',
        dilemma: 'Hipertenso com hidroclorotiazida + losartana. Compete sob o Código.',
        math: '0,3 g/kg = 24,6 g · 6,7 g de Na',
        evidence: [
            'Remo 2.000 m é alvo clássico: ~2 s com horário individual, em elite (Boegman 2020).',
            'Bicarbonato agudo: PAD +3,3 mmHg em normotensos (Kahle 2013).',
            'β-alanina não tem sódio e foi usada dos 60 aos 80 anos (del Favero 2012).',
        ],
        traps: [
            'Hidroclorotiazida é S5: sem AUT, já é infração.',
            'Tiazida + bicarbonato: a bula contraindica.',
            'Rim: rastrear TFG antes (BiCARB 2020).',
        ],
        signal: 'vermelho', headline: 'Primeiro o médico, depois o tampão',
        reasoning: [
            'AUT da tiazida e avaliação renal antes de falar em ergogênico.',
            'Bicarbonato fora de cogitação sem liberação médica.',
            'Caminho provável: β-alanina, dentro do limite brasileiro.',
        ],
    },
    {
        id: 'bianca', name: 'Bianca', sport: 'natação', effortSec: [120, 120], stamp: 'Regra primeiro', profile: '18 anos · natação 200 m · 60 kg', effort: '~2 min, manhã e tarde',
        dilemma: 'Ovolactovegetariana. Seletiva estadual, treina 2×/dia.',
        math: '0,3 g/kg = 18 g · 4,9 g de Na',
        evidence: [
            'Vegetarianos: carnosina −26% no gastrocnêmio (Everaert 2011, dado de homens).',
            '200 m: positivo em elite masculina (Lindh 2008), nulo na meta-análise (Huang 2025).',
            'Nadadores bem treinados: 124,5 × 125,1 s, sem diferença (Gurton 2025).',
        ],
        traps: [
            'IN 28: β-alanina não autorizada abaixo de 19 anos.',
            'Cápsula de gelatina não é vegetariana.',
            'Dose repetida no mesmo dia; controle frequente em seletiva.',
        ],
        signal: 'amarelo', headline: 'A regra e a idade decidem antes da ciência',
        reasoning: [
            'β-alanina fica para depois dos 19 anos.',
            'Bicarbonato em 200 m: evidência nula em quem já é bem treinado.',
            'Antes de tudo: disponibilidade energética e proteína na dieta vegetariana.',
        ],
    },
];

/** Janela do tampão na régua do tempo (ISSN 2021: 30 s a ~12 min). */
export const WINDOW_SEC = [30, 720] as const;

/** 2 passos por caso (raciocínio → veredito) + o quadro final. */
export const CASE_STEP_COUNT = CASES.length * 2 + 1;
export const CASE_TABS = [...CASES.map(c => c.name), 'Os quatro'] as const;
