import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { BODY_FONT, C } from '../kit/palette';
import { Panel } from '../kit/ui';
import { br } from '../kit/format';
import type { PairMetric, TrainingStudy } from './alkalineContent';
import { Tag } from './ui';

/** Cartão de um estudo do slide 74: desenho do treino e, quando revelado, bicarbonato × placebo por desfecho. */

const PairBars = ({ m, max, show, index }: { m: PairMetric; max: number; show: boolean; index: number }) => {
    const reduce = useReducedMotion();
    const bars = [
        { key: 'bic', value: m.bic, color: C.base },
        { key: 'pla', value: m.placebo, color: C.co2 },
    ];
    return (
        <div className="grid items-center gap-3" style={{ gridTemplateColumns: '150px minmax(0,1fr) 172px', height: 42 }}>
            <div className="flex flex-col leading-tight">
                <span className="text-[16px] font-semibold text-white">{m.label}</span>
                {m.note && show && <span className="text-[16px]" style={{ color: C.lactate }}>{m.note}</span>}
            </div>
            <div className="flex flex-col gap-1">
                {bars.map((b, i) => (
                    <div key={b.key} className="relative h-[11px] rounded bg-white/[0.05]">
                        <motion.div className="absolute inset-y-0 left-0 rounded" style={{ background: b.color, width: `${(b.value / max) * 100}%`, originX: 0 }}
                            initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: show ? 1 : 0 }}
                            transition={{ duration: reduce ? 0 : DUR.bar, delay: reduce ? 0 : 0.15 + index * 0.2 + i * 0.1, ease: EASE_OUT }} />
                    </div>
                ))}
            </div>
            <span className="text-right font-mono text-[16px] whitespace-nowrap">
                {show ? (
                    <>
                        <span style={{ color: C.base }}>+{br(m.bic, m.decimals)}{m.unit}</span>
                        <span className="text-gray-400"> × </span>
                        <span style={{ color: C.co2 }}>+{br(m.placebo, m.decimals)}{m.unit}</span>
                    </>
                ) : <span style={{ color: C.muted }}>?</span>}
            </span>
        </div>
    );
};

export const StudyCard = ({ study, active, revealed }: { study: TrainingStudy; active: boolean; revealed: boolean }) => (
    <Panel state={active ? 'active' : revealed ? 'idle' : 'dim'} glow={C.base} className="p-4 flex flex-col gap-2.5">
        <div className="flex items-center justify-between gap-2">
            <h3 className="font-body text-[1.45rem] font-semibold leading-tight text-white text-balance" style={BODY_FONT}>{study.who}</h3>
            <Tag color={C.muted}>{study.tier}</Tag>
        </div>
        <p className="text-[16px] leading-snug text-gray-300">{study.design}</p>
        <div className="flex flex-col gap-1.5">
            {study.metrics.map((m, i) => <PairBars key={m.label} m={m} max={study.max} show={revealed} index={i} />)}
        </div>
    </Panel>
);
