import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Carnosina esquemática (β-alanil-L-histidina): cadeia H₂N–CH₂–CH₂–C(=O)–NH–CH(COOH) com o anel imidazol pendurado.
 * `assemble` anima as duas metades se juntando (síntese); `protonated` (0–1) acende o H⁺ no N do anel.
 */

const MOLECULE_W = 670;
const MOLECULE_H = 330;

const Y = 110;
const RING = { cx: 430, cy: 250, r: 40 };
const vertex = (i: number) => {
    const a = ((-90 + i * 72) * Math.PI) / 180;
    return { x: RING.cx + RING.r * Math.cos(a), y: RING.cy + RING.r * Math.sin(a) };
};
const V = [0, 1, 2, 3, 4].map(vertex);

interface Atom {
    x: number;
    label: string;
}

const BETA: readonly Atom[] = [{ x: 56, label: 'H₂N' }, { x: 132, label: 'CH₂' }, { x: 204, label: 'CH₂' }, { x: 272, label: 'C' }];
const HIS: readonly Atom[] = [{ x: 350, label: 'NH' }, { x: 430, label: 'CH' }, { x: 520, label: 'COOH' }];
const half = (a: Atom) => 12 + a.label.length * 5.5;

const Bond = ({ x1, x2, y = Y, color }: { x1: number; x2: number; y?: number; color: string }) => (
    <line x1={x1} x2={x2} y1={y} y2={y} stroke={color} strokeWidth={3} strokeLinecap="round" />
);

const Chain = ({ atoms, color }: { atoms: readonly Atom[]; color: string }) => (
    <g>
        {atoms.slice(1).map((a, i) => <Bond key={a.x} x1={atoms[i].x + half(atoms[i])} x2={a.x - half(a)} color={color} />)}
        {atoms.map(a => <SvgText key={a.x} x={a.x} y={Y + 7} text={a.label} anchor="middle" color={color} size={20} weight={700} />)}
    </g>
);

interface MoleculeProps {
    assemble: boolean;
    protonated: number;
    reduce: boolean;
}

export const CarnosineMolecule = ({ assemble, protonated, reduce }: MoleculeProps) => {
    const gap = assemble && !reduce ? 70 : 0;
    const t = { duration: 1.1, delay: 0.4, ease: [0.16, 1, 0.3, 1] as const };
    const hDir = { x: V[1].x - RING.cx, y: V[1].y - RING.cy };
    const h = { x: V[1].x + hDir.x * 1.45, y: V[1].y + hDir.y * 1.45 };
    return (
        <svg width={MOLECULE_W} height={MOLECULE_H} viewBox={`0 0 ${MOLECULE_W} ${MOLECULE_H}`} role="img" aria-label="Estrutura esquemática da carnosina">
            <motion.g initial={{ x: -gap }} animate={{ x: 0 }} transition={t}>
                <Chain atoms={BETA} color={C.carno} />
                <line x1={268} x2={268} y1={Y - 20} y2={Y - 48} stroke={C.carno} strokeWidth={3} />
                <line x1={277} x2={277} y1={Y - 20} y2={Y - 48} stroke={C.carno} strokeWidth={3} />
                <SvgText x={272} y={Y - 56} text="O" anchor="middle" color={C.carno} size={20} weight={700} />
                <path d={`M40 ${Y + 36} v10 h244 v-10`} fill="none" stroke={C.carno} strokeOpacity={0.6} strokeWidth={2} />
                <SvgText x={162} y={Y + 74} text="β-alanina" anchor="middle" color={C.carno} size={18} weight={700} />
            </motion.g>

            <motion.g initial={{ x: gap }} animate={{ x: 0 }} transition={t}>
                <Chain atoms={HIS} color={C.base} />
                <line x1={430} x2={430} y1={Y + 16} y2={V[0].y - 4} stroke={C.base} strokeWidth={3} />
                <SvgText x={444} y={Y + 58} text="CH₂" color={C.base} size={18} weight={700} />
                <polygon points={V.map(v => `${v.x},${v.y}`).join(' ')} fill={`${C.base}1a`} stroke={C.base} strokeWidth={3} />
                <SvgText x={V[1].x + 4} y={V[1].y + 6} text="N" color={C.text} size={19} weight={700} />
                <SvgText x={V[3].x - 6} y={V[3].y + 22} text="NH" anchor="end" color={C.text} size={19} weight={700} />
                <SvgText x={RING.cx + 58} y={RING.cy + 62} text="anel imidazol" color={C.base} size={17} />
                <SvgText x={600} y={Y + 74} text="L-histidina" anchor="middle" color={C.base} size={18} weight={700} />
                <g style={{ opacity: protonated, transition: 'opacity 300ms' }}>
                    <line x1={V[1].x + hDir.x * 0.55} y1={V[1].y + hDir.y * 0.55} x2={h.x - hDir.x * 0.5} y2={h.y - hDir.y * 0.5}
                        stroke={C.acid} strokeWidth={3} />
                    <circle cx={h.x} cy={h.y} r={20} fill={`${C.acid}33`} stroke={C.acid} strokeWidth={2.5} />
                    <SvgText x={h.x} y={h.y + 6} text="H⁺" anchor="middle" color={C.acidSoft} size={18} weight={700} />
                </g>
            </motion.g>

            <motion.g initial={{ opacity: assemble && !reduce ? 0 : 1 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 1.3, ease: EASE_OUT }}>
                <Bond x1={272 + 16} x2={350 - 23} color={C.text} />
                <SvgText x={392} y={Y - 74} text="ligação peptídica" anchor="middle" color={C.muted} size={16} weight={500} />
                <SvgText x={392} y={Y - 50} text="CARNS1 · ATP → ADP" anchor="middle" color={C.text} size={16} />
            </motion.g>
        </svg>
    );
};
