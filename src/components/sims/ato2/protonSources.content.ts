import type { EvidenceKind } from './ui';

/**
 * Slide 24 — "De Onde Vem o H⁺?". Três escolas (dossiê 03, Parte 2): Robergs 2004 (hidrólise do
 * ATP), Böning 2005/2008 (ácido lático), Stewart/Lindinger 1995 (diferença de íons fortes).
 * Ponto de acordo: Marcinek 2010, inclinação 0,98 (r² = 0,86), camundongo isquêmico.
 */

export interface Witness {
    id: string;
    name: string;
    school: string;
    claim: string;
    kind: EvidenceKind;
    kindLabel: string;
}

export const WITNESSES: readonly Witness[] = [
    {
        id: 'atp', name: 'Robergs 2004', school: 'Hidrólise do ATP',
        claim: 'O H⁺ sai do ATP; o lactato até consome H⁺.',
        kind: 'teoria', kindLabel: 'ESTEQUIOMETRIA',
    },
    {
        id: 'lactic', name: 'Böning 2005/2008', school: 'Ácido lático (clássica)',
        claim: 'Somando tudo, sai 1 H⁺ por lactato.',
        kind: 'teoria', kindLabel: 'CARTAS · posição',
    },
    {
        id: 'sid', name: 'Stewart; Lindinger 1995', school: 'Íons fortes (físico-química)',
        claim: 'O H⁺ é consequência; muda quem é forte: lactato⁻ e K⁺.',
        kind: 'revisão', kindLabel: 'REVISÃO · dados humanos',
    },
];

export const PROTON_STEPS = [
    {
        tab: '1ª testemunha',
        headline: '"O fogo é o ATP"',
        text: 'Cada ATP quebrado solta um H⁺. Com ATP da mitocôndria, ele é reciclado; acima do steady state, o ATP glicolítico deixa o H⁺ sobrar. E a LDH, ao formar lactato, consome um H⁺.',
    },
    {
        tab: '2ª testemunha',
        headline: '"O fogo é o ácido lático"',
        text: 'A réplica: somando a glicólise e a hidrólise do ATP glicolítico, a conta final é a do ácido lático — um H⁺ por lactato. No pH da célula, ele está praticamente todo dissociado.',
    },
    {
        tab: '3ª testemunha',
        headline: '"Ninguém solta H⁺: a água obedece"',
        text: 'O [H⁺] é variável dependente: entra um ânion forte (lactato⁻), sai um cátion forte (K⁺), e a água se dissocia para manter a neutralidade. No exercício intenso, isso explica 62% da subida do H⁺.',
    },
    {
        tab: 'O ponto de acordo',
        headline: 'H⁺ e lactato sobem quase 1 para 1',
        text: 'No mesmo músculo, a inclinação foi 0,98: a contabilidade é disputada; a correlação, não. O lactato é o termômetro da acidose — não o fogo. A ligação só se desfaz quando a fosfocreatina acaba.',
    },
] as const;

/** Lindinger 1995: origem do aumento do [H⁺] intracelular no exercício intenso. */
export const STEWART_SHARES = [
    { id: 'sid', label: 'queda da SID (K⁺ sai, lactato⁻ entra)', pct: 62 },
    { id: 'atot', label: 'ácidos fracos (Pi, creatina)', pct: 19 },
    { id: 'pco2', label: 'PCO₂ (+50 mmHg)', pct: 12 },
    { id: 'ka', label: 'Kₐ aparente', pct: 7 },
] as const;
