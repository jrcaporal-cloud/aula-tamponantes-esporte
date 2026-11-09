import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Frame, Tag } from './ato3/Frame';
import { VIALS, VIAL_FEET, VIAL_TABS, type Vial } from './ato3/historia';
import { br, signed } from './kit/format';
import { C } from './kit/palette';
import { SvgText } from './kit/ui';
import { useTween } from './kit/useTween';

/**
 * Slide 40 — "1977: Três Frascos" (JONES1977). A turma aposta num frasco; o passador mede o pH
 * antes do teste e solta a "corrida" até a exaustão a 95% da potência máxima.
 */

const W = 1096;
const H = 372;
const LANE_H = 92;
const TOP = 38;
const TRACK_X0 = 360;
const TRACK_X1 = 940;
const T_MAX = 600;
const sx = (t: number) => TRACK_X0 + (t / T_MAX) * (TRACK_X1 - TRACK_X0);
const CONTROL = VIALS[1].time;

/** Frasco de laboratório com o líquido da cor do sal. */
const VialIcon = ({ x, y, color, picked, reduce, phase }: { x: number; y: number; color: string; picked: boolean; reduce: boolean; phase: number }) => (
    <g transform={`translate(${x} ${y})`}>
        {picked && <circle cx={22} cy={34} r={40} fill={color} opacity={0.16} />}
        <rect x={10} y={0} width={24} height={8} rx={2} fill="#CBD5E1" opacity={0.8} />
        <path d="M12 8 V52 a10 10 0 0 0 20 0 V8" fill="rgba(255,255,255,0.06)" stroke="rgba(255,255,255,0.55)" strokeWidth={2} />
        <path d="M13 30 V52 a9 9 0 0 0 18 0 V30 Z" fill={color} opacity={0.85} />
        {/* Bolha do líquido: laço SMIL só sem movimento reduzido; begin negativo defasa os 3 frascos (não sobem juntos). */}
        <circle cx={19} cy={44} r={2.5} fill="#fff" opacity={0.5}>
            {!reduce && <animate attributeName="cy" values="50;32;50" dur="2.6s" begin={`-${phase}s`} repeatCount="indefinite" />}
        </circle>
    </g>
);

interface LaneProps {
    vial: Vial;
    index: number;
    step: number;
    clock: number;
    picked: boolean;
    reduce: boolean;
    onPick: () => void;
}

const Lane = ({ vial, index, step, clock, picked, reduce, onPick }: LaneProps) => {
    const cy = TOP + index * LANE_H + LANE_H / 2;
    const shown = Math.min(clock, vial.time);
    const done = step >= 2 && clock >= vial.time;
    const change = ((vial.time - CONTROL) / CONTROL) * 100;
    return (
        <g onClick={onPick} style={{ cursor: 'pointer' }}>
            <rect x={0} y={cy - LANE_H / 2 + 4} width={W} height={LANE_H - 8} rx={14}
                fill={picked ? `${vial.color}14` : 'rgba(255,255,255,0.02)'} stroke={picked ? `${vial.color}99` : 'transparent'} />
            <VialIcon x={22} y={cy - 32} color={vial.color} picked={picked} reduce={reduce} phase={index * 0.85} />
            <SvgText x={96} y={cy - 6} text={vial.salt} size={24} weight={700} color="#fff" />
            <SvgText x={96} y={cy + 22} text={vial.role} size={17} weight={500} color={vial.color} />
            {step >= 1 && (
                <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4, delay: 0.15 * index }}>
                    <rect x={228} y={cy - 19} width={108} height={38} rx={10} fill="rgba(0,0,0,0.35)" stroke={`${vial.color}88`} />
                    <SvgText x={282} y={cy + 7} text={`pH ${br(vial.ph, 2)}`} size={19} weight={700} anchor="middle" color={vial.color} />
                </motion.g>
            )}
            <rect x={TRACK_X0} y={cy - 13} width={TRACK_X1 - TRACK_X0} height={26} rx={6} fill="rgba(255,255,255,0.05)" />
            {step >= 2 && (
                <>
                    <rect x={TRACK_X0} y={cy - 13} width={Math.max(sx(shown) - TRACK_X0, 0)} height={26} rx={6} fill={vial.color} opacity={0.88} />
                    {done && (
                        <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
                            <line x1={sx(vial.time - vial.sd)} x2={sx(vial.time + vial.sd)} y1={cy} y2={cy} stroke="#fff" strokeWidth={2.5} />
                            <line x1={sx(vial.time - vial.sd)} x2={sx(vial.time - vial.sd)} y1={cy - 9} y2={cy + 9} stroke="#fff" strokeWidth={2} />
                            <line x1={sx(vial.time + vial.sd)} x2={sx(vial.time + vial.sd)} y1={cy - 9} y2={cy + 9} stroke="#fff" strokeWidth={2} />
                            <SvgText x={sx(vial.time + vial.sd) + 12} y={cy + 7} text={`${vial.time} ± ${vial.sd} s`} size={20} weight={700} color="#fff" />
                        </motion.g>
                    )}
                </>
            )}
            {step >= 3 && vial.id !== 'controle' && (
                <motion.g initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
                    <SvgText x={sx(vial.time) - 10} y={cy - 22} text={`${signed(change)}% vs controle`} size={17} weight={700} anchor="end" color={vial.color} />
                </motion.g>
            )}
        </g>
    );
};

const ThreeVialsSim = () => {
    const { step, setStep } = useSlideSteps(VIAL_TABS.length);
    const reduce = useReducedMotion() ?? false;
    const [picked, setPicked] = useState<Vial['id'] | null>(null);
    const clock = useTween(step >= 2 ? T_MAX : 0, reduce, 4200);
    const running = step === 2 && clock < VIALS[2].time;

    return (
        <Frame tabs={VIAL_TABS} step={step} setStep={setStep} layoutId="vials-tab" foot={VIAL_FEET[step]}
            chips={<><Tag color={C.base}>Jones et al. 1977 · n = 5</Tag>{step >= 3 && <Tag color={C.caveat}>% = cálculo</Tag>}</>}>
            <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="Três frascos e o tempo até a exaustão">
                <SvgText x={96} y={22} text={picked ? 'Aposta da turma marcada' : 'Clique no frasco da aposta'} size={16} weight={500} color={C.muted} />
                <SvgText x={TRACK_X0} y={22} text="Tempo até a exaustão a 95% da potência máxima" size={17} weight={600} color="#CBD5E1" />
                {step >= 2 && (
                    <SvgText x={TRACK_X1 + 150} y={22} text={running ? `t = ${Math.round(clock)} s` : 'fim do teste'} size={18} weight={700}
                        anchor="end" color={running ? C.lactate : C.muted} />
                )}
                {VIALS.map((v, i) => (
                    <Lane key={v.id} vial={v} index={i} step={step} clock={clock} picked={picked === v.id} reduce={reduce}
                        onPick={() => setPicked(p => (p === v.id ? null : v.id))} />
                ))}
                {[0, 100, 200, 300, 400, 500, 600].map(t => (
                    <g key={t}>
                        <line x1={sx(t)} x2={sx(t)} y1={TOP} y2={TOP + LANE_H * 3} stroke="rgba(255,255,255,0.06)" />
                        <SvgText x={sx(t)} y={TOP + LANE_H * 3 + 24} text={`${t} s`} size={16} weight={500} anchor="middle" color={C.muted} />
                    </g>
                ))}
                {step >= 3 && (
                    <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5, delay: 0.3 }}>
                        <SvgText x={TRACK_X0} y={H - 4} text="DP de ±120 s no braço alcalino: com 5 pessoas, a média balança muito."
                            size={17} weight={600} color={C.lactate} />
                    </motion.g>
                )}
            </svg>
        </Frame>
    );
};

export default ThreeVialsSim;
