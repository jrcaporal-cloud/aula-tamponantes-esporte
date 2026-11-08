import { C } from '../../sims/kit/palette';
import type * as THREE from 'three';
import type { LabelSpec } from '../shared/Label3D';
import { at, levelY, STATION, stationX } from './layout';
import { heroBa, heroRing, POOL_HIS, poolHome } from './synthesisPool';

/*
 * Rótulos 3D de cada etapa (aparecem quando a câmera assenta). Âncora no mundo + deslocamento da
 * caixa em pixels; todos no tamanho grande (≥ 14 px no subtítulo).
 */

const S = STATION;
const L = (id: string, text: string, color: string, p: [number, number, number], dx: number, dy: number, sub?: string): LabelSpec =>
    ({ id, text, sub, color, at: p, dx, dy, big: true });

const SLATE_LIGHT = '#CBD5E1';
const ENZYME = '#34D399';

/** O rótulo da β-alanina acompanha a primeira β-alanina livre da etapa 4. */
const followBa = (_T: number, clock: number, out: THREE.Vector3) => { poolHome(POOL_HIS, clock, out).x += stationX(S.synthesis); };

const followHeroBa = (_T: number, clock: number, out: THREE.Vector3) => { heroBa(clock, out).x += stationX(S.synthesis); };
const followHeroRing = (_T: number, clock: number, out: THREE.Vector3) => { heroRing(clock, out).x += stationX(S.synthesis); };

const BY_STEP: readonly LabelSpec[][] = [
    [
        L('luz', 'Luz intestinal', C.carnoSoft, at(S.gut, -4.5, 4.2, 0), 70, 20, 'β-alanina engolida'),
        L('vil', 'Vilosidade', '#e9a8c4', at(S.gut, 1.2, 2.4, 3.6), 70, -40, 'absorção'),
        L('cap', 'Capilar → sangue', C.risk, at(S.gut, 4.6, -1.5, 4.5), -40, 80, 'pico em ~30 min'),
    ],
    [
        L('carn', 'Carnosina ingerida', C.carno, at(S.blood, -6.5, 0.6, 1.4), 30, -110, 'β-alanina + histidina unidas'),
        L('cn1', 'Carnosinase sérica (CN1)', ENZYME, at(S.blood, 1.4, 0.4, -0.4), 60, -150, 'corta a ligação peptídica'),
        L('livre', 'Peças livres', SLATE_LIGHT, at(S.blood, 6.5, -1.6, 1.2), -60, 110, 'β-alanina segue para o músculo'),
    ],
    [
        L('fora', 'Fora da fibra', C.carnoSoft, at(S.membrane, 0.6, 3.1, 0), 10, -20, 'sangue / interstício'),
        L('taut', 'TauT', '#7dd3c0', at(S.membrane, -3.2, 1.8, -0.6), -70, -30, 'β-alanina e taurina'),
        L('pat1', 'PAT1', '#93c5d8', at(S.membrane, 4.4, 1.8, -0.4), 60, -20, 'só β-alanina'),
        L('dentro', 'Sarcoplasma', SLATE_LIGHT, at(S.membrane, -6, -3.4, 2), -30, 50, 'dentro da fibra'),
    ],
    [
        L('enz', 'CARNS1', ENZYME, at(S.synthesis, -2.2, -2.4, 1.2), -60, 60, 'ATP → ADP'),
        L('his', 'L-histidina: sobra', SLATE_LIGHT, at(S.synthesis, 5, -2.2, -2), -30, 90, 'perto do Km da enzima'),
        { ...L('ba', 'β-alanina: falta', C.carno, at(S.synthesis, -5.5, 1.5, 0), -50, -40, 'é o limitante'), at: undefined, follow: followBa },
        { ...L('carn', 'Carnosina', C.carnoSoft, at(S.synthesis, 0, 0, 0), -100, 45, 'β-alanil-L-histidina'), at: undefined, follow: followHeroBa },
        { ...L('imid', 'Anel imidazol', C.base, at(S.synthesis, 0, 0, 0), 90, -10, 'pKa 6,83'), at: undefined, follow: followHeroRing },
    ],
    [
        L('basal', 'Basal', '#e5e7eb', at(S.tank, 3.05, levelY(1), 0), 60, 0),
        L('50', '+50%', '#94a3b8', at(S.tank, 3.05, levelY(1.5), 0), 60, 0),
        L('100', '+100%', '#94a3b8', at(S.tank, 3.05, levelY(2), 0), 60, 0),
        L('tank', 'Carnosina muscular', C.carno, at(S.tank, -3, levelY(1.6), 0), -150, -10, 'sobe pela dose acumulada'),
    ],
    [
        L('imid', 'Imidazol + H⁺', C.acid, at(S.buffer, 1.4, -0.3, 3.2), -40, 120, 'pKa 6,83: tampona entre 7,1 e 6,5'),
        L('h', 'H⁺ livre', C.acid, at(S.buffer, 2, 3.2, 0), -40, -40, 'sobe no exercício intenso'),
    ],
    [
        L('mrg', 'MrgprD', C.risk, at(S.skin, 3, 3.45, -0.5), -60, -55, 'receptor da β-alanina'),
        L('neu', 'Neurônio sensorial', '#e2e8f0', at(S.skin, 1.4, -3.4, 0.4), -60, 50, 'inerva só a pele'),
        L('mast', 'Mastócito', '#94a3b8', at(S.skin, 5.2, -0.4, 1.2), -5, -95, 'sem histamina'),
        L('cap', 'Capilar', C.risk, at(S.skin, -4.2, 1.2, -1.2), 40, 120, 'β-alanina do plasma'),
    ],
];

export const labelsForStep = (step: number): readonly LabelSpec[] => BY_STEP[step] ?? [];
