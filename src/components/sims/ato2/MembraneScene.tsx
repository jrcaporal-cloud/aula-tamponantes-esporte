import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { BLOOD_HCO3, EFFLUX, K_OUT } from './whyItWorks.content';

/**
 * Membrana da fibra em corte (slide 15): H⁺ e lactato dentro, bicarbonato fora, três portas MCT.
 * Faixa de cima e de baixo mudam por passo: (0) bicarbonato barrado + sangue × fibra (Bishop 2004);
 * (1) gradiente e efluxo medido (Hollidge 2000); (2) glicólise acelerada e K⁺ fora (Street 2005).
 * Posições e contagens de partículas são ilustrativas. Partículas em <animateMotion>.
 */

export const MEM_W = 640;
export const MEM_H = 440;
const MEM_X = 312;
const DOORS = [150, 222, 294] as const;
const TOP = 112;
const SPAN = 220;

/** Pontos fixos (sem sorteio) dentro e fora da fibra, na faixa do meio. */
const spread = (n: number, x0: number, w: number, seed: number) => Array.from({ length: n }, (_, i) => ({
    x: x0 + ((seed + (i + 1) * 0.7548776662) % 1) * w,
    y: TOP + ((seed * 0.5 + (i + 1) * 0.5698402910) % 1) * SPAN,
}));
const INSIDE = spread(16, 26, 236, 0.13);
const OUTSIDE = spread(18, 372, 240, 0.41);

export type MembraneStage = 0 | 1 | 2;

interface MembraneSceneProps {
    alkalosis: boolean;
    stage: MembraneStage;
    reduce: boolean;
}

const fade = { initial: { opacity: 0 }, animate: { opacity: 1 }, transition: { duration: 0.4, delay: 0.15, ease: EASE_OUT } };

/** Passo 0: o bicarbonato sobe no sangue, mas dentro da fibra nada muda. */
const OutsideOnly = ({ alkalosis }: { alkalosis: boolean }) => {
    const v = alkalosis ? BLOOD_HCO3.alcalose : BLOOD_HCO3.repouso;
    const gx = 372;
    const gw = 230;
    const scale = (mm: number) => gx + ((mm - 20) / 12) * gw;
    return (
        <motion.g {...fade}>
            <g>
                <line x1={438} x2={352} y1={78} y2={78} stroke={C.base} strokeWidth={3} />
                <path d="M352 78 l12 -7 M352 78 l12 7" stroke={C.base} strokeWidth={3} fill="none" />
                <path d="M326 64 l26 28 M352 64 l-26 28" stroke={C.risk} strokeWidth={4} />
                <SvgText x={448} y={84} text="HCO₃⁻ não entra" size={17} color={C.baseSoft} weight={700} />
            </g>
            <SvgText x={gx} y={372} text="HCO₃⁻ no sangue" size={16} color="#CBD5E1" weight={500} />
            <rect x={gx} y={384} width={gw} height={18} rx={9} fill="rgba(255,255,255,0.08)" />
            <rect x={gx} y={384} width={gw} height={18} fill={C.base}
                style={{ clipPath: `inset(0 ${100 - ((scale(v) - gx) / gw) * 100}% 0 0 round 9px)`, transition: 'clip-path 0.6s var(--ease-out)' }} />
            <line x1={scale(BLOOD_HCO3.repouso)} x2={scale(BLOOD_HCO3.repouso)} y1={378} y2={408} stroke="#fff" strokeWidth={2} strokeDasharray="3 3" />
            <SvgText x={gx} y={428} text={`antes ${br(BLOOD_HCO3.repouso, 1)}`} size={16} color="#CBD5E1" weight={500} />
            <SvgText x={gx} y={428} text={`antes ${br(BLOOD_HCO3.repouso, 1)}`} size={16} color="#CBD5E1" weight={500} />
            <SvgText x={gx + gw} y={428} text={`${br(v, 1)} mmol/L`} anchor="end" size={17} color={C.baseSoft} weight={700} />
            {[{ y: 384, t: 'pH de repouso' }, { y: 416, t: 'tampão da fibra (βm)' }].map(r => (
                <g key={r.t}>
                    <rect x={20} y={r.y - 20} width={34} height={28} rx={8} fill="rgba(4,8,15,0.85)" stroke={C.acidSoft} strokeWidth={2} />
                    <SvgText x={37} y={r.y} text="=" anchor="middle" size={20} color={C.acidSoft} weight={800} />
                    <SvgText x={64} y={r.y} text={`${r.t}: igual`} size={16} color="#E5E7EB" weight={600} />
                </g>
            ))}
        </motion.g>
    );
};

/** Passo 1+: faixa do gradiente (ácido dentro → alcalino fora) e o efluxo medido em barras. */
const Gradient = ({ alkalosis }: { alkalosis: boolean }) => (
    <motion.g {...fade}>
        <defs>
            <linearGradient id="mem-grad" x1="0" x2="1" y1="0" y2="0">
                <stop offset="0" stopColor={C.acid} stopOpacity={0.55} />
                <stop offset="0.5" stopColor="#94A3B8" stopOpacity={0.25} />
                <stop offset="1" stopColor={C.base} stopOpacity={alkalosis ? 0.75 : 0.25} style={{ transition: 'stop-opacity 0.6s' }} />
            </linearGradient>
        </defs>
        <path d={`M24 64 L${MEM_W - 60} 64 L${MEM_W - 60} 54 L${MEM_W - 24} 76 L${MEM_W - 60} 98 L${MEM_W - 60} 88 L24 88 Z`} fill="url(#mem-grad)" />
        <SvgText x={34} y={82} text="H⁺ + lactato⁻ descem o gradiente →" size={16} color="#fff" weight={700} />
    </motion.g>
);

const EffluxBars = ({ alkalosis }: { alkalosis: boolean }) => {
    const rows = [
        { k: 'controle', v: EFFLUX.controle, on: !alkalosis, y: 392 },
        { k: 'alcalose', v: EFFLUX.alcalose, on: alkalosis, y: 422 },
    ];
    return (
        <motion.g {...fade}>
            <SvgText x={20} y={364} text="efluxo de lactato da perna (mmol/min)" size={16} color="#CBD5E1" weight={500} />
            {rows.map(r => (
                <g key={r.k} style={{ opacity: r.on ? 1 : 0.45, transition: 'opacity 0.4s' }}>
                    <SvgText x={20} y={r.y} text={r.k} size={16} color="#E5E7EB" weight={600} />
                    <rect x={100} y={r.y - 15} width={150 * (r.v / EFFLUX.alcalose)} height={18} rx={6} fill={C.lactate} />
                    <SvgText x={108 + 150 * (r.v / EFFLUX.alcalose)} y={r.y} text={br(r.v, 1)} size={17} color={C.lactate} weight={700} />
                </g>
            ))}
        </motion.g>
    );
};

/** Passo 2: engrenagem da glicólise (gira mais rápido em alcalose) e K⁺ fora da fibra. */
const Gear = ({ x, y, fast, reduce }: { x: number; y: number; fast: boolean; reduce: boolean }) => {
    const teeth = Array.from({ length: 8 }, (_, i) => i * 45);
    return (
        <g transform={`translate(${x} ${y})`}>
            <g>
                {teeth.map(a => <rect key={a} x={-4} y={-19} width={8} height={9} rx={2} fill={C.acidSoft} transform={`rotate(${a})`} />)}
                <circle r={13} fill="none" stroke={C.acidSoft} strokeWidth={5} />
                {!reduce && (
                    <animateTransform key={fast ? 'f' : 's'} attributeName="transform" type="rotate" from="0" to="360"
                        dur={fast ? '1.6s' : '4.5s'} repeatCount="indefinite" />
                )}
            </g>
        </g>
    );
};

const FactoryAndK = ({ alkalosis, reduce }: { alkalosis: boolean; reduce: boolean }) => {
    const k = alkalosis ? K_OUT.alcalose : K_OUT.controle;
    return (
        <motion.g {...fade}>
            <rect x={14} y={354} width={286} height={74} rx={12} fill="rgba(4,8,15,0.8)" stroke={C.acidSoft} strokeOpacity={0.5} />
            <Gear x={50} y={391} fast={alkalosis} reduce={reduce} />
            <SvgText x={84} y={384} text="glicólise" size={17} color={C.acidSoft} weight={700} />
            <SvgText x={84} y={408} text={alkalosis ? 'menos freada pelo H⁺' : 'freada pelo H⁺'} size={16} color="#E5E7EB" weight={500} />
            <rect x={340} y={354} width={286} height={74} rx={12} fill="rgba(4,8,15,0.8)" stroke="#E5E7EB" strokeOpacity={0.35} />
            {Array.from({ length: 11 }, (_, i) => (
                <g key={i} style={{ opacity: i < Math.round(k) ? 1 : 0.12, transition: 'opacity 0.5s' }}>
                    <circle cx={364 + i * 24} cy={377} r={9} fill="#E5E7EB" />
                    <text x={364 + i * 24} y={382} textAnchor="middle" fontSize={14} fontWeight={800} fill="#0B1220" style={{ fontFamily: 'var(--font-body)' }}>K</text>
                </g>
            ))}
            <SvgText x={354} y={416} text={`K⁺ fora da fibra: ${br(k, 1)} mM`} size={16} color="#E5E7EB" weight={700} />
        </motion.g>
    );
};

export const MembraneScene = ({ alkalosis, stage, reduce }: MembraneSceneProps) => {
    const outside = alkalosis ? 18 : 10;
    const perDoor = alkalosis ? 3 : 1;
    const efflux = stage >= 1;
    return (
        <svg viewBox={`0 0 ${MEM_W} ${MEM_H}`} width={MEM_W} height={MEM_H} role="img"
            aria-label={`Membrana da fibra, ${alkalosis ? 'com alcalose' : 'controle'}`}>
            <rect x={0} y={0} width={MEM_X} height={MEM_H} fill="rgba(251,146,60,0.07)" />
            <rect x={MEM_X + 24} y={0} width={MEM_W - MEM_X - 24} height={MEM_H} fill={alkalosis ? 'rgba(34,211,238,0.12)' : 'rgba(34,211,238,0.04)'}
                style={{ transition: 'fill 0.6s' }} />
            <SvgText x={20} y={36} text="dentro da fibra" size={18} color={C.acidSoft} weight={700} />
            <SvgText x={MEM_W - 20} y={36} text={alkalosis ? 'fora · alcalose' : 'fora · controle'} anchor="end" size={18} color={C.baseSoft} weight={700} />
            <rect x={MEM_X} y={0} width={24} height={MEM_H} fill="rgba(148,163,184,0.25)" />
            {DOORS.map(y => (
                <g key={y}>
                    <rect x={MEM_X - 6} y={y - 20} width={36} height={40} rx={8} fill="#0B1220" stroke={C.lactate} strokeWidth={2} />
                    <SvgText x={MEM_X + 12} y={y + 6} text="MCT" anchor="middle" size={16} color={C.lactate} weight={700} />
                </g>
            ))}
            {INSIDE.map((p, i) => <circle key={`in${i}`} cx={p.x} cy={p.y} r={7} fill={i % 2 ? C.lactate : C.acid} opacity={0.85} />)}
            {OUTSIDE.map((p, i) => (
                <g key={`out${i}`} style={{ opacity: i < outside ? 1 : 0, transition: 'opacity 0.5s' }}>
                    <circle cx={p.x} cy={p.y} r={10} fill="none" stroke={C.base} strokeWidth={2.5} />
                    <circle cx={p.x} cy={p.y} r={3} fill={C.base} />
                </g>
            ))}
            {stage === 0 && <OutsideOnly alkalosis={alkalosis} />}
            {efflux && <Gradient alkalosis={alkalosis} />}
            {efflux && !reduce && DOORS.flatMap(y => Array.from({ length: perDoor }, (_, k) => {
                const path = `M${MEM_X - 70} ${y} L${MEM_X + 110} ${y}`;
                return (
                    <g key={`${y}-${k}-${perDoor}`}>
                        <circle r={7} fill={C.acid}>
                            <animateMotion dur="2.2s" begin={`-${((k * 2.2) / perDoor).toFixed(2)}s`} repeatCount="indefinite" path={path} />
                        </circle>
                        <circle r={6} fill={C.lactate}>
                            <animateMotion dur="2.2s" begin={`-${((k * 2.2) / perDoor + 0.18).toFixed(2)}s`} repeatCount="indefinite" path={`M${MEM_X - 70} ${y + 12} L${MEM_X + 110} ${y + 12}`} />
                        </circle>
                    </g>
                );
            }))}
            {stage === 1 && <EffluxBars alkalosis={alkalosis} />}
            {stage === 2 && <FactoryAndK alkalosis={alkalosis} reduce={reduce} />}
        </svg>
    );
};
