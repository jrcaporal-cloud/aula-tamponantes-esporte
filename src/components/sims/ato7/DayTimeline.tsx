import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { ALK_WINDOW, DAY_END, DAY_START, GI_WINDOW, type AthleteDay, type EventKind } from './day';

/** Linha do tempo horária de um dia de prova (slide 93). viewBox = caixa: 1104 × 190. */
const W = 1104;
const H = 190;
const X0 = 100;
const X1 = W - 14;
const AXIS_Y = 160;

const sx = (t: number) => X0 + ((t - DAY_START) / (DAY_END - DAY_START)) * (X1 - X0);

const EVENT_COLOR: Record<EventKind, string> = {
    prova: '#FFFFFF',
    pesagem: C.sodium,
    remedio: C.risk,
    controle: C.co2,
};

interface Props {
    day: AthleteDay;
    focus: number | null;
}

export const DayTimeline = ({ day, focus }: Props) => {
    const reduce = useReducedMotion();
    const lanes = day.lanes.length;
    const laneH = lanes === 1 ? 110 : 66;
    const laneTop = (i: number) => (lanes === 1 ? 30 : 16 + i * (laneH + 8));

    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label={`Dia de prova de ${day.name}`}>
            {Array.from({ length: DAY_END - DAY_START + 1 }, (_, i) => DAY_START + i).map(h => (
                <g key={h}>
                    <line x1={sx(h)} x2={sx(h)} y1={10} y2={AXIS_Y} stroke="rgba(255,255,255,0.06)" />
                    {h % 2 === 0 && <SvgText x={sx(h)} y={AXIS_Y + 24} text={`${h}h`} anchor="middle" size={16} color={C.muted} weight={500} />}
                </g>
            ))}
            {day.lanes.map((lane, li) => {
                const top = laneTop(li);
                const mid = top + laneH / 2;
                return (
                    <g key={lane.label}>
                        <SvgText x={0} y={mid + 6} text={lane.label} size={18} weight={700} color="#E5E7EB" />
                        <line x1={X0} x2={X1} y1={mid} y2={mid} stroke="rgba(255,255,255,0.22)" />
                        {lane.doses.map((d, di) => (
                            <motion.g key={d.t} initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.enter, ease: EASE_OUT, delay: reduce ? 0 : stagger(di, 0.1) }}>
                                <rect x={sx(d.t + GI_WINDOW[0])} y={top} width={sx(d.t + GI_WINDOW[1]) - sx(d.t + GI_WINDOW[0])} height={laneH}
                                    fill={C.risk} fillOpacity={d.tentative ? 0.14 : 0.28} rx={4} />
                                <rect x={sx(d.t + ALK_WINDOW[0])} y={top} width={sx(d.t + ALK_WINDOW[1]) - sx(d.t + ALK_WINDOW[0])} height={laneH}
                                    fill={C.base} fillOpacity={d.tentative ? 0.12 : 0.22} stroke={C.base} strokeOpacity={0.6}
                                    strokeDasharray={d.tentative ? '5 4' : undefined} rx={4} />
                                <circle cx={sx(d.t)} cy={mid} r={8} fill={C.base} stroke="#04080F" strokeWidth={2} />
                                <SvgText x={sx(d.t)} y={mid + 28} text={d.label} anchor="middle" size={16} color={C.baseSoft} />
                            </motion.g>
                        ))}
                        {lane.events.map((e, ei) => {
                            const color = EVENT_COLOR[e.kind];
                            const y = e.row === 0 ? mid - 14 : mid + 26;
                            return (
                                <motion.g key={`${e.t}-${e.label}`} initial={reduce ? false : { opacity: 0, y: -6 }} animate={{ opacity: e.tentative ? 0.75 : 1, y: 0 }}
                                    transition={{ duration: DUR.enter, ease: EASE_OUT, delay: reduce ? 0 : stagger(ei, 0.3) }}>
                                    <line x1={sx(e.t)} x2={sx(e.t)} y1={mid - 9} y2={mid + 9} stroke={color} strokeWidth={3} strokeDasharray={e.tentative ? '3 3' : undefined} />
                                    {/* "controle" cai na borda da janela de alcalose: alinhado à esquerda do traço, fica inteiro dentro dela. */}
                                    <SvgText x={e.kind === 'controle' ? sx(e.t) - 8 : sx(e.t)} y={y} text={e.label}
                                        anchor={e.kind === 'controle' ? 'end' : 'middle'} size={17} weight={700} color={color} />
                                </motion.g>
                            );
                        })}
                    </g>
                );
            })}
            {day.conflicts.map(c => {
                const top = laneTop(c.lane);
                const active = focus === c.n;
                return (
                    <motion.g key={c.n} initial={reduce ? false : { opacity: 0, scale: 0.6 }} animate={{ opacity: 1, scale: active ? 1.2 : 1 }}
                        style={{ transformBox: 'fill-box', transformOrigin: 'center' }} transition={{ duration: DUR.enter, ease: EASE_OUT, delay: reduce ? 0 : active ? 0 : 0.6 + Math.min(c.n * 0.08, 0.3) }}>
                        <circle cx={sx(c.t) + 16} cy={top + 12} r={12} fill={C.lactate} stroke="#04080F" strokeWidth={2} />
                        <text x={sx(c.t) + 16} y={top + 18} textAnchor="middle" fontSize={16} fontWeight={800} fill="#04080F"
                            style={{ fontFamily: 'var(--font-body)' }}>{c.n}</text>
                    </motion.g>
                );
            })}
        </svg>
    );
};
