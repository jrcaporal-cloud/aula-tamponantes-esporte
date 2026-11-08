import { ANTACID_POWDER_G, br, type DoseSummary } from './dose';

/*
 * Texto do modelo "Do copo ao músculo": etapas (com a pose da câmera), estratégias contra o GI e o
 * registro das estruturas clicáveis. Fonte única: dossiês 01, 03 e 06.
 */

export type Vec3 = readonly [number, number, number];
export interface Pose { pos: Vec3; tgt: Vec3 }

export interface JourneyStep {
    badge: string;
    title: string;
    short: string;
    sources: string;
    pose: Pose;
}

export const STEPS: readonly JourneyStep[] = [
    {
        badge: 'Percurso', title: 'Do copo ao músculo', short: 'O percurso inteiro',
        sources: 'ISSN 2021 (Grgic et al.) · Bishop et al. 2004',
        pose: { pos: [1.4, 3.4, 43], tgt: [1.4, 2.8, 0] },
    },
    {
        badge: 'Estômago', title: 'O pó encontra o ácido', short: 'Estômago: CO₂',
        sources: 'ISSN 2021 · Antonio et al. 2026 · cálculo próprio (dossiê 01)',
        pose: { pos: [-6.6, 2.6, 21], tgt: [-8.6, 2.2, 0] },
    },
    {
        badge: 'Intestino', title: 'O que sobra puxa água', short: 'Intestino: absorção e água',
        sources: 'Kahle et al. 2013 · Miller et al. 2025 · Winter et al. 2026',
        pose: { pos: [-1.4, -2.6, 22], tgt: [-2.6, -3.5, 0] },
    },
    {
        badge: 'Sangue', title: 'A média esconde o relógio', short: 'Sangue: HCO₃⁻ × tempo',
        sources: 'de Oliveira et al. 2022 · Jones et al. 2016 · Boegman et al. 2020',
        pose: { pos: [4.6, -0.9, 17.5], tgt: [4.6, -1.3, 0] },
    },
    {
        badge: 'Músculo', title: 'O gradiente puxa o ácido para fora', short: 'Músculo: efluxo',
        sources: 'Hollidge-Horvat et al. 2000 · Bishop et al. 2004 · Juel 1997',
        pose: { pos: [12.6, 1.0, 15], tgt: [11.8, 0.1, 0] },
    },
    {
        badge: 'Balanço', title: 'A conta do sódio', short: 'Balanço: sódio',
        sources: 'OMS (sódio) · rótulo FDA de antiácido · Boegman et al. 2020 · cálculo próprio',
        pose: { pos: [9.8, -5.6, 17], tgt: [9.8, -8.2, 0] },
    },
];

export const LAST_STEP = STEPS.length - 1;

/** Texto da etapa; as etapas 1 e 5 usam a dose escolhida nos controles. */
export const stepText = (step: number, d: DoseSummary): string => {
    switch (step) {
        case 0:
            return 'A dose faz cinco paradas: estômago, intestino, veia porta e circulação, capilar do músculo e fibra. '
                + 'O efeito acontece por fora: o pH da fibra em repouso não muda com bicarbonato (Bishop 2004). '
                + 'Em cada parada há um preço — gás, água ou sódio — e é nele que a prática se decide.';
        case 1:
            return 'NaHCO₃ + HCl → NaCl + H₂O + CO₂. O gás distende a parede: é a origem do estufamento, da náusea e da dor que a ISSN lista como efeitos mais comuns. '
                + `Se os ${br(d.powder)} g reagissem todos, sairiam até ~${br(d.co2)} L de CO₂ — teto de conta, não medida: o estômago não tem ácido para tudo de uma vez. `
                + 'O que não reage segue adiante como carga de soluto.';
        case 2:
            return 'Na⁺ e HCO₃⁻ atravessam a parede rumo ao sangue. O que fica no lúmen puxa água por osmose: diarreia em 10 de 11 atletas (Kahle 2013); '
                + 'nos ensaios de corrida, sintomas GI em 29,5 % × 2,6 % com placebo (Miller 2025). '
                + 'Ligue as estratégias: a cena muda. Nenhuma foi comparada diretamente com as outras (Winter 2026).';
        case 3:
            return 'O HCO₃⁻ do sangue sobe em média +5,2 mmol/L (189 estudos; de Oliveira 2022), e o pH sobe junto. '
                + 'A média esconde o relógio: com 0,3 g/kg, o pico veio entre 75 e 180 min, conforme a pessoa (Jones 2016, 16 homens). '
                + 'Escolha um atleta e compare o pico dele com a largada fixa de 60 min.';
        case 4:
            return 'No esforço intenso, H⁺ e lactato se acumulam na fibra e saem juntos pelos transportadores MCT. '
                + 'Com o sangue alcalino, o gradiente cresce e a saída acelera: efluxo de lactato da perna 10,0 × 4,2 mmol/min (Hollidge-Horvat 2000, n = 8). '
                + 'No capilar, o HCO₃⁻ recebe o H⁺ e vira CO₂, que o pulmão elimina. A acidose é adiada, não abolida.';
        default: {
            const label = d.powder > ANTACID_POWDER_G
                ? 'acima do máximo de 24 h do rótulo de antiácido (~16,8 g de pó)'
                : 'abaixo do máximo de 24 h do rótulo de antiácido (~16,8 g de pó)';
            return `27,4 % do NaHCO₃ é sódio. ${br(d.mass, 0)} kg × ${br(d.dose, 2)} g/kg = ${br(d.powder)} g de pó = ${br(d.sodium)} g de sódio: `
                + `${br(d.whoTimes)}× o teto diário da OMS (< 2 g), numa tomada só — e ${label}. `
                + 'Para quem bate peso, o sódio ainda retém água: ~0,4 kg no remo de elite (Boegman 2020).';
        }
    }
};

/* ── Estratégias contra o GI (etapa 2): o efeito na cena é ilustrativo; a evidência é a do dossiê ── */

export type StrategyId = 'cho' | 'retard' | 'split' | 'enteric';

export interface Strategy {
    id: StrategyId;
    label: string;
    /** Rótulo curto (chip do HUD). */
    chip: string;
    evidence: string;
    note: string;
    /** Multiplicadores ilustrativos: gás no estômago e água puxada no intestino. */
    gas: number;
    water: number;
}

export const STRATEGIES: readonly Strategy[] = [
    {
        id: 'cho', label: 'Refeição rica em carboidrato', chip: 'Refeição com CHO', evidence: 'ECR pequeno + consensos',
        note: 'Com comida: HCO₃⁻ e pH maiores e menos GI (Carr 2011, n = 13); o COI sugere ~1,5 g/kg de CHO.',
        gas: 0.65, water: 0.75,
    },
    {
        id: 'retard', label: 'Cápsula de liberação retardada', chip: 'Liberação retardada', evidence: '1 ECR cruzado, n = 12',
        note: '−45,1 % na incidência e −47,5 % na gravidade do GI vs. solução; pico mais tardio (Hilton 2019).',
        gas: 0.5, water: 0.85,
    },
    {
        id: 'split', label: 'Fracionar a dose', chip: 'Fracionar', evidence: 'consensos (COI, ISSN)',
        note: 'Doses menores ao longo de 30–180 min (COI 2018; ISSN 2021).',
        gas: 0.6, water: 0.8,
    },
    {
        id: 'enteric', label: 'Cápsula entérica', chip: 'Entérica', evidence: '2 ECRs pequenos (n = 14 e 11)',
        note: 'Gravidade do GI 2,8 × 7,0 com gelatina, mas HCO₃⁻ menor (Hilton 2020); protege o estômago, "provavelmente não" a diarreia osmótica (ISSN).',
        gas: 0.2, water: 1,
    },
];

/* ── Estruturas clicáveis: nome, função, fonte e pose do close-up ── */

export type StructureId = 'estomago' | 'intestino' | 'veia' | 'capilar' | 'fibra' | 'mct' | 'sodio';

export interface Structure { name: string; info: string; source: string; pose: Pose }

export const STRUCTURES: Record<StructureId, Structure> = {
    estomago: {
        name: 'Estômago',
        info: 'O NaHCO₃ neutraliza o HCl e libera CO₂, que distende a parede. Raro, mas descrito: ruptura gástrica após bicarbonato (36 casos revisados).',
        source: 'ISSN 2021 · Han et al. 2022',
        pose: { pos: [-7.4, 3.4, 9.5], tgt: [-9.4, 2.6, 0] },
    },
    intestino: {
        name: 'Intestino delgado',
        info: 'Absorve Na⁺ e HCO₃⁻. O soluto que sobra no lúmen puxa água: diarreia osmótica, em 10 de 11 atletas com 0,3 g/kg.',
        source: 'Kahle et al. 2013 · ISSN 2021',
        pose: { pos: [-2.2, -3.4, 9], tgt: [-3.2, -4.2, 0] },
    },
    veia: {
        name: 'Veia porta → circulação',
        info: 'Leva o que foi absorvido ao fígado, ao coração e às artérias (trecho esquemático). No sangue, HCO₃⁻ +5,2 mmol/L em média.',
        source: 'de Oliveira et al. 2022',
        pose: { pos: [3.2, 0.6, 8.5], tgt: [2.4, -0.6, 0] },
    },
    capilar: {
        name: 'Capilar do músculo',
        info: 'Onde o tampão trabalha: H⁺ + HCO₃⁻ → H₂O + CO₂. O CO₂ vai ao pulmão, e a ventilação o elimina.',
        source: 'COI 2018 · dossiê 03',
        pose: { pos: [12, 2.6, 6.5], tgt: [11.4, 1.1, 0] },
    },
    fibra: {
        name: 'Fibra muscular',
        info: 'Acumula H⁺ e lactato no esforço intenso. Com bicarbonato, o pH de repouso não muda; antes do 5º tiro, 6,81 × 6,73 (só 4 sujeitos).',
        source: 'Bishop et al. 2004 · Costill et al. 1984',
        pose: { pos: [11.4, -0.2, 11.5], tgt: [11.2, -0.9, 0] },
    },
    mct: {
        name: 'Transportadores MCT1/MCT4',
        info: 'Cotransporte lactato–H⁺: a porta por onde os dois saem juntos. Na membrana também há NHE1 (troca Na⁺/H⁺) e NBC (Na⁺/HCO₃⁻).',
        source: 'Juel 1997 · Juel 2008',
        pose: { pos: [11.9, 1.4, 5], tgt: [11.6, 0.2, 0] },
    },
    sodio: {
        name: 'Sódio da dose',
        info: '22,99 / 84,01 = 27,37 % da massa do NaHCO₃ é sódio. Cada disco da pilha = 0,5 g de Na. Teto da OMS: < 2 g de sódio por dia.',
        source: 'OMS · rótulo FDA de antiácido · cálculo próprio',
        pose: { pos: [11.4, -4.6, 9], tgt: [10.6, -6.4, 0] },
    },
};
