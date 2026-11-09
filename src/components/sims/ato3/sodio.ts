import { CAST_COLOR } from '../ato1/content';

/** Slide 48: calculadora de sódio (contas próprias; tetos da OMS e do rótulo FDA do antiácido — dossiês 01 e 06). */

export const NA_FRACTION = 0.2737; // 22,990 / 84,006
export const NA_MOLAR = 22.99;
export const CAPSULE_G = 0.84;
/** Líquido do protocolo de Boegman 2020 (mL/kg). */
export const FLUID_ML_PER_KG = 10;
/** OMS: menos de 2 g de sódio por dia. */
export const WHO_NA_G = 2;
/** Rótulo FDA (Arm & Hammer): no máximo 7 × ½ colher (~2,4 g) em 24 h; 3 se > 60 anos. */
export const LABEL_MAX_G = 16.8;
export const LABEL_MAX_60_G = 7.2;
/** Bula brasileira de antiácido: 2,5 g por dose. */
export const BULA_BR_G = 2.5;

export interface Preset {
    id: string;
    name: string;
    mass: number;
    color: string;
}

export const PRESETS: readonly Preset[] = [
    { id: 'julia', name: 'Júlia', mass: 54, color: CAST_COLOR.julia },
    { id: 'rafael', name: 'Rafael', mass: 76, color: CAST_COLOR.rafael },
    { id: 'carlos', name: 'Carlos', mass: 82, color: CAST_COLOR.carlos },
    { id: 'bianca', name: 'Bianca', mass: 60, color: CAST_COLOR.bianca },
];

export const SODIUM_TABS = ['A conta', '× teto da OMS', '× rótulo do antiácido', 'Os quatro atletas'] as const;

export const SODIUM_DEFAULTS: readonly { mass: number; dose: number }[] = [
    { mass: 70, dose: 0.3 }, { mass: 70, dose: 0.3 }, { mass: 70, dose: 0.3 }, { mass: 54, dose: 0.3 },
];

export const SODIUM_FEET: readonly string[] = [
    '70 kg × 0,3 g/kg = 21 g de pó. Como 27,4% da molécula é sódio, são ~5,7 g de sódio — numa tomada só.',
    'A OMS pede menos de 2 g de sódio por dia. Uma dose de 0,3 g/kg para 70 kg passa disso quase 3 vezes, antes do café da manhã.',
    'O rótulo do antiácido limita a ~16,8 g de pó em 24 h (7,2 g acima de 60 anos). O atleta toma mais do que isso de uma vez.',
    'Nos nossos quatro atletas, de 4,4 a 6,7 g de sódio por dose. Para o Carlos, hipertenso, é 3,4× o teto da OMS numa tomada.',
];

export const compute = (mass: number, dose: number) => {
    const powder = mass * dose;
    const na = powder * NA_FRACTION;
    return {
        powder,
        na,
        naMmol: (na / NA_MOLAR) * 1000,
        capsules: Math.round(powder / CAPSULE_G),
        fluid: mass * FLUID_ML_PER_KG,
        whoTimes: na / WHO_NA_G,
        labelTimes: powder / LABEL_MAX_G,
    };
};
