/** Slide 91 — E no Brasil? Fonte: dossiê 06, Parte 2 (ANVISA-IN28, BULA-BR, CFN-656) e contas do dossiê. */

export type BrazilVisual = 'rotulo' | 'relogio' | 'bicarbonato' | 'cfn';

export interface BrazilStep {
    tab: string;
    visual: BrazilVisual;
    kicker: string;
    title: string;
    text: string;
    points: readonly string[];
    source: string;
}

export const BRAZIL_STEPS: readonly BrazilStep[] = [
    {
        tab: 'O rótulo', visual: 'rotulo', kicker: 'Anvisa · IN 28/2018',
        title: 'β-alanina: o rótulo autoriza um terço da dose estudada',
        text: 'Incluída pela IN 102/2021: no máximo 2 g/dia, em doses de até 300 mg com 2 h de intervalo, só a partir de 19 anos.',
        points: ['Nenhum ECR usou esse fracionamento.', 'Não há alegação de desempenho autorizada para β-alanina.'],
        source: 'Anvisa, IN 28/2018, texto consolidado até a IN 470/2026 (Anexos I, IV, V e VI); AIS 2025.',
    },
    {
        tab: 'O relógio', visual: 'relogio', kicker: 'Rótulo × literatura',
        title: 'No limite do rótulo, a carga leva três vezes mais',
        text: 'A mediana da meta-análise de Hobson foi 179 g no total. A 6,4 g/dia, isso dá 28 dias; a 2 g/dia, ~90.',
        points: ['A carnosina sobe com a dose total, não com a pressa.'],
        source: 'Hobson 2012 (mediana de 179 g; +2,85%); dias = cálculo.',
    },
    {
        tab: 'O bicarbonato', visual: 'bicarbonato', kicker: 'Suplemento ou medicamento?',
        title: 'Não existe "suplemento de bicarbonato" em cápsula',
        text: 'Na IN 28, bicarbonato e citrato de sódio só entram como fonte de sódio em suplemento líquido de eletrólitos. O pó da farmácia é antiácido.',
        points: ['21 g ≈ 8 doses de antiácido de uma vez (cálculo).'],
        source: 'IN 28, Anexo I, nota vi; bula Bicarbonato de Sódio RioQuímica (RDC 199/2006, notificação simplificada).',
    },
    {
        tab: 'O CFN', visual: 'cfn', kicker: 'Resolução CFN 656/2020',
        title: 'A norma do nutricionista remete à IN 28 — e para aí',
        text: 'Não localizamos parecer do CFN sobre os dois casos que mais aparecem no consultório. É zona cinzenta, não regra.',
        points: ['Isto não é orientação jurídica: na dúvida, consulte o CRN.'],
        source: 'CFN 656/2020, alterada pela 731/2022 (art. 1º §2º; art. 3º VI, VII, VIII e XII; parágrafo único).',
    },
];

/** Tomadas pelo rótulo: 6 × 300 mg + 1 × 200 mg = 2 g (cálculo), a cada 2 h. */
export const LABEL_DOSES = [
    { h: 7, mg: 300 }, { h: 9, mg: 300 }, { h: 11, mg: 300 }, { h: 13, mg: 300 },
    { h: 15, mg: 300 }, { h: 17, mg: 300 }, { h: 19, mg: 200 },
] as const;

/** Regime prático do AIS: 1,6 g nas 3 refeições e no maior lanche (6,4 g/d). */
export const AIS_DOSES = [{ h: 8, mg: 1600 }, { h: 12.5, mg: 1600 }, { h: 16, mg: 1600 }, { h: 20, mg: 1600 }] as const;

export const NOT_AUTHORIZED = ['0 a 18 anos', 'gestantes', 'lactantes'] as const;

/** Corrida até 179 g (Hobson 2012) em cada regime. */
export const LOAD_TARGET_G = 179;
export const LOAD_RACES = [
    { id: 'ais', label: '6,4 g/dia', sub: 'AIS / ISSN', gPerDay: 6.4 },
    { id: 'lit', label: '3,2 g/dia', sub: 'piso da faixa do AIS', gPerDay: 3.2 },
    { id: 'anvisa', label: '2 g/dia', sub: 'teto do rótulo (IN 28)', gPerDay: 2 },
] as const;

export const SHELVES = [
    {
        id: 'liquido', mark: 'sim', title: 'Suplemento líquido de eletrólitos',
        text: 'Bicarbonato ou citrato só como fonte de sódio: 460 a 1.150 mg de Na por litro.',
    },
    {
        id: 'capsula', mark: 'nao', title: 'Cápsula de bicarbonato para tamponar',
        text: 'Não está prevista como suplemento alimentar regularizado.',
    },
    {
        id: 'farmacia', mark: 'med', title: 'Pó da farmácia',
        text: 'Medicamento antiácido: 2,5 g por dose, meia hora antes das refeições.',
    },
] as const;

export const CFN_DUTIES = [
    'Respeitar as listas de constituintes da IN 28 (art. 3º, VIII).',
    'Fora do UL, só com alto grau de evidência de eficácia e segurança (VII).',
    'Considerar interações com fármacos e contraindicações (VI).',
    'Registrar via, composição, posologia e justificativa (XII).',
    'Notificar efeitos adversos aos órgãos sanitários.',
] as const;

export const GRAY_ZONES = [
    { id: 'ba', title: 'β-alanina acima de 2 g/dia em manipulado', why: 'A literatura usa 3,2–6,4 g/d; o rótulo, 2 g/d. A 656 permite manipulados, mas manda respeitar a IN 28.' },
    { id: 'bic', title: 'Bicarbonato em cápsula, para desempenho', why: 'Como suplemento, só líquido de eletrólitos; como medicamento, é antiácido.' },
] as const;
