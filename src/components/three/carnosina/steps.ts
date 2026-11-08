import { at, STATION, type Vec3 } from './layout';

/*
 * As sete etapas do modelo: texto do painel, fontes e a pose da câmera em cada estação.
 * Todo número vem do dossiê 02 (marcado como confirmado).
 */

export interface CarnoStep {
    id: number;
    badge: string;
    title: string;
    short: string;
    text: string;
    sources: readonly string[];
    cam: { pos: Vec3; tgt: Vec3 };
    /** Pose intermediária do voo até esta etapa (a câmera recua no meio do caminho). */
    via?: { pos: Vec3; tgt: Vec3 };
}

const S = STATION;
/**
 * Enquadramento da estação `i`: câmera a `dist` do centro `c`, elevada `el` graus. O alvo fica um pouco
 * à esquerda e abaixo do centro, para a cena cair à direita e acima do painel flutuante e da linha do tempo.
 */
const frame = (i: number, c: Vec3, dist: number, el: number, yaw = -6) => {
    const tgt = at(i, c[0] - dist * 0.1, c[1] - dist * 0.05, c[2]);
    const e = (el * Math.PI) / 180;
    const y = (yaw * Math.PI) / 180;
    return {
        pos: [tgt[0] + Math.sin(y) * Math.cos(e) * dist, tgt[1] + Math.sin(e) * dist, tgt[2] + Math.cos(y) * Math.cos(e) * dist] as Vec3,
        tgt,
    };
};
/** Pose do meio do voo: entre a estação anterior e esta, recuada. */
const via = (i: number) => ({ pos: at(i, -35, 12, 52), tgt: at(i, -35, 0, 0) });

export const CARNO_STEPS: readonly CarnoStep[] = [
    {
        id: 0, badge: 'INTESTINO', title: 'Do intestino ao sangue', short: 'β-alanina absorvida',
        text: 'A β-alanina (violeta) atravessa a parede do intestino e cai no sangue. Com 1,6 g pura, o pico plasmático é de 248 µM em ~30 min, e a curva volta à linha de base em ~2 h. Quase tudo fica no corpo (97–98%), mas só ~3% vira carnosina no músculo.',
        sources: ['Décombaz 2012 Amino Acids', 'Harris 2006 Amino Acids', 'Stegen 2013 MSSE'],
        cam: frame(S.gut, [-1.5, 0, 0], 30, 16),
    },
    {
        id: 1, badge: 'SANGUE', title: 'O pedágio da carnosinase', short: 'CN1 corta a carnosina',
        text: 'Por que não tomar carnosina pronta? No plasma humano, a carnosinase sérica (CN1) a parte em β-alanina + histidina: meia-vida de 1,2 min. Ainda assim ela carrega o músculo (+65,8% × +64,2% com β-alanina isomolar) — é só uma fonte cara de β-alanina. Por isso se suplementa o precursor.',
        sources: ['de Jager 2023 Sci Rep', 'Teufel 2003 J Biol Chem', 'Everaert 2012 Am J Physiol', 'Harris 2006 Amino Acids'],
        cam: frame(S.blood, [0, 0, 0], 27, 8),
        via: via(S.blood),
    },
    {
        id: 2, badge: 'MEMBRANA', title: 'A porta da taurina', short: 'entrada pelo TauT e PAT1',
        text: 'Na fibra, a β-alanina entra pelo TauT — o transportador da taurina — e pelo PAT1, ambos expressos no músculo humano. A disputa com a taurina (cinza) é real na porta, mas não esvazia o estoque: a taurina muscular humana não caiu.',
        sources: ['Everaert 2013 Eur J Appl Physiol', 'Dolan 2019 Adv Nutr', 'Hill 2007 Amino Acids'],
        cam: frame(S.membrane, [0.5, 0, 0], 27, 24),
        via: via(S.membrane),
    },
    {
        id: 3, badge: 'SÍNTESE', title: 'β-alanina + histidina = carnosina', short: 'CARNS1 monta a carnosina',
        text: 'A carnosina sintase (CARNS1) junta β-alanina e L-histidina, gastando ATP. A histidina sobra perto do Km da enzima; a β-alanina está baixa e tem Km maior: é o fator limitante. Prova direta: histidina sozinha não mudou a carnosina; β-alanina sim.',
        sources: ['Sale 2010 Amino Acids', 'Drozak 2010 J Biol Chem', 'Blancquaert 2017 MSSE'],
        cam: frame(S.synthesis, [0, 0.8, 0], 25, 8),
        via: via(S.synthesis),
    },
    {
        id: 4, badge: 'CARGA', title: 'Encher o tanque leva semanas', short: 'acúmulo semana a semana',
        text: 'O que manda é a dose acumulada, não a do dia: 3,2 g/d por 4 semanas deram +42%; 6,4 g/d, +64%; 10 semanas, +80%. Com ED50 de 377 g, protocolos usuais ficam longe do teto, e 99,3% das pessoas respondem. Ao parar, volta devagar: de 6 a 15 semanas até o basal.',
        sources: ['Harris 2006 Amino Acids', 'Hill 2007 Amino Acids', 'Stellingwerff 2012 Amino Acids', 'Rezende 2020 Front Physiol', 'Baguet 2009 J Appl Physiol'],
        cam: frame(S.tank, [0, 0, 0], 24, 10),
        via: via(S.tank),
    },
    {
        id: 5, badge: 'TAMPÃO', title: 'O imidazol segura o H⁺', short: 'tamponamento no sarcoplasma',
        text: 'Em exercício intenso o pH do músculo cai. O anel imidazol da carnosina tem pKa 6,83, no meio dessa faixa, e captura H⁺ (laranja) justo quando o ácido sobe. O efeito é real, mas modesto: em humanos, a carnosina responde por ~7% da capacidade tamponante do músculo.',
        sources: ['Sale 2010 Amino Acids', 'Mannion 1992 Eur J Appl Physiol'],
        cam: frame(S.buffer, [-2.5, 0.4, 0], 29, 8),
        via: via(S.buffer),
    },
    {
        id: 6, badge: 'PELE', title: 'O formigamento', short: 'MrgprD dispara na pele',
        text: 'A parestesia segue o pico no sangue, não a carga no músculo. A β-alanina ativa o MrgprD de neurônios que inervam só a pele, numa via sem histamina. Acima de 800 mg por dose ela é comum (OR 8,9); com liberação lenta (pico de 82 µM), os sintomas não diferiram do placebo. Doses menores e fracionadas também evitam.',
        sources: ['Liu 2012 J Neurosci', 'Shinohara 2004 J Biol Chem', 'Décombaz 2012 Amino Acids', 'Artioli 2010 MSSE', 'Dolan 2019 Adv Nutr'],
        cam: frame(S.skin, [-2.5, 0.6, 0], 30, 10),
        via: via(S.skin),
    },
];
