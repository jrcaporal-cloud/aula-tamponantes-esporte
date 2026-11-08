import { C } from '../kit/palette';

/** Slide 47: o preço no intestino e as estratégias, cada uma com a força da evidência (dossiê 01). */

export const GUT_TABS = ['O preço', 'Onde dói', 'Pode zerar o efeito', 'O que reduz', 'O que não está provado'] as const;

export const GUT_FEET: readonly string[] = [
    'Em 11 ECRs de corrida, sintomas GI em 29,5% com bicarbonato × 2,6% com placebo; 8,7% abandonaram o teste. Num ECR, diarreia em 10 de 11.',
    'Dois lugares, dois mecanismos: no estômago, o CO₂ estufa; no intestino, o soluto que sobrou puxa água. O pior costuma vir ~90 min após a solução.',
    'Em 21 homens, o efeito médio não apareceu (p = 0,16). Tirando os 4 que passaram mal, apareceu (p = 0,01). O GI pode apagar o ganho.',
    'O que tem dado a favor: refeição rica em carboidrato, 120–180 min de antecedência, cápsula entérica, fracionar, carga de vários dias.',
    'O que ainda não está provado: o hidrogel tem bons dados, mas financiados pelo fabricante; a loção na pele não mudou o sangue.',
];

export type GutSite = 'estomago' | 'intestino' | 'pele' | 'tempo';

export interface Strategy {
    id: string;
    name: string;
    finding: string;
    evidence: string;
    color: string;
    site: GutSite;
}

export const STRATEGIES: readonly Strategy[] = [
    { id: 'refeicao', name: 'Refeição rica em carboidrato', finding: 'menos GI e mais HCO₃⁻ (Carr 2011, n = 13)', evidence: 'ECR pequeno', color: C.ok, site: 'estomago' },
    { id: 'tempo', name: '120–180 min antes', finding: 'GI só não subiu aos 180 min (Siegler 2012, n = 8)', evidence: 'ECR pequeno', color: C.ok, site: 'tempo' },
    { id: 'capsula', name: 'Cápsula entérica', finding: 'gravidade 2,8 × 7,0 da gelatina; 4 km mantido (Hilton 2020)', evidence: 'ECRs pequenos', color: C.ok, site: 'intestino' },
    { id: 'fracionar', name: 'Fracionar a dose', finding: 'doses menores ao longo de horas (ISSN 2021)', evidence: 'posicionamento', color: C.base, site: 'estomago' },
    { id: 'multidia', name: 'Carga de vários dias', finding: '0,4–0,5 g/kg/dia por 3–7 dias, nas refeições (ISSN 2021)', evidence: 'posicionamento', color: C.base, site: 'tempo' },
    { id: 'hidrogel', name: 'Hidrogel de carboidrato', finding: 'GI agregado −79 UA vs cápsula (Gough 2024)', evidence: 'financiado pelo fabricante', color: C.lactate, site: 'intestino' },
    { id: 'locao', name: 'Loção na pele', finding: 'não elevou pH nem HCO₃⁻; sem ganho (McKay 2020)', evidence: 'nulo · estudo independente', color: C.risk, site: 'pele' },
];

/** Estratégias ligadas por padrão em cada passo (o clique liga/desliga). */
export const GUT_DEFAULT_ON: readonly (readonly string[])[] = [
    [], [], [],
    ['refeicao', 'tempo', 'capsula', 'fracionar', 'multidia'],
    ['hidrogel', 'locao'],
];

/** MILLER2025RUN: bicarbonato × placebo (%). */
export const MILLER = [
    { label: 'sintomas GI', sb: 29.5, pla: 2.6 },
    { label: 'abandono por GI', sb: 8.7, pla: 1.6 },
] as const;
