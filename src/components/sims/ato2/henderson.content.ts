/**
 * Slide 21 — "Henderson–Hasselbalch sem Medo". Constantes: pKa 6,1 e solubilidade 0,03 (dossiê 03).
 * Cenários: repouso 24/40; fim do 2.000 m (pH 7,07 e PaCO₂ ~40, NIELSEN2002 → HCO₃⁻ ~11 por cálculo);
 * hiperventilação hipotética (PCO₂ 30); bicarbonato oral +5,2 mmol/L (DEOLIVEIRA2022).
 */

export const PKA_BICARB = 6.1;
export const CO2_SOLUBILITY = 0.03;

export const phOf = (hco3: number, pco2: number): number =>
    PKA_BICARB + Math.log10(hco3 / (CO2_SOLUBILITY * pco2));

export const HCO3_RANGE = [5, 35] as const;
export const PCO2_RANGE = [20, 60] as const;

export interface HendersonStep {
    tab: string;
    hco3: number;
    pco2: number;
    headline: string;
    text: string;
    source: string;
    /** Passo do gráfico de titulação (sem balança). */
    curves?: boolean;
}

export const HH_STEPS: readonly HendersonStep[] = [
    {
        tab: 'Repouso',
        hco3: 24,
        pco2: 40,
        headline: 'O pH depende de uma razão, não de um número',
        text: '24 de bicarbonato contra 1,2 de CO₂ dissolvido: razão 20 para 1, pH 7,40. Mexer nos dois lados na mesma proporção não muda nada.',
        source: 'Cálculo com pKa 6,1 e solubilidade do CO₂ 0,03 mmol·L⁻¹·mmHg⁻¹.',
    },
    {
        tab: 'Fim do 2.000 m',
        hco3: 11.2,
        pco2: 40,
        headline: 'O bicarbonato cai para menos da metade',
        text: 'Com pH arterial 7,07 e PaCO₂ ~40 mmHg no fim da prova, a equação devolve ~11 mmol/L de bicarbonato: ele foi gasto segurando o H⁺ que saiu do músculo.',
        source: 'pH e PaCO₂ medidos: Nielsen 2002 (remadores, humano). HCO₃⁻ ~11 = cálculo.',
    },
    {
        tab: 'E se o pulmão ajudar?',
        hco3: 11.2,
        pco2: 30,
        headline: 'Baixar o CO₂ devolve ~0,1 de pH',
        text: 'Se a hiperventilação levasse a PCO₂ a 30 mmHg, o pH subiria para ~7,19. Nos remadores, a PaCO₂ do último minuto não caiu: a ventilação já estava no teto.',
        source: 'Hipótese de cálculo. PaCO₂ inalterada no fim da prova: Nielsen 2002.',
    },
    {
        tab: 'Com bicarbonato',
        hco3: 29.2,
        pco2: 40,
        headline: 'O suplemento aumenta o numerador',
        text: 'Em média, o bicarbonato oral eleva o HCO₃⁻ do sangue em 5,2 mmol/L. Em repouso, a equação vai a ~7,49: há mais reserva para receber o H⁺ que vai transbordar da fibra.',
        source: '+5,2 mmol/L (ICr95 4,7–5,7): de Oliveira 2022, meta-análise, 189 estudos. pH = cálculo.',
    },
    {
        tab: 'Perto do pKa',
        hco3: 24,
        pco2: 40,
        curves: true,
        headline: 'Um tampão trabalha melhor perto do seu pKa',
        text: 'Carnosina (6,83) e fosfato (~6,8) têm o pico dentro da faixa do músculo em exercício. O bicarbonato (6,1) fica fora — no sangue ele vale por outro motivo: o CO₂ que se forma sai pelo pulmão.',
        source: 'pKa da carnosina: Sale 2010. Fosfato ~6,8: química de livro. Faixa 7,1–6,5: Sahlin 1976; Mannion 1992.',
    },
];
