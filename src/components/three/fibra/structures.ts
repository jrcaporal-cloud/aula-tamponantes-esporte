import { C } from '../../sims/kit/palette';
import { BUFFER_SITES, CAP_Y, CAP_Z, CA_POINT, MITOCHONDRIA, PORT_X, onFiber, PORT_A, FIBER_R, type Vec3 } from './layout';

/*
 * Estruturas clicáveis: nome, cartão explicativo (com a fonte) e a pose do close-up.
 * Números só os confirmados nos dossiês 02 e 03; onde não há número confirmado, o cartão não inventa.
 */

export type StructureId =
    | 'sarcolema' | 'miofibrila' | 'mitocondria' | 'capilar' | 'hemacia'
    | 'proteina' | 'fosfato' | 'carnosina' | 'ck'
    | 'mct4' | 'mct1' | 'nhe1' | 'nbc' | 'anidrase';

export interface Pose { pos: Vec3; tgt: Vec3 }

export interface Structure {
    name: string;
    info: string;
    source: string;
    color: string;
    pose: Pose;
}

/** Close-up olhando para um ponto, a partir da frente e um pouco de cima. */
const near = (p: Vec3, back = 6, up = 1.1, side = 0.6): Pose => ({
    pos: [p[0] + side, p[1] + up, p[2] + back],
    tgt: p,
});

const port = (x: number): Vec3 => onFiber(x, PORT_A, FIBER_R);

export const STRUCTURES: Readonly<Record<StructureId, Structure>> = {
    sarcolema: {
        name: 'Sarcolema',
        info: 'A membrana da fibra. Três sistemas levam o ácido para fora: o cotransporte lactato/H⁺ (MCT), a troca Na⁺/H⁺ (NHE1) e o cotransporte Na⁺/HCO₃⁻ (NBC). Todos se adaptam ao treino.',
        source: 'Juel C. Acta Physiol 2008;193(1):17-24.',
        color: '#C7D2FE',
        pose: { pos: [-1.5, 6.2, 9.5], tgt: [-1.5, 2.6, 0.8] },
    },
    miofibrila: {
        name: 'Miofibrilas',
        info: 'Onde a miosina hidrolisa ATP. A contabilidade bioquímica do H⁺ é disputada, mas in vivo H⁺ e lactato sobem quase 1:1 (inclinação 0,98 em músculo de camundongo).',
        source: 'Marcinek DJ et al. J Appl Physiol 2010;108(6):1479-86.',
        color: '#E9A8B8',
        pose: { pos: [3, 1.8, 13], tgt: [1.5, -0.2, -0.6] },
    },
    mitocondria: {
        name: 'Mitocôndria',
        info: 'O lactato é combustível: no exercício submáximo estável, ≥75% do lactato formado é oxidado durante o próprio exercício.',
        source: 'Brooks GA. Med Sci Sports Exerc 1986;18(3):360-8.',
        color: '#86EFAC',
        pose: near(MITOCHONDRIA[0].p),
    },
    capilar: {
        name: 'Capilar e plasma',
        info: 'O plasma carrega o HCO₃⁻, tampão extracelular. No fim de um 2.000 m de remo, o pH arterial caiu de 7,42 para 7,07.',
        source: 'Nielsen HB et al. J Appl Physiol 2002;93(2):724-31.',
        color: C.base,
        pose: { pos: [-1, CAP_Y + 1.6, CAP_Z + 7.5], tgt: [-1, CAP_Y, CAP_Z] },
    },
    hemacia: {
        name: 'Hemácia',
        info: 'A hemoglobina também tampona H⁺ dentro da hemácia, e a hemácia carrega anidrase carbônica. Conceito clássico; a aula não cita número para essa fração.',
        source: 'Esquema conceitual (sem número citado).',
        color: '#FDA4AF',
        pose: { pos: [-3, CAP_Y + 1.2, CAP_Z + 5.5], tgt: [-3, CAP_Y, CAP_Z] },
    },
    proteina: {
        name: 'Proteínas (histidina)',
        info: 'O tamponamento intracelular não-bicarbonato vem sobretudo dos grupos imidazol da histidina nas proteínas. A divisão percentual entre os tampões não está confirmada.',
        source: 'Abe H. Biochemistry (Mosc) 2000;65(7):757-65.',
        color: C.baseDeep,
        pose: near(BUFFER_SITES.proteina[0].p, 5),
    },
    fosfato: {
        name: 'Fosfato inorgânico',
        info: 'O Pi sobe com a quebra da PCr e entra no tamponamento dentro da fibra. Sem porcentagem confirmada para a fração dele.',
        source: 'Abe H. Biochemistry (Mosc) 2000;65(7):757-65.',
        color: C.baseSoft,
        pose: near(BUFFER_SITES.fosfato[0].p, 5),
    },
    carnosina: {
        name: 'Carnosina',
        info: 'Imidazol com pKa 6,83, dentro da faixa do pH muscular. Estimativa em 50 adultos: ~7% da capacidade tamponante muscular total. Com beta-alanina: +58,8% em 4 semanas e +80,1% em 10.',
        source: 'Mannion AF et al. Eur J Appl Physiol 1992;64(1):47-50 · Sale C et al. Amino Acids 2010;39(2):321-33 · Hill CA et al. Amino Acids 2007;32(2):225-33.',
        color: C.carno,
        pose: near(BUFFER_SITES.carnosina[0].p, 5),
    },
    ck: {
        name: 'PCr / creatina-quinase',
        info: 'PCr + ADP + H⁺ → ATP + Cr: a reação consome H⁺. No início do exercício aparece uma alcalose transitória que se desfaz em ~2 min.',
        source: 'Guthrie BM et al. Can J Appl Physiol 1996;21(4):251-63.',
        color: C.ok,
        pose: near(BUFFER_SITES.ck[0].p, 5),
    },
    mct4: {
        name: 'MCT4',
        info: 'Cotransportador lactato/H⁺ de baixa afinidade (Km ~20 mM), mais abundante nas fibras tipo II: a via principal de exportação.',
        source: 'Juel C, Halestrap AP. J Physiol 1999;517(3):633-42 · Pilegaard H et al. Am J Physiol 1999;276(5):E843-8.',
        color: C.lactate,
        pose: near(port(PORT_X.mct4[0]), 6, 2),
    },
    mct1: {
        name: 'MCT1',
        info: 'Alta afinidade (Km ~5 mM), mais nas fibras oxidativas — também capta lactato para queimar. O conteúdo de MCT sobe com treino intenso.',
        source: 'Juel C, Halestrap AP. J Physiol 1999;517(3):633-42 · Thomas C et al. Am J Physiol Regul 2012;302(1):R1-14.',
        color: C.lactate,
        pose: near(port(PORT_X.mct1[0]), 6, 2),
    },
    nhe1: {
        name: 'NHE1',
        info: 'Troca Na⁺/H⁺: um H⁺ sai, um Na⁺ entra. A contribuição percentual de cada transportador ao efluxo não está confirmada.',
        source: 'Juel C. Acta Physiol 2008;193(1):17-24.',
        color: C.sodium,
        pose: near(port(PORT_X.nhe1[0]), 6, 2),
    },
    nbc: {
        name: 'NBC (NBCe1/NBCe2)',
        info: 'Cotransporte Na⁺ + HCO₃⁻ para dentro da fibra. Em vesículas de sarcolema de rato, ~metade da recuperação do pH dependeu de bicarbonato.',
        source: 'Kristensen JM et al. Acta Physiol Scand 2004;182(1):69-76.',
        color: C.base,
        pose: near(port(PORT_X.nbc[0]), 6, 2),
    },
    anidrase: {
        name: 'Anidrase carbônica',
        info: 'HCO₃⁻ + H⁺ → H₂CO₃ → CO₂ + H₂O; o CO₂ vai para o pulmão. A anidrase II também acelera o MCT4 sem catálise — evidência de oócito, não de humano.',
        source: 'Becker HM et al. J Membr Biol 2010;234(2):125-35.',
        color: C.co2,
        pose: near(CA_POINT, 6, 1),
    },
};
