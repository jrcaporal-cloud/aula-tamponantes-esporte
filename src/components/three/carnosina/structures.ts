import { at, STATION, type Vec3 } from './layout';

/*
 * Estruturas clicáveis: nome, o que dizer dela (só números confirmados no dossiê 02) e a pose do
 * close-up. O alvo do close-up é o ponto da estrutura; a câmera fica a `dist` de frente, um pouco acima.
 */

export type StructureId =
    | 'vilosidade' | 'bala' | 'capilar'
    | 'cn1' | 'carnosinaPlasma' | 'hemacia'
    | 'taut' | 'pat1' | 'taurina'
    | 'carns1' | 'histidina' | 'carnosina' | 'imidazol'
    | 'tanque'
    | 'hplus' | 'miofibrila'
    | 'mrgprd' | 'neuronio' | 'mastocito';

export interface Structure {
    name: string;
    info: string;
    src: string;
    target: Vec3;
    dist: number;
}

const S = STATION;

export const STRUCTURES: Readonly<Record<StructureId, Structure>> = {
    vilosidade: { name: 'Vilosidade intestinal', info: 'A β-alanina é absorvida no intestino delgado e cai no sangue; a perda urinária fica abaixo de 5%.', src: 'Harris 2006', target: at(S.gut, -2, 0, 0), dist: 11 },
    bala: { name: 'β-alanina', info: 'Precursor que limita a síntese de carnosina. 1,6 g pura em solução: pico plasmático de 248 µM em 0,5 h.', src: 'Sale 2010; Décombaz 2012', target: at(S.gut, -1, 3, 0), dist: 10 },
    capilar: { name: 'Capilar', info: 'A β-alanina plasmática volta à linha de base em cerca de 2 h. Do total engolido, 97–98% ficam no corpo.', src: 'Harris 2006; Stegen 2013', target: at(S.gut, 6, -1.5, 0), dist: 11 },
    cn1: { name: 'Carnosinase sérica (CN1)', info: 'Dipeptidase do plasma humano: Km de 1,2 mM para a carnosina, atividade máxima em pH 8,5. Em camundongo e rato, só no rim — cuidado ao transpor estudos animais.', src: 'Teufel 2003', target: at(S.blood, 0, 0, 0), dist: 9 },
    carnosinaPlasma: { name: 'Carnosina ingerida', info: 'Meia-vida no plasma: carnosina 1,20 min, anserina 2,14 min, balenina 34,9 min. Com 60 mg/kg, só 8 de 25 pessoas tiveram carnosina mensurável no sangue.', src: 'de Jager 2023; Everaert 2012', target: at(S.blood, -3, 0, 0), dist: 9 },
    hemacia: { name: 'Hemácia', info: 'Em humanos (não em roedores), a carnosina circula protegida dentro das hemácias.', src: 'Van der Stede 2023', target: at(S.blood, 4, -1.5, 0), dist: 10 },
    taut: { name: 'TauT (transportador de taurina)', info: 'Expresso no músculo humano; leva β-alanina para dentro da fibra — base da hipótese de competição com a taurina.', src: 'Everaert 2013', target: at(S.membrane, -3, 0, 0), dist: 9 },
    pat1: { name: 'PAT1', info: 'Transportador de aminoácidos expresso no músculo; a outra porta de entrada da β-alanina.', src: 'Everaert 2013', target: at(S.membrane, 4, 0, 0), dist: 9 },
    taurina: { name: 'Taurina', info: 'Disputa o TauT, mas a taurina muscular humana não caiu: ES 0,156 (−0,38 a 0,72) na meta-análise; inalterada em 10 semanas.', src: 'Dolan 2019; Hill 2007', target: at(S.membrane, -3, 3, 0), dist: 10 },
    carns1: { name: 'CARNS1 (carnosina sintase)', info: 'Família ATP-grasp: a reação libera ADP. Eficiência 15–25× maior para β-alanina do que para GABA. Expressa preferencialmente em fibras rápidas.', src: 'Drozak 2010; Van der Stede 2023', target: at(S.synthesis, 0, 0, 0), dist: 11 },
    histidina: { name: 'L-histidina', info: 'Abundante em relação ao Km da enzima. Ainda assim, com 6 g/d de β-alanina, caiu 30,6% no plasma e 31,6% no músculo; a co-suplementação evitou a queda.', src: 'Sale 2010; Blancquaert 2017', target: at(S.synthesis, 4, 0.5, 0), dist: 9 },
    carnosina: { name: 'Carnosina (β-alanil-L-histidina)', info: 'Dipeptídeo estável: não há carnosinase dentro do miócito. Vasto lateral: 20,0 mmol/kg de massa seca (♂ 21,3 × ♀ 17,5).', src: 'Baguet 2009; Mannion 1992', target: at(S.synthesis, 0, 4, 0), dist: 10 },
    imidazol: { name: 'Anel imidazol', info: 'O grupo que tampona: pKa 6,83, dentro da faixa de pH do músculo em exercício. A ligação com a β-alanina desloca o pKa da histidina para ~6,8.', src: 'Sale 2010; Harris & Stellingwerff 2013', target: at(S.buffer, 0, 0, 0), dist: 8 },
    tanque: { name: 'Estoque de carnosina', info: 'Sobe conforme a dose acumulada, não pela carnosina basal nem pelo músculo. De cada 100 g engolidos, ~3 g viram carnosina.', src: 'Stellingwerff 2012; Stegen 2013', target: at(S.tank, 0, 0, 0), dist: 14 },
    hplus: { name: 'H⁺', info: 'Sobe no exercício intenso. A carnosina responde por ~7% da capacidade tamponante do músculo humano (2,4–10,1 mmol H⁺/kg ms entre pH 7,1 e 6,5).', src: 'Mannion 1992', target: at(S.buffer, -2, 1, 0), dist: 9 },
    miofibrila: { name: 'Miofibrilas', info: 'A carnosina basal é 1,71× maior em fibras IIa que em tipo I, e sobe nas duas com a suplementação.', src: 'Hill 2007; Kendrick 2009', target: at(S.buffer, 0, -3, -3), dist: 11 },
    mrgprd: { name: 'Receptor MrgprD', info: 'Receptor acoplado a proteína G que responde especificamente à β-alanina em concentração micromolar; descrito em 2004.', src: 'Shinohara 2004', target: at(S.skin, -1, 2.6, 0), dist: 8 },
    neuronio: { name: 'Neurônio sensorial', info: 'Subpopulação que inerva só a pele e responde a β-alanina, calor e estímulo mecânico nocivo — mas não à histamina. A coceira depende do MrgprD.', src: 'Liu 2012 (J Neurosci)', target: at(S.skin, 0, -1, 0), dist: 12 },
    mastocito: { name: 'Mastócito', info: 'Fica fora da via: β-alanina na pele deu coceira sem pápula nem eritema. Por isso anti-histamínico não resolve.', src: 'Liu 2012 (J Neurosci)', target: at(S.skin, 4.5, -1.5, 1), dist: 9 },
};

export const poseOf = (id: StructureId) => {
    const t = STRUCTURES[id].target;
    const d = STRUCTURES[id].dist;
    return { pos: [t[0] + d * 0.12, t[1] + d * 0.22, t[2] + d] as Vec3, tgt: t };
};
