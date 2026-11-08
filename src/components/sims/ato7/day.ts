/**
 * Slide 93 — O Dia de Prova. Personagens FICTÍCIOS (dossiê 06, Parte 5); horários ilustrativos.
 * Janelas após cada dose (cápsulas com refeição, URWIN2023): GI com pico em 35–50 min;
 * HCO₃⁻ ≥ +6 mmol/L de 120 a 180 min. Doses e sódio = cálculo (0,3 g/kg; 27,37% de Na).
 */

export type EventKind = 'prova' | 'pesagem' | 'remedio' | 'controle';

export interface DayEvent {
    t: number;
    label: string;
    kind: EventKind;
    /** 0 = rótulo acima da linha; 1 = abaixo. */
    row: 0 | 1;
    tentative?: boolean;
}

export interface Lane {
    label: string;
    doses: readonly { t: number; label: string; tentative?: boolean }[];
    events: readonly DayEvent[];
}

export interface Conflict {
    n: number;
    lane: number;
    t: number;
    title: string;
    text: string;
    source: string;
}

export interface AthleteDay {
    id: string;
    name: string;
    who: string;
    dose: string;
    lanes: readonly Lane[];
    conflicts: readonly Conflict[];
}

export const DAY_START = 6;
export const DAY_END = 19;

/** Janelas relativas à dose, em horas (URWIN2023). */
export const GI_WINDOW = [35 / 60, 50 / 60] as const;
export const ALK_WINDOW = [2, 3] as const;

export const DAYS: readonly AthleteDay[] = [
    {
        id: 'julia', name: 'Júlia', who: '24 anos · 800 m · 54 kg · nunca usou bicarbonato',
        dose: '0,3 g/kg = 16,2 g · 4,4 g Na',
        lanes: [
            { label: 'Dia 1', doses: [{ t: 7.5, label: 'dose' }], events: [{ t: 10, label: 'eliminatória', kind: 'prova', row: 0 }] },
            {
                label: 'Dia 2', doses: [{ t: 14.5, label: 'dose' }],
                events: [{ t: 17, label: 'final', kind: 'prova', row: 0 }, { t: 17.5, label: 'controle', kind: 'controle', row: 1, tentative: true }],
            },
        ],
        conflicts: [
            { n: 1, lane: 0, t: 7.5, title: 'Estreia em prova', text: 'Nunca testou: não sabe quando vem o próprio GI nem quando o HCO₃⁻ chega ao pico. Eliminatória não é lugar de primeira vez.', source: 'Boegman 2020; AIS 2025' },
            { n: 2, lane: 1, t: 14.5, title: 'Segunda carga em ~31 h', text: 'GI e sódio se repetem. O "reforço" de ~0,1 g/kg do AIS não tem eficácia publicada: só se testado.', source: 'AIS 2025; ISSN 2026' },
            { n: 3, lane: 1, t: 17.5, title: 'Controle após a final', text: 'Urina alcalina pode exigir horas de espera até uma amostra válida.', source: 'AIS 2025' },
        ],
    },
    {
        id: 'rafael', name: 'Rafael', who: '28 anos · jiu-jítsu, leve · 76 kg · corta peso',
        dose: '0,3 g/kg = 22,8 g · 6,2 g Na · ~760 mL',
        lanes: [{
            label: 'Sábado', doses: [{ t: 6.5, label: 'dose' }],
            events: [
                { t: 9, label: 'pesagem', kind: 'pesagem', row: 0 },
                { t: 9.1, label: 'luta 1', kind: 'prova', row: 1 },
                { t: 10.7, label: 'luta 2', kind: 'prova', row: 0 },
                { t: 12.5, label: 'luta 3', kind: 'prova', row: 1 },
                { t: 14.8, label: 'luta 4?', kind: 'prova', row: 0, tentative: true },
                { t: 16.3, label: 'luta 5?', kind: 'prova', row: 1, tentative: true },
            ],
        }],
        conflicts: [
            { n: 1, lane: 0, t: 6.5, title: 'A dose vem antes da balança', text: 'Para a janela pegar a 1ª luta, carrega-se antes de pesar: água e sódio sobem na balança (~0,6 kg em remadores leves).', source: 'Boegman 2020; AIS 2025' },
            { n: 2, lane: 0, t: 9, title: 'Pesagem colada na luta', text: 'IBJJF: com quimono, imediatamente antes da 1ª luta, tentativa única. Não há 2–3 h entre pesar e lutar.', source: 'IBJJF, regras de pesagem' },
            { n: 3, lane: 0, t: 12.5, title: 'A chave não respeita o relógio', text: 'Até 5 lutas em horários imprevisíveis: a janela de alcalose não acompanha.', source: 'Urwin 2023; Miranda 2022' },
        ],
    },
    {
        id: 'carlos', name: 'Carlos', who: '58 anos · remo master 2.000 m · 82 kg · hipertenso: hidroclorotiazida + losartana',
        dose: '0,3 g/kg = 24,6 g · 6,7 g Na',
        lanes: [{
            label: 'Regata', doses: [{ t: 8.5, label: 'dose' }],
            events: [
                { t: 7, label: 'remédios', kind: 'remedio', row: 1 },
                { t: 11, label: 'final 2.000 m', kind: 'prova', row: 0 },
                { t: 11.5, label: 'controle', kind: 'controle', row: 1, tentative: true },
            ],
        }],
        conflicts: [
            { n: 1, lane: 0, t: 7, title: 'A regata começa no remédio', text: 'Hidroclorotiazida é S5, proibida sempre: sem AUT aprovada, ele compete em infração.', source: 'WADA 2026, S5' },
            { n: 2, lane: 0, t: 8.5, title: 'Tiazida + bicarbonato', text: 'Hipocalemia e alcalose somadas: a bula do bicarbonato contraindica com esse diurético.', source: 'Bula Baxter' },
            { n: 3, lane: 0, t: 11, title: 'Sódio de uma vez', text: '6,7 g numa tomada: 3,4× o teto diário da OMS, num hipertenso (cálculo).', source: 'OMS; ISSN 2026' },
        ],
    },
    {
        id: 'bianca', name: 'Bianca', who: '18 anos · natação 200 m · 60 kg · ovolactovegetariana',
        dose: '0,3 g/kg = 18 g · 4,9 g Na',
        lanes: [{
            label: 'Seletiva', doses: [{ t: 7, label: 'dose' }, { t: 15, label: 'reforço?', tentative: true }],
            events: [
                { t: 9.5, label: 'eliminatória', kind: 'prova', row: 0 },
                { t: 17.5, label: 'final', kind: 'prova', row: 0 },
                { t: 18, label: 'controle', kind: 'controle', row: 1, tentative: true },
            ],
        }],
        conflicts: [
            { n: 1, lane: 0, t: 7, title: 'A idade decide primeiro', text: 'β-alanina não é autorizada no Brasil abaixo de 19 anos. E a cápsula de gelatina não é vegetariana.', source: 'IN 28; Everaert 2011' },
            { n: 2, lane: 0, t: 15, title: 'Manhã e tarde', text: 'Repetir para a final soma GI e sódio, sem eficácia publicada do reforço.', source: 'AIS 2025' },
            { n: 3, lane: 0, t: 18, title: 'Seletiva tem controle', text: 'Urina alcalina pode atrasar a amostra válida por horas.', source: 'AIS 2025' },
        ],
    },
];
