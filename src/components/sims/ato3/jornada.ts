import { C } from '../kit/palette';

/** Slide 42: o caminho do bicarbonato, do copo à fibra. Números: dossiês 01 e 03. */

export type StationId = 'estomago' | 'intestino' | 'sangue' | 'fibra';

export interface JourneyFact {
    big: string;
    label: string;
    source: string;
    color: string;
}

export interface JourneyStep {
    tab: string;
    station: StationId;
    foot: string;
    facts: readonly JourneyFact[];
}

export const JOURNEY_STEPS: readonly JourneyStep[] = [
    {
        tab: 'Estômago', station: 'estomago',
        foot: 'No estômago, o bicarbonato encontra o ácido clorídrico e vira gás: é daqui que vêm o estufamento, o arroto e a náusea.',
        facts: [
            { big: 'NaHCO₃ + HCl → NaCl + H₂O + CO₂', label: 'a reação no estômago', source: 'ISSN 2021', color: C.co2 },
            { big: '~6,8 L', label: 'teto teórico de CO₂ para 22,5 g (75 kg × 0,3 g/kg), se tudo reagisse — cálculo, não medida', source: 'cálculo do dossiê', color: C.co2 },
        ],
    },
    {
        tab: 'Intestino', station: 'intestino',
        foot: 'O que não reagiu segue adiante como carga de soluto: o excesso puxa água para a luz do intestino.',
        facts: [
            { big: 'diarreia osmótica', label: 'a cápsula entérica protege o estômago, mas "provavelmente não" evita a diarreia', source: 'ISSN 2021', color: C.risk },
            { big: '27,4%', label: 'do pó é sódio: ele também chega ao sangue', source: 'massa molar · cálculo', color: C.sodium },
        ],
    },
    {
        tab: 'Sangue', station: 'sangue',
        foot: 'No sangue, o estoque de base sobe em média 5,2 mmol/L e o pH sobe junto — o tampão fica do lado de fora da fibra.',
        facts: [
            { big: '+5,2 mmol/L', label: 'HCO₃⁻ sanguíneo, em média (ICr95 4,7–5,7), 189 artigos', source: 'de Oliveira 2022', color: C.base },
            { big: '23,6 → 30,0', label: 'HCO₃⁻ de repouso (mmol/L) com 0,3 g/kg; pH 7,42 → 7,50', source: 'Bishop 2004 · n = 10', color: C.base },
        ],
    },
    {
        tab: 'Fibra', station: 'fibra',
        foot: 'O bicarbonato não entra na fibra: com o sangue mais alcalino, o gradiente puxa mais H⁺ e lactato para fora durante o esforço.',
        facts: [
            { big: 'pH de repouso igual', label: 'dentro da fibra, antes do exercício, nada muda', source: 'Bishop 2004', color: C.muted },
            { big: '10,0 × 4,2', label: 'efluxo de lactato da perna (mmol/min) a 75% do VO₂máx, alcalose × controle', source: 'Hollidge-Horvat 2000 · n = 8', color: C.lactate },
        ],
    },
];

export const STATION_ORDER: readonly StationId[] = ['estomago', 'intestino', 'sangue', 'fibra'];
