/*
 * Contas da jornada (funções puras). Números do dossiê 01 (§0, JONES2016, DEOLIVEIRA2022) e 06
 * (BULA-ARMHAMMER, OMS, AIS). Tudo o que é conta própria aparece rotulado como "cálculo" na tela.
 */

/** Massa molar do NaHCO₃ (g/mol) e fração de sódio: 22,990 / 84,006 = 27,37 %. */
export const MOLAR_MASS = 84.006;
export const NA_FRACTION = 22.99 / MOLAR_MASS;
/** Teto diário de sódio da OMS (< 2 g de Na/dia). */
export const WHO_NA_G = 2;
/** Rótulo FDA do antiácido: no máximo 7 × ½ colher (~2,4 g) em 24 h ≈ 16,8 g de pó, 4,6 g de Na. */
export const ANTACID_POWDER_G = 16.8;
export const ANTACID_NA_G = 4.6;
/** Cápsula de 840 mg (exemplo da ficha do AIS). */
export const CAPSULE_G = 0.84;
/** Litros de gás por mol a 37 °C e 1 atm (22,414 × 310,15 / 273,15). */
const L_PER_MOL = 25.45;
/** Média de 189 estudos: +5,2 mmol/L (DEOLIVEIRA2022). */
export const MEAN_RISE = 5.2;
/** Limiar didático de "tampão disponível" usado na curva (dossiê 01, ideia 1; BOEGMAN2020). */
export const THRESHOLD = 5;

export const MASS_RANGE = { min: 40, max: 110 } as const;
export const DOSE_RANGE = { min: 0.1, max: 0.5, step: 0.05 } as const;

export interface DoseSummary {
    mass: number;
    dose: number;
    powder: number;
    sodium: number;
    co2: number;
    capsules: number;
    whoTimes: number;
}

export const summarize = (mass: number, dose: number): DoseSummary => {
    const powder = mass * dose;
    const sodium = powder * NA_FRACTION;
    return {
        mass,
        dose,
        powder,
        sodium,
        co2: (powder / MOLAR_MASS) * L_PER_MOL,
        capsules: Math.ceil(powder / CAPSULE_G - 1e-9),
        whoTimes: sodium / WHO_NA_G,
    };
};

/* ── Relógio do HCO₃⁻ (JONES2016: 16 homens, sangue capilar por 3 h, pó em solução) ── */

interface JonesRow { dose: number; rise: readonly [number, number]; peak: readonly [number, number] }

/** Faixas individuais por dose: aumento de HCO₃⁻ (mmol/L) e tempo até o pico (min). */
const JONES: readonly JonesRow[] = [
    { dose: 0.1, rise: [2.0, 5.0], peak: [30, 150] },
    { dose: 0.2, rise: [5.1, 8.1], peak: [40, 165] },
    { dose: 0.3, rise: [6.0, 12.3], peak: [75, 180] },
];

const lerp = (a: number, b: number, k: number) => a + (b - a) * k;

/** Faixas na dose pedida: interpola entre as doses do estudo; acima de 0,3 g/kg fica a de 0,3 (não testado). */
export const jonesRanges = (dose: number): { rise: [number, number]; peak: [number, number]; tested: boolean } => {
    const d = Math.min(Math.max(dose, 0.1), 0.3);
    const i = d >= 0.2 ? 1 : 0;
    const a = JONES[i];
    const b = JONES[i + 1];
    const k = (d - a.dose) / (b.dose - a.dose);
    return {
        rise: [lerp(a.rise[0], b.rise[0], k), lerp(a.rise[1], b.rise[1], k)],
        peak: [lerp(a.peak[0], b.peak[0], k), lerp(a.peak[1], b.peak[1], k)],
        tested: dose <= 0.3 + 1e-9,
    };
};

export interface Curve { id: number; label: string; peak: number; rise: number }

/** Seis atletas ilustrativos: posição de cada um dentro das faixas (pico tardio não quer dizer pico alto). */
const ATHLETES: readonly { qp: number; qr: number }[] = [
    { qp: 0.04, qr: 0.56 },
    { qp: 0.24, qr: 0.19 },
    { qp: 0.43, qr: 0.89 },
    { qp: 0.62, qr: 0.06 },
    { qp: 0.81, qr: 0.44 },
    { qp: 0.98, qr: 0.7 },
];

export const ATHLETE_COUNT = ATHLETES.length;

export const curvesFor = (dose: number): Curve[] => {
    const { rise, peak } = jonesRanges(dose);
    return ATHLETES.map((a, i) => ({
        id: i,
        label: `Atleta ${i + 1}`,
        peak: Math.round(lerp(peak[0], peak[1], a.qp)),
        rise: lerp(rise[0], rise[1], a.qr),
    }));
};

/** Forma da curva (sobe, pico, desce devagar): forma ilustrativa; pico e altura vêm das faixas do estudo. */
const SHAPE = 3;
export const riseAt = (c: Curve, minute: number): number => {
    if (minute <= 0) return 0;
    const x = minute / c.peak;
    return c.rise * Math.pow(x, SHAPE) * Math.exp(SHAPE * (1 - x));
};

/** Janela em que a curva fica acima do limiar (min), por busca simples de 1 em 1 minuto. */
export const windowAbove = (c: Curve, level: number, until = 240): [number, number] | null => {
    let start = -1;
    let end = -1;
    for (let m = 0; m <= until; m++) {
        if (riseAt(c, m) >= level) {
            if (start < 0) start = m;
            end = m;
        }
    }
    return start < 0 ? null : [start, end];
};

/** pH por Henderson–Hasselbalch com PCO₂ fixa em 40 mmHg e HCO₃⁻ basal de 24 mmol/L (cálculo). */
export const phFor = (rise: number): number => 6.1 + Math.log10((24 + rise) / (0.03 * 40));

/** Número no padrão brasileiro (vírgula decimal). */
export const br = (x: number, digits = 1): string => x.toFixed(digits).replace('.', ',');
