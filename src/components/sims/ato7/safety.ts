import type { Signal } from './shared';

/** Slide 92 — Quando o Tampão Vira Problema. Fonte: dossiê 06, Parte 1 (semáforo 1.1 e fichas). */

export interface Verdict {
    signal: Signal;
    text: string;
    source: string;
    level: string;
}

export interface Profile {
    id: string;
    tab: string;
    name: string;
    sub: string;
    bic: Verdict;
    ba: Verdict;
}

export const PROFILES: readonly Profile[] = [
    {
        id: 'saudavel', tab: 'Saudável', name: 'Adulto saudável', sub: 'dose pontual, testada no treino',
        bic: { signal: 'amarelo', level: 'ECR', source: 'Kahle 2013 (n = 11)',
            text: 'O problema agudo é o intestino: diarreia em 10 de 11 com 0,3 g/kg em solução. A pressão quase não se move (PAD +3,3 mmHg).' },
        ba: { signal: 'verde', level: 'MA + ECR', source: 'Dolan 2019 (101 estudos); Saunders 2020',
            text: 'Parestesia é o único efeito consistente (OR 8,9). Taurina muscular inalterada; 24 semanas a 6,4 g/d sem alteração clínica.' },
    },
    {
        id: 'tiazida', tab: 'Tiazida', name: 'Hipertenso com tiazida', sub: 'hidroclorotiazida + losartana',
        bic: { signal: 'vermelho', level: 'BULA', source: 'Bula do bicarbonato (Baxter); ISSN 2026',
            text: 'A bula contraindica o bicarbonato com diurético que causa alcalose hipoclorêmica: soma hipocalemia. E 21 g carregam 5,75 g de sódio.' },
        ba: { signal: 'verde', level: 'REG', source: 'WADA 2026, classe S5',
            text: 'Não leva sódio. Mas a regra pesa: hidroclorotiazida é S5, proibida sempre — competir sob o Código exige AUT.' },
    },
    {
        id: 'renal', tab: 'Rim', name: 'Doença renal crônica', sub: 'qualquer estágio, fora da nefrologia',
        bic: { signal: 'vermelho', level: 'ECR', source: 'BiCARB 2020 (n = 300)',
            text: 'Em ≥ 60 anos com TFG < 30, até 3 g/d por até 2 anos não trouxe ganho e teve mais eventos adversos: 457 × 400.' },
        ba: { signal: 'amarelo', level: 'lacuna', source: 'Dossiê 06 — sem estudo localizado',
            text: 'Sem dados nessa população. Ausência de dado não é sinal verde.' },
    },
    {
        id: 'idoso', tab: 'Idoso', name: 'Acima de 60 anos', sub: 'master, com ou sem comorbidade',
        bic: { signal: 'amarelo', level: 'BULA + CASO', source: 'Rótulo FDA de antiácido; Diaconu 2022',
            text: 'O teto do antiácido cai pela metade: 100 mEq/d — e 20 g são ~238 mEq. O caso de 69 anos tomou isso por 1 semana.' },
        ba: { signal: 'verde', level: 'ECR', source: 'del Favero 2012 (n = 18)',
            text: '3,2 g/d por 12 semanas em pessoas de 60 a 80 anos, sem problemas relatados; carnosina +85,4%.' },
    },
    {
        id: 'compulsao', tab: 'Compulsão', name: 'Transtorno alimentar', sub: 'compulsão, purgação, corte de peso',
        bic: { signal: 'vermelho', level: 'revisão de casos', source: 'Han 2022 (36 casos); rótulo FDA',
            text: 'Ruptura gástrica: 36 casos publicados, mortalidade 41,6%, 47,2% ligados a transtorno alimentar. O rótulo veta tomar "muito cheio".' },
        ba: { signal: 'verde', level: 'MA', source: 'Dolan 2019',
            text: 'Sem risco específico da molécula. O cuidado aqui é com a relação com a comida, não com o pó.' },
    },
    {
        id: 'adolescente', tab: 'Adolescente', name: 'Abaixo de 19 anos', sub: 'categorias de base',
        bic: { signal: 'amarelo', level: 'OBS', source: 'Al-Abri 2014 (Califórnia, 2000–2012)',
            text: 'Sem dados em atletas adolescentes. Fora do esporte: 192 intoxicações sintomáticas, 11,5% para burlar exame de urina.' },
        ba: { signal: 'vermelho', level: 'REG', source: 'Anvisa, IN 28 (Anexo IV)',
            text: 'No Brasil, "não autorizada" abaixo de 19 anos. É regra regulatória, não dado de toxicidade — e vale do mesmo jeito.' },
    },
];

/** Passo 0: o caso que mostra dose × contexto (Diaconu 2022). */
export const ANCHOR = {
    who: 'Homem, 69 anos · gota, nefropatia, hipertensão, fibrilação atrial',
    what: '20 g de bicarbonato em 2 L de água por dia, durante 1 semana, para "dissolver tofos"',
    labs: [
        { label: 'pH', value: '7,61', ref: '7,35–7,45' },
        { label: 'HCO₃⁻', value: '53,2', ref: 'mmol/L' },
        { label: 'K⁺', value: '2,6', ref: 'mEq/L' },
        { label: 'Creatinina', value: '4,02', ref: 'mg/dL' },
    ],
    source: 'Diaconu 2022, relato de caso — recuperou com hidratação e KCl.',
} as const;

export const SAFETY_TABS = ['A dose', ...PROFILES.map(p => p.tab)] as const;
