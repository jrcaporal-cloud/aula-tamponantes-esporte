import { C } from '../kit/palette';

/**
 * Slide 71 · "O banco das testemunhas fracas". Posições QUALITATIVAS (força da evidência × efeito);
 * só bicarbonato e β-alanina têm estimativa agrupada. Todos os números vêm do dossiê 04 (confirmados no abstract).
 */

export type Group = 'fortes' | 'sangue' | 'musculo' | 'prateleira';

export interface Witness {
    id: string;
    label: string;
    color: string;
    /** Coluna: 0 nenhum ensaio no esporte · 1 muito baixa · 2 baixa · 3 moderada. */
    col: 0 | 1 | 2 | 3;
    /** Linha: 0 efeito pequeno · 1 incerto/misto · 2 nulo. */
    row: 0 | 1 | 2;
    group: Group;
    verdict: string;
    lines: readonly string[];
    source: string;
    /** Alerta de leitura crítica (só a água alcalina). */
    alert?: { value: string; text: string };
}

export const COLS = ['nenhum ensaio no esporte', 'muito baixa', 'baixa', 'moderada'] as const;
export const ROWS = ['pequeno (ES ~0,2)', 'incerto ou misto', 'nulo'] as const;

export const WITNESSES: readonly Witness[] = [
    {
        id: 'bic', label: 'Bicarbonato', color: C.base, col: 3, row: 0, group: 'fortes', verdict: 'testemunha forte',
        lines: ['Tamponantes extracelulares: ES 0,17 (0,12–0,21) em 189 artigos e 2.019 pessoas; 158 artigos são de bicarbonato.'],
        source: 'de Oliveira 2022, Sports Med',
    },
    {
        id: 'ba', label: 'β-alanina', color: C.carno, col: 3, row: 0, group: 'fortes', verdict: 'testemunha forte',
        lines: ['ES 0,18 (0,08–0,28) em 40 estudos e 1.461 participantes.'],
        source: 'Saunders 2017, Br J Sports Med',
    },
    {
        id: 'cit', label: 'Citrato', color: C.ok, col: 3, row: 1, group: 'fortes', verdict: 'mesma alcalose, menos efeito',
        lines: ['Rendeu menos que o bicarbonato: β = 0,10 (−0,02 a 0,22), com 39 desfechos contra 192.'],
        source: 'de Oliveira 2022 · slide anterior',
    },
    {
        id: 'lac', label: 'Lactato', color: C.lactate, col: 2, row: 2, group: 'sangue', verdict: 'nulo, com GI',
        lines: [
            'USP, 18 atletas, 5 dias: o bicarbonato (controle positivo) deu +2,9% de trabalho; o lactato de cálcio não mudou pH, HCO₃⁻ nem desempenho.',
            'Lactato de sódio: vômito e diarreia, de moderados a graves.',
        ],
        source: 'Oliveira 2017, Scand J Med Sci Sports · McCarthy 2024, J Appl Physiol',
    },
    {
        id: 'pho', label: 'Fosfato', color: C.co2, col: 2, row: 1, group: 'sangue', verdict: 'misto, e não é tampão',
        lines: [
            '+9,8% de potência com n = 6 × 32,8 = 32,8 min no contrarrelógio com n = 20.',
            'O 2,3-DPG subiu, caiu ou não mudou conforme o estudo: o mecanismo provável é o O₂, não o pH.',
        ],
        source: 'Folland 2008 · Brown 2019 · Buck 2013',
    },
    {
        id: 'khco3', label: 'KHCO₃', color: C.risk, col: 0, row: 1, group: 'sangue', verdict: 'sem ensaio no esporte',
        lines: [
            'Evidência só no osso de idosos: menos reabsorção e calciúria; força e função física sem efeito.',
            '0,3 g/kg em 70 kg ≈ 210 mmol de K⁺ (cálculo): muito acima dos 67,5–122 mmol/dia testados.',
        ],
        source: 'Dawson-Hughes 2009 e 2015',
    },
    {
        id: 'caco3', label: 'CaCO₃', color: C.co2, col: 0, row: 2, group: 'sangue', verdict: 'testemunha?',
        lines: ['Carbonato de cálcio, o antiácido de farmácia: neutraliza ácido no estômago.', 'Nenhum ensaio de desempenho o usou como tampão. Então onde ele aparece?'],
        source: 'a resposta vem no passo 5',
    },
    {
        id: 'cre', label: 'Creatina (tampão)', color: C.lactate, col: 1, row: 2, group: 'musculo', verdict: 'funciona, mas não como tampão',
        lines: [
            'pH mais alto só no exercício leve (32% da CVM); a 79%, onde a acidose importa, nada.',
            'No “stack”, o ganho no sprint veio da creatina: +34 W (10–58).',
        ],
        source: 'Rico-Sanz 2000 · Moesgaard 2024',
    },
    {
        id: 'his', label: 'Histidina', color: C.carno, col: 2, row: 2, group: 'musculo', verdict: 'não é o limitante',
        lines: ['3,5 g/dia por 23 dias não mudou a carnosina.', 'Já a β-alanina sozinha baixou a histidina muscular em 31,6%.'],
        source: 'Blancquaert 2017, Med Sci Sports Exerc · n = 30',
    },
    {
        id: 'car', label: 'Carnosina oral', color: C.carno, col: 2, row: 1, group: 'musculo', verdict: 'uma β-alanina cara',
        lines: [
            'Carnosina muscular +65,8% com L-carnosina × +64,2% com β-alanina isomolar.',
            'A carnosinase quebra o dipeptídeo no caminho; o músculo refaz a partir da β-alanina.',
        ],
        source: 'Harris 2006, Amino Acids · Gardner 1991',
    },
    {
        id: 'ans', label: 'Anserina · balenina', color: C.carnoSoft, col: 1, row: 1, group: 'musculo', verdict: 'sinal pequeno, não tampão',
        lines: [
            'Anserina + carnosina agudas: +6% ± 11% nos 5 s iniciais do Wingate; os autores não atribuem ao pH.',
            'Balenina: sprint e contrarrelógios nulos, pH inalterado (n = 20).',
        ],
        source: 'Blancquaert 2021 · de Jager 2023',
    },
    {
        id: 'agua', label: 'Água alcalina', color: C.baseSoft, col: 1, row: 1, group: 'prateleira', verdict: 'confira o número',
        lines: ['Estudo de produto comercial, 38 pessoas em vida livre.'],
        alert: { value: 'pH do sangue 6,23', text: 'Valor incompatível com a vida, no próprio resumo. Provável troca entre sangue e urina, ou método inadequado.' },
        source: 'Heil 2010, JISSN · não citar como dado',
    },
    {
        id: 'dieta', label: 'Dieta alcalina', color: C.sodium, col: 1, row: 1, group: 'prateleira', verdict: 'sem ganho consistente',
        lines: [
            '400 m em 65,8 × 67,3 s (n = 11), mas contra uma dieta acidificante e sem cegamento.',
            'Revisão de 10 estudos: o pH plasmático sobe; o desempenho não melhora de forma consistente.',
        ],
        source: 'Limmer 2018 · Applegate 2017',
    },
];

export interface EvidenceStep {
    tab: string;
    caption: string;
    focus: string;
    groups: readonly Group[];
}

export const EVIDENCE_STEPS: readonly EvidenceStep[] = [
    { tab: 'A régua', caption: 'Antes das fracas, a régua: as testemunhas fortes dão efeito pequeno.', focus: 'bic', groups: ['fortes'] },
    { tab: 'No sangue', caption: 'Outros sais “de sangue”: menos dado, mais desconforto.', focus: 'lac', groups: ['fortes', 'sangue'] },
    { tab: 'No músculo', caption: 'Atalhos para a carnosina e um tampão que não tampona.', focus: 'car', groups: ['fortes', 'sangue', 'musculo'] },
    { tab: 'Na prateleira', caption: 'O que se vende como alcalinizante.', focus: 'agua', groups: ['fortes', 'sangue', 'musculo', 'prateleira'] },
    { tab: 'A virada', caption: 'Uma das fichas nunca foi testemunha.', focus: 'caco3', groups: ['fortes', 'sangue', 'musculo', 'prateleira'] },
];

/** Ensaios do dossiê em que o CaCO₃ foi o placebo. */
export const PLACEBO_TRIALS = [
    'Ball 1996 · 3,0 mmol/kg',
    'Schabort 2000 · 0,1 g/kg',
    'Tobias 2013 · USP',
    'Danaher 2014',
    'da Silva 2019 · 71 ciclistas',
    'Azevedo 2024',
] as const;

export const CACO3_REVEALED = {
    verdict: 'é o placebo',
    lines: [
        'Em pelo menos seis ensaios de tamponantes, o comprimido falso é carbonato de cálcio.',
        'Tratado como sem efeito sistêmico relevante: pressuposto dos autores, não testado nessas fontes.',
    ],
    source: 'ensaios listados no quadro do placebo',
} as const;
