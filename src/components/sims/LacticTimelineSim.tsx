import { motion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { EVENTS, TIMELINE_STEPS, type TrialEvent } from './ato2/lacticTimeline.content';
import { SimShell, Tag } from './ato2/ui';

/**
 * Slide 22 — "O Julgamento do Ácido Lático". Oito autos do processo, dois por passo. Embaixo da
 * linha do tempo, a "ficha" do réu: a reputação do lactato desce de suspeito a combustível,
 * sobe de novo com a briga de 2005 e termina como marcador fiel (leitura didática, não medida).
 */

const W = 1136;
const H = 214;
const NODE_X0 = 170;
const NODE_DX = (W - NODE_X0 - 50) / (EVENTS.length - 1);
const NODE_Y = 58;
const REP_TOP = 104;
const REP_BOTTOM = 196;

const nodeX = (i: number) => NODE_X0 + i * NODE_DX;
const repY = (r: number) => REP_BOTTOM - r * (REP_BOTTOM - REP_TOP);

const Timeline = ({ step }: { step: number }) => {
    const current: readonly number[] = TIMELINE_STEPS[step].events;
    const lastVisible = current[current.length - 1];
    const visible = EVENTS.slice(0, lastVisible + 1);
    const points = visible.map((e, i) => `${nodeX(i).toFixed(1)},${repY(e.reputation).toFixed(1)}`).join(' ');
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="Linha do tempo do ácido lático, 1907 a 2010">
            <defs>
                <linearGradient id="lactic-rep" gradientUnits="userSpaceOnUse" x1="0" y1={REP_TOP} x2="0" y2={REP_BOTTOM}>
                    <stop offset="0%" stopColor={C.acid} />
                    <stop offset="100%" stopColor={C.base} />
                </linearGradient>
            </defs>
            <line x1={nodeX(0) - 30} x2={nodeX(EVENTS.length - 1) + 30} y1={NODE_Y} y2={NODE_Y} stroke="rgba(255,255,255,0.2)" strokeWidth={2} />
            {EVENTS.map((e, i) => {
                const active = current.includes(i);
                const done = i <= lastVisible;
                return (
                    <g key={e.year} style={{ opacity: done ? 1 : 0.35, transition: 'opacity 0.4s' }}>
                        <SvgText x={nodeX(i)} y={NODE_Y - 22} text={e.year} anchor="middle" size={active ? 22 : 18}
                            color={active ? '#fff' : '#CBD5E1'} weight={700} />
                        <circle cx={nodeX(i)} cy={NODE_Y} r={active ? 10 : 7} fill={done ? C.lactate : '#1F2937'}
                            stroke={active ? '#fff' : 'rgba(255,255,255,0.4)'} strokeWidth={2} />
                    </g>
                );
            })}
            <SvgText x={12} y={REP_TOP + 6} text="suspeito" size={16} color={C.acid} weight={700} />
            <SvgText x={12} y={REP_BOTTOM + 4} text="combustível" size={16} color={C.base} weight={700} />
            <SvgText x={12} y={REP_TOP - 22} text="reputação do lactato" size={16} color={C.muted} weight={500} />
            <line x1={NODE_X0 - 30} x2={W - 20} y1={REP_TOP} y2={REP_TOP} stroke={C.acid} strokeOpacity={0.2} strokeDasharray="4 6" />
            <line x1={NODE_X0 - 30} x2={W - 20} y1={REP_BOTTOM} y2={REP_BOTTOM} stroke={C.base} strokeOpacity={0.2} strokeDasharray="4 6" />
            <polyline points={points} fill="none" stroke="url(#lactic-rep)" strokeWidth={4} strokeLinejoin="round" strokeLinecap="round" />
            {visible.map((e, i) => (
                <circle key={e.year} cx={nodeX(i)} cy={repY(e.reputation)} r={6} fill={e.reputation > 0.6 ? C.acid : C.base} stroke="#04080F" strokeWidth={2} />
            ))}
        </svg>
    );
};

const EventCard = ({ event, order }: { event: TrialEvent; order: number }) => (
    <motion.div className="flex min-w-0 flex-1" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35, delay: order * 0.15 }}>
        <Panel className="flex w-full flex-col gap-2 px-5 py-4" state="active" glow={C.lactate}>
            <div className="flex items-baseline justify-between gap-3">
                <span className="font-display text-[2rem] font-semibold leading-none text-yellow-300">{event.year}</span>
                <Tag kind={event.kind}>{event.kindLabel}</Tag>
            </div>
            <span className="text-[15px] text-gray-300">{event.who}</span>
            <h3 className="font-display text-[1.3rem] font-semibold leading-tight text-white">{event.title}</h3>
            <p className="text-[16px] leading-snug text-gray-100">{event.text}</p>
        </Panel>
    </motion.div>
);

const LacticTimelineSim = () => {
    const { step, setStep } = useSlideSteps(TIMELINE_STEPS.length);
    const { events } = TIMELINE_STEPS[step];
    return (
        <SimShell tabs={TIMELINE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="lactic-tabs"
            chips={<Tag kind="ilustrativo">curva de reputação: leitura didática</Tag>}>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <Panel className="shrink-0"><Timeline step={step} /></Panel>
                <div key={step} className="flex min-h-0 flex-1 gap-3">
                    {events.map((idx, order) => <EventCard key={EVENTS[idx].year} event={EVENTS[idx]} order={order} />)}
                </div>
            </div>
        </SimShell>
    );
};

export default LacticTimelineSim;
