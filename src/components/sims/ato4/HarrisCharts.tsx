import { motion } from 'framer-motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CARNOSINE_BARS, DISCLOSURES, WORK_GAIN_PCT } from './harrisContent';
import { Person } from './HarrisVisuals';
import { HARRIS_VB, delayed } from './harrisMotion';

/**
 * Quadros dos passos 3 e 4 do slide "O Homem da Creatina" (viewBox 568 × 372).
 * Passo 3: barras do aumento de carnosina (Harris 2006, Hill 2007) com o selo do coautor da NAI; o trabalho a 110% à parte.
 * Passo 4: rede dos cinco vínculos declarados em del Favero 2012 — uma aresta por declaração, uma de cada vez.
 */

const VB = `0 0 ${HARRIS_VB.w} ${HARRIS_VB.h}`;

/* ——— Passo 3: Chichester ——— */

const BASE_Y = 272;
const PX_PER_PCT = 2.3;
const BAR_W = 58;
const barX = (i: number): number => 26 + i * 80 + (i >= 2 ? 30 : 0);

/** Bicicleta esquemática (rodas giram). */
const Bike = ({ x, y, reduce }: { x: number; y: number; reduce: boolean }) => (
    <g transform={`translate(${x} ${y})`} stroke={C.base} strokeWidth={3} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {[-34, 34].map(cx => (
            <g key={cx}>
                <circle cx={cx} cy={0} r={22} />
                <g>
                    <path d={`M${cx - 22} 0 H${cx + 22} M${cx} -22 V22`} strokeWidth={1.5} strokeOpacity={0.6} />
                    {!reduce && <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} 0`} to={`360 ${cx} 0`} dur="1.6s" repeatCount="indefinite" />}
                </g>
            </g>
        ))}
        <path d="M-34 0 L-8 -30 L22 -30 L34 0 M-8 -30 L0 0 L22 -30 M-14 -40 H-2 M22 -30 L18 -42 H28" />
    </g>
);

export const ChichesterVisual = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox={VB} width="100%" height="100%" role="img" aria-label="Aumento da carnosina muscular em Chichester e trabalho no teste a 110%">
        <SvgText x={14} y={20} text="CARNOSINA NO MÚSCULO · AUMENTO" size={16} color={C.carnoSoft} weight={700} />
        {[20, 40, 60, 80].map(p => (
            <line key={p} x1={14} x2={356} y1={BASE_Y - p * PX_PER_PCT} y2={BASE_Y - p * PX_PER_PCT} stroke="rgba(255,255,255,0.07)" />
        ))}
        {CARNOSINE_BARS.map((b, i) => {
            const h = b.pct * PX_PER_PCT;
            const x = barX(i);
            return (
                <g key={`${b.study}-${b.label}`}>
                    <motion.rect x={x} y={BASE_Y - h} width={BAR_W} height={h} rx={6} fill={C.carno} fillOpacity={0.85}
                        style={{ transformBox: 'fill-box', originY: 1 }}
                        initial={{ scaleY: reduce ? 1 : 0 }} animate={{ scaleY: 1 }}
                        transition={{ duration: reduce ? 0 : 0.7, delay: reduce ? 0 : 0.2 + i * 0.25, ease: 'easeOut' }} />
                    <motion.g {...delayed(reduce, 0.7 + i * 0.25)}>
                        <SvgText x={x + BAR_W / 2} y={BASE_Y - h - 10} text={`+${br(b.pct, 1)}%`} anchor="middle" size={18} color="#fff" weight={800} />
                    </motion.g>
                    <SvgText x={x + BAR_W / 2} y={BASE_Y + 22} text={b.label} anchor="middle" size={16} color="#E5E7EB" weight={600} />
                </g>
            );
        })}
        <line x1={14} x2={356} y1={BASE_Y} y2={BASE_Y} stroke="rgba(255,255,255,0.35)" />
        {/* Hill: 4 → 10 semanas */}
        <motion.path d={`M${barX(2) + BAR_W / 2} ${BASE_Y - 58.8 * PX_PER_PCT - 32} Q${barX(3) - 6} ${BASE_Y - 80.1 * PX_PER_PCT - 50} ${barX(3) + 6} ${BASE_Y - 80.1 * PX_PER_PCT - 32}`}
            fill="none" stroke={C.carnoSoft} strokeWidth={2} strokeDasharray="4 4" {...delayed(reduce, 1.6)} />
        <SvgText x={(barX(0) + barX(1) + BAR_W) / 2} y={BASE_Y + 44} text="Harris 2006 · 4 sem" anchor="middle" size={16} color={C.carnoSoft} weight={700} />
        <SvgText x={(barX(2) + barX(3) + BAR_W) / 2} y={BASE_Y + 44} text="Hill 2007" anchor="middle" size={16} color={C.carnoSoft} weight={700} />
        {/* selo do conflito sobre o estudo de 2006 */}
        <motion.g {...delayed(reduce, 1.9, 0.3)}>
            <g transform="rotate(-8 95 60)">
                <rect x={22} y={44} width={148} height={32} rx={8} fill="rgba(4,8,15,0.85)" stroke={C.lactate} strokeWidth={2.5} strokeDasharray="6 3" />
                <SvgText x={96} y={66} text="coautor da NAI" anchor="middle" size={17} color={C.lactate} weight={800} />
            </g>
        </motion.g>
        <motion.g {...delayed(reduce, 2.3)}>
            <rect x={14} y={334} width={342} height={32} rx={16} fill="rgba(250,204,21,0.10)" stroke={`${C.lactate}99`} />
            <rect x={30} y={343} width={30} height={14} rx={7} fill={C.lactate} />
            <line x1={45} x2={45} y1={343} y2={357} stroke="#04080F" strokeWidth={2} />
            <SvgText x={72} y={356} text="insumo dos ensaios: CarnoSyn (NAI)" size={16} color={C.lactate} weight={700} />
        </motion.g>
        {/* trabalho a 110% */}
        <line x1={378} x2={378} y1={10} y2={366} stroke="rgba(255,255,255,0.12)" />
        <motion.g {...delayed(reduce, 1.2)}>
            <SvgText x={474} y={40} text="TESTE A 110%" anchor="middle" size={16} color={C.baseSoft} weight={700} />
            <SvgText x={474} y={60} text="da potência máxima" anchor="middle" size={16} color="#CBD5E1" weight={600} />
            <Bike x={474} y={130} reduce={reduce} />
            <SvgText x={474} y={208} text={`+${br(WORK_GAIN_PCT, 1)}%`} anchor="middle" size={36} color={C.base} weight={800} />
            <SvgText x={474} y={234} text="trabalho total" anchor="middle" size={17} color="#fff" weight={700} />
            <SvgText x={474} y={256} text="4 semanas · Hill 2007" anchor="middle" size={16} color="#CBD5E1" weight={600} />
            <SvgText x={474} y={300} text="outra medida:" anchor="middle" size={16} color="#CBD5E1" weight={500} />
            <SvgText x={474} y={320} text="desempenho, não" anchor="middle" size={16} color="#CBD5E1" weight={500} />
            <SvgText x={474} y={340} text="carnosina" anchor="middle" size={16} color="#CBD5E1" weight={500} />
        </motion.g>
    </svg>
);

/* ——— Passo 4: rede de vínculos ——— */

interface Edge {
    d: string;
    label: readonly string[];
    lx: number;
    ly: number;
    anchor: 'start' | 'middle' | 'end';
    color?: string;
}

/** Uma entrada por declaração, na ordem de DISCLOSURES. */
const EDGES: readonly (readonly Edge[])[] = [
    [{ d: 'M104 252 L250 206', label: ['ex-funcionário'], lx: 146, ly: 262, anchor: 'start' }],
    [{ d: 'M106 92 Q220 92 254 166', label: ['financia pesquisa'], lx: 168, ly: 82, anchor: 'start' }],
    [
        { d: 'M106 66 Q290 4 466 62', label: ['inventor nomeado'], lx: 290, ly: 24, anchor: 'middle' },
        { d: 'M470 98 L326 166', label: ['da NAI'], lx: 428, ly: 150, anchor: 'start' },
    ],
    [{ d: 'M94 106 Q110 190 248 184', label: ['consultor', 'não remunerado'], lx: 6, ly: 184, anchor: 'start' }],
    [
        { d: 'M324 212 L462 280', label: ['CarnoSyn e placebo', 'financiamento parcial'], lx: 286, ly: 292, anchor: 'start' },
        { d: 'M490 200 L490 258', label: [], lx: 0, ly: 0, anchor: 'start', color: C.base },
    ],
];

const STEP_S = 0.75;
const HEX = 'M0 -46 L40 -23 L40 23 L0 46 L-40 23 L-40 -23 Z';

const EdgeLine = ({ e, delay, reduce }: { e: Edge; delay: number; reduce: boolean }) => (
    <g>
        <motion.path d={e.d} fill="none" stroke={e.color ?? C.lactate} strokeWidth={3} strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }}
            transition={{ duration: reduce ? 0 : 0.5, delay: reduce ? 0 : delay }} />
        <motion.g {...delayed(reduce, delay + 0.35)}>
            {e.label.map((t, k) => (
                <SvgText key={t} x={e.lx} y={e.ly + k * 19} text={t} anchor={e.anchor} size={16} color={C.lactate} weight={700} />
            ))}
        </motion.g>
    </g>
);

const NodeLabel = ({ x, y, lines, color = '#fff' }: { x: number; y: number; lines: readonly string[]; color?: string }) => (
    <>
        {lines.map((t, k) => (
            <SvgText key={t} x={x} y={y + k * 18} text={t} anchor="middle" size={16} color={k === 0 ? color : '#CBD5E1'} weight={k === 0 ? 700 : 500} />
        ))}
    </>
);

export const DisclosureVisual = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox={VB} width="100%" height="100%" role="img" aria-label={`Vínculos declarados: ${DISCLOSURES.join('; ')}`}>
        {EDGES.map((group, i) => group.map((e, k) => (
            <EdgeLine key={`${i}-${k}`} e={e} delay={0.4 + i * STEP_S + k * 0.25} reduce={reduce} />
        )))}
        {/* nós */}
        <circle cx={80} cy={78} r={30} fill="rgba(167,139,250,0.16)" stroke={C.carno} strokeWidth={2} />
        <Person x={80} y={84} color={C.carnoSoft} />
        <NodeLabel x={80} y={128} lines={['Roger Harris', 'coautor']} />
        <circle cx={80} cy={268} r={30} fill="rgba(148,163,184,0.16)" stroke={C.co2} strokeWidth={2} />
        <Person x={80} y={274} color={C.co2} />
        <NodeLabel x={80} y={318} lines={['John Wise', 'coautor']} />
        <g transform="translate(290 186)">
            <path d={HEX} fill="rgba(250,204,21,0.14)" stroke={C.lactate} strokeWidth={2.5} />
            {!reduce && (
                <path d={HEX} fill="none" stroke={C.lactate} strokeWidth={2}>
                    <animate attributeName="opacity" values="0;0.7;0" dur="2.4s" repeatCount="indefinite" />
                    <animateTransform attributeName="transform" type="scale" values="1;1.14;1" dur="2.4s" repeatCount="indefinite" />
                </path>
            )}
        </g>
        <SvgText x={290} y={188} text="NAI" anchor="middle" size={26} color={C.lactate} weight={800} />
        <SvgText x={290} y={210} text="CarnoSyn" anchor="middle" size={16} color="#fff" weight={700} />
        <g transform="translate(470 40)">
            <path d="M0 0 H28 L40 12 V54 H0 Z" fill="rgba(250,204,21,0.08)" stroke={C.lactate} strokeWidth={2} />
            {[18, 28, 38].map(y => <line key={y} x1={7} x2={33} y1={y} y2={y} stroke={C.lactate} strokeOpacity={0.6} />)}
        </g>
        <SvgText x={490} y={116} text="patentes" anchor="middle" size={16} color="#fff" weight={700} />
        <rect x={446} y={172} width={88} height={28} rx={14} fill="rgba(34,211,238,0.12)" stroke={C.base} strokeWidth={2} />
        <SvgText x={490} y={192} text="FAPESP" anchor="middle" size={16} color={C.base} weight={800} />
        <g transform="translate(470 262)">
            <path d="M0 0 H32 L40 8 V52 H0 Z" fill="rgba(255,255,255,0.08)" stroke="#E5E7EB" strokeWidth={2} />
            {[16, 26, 36].map(y => <line key={y} x1={7} x2={33} y1={y} y2={y} stroke="#E5E7EB" strokeOpacity={0.5} />)}
        </g>
        <NodeLabel x={490} y={338} lines={['del Favero 2012', 'USP · idosos']} />
    </svg>
);
