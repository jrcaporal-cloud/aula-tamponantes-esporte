import { C } from '../../sims/kit/palette';
import type { LabelSpec } from '../shared/Label3D';
import { BUFFER_SITES, CAP_Y, CAP_Z, CA_POINT, FIBER_R, MITOCHONDRIA, PORT_A, PORT_X, onFiber } from './layout';
import type { Pose } from './structures';

/*
 * As 7 etapas do modelo: texto do painel, fonte, pose da câmera, rótulos 3D e os controles que a
 * etapa liga ao entrar (o espectador pode mexer depois). Números só dos dossiês 01–03.
 */

export interface Controls { intensity: number; bic: boolean; ba: boolean }

export interface FiberStep {
    badge: string;
    title: string;
    short: string;
    text: string;
    sources: readonly string[];
    pose: Pose;
    labels: readonly LabelSpec[];
    preset: Controls;
}

const lab = (id: string, text: string, sub: string, color: string, at: [number, number, number], dx: number, dy: number): LabelSpec =>
    ({ id, text, sub, color, at, dx, dy, big: true });

const port = (x: number) => onFiber(x, PORT_A, FIBER_R + 0.2);
const EXERCISE: Controls = { intensity: 0.9, bic: false, ba: false };

export const FIBER_STEPS: readonly FiberStep[] = [
    {
        badge: 'VISÃO GERAL',
        title: 'Uma fibra, um capilar',
        short: 'Visão geral',
        text: 'Um segmento de fibra em corte: atrás, as miofibrilas; na fatia aberta, o sarcoplasma com mitocôndrias. Acima, um capilar com hemácias. As cores valem para a aula toda.',
        sources: ['Esquema didático; escalas fora de proporção.'],
        pose: { pos: [-0.4, 7.5, 29], tgt: [-0.6, 1.3, 0] },
        labels: [
            lab('sarc', 'Sarcolema', 'membrana da fibra', '#C7D2FE', onFiber(3.2, 0.2, FIBER_R), 50, -36),
            lab('myo', 'Miofibrilas', 'onde o ATP é gasto', '#E9A8B8', [5.5, -1.4, -0.6], 70, 60),
            lab('mito', 'Mitocôndria', 'oxida o lactato', '#86EFAC', MITOCHONDRIA[5].p, 20, 140),
            lab('cap', 'Capilar', 'plasma com HCO₃⁻', C.base, [6, CAP_Y + 0.9, CAP_Z], -20, -46),
        ],
        preset: { intensity: 0, bic: false, ba: false },
    },
    {
        badge: 'EXERCÍCIO INTENSO',
        title: 'H⁺ e lactato sobem juntos',
        short: 'Exercício intenso',
        text: 'No esforço intenso, H⁺ (laranja) e lactato (âmbar) aparecem no sarcoplasma. A origem bioquímica do H⁺ é disputada, mas in vivo os dois sobem quase 1:1 — o lactato é o termômetro, não o fogo. Na biópsia, o pH muscular vai de 7,08 em repouso a 6,60 na exaustão.',
        sources: ['Marcinek DJ et al. J Appl Physiol 2010;108(6):1479-86 (inclinação 0,98, camundongo).', 'Sahlin K et al. Pflugers Arch 1976;367(2):143-9.'],
        pose: { pos: [0.1, 3.4, 21.5], tgt: [0.3, -0.1, 0.8] },
        labels: [
            lab('h', 'H⁺', 'nasce no sarcoplasma', C.acid, [-2.6, 0.6, 2.2], -40, -110),
            lab('lac', 'Lactato', 'quase 1:1 com o H⁺', C.lactate, [2.6, 0.2, 2.3], 60, 110),
        ],
        preset: EXERCISE,
    },
    {
        badge: '1ª LINHA',
        title: 'Tampões dentro da fibra',
        short: 'Tampões intracelulares',
        text: 'Antes de sair, parte do H⁺ é segurada ali mesmo: histidina das proteínas, fosfato inorgânico e carnosina (~7% da capacidade tamponante muscular). A creatina-quinase consome H⁺: PCr + ADP + H⁺ → ATP + Cr. A fração de cada um dos outros não está confirmada.',
        sources: ['Abe H. Biochemistry (Mosc) 2000;65(7):757-65.', 'Mannion AF et al. Eur J Appl Physiol 1992;64(1):47-50.', 'Guthrie BM et al. Can J Appl Physiol 1996;21(4):251-63.'],
        pose: { pos: [0.6, 3.2, 21], tgt: [0.4, -0.1, 0.8] },
        labels: [
            lab('prot', 'Proteínas', 'imidazol da histidina', C.base, BUFFER_SITES.proteina[1].p, 40, -120),
            lab('pi', 'Fosfato (Pi)', 'sobe com a quebra da PCr', C.baseSoft, BUFFER_SITES.fosfato[10].p, 20, 140),
            lab('carno', 'Carnosina', '~7% do tampão muscular', C.carno, BUFFER_SITES.carnosina[7].p, -80, -60),
            lab('ck', 'PCr / CK', 'consome H⁺', C.ok, BUFFER_SITES.ck[2].p, -60, 50),
        ],
        preset: EXERCISE,
    },
    {
        badge: '2ª LINHA',
        title: 'Portas do sarcolema',
        short: 'Exportação',
        text: 'O que sobra sai pela membrana. MCT4 e MCT1 levam lactato + H⁺ juntos; NHE1 troca H⁺ por Na⁺; NBC traz Na⁺ + HCO₃⁻ para dentro. O MCT4 (Km ~20 mM) predomina nas fibras tipo II; o MCT1 (Km ~5 mM), nas oxidativas. O peso de cada porta não está confirmado.',
        sources: ['Juel C, Halestrap AP. J Physiol 1999;517(3):633-42.', 'Kristensen JM et al. Acta Physiol Scand 2004;182(1):69-76.', 'Juel C. Acta Physiol 2008;193(1):17-24.'],
        pose: { pos: [-0.3, 10, 19.5], tgt: [-0.3, 2.6, 0.6] },
        labels: [
            lab('mct4', 'MCT4', 'lactato + H⁺ saem', C.lactate, port(PORT_X.mct4[0]), 16, -75),
            lab('mct1', 'MCT1', 'lactato + H⁺ saem', C.lactate, port(PORT_X.mct1[0]), 16, 95),
            lab('nhe1', 'NHE1', 'H⁺ sai, Na⁺ entra', C.sodium, port(PORT_X.nhe1[0]), 16, -75),
            lab('nbc', 'NBC', 'Na⁺ + HCO₃⁻ entram', C.base, port(PORT_X.nbc[0]), 16, 95),
        ],
        preset: EXERCISE,
    },
    {
        badge: '3ª E 4ª LINHAS',
        title: 'O sangue recebe o ácido',
        short: 'Sangue e CO₂',
        text: 'No capilar, HCO₃⁻ + H⁺ → H₂CO₃ → CO₂ + H₂O, com a anidrase carbônica; a hemoglobina também tampona. O CO₂ segue para o pulmão — a ventilação é a última linha. No fim de um 2.000 m de remo, o pH arterial foi de 7,42 a 7,07.',
        sources: ['Nielsen HB et al. J Appl Physiol 2002;93(2):724-31.'],
        pose: { pos: [1.2, 10.5, 23.5], tgt: [1.0, 3.7, 0.6] },
        labels: [
            lab('ca', 'HCO₃⁻ + H⁺ → CO₂ + H₂O', 'anidrase carbônica', C.base, [CA_POINT[0], CA_POINT[1], CA_POINT[2]], -10, -110),
            lab('co2', 'CO₂ → pulmão', 'ventilação', C.co2, [7.6, CAP_Y + 0.5, CAP_Z], -20, -70),
            lab('hb', 'Hemoglobina', 'também tampona', '#FDA4AF', [-4.2, CAP_Y - 0.3, CAP_Z + 0.4], 20, 95),
        ],
        preset: EXERCISE,
    },
    {
        badge: 'COM BICARBONATO',
        title: 'Puxar o ácido de fora',
        short: 'Com bicarbonato',
        text: 'O bicarbonato sobe o HCO₃⁻ do sangue em média +5,2 mmol/L. O plasma fica mais alcalino, o gradiente cresce e sai mais H⁺ e lactato: a 75% do VO₂máx, o efluxo de lactato da perna foi 10,0 × 4,2 mmol/min. O pH da fibra em repouso não muda — o bicarbonato não entra, ele puxa de fora.',
        sources: ['de Oliveira LF et al. Sports Med 2022;52(3):505-26.', 'Hollidge-Horvat MG et al. Am J Physiol Endocrinol Metab 2000;278(2):E316-29 (n = 8).', 'Bishop D et al. Med Sci Sports Exerc 2004;36(5):807-13.'],
        pose: { pos: [-0.4, 7.5, 29], tgt: [-0.6, 1.3, 0] },
        labels: [
            lab('plasma', 'Plasma mais alcalino', '+5,2 mmol/L de HCO₃⁻', C.base, [6, CAP_Y + 0.9, CAP_Z], -20, -46),
            lab('grad', 'Gradiente maior', 'mais saída de H⁺ e lactato', C.acid, port(PORT_X.mct1[0]), 90, 90),
        ],
        preset: { intensity: 0.9, bic: true, ba: false },
    },
    {
        badge: 'COM BETA-ALANINA',
        title: 'Mais carnosina, ganho modesto',
        short: 'Com beta-alanina',
        text: 'Semanas de beta-alanina aumentam a carnosina do músculo: +58,8% em 4 semanas e +80,1% em 10. Mais violeta dentro da fibra e um pouco mais de H⁺ capturado ali — mas, partindo de ~7% do tampão muscular, o efeito é modesto.',
        sources: ['Hill CA et al. Amino Acids 2007;32(2):225-33.', 'Mannion AF et al. Eur J Appl Physiol 1992;64(1):47-50.'],
        pose: { pos: [0.6, 3.2, 21], tgt: [0.4, -0.1, 0.8] },
        labels: [
            lab('carno2', 'Carnosina', '+58,8% em 4 semanas', C.carno, BUFFER_SITES.carnosina[7].p, -80, -60),
        ],
        preset: { intensity: 0.9, bic: false, ba: true },
    },
];
