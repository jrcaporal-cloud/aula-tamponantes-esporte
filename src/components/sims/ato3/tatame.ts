import { C } from '../kit/palette';

/** Slide 26: bicarbonato nas lutas (dossiê 01, seção 3) e o dilema de Rafael (caso fictício, dossiê 06). */

export interface CombatTrial {
    sport: string;
    who: string;
    n: string;
    result: string;
    positive: boolean;
    /** Atletas por estudo (um ponto por atleta no slide). */
    athletes: readonly number[];
}

export const COMBAT: readonly CombatTrial[] = [
    { sport: 'Judô', who: 'Artioli 2007 · USP', n: 'n = 9 e 14', result: 'melhora no 2º e 3º SJFT; Wingate de braços no 3º e 4º', positive: true, athletes: [9, 14] },
    { sport: 'Boxe', who: 'Siegler 2010', n: 'n = 10', result: 'mais golpes acertados em 4 × 3 min de sparring', positive: true, athletes: [10] },
    { sport: 'Taekwondo', who: 'Lopes-Silva 2018', n: 'n = 9', result: 'tempo de ataque +13% (p = 0,05)', positive: true, athletes: [9] },
    { sport: 'Caratê', who: 'Rezaei 2019', n: 'n = 8', result: 'mais tempo até a exaustão no teste específico', positive: true, athletes: [8] },
    { sport: 'Jiu-jítsu', who: 'Ragone 2020', n: 'n = 10', result: 'alcalose sim; preensão máxima e intermitente: nada', positive: false, athletes: [10] },
];

export const MAT_TABS = ['Os ensaios', 'Meta-análise', 'Antes da pesagem', 'Depois da pesagem', 'O que pesa'] as const;

export const MAT_FEET: readonly string[] = [
    'Judô, boxe, taekwondo, caratê: ensaios positivos, todos com 8 a 14 atletas, e o efeito nas séries finais. O único agudo de jiu-jítsu foi nulo.',
    'Juntando 8 artigos: o lactato sobe, mas potência, esforço percebido e testes específicos não mudam. O "sim" do posicionamento não é unânime.',
    'Na IBJJF a pesagem é de quimono, imediatamente antes da 1ª luta, tentativa única. Tomar antes significa subir na balança com o sódio e a água.',
    'Tomar depois da pesagem: a 1ª luta começa sem tampão algum, e as seguintes caem em horários que ninguém controla.',
    'Para o Rafael, o bicarbonato briga com a balança, com o estômago no solo e com o relógio. A decisão fica para o veredito (Ato VII).',
];

export type DoseTiming = 'antes' | 'depois';

export const MAT_DEFAULT_TIMING: readonly DoseTiming[] = ['antes', 'antes', 'antes', 'depois', 'depois'];

/** Linha do tempo ILUSTRATIVA do dia (min desde o início); pesagem colada na 1ª luta. */
export const WEIGH_IN = 150;
export const FIGHTS: readonly { start: number; dur: number }[] = [
    { start: 152, dur: 8 }, { start: 196, dur: 10 }, { start: 238, dur: 6 }, { start: 292, dur: 10 }, { start: 330, dur: 8 },
];
export const DAY_END = 360;

/** Rafael: 76 kg × 0,3 g/kg (cálculo do dossiê 06). */
export const RAFAEL = { mass: 76, powder: 22.8, na: 6.2, capsules: 27, fluidMl: 760 } as const;

export const MAT_WEIGHS: readonly { id: 'balanca' | 'estomago' | 'relogio' | 'corte'; title: string; text: string; color: string }[] = [
    { id: 'balanca', title: 'A balança', text: 'Sódio retém água: remadores peso-leve ganharam ~0,6 kg com 0,3 g/kg + 10 mL/kg (Boegman 2020).', color: C.sodium },
    { id: 'estomago', title: 'O estômago no solo', text: 'Compressão abdominal com o estômago cheio de gás; GI em até 29,5% nos ECRs.', color: C.risk },
    { id: 'relogio', title: 'O relógio', text: 'Pico entre 75 e 180 min — e lutas em horários imprevisíveis, até 5 no dia.', color: C.lactate },
    { id: 'corte', title: 'O corte de peso', text: 'Diurético para bater o peso é S5, proibido sempre — e soma alcalose e hipocalemia.', color: C.acid },
];

/** Janela de pico do HCO₃⁻ com 0,3 g/kg (Jones 2016, faixa usada no slide do relógio). */
export const PEAK_WINDOW = { from: 75, to: 180 } as const;

/** Sintomas GI nos ECRs de corrida (MILLER2025RUN): 29,5% × 2,6% no placebo. */
export const GI_RATE = { bicarb: 29.5, placebo: 2.6 } as const;

/** ISSN 2021: esportes de combate listados entre os que melhoram com 0,2–0,5 g/kg. */
export const ISSN_COMBAT = ['boxe', 'judô', 'caratê', 'taekwondo', 'luta olímpica'] as const;
