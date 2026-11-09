import { motion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { Gavel } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { ACCOMPLICES, COURT_STEPS, DEFENSE, PROSECUTION, type Exhibit } from './ato2/court.content';
import { SimShell, SourceLine, StepText, Tag } from './ato2/ui';

/**
 * Slide 27 — "O H⁺ é Mesmo o Vilão?". Tribunal: provas de acusação à esquerda, de defesa à
 * direita, balança no centro. Uma prova da defesa é anulada (não se repetiu); o H⁺ depõe como
 * mensageiro; o veredito chama os co-réus. A inclinação da balança é leitura didática.
 */

const SW = 376;
/** Altura com folga: o rótulo do prato que desce (y ≈ 40 + 92 + 29) não pode encostar na borda. */
const SH = 178;
const PIVOT = { x: SW / 2, y: 40 };
const ARM = 140;
const TILT_TRANSITION = `transform ${DUR.bar}s cubic-bezier(${EASE_IN_OUT.join(', ')})`;

const Scale = ({ tilt }: { tilt: number }) => {
    const deg = tilt * 12;
    const drop = Math.sin((deg * Math.PI) / 180) * ARM;
    return (
        <svg viewBox={`0 0 ${SW} ${SH}`} width={SW} height={SH} role="img" aria-label="Balança entre acusação e defesa">
            <line x1={PIVOT.x} x2={PIVOT.x} y1={PIVOT.y} y2={SH - 14} stroke="#CBD5E1" strokeWidth={4} />
            <rect x={PIVOT.x - 50} y={SH - 16} width={100} height={8} rx={4} fill="#CBD5E1" />
            <g style={{ transform: `rotate(${deg}deg)`, transformOrigin: `${PIVOT.x}px ${PIVOT.y}px`, transition: TILT_TRANSITION }}>
                <line x1={PIVOT.x - ARM} x2={PIVOT.x + ARM} y1={PIVOT.y} y2={PIVOT.y} stroke="#E5E7EB" strokeWidth={5} strokeLinecap="round" />
            </g>
            <circle cx={PIVOT.x} cy={PIVOT.y} r={8} fill="#E5E7EB" />
            {[{ side: -1, color: C.acid, label: 'acusação' }, { side: 1, color: C.base, label: 'defesa' }].map(p => (
                <g key={p.label} style={{ transform: `translateY(${p.side * drop}px)`, transition: TILT_TRANSITION }}>
                    <line x1={PIVOT.x + p.side * ARM} x2={PIVOT.x + p.side * ARM} y1={PIVOT.y} y2={PIVOT.y + 34} stroke={p.color} strokeWidth={2} />
                    <path d={`M${PIVOT.x + p.side * ARM - 44} ${PIVOT.y + 34} Q${PIVOT.x + p.side * ARM} ${PIVOT.y + 70} ${PIVOT.x + p.side * ARM + 44} ${PIVOT.y + 34} Z`}
                        fill={`${p.color}33`} stroke={p.color} strokeWidth={2} />
                    <SvgText x={PIVOT.x + p.side * ARM} y={PIVOT.y + 92} text={p.label} anchor="middle" size={16} color={p.color} weight={700} />
                </g>
            ))}
        </svg>
    );
};

const ExhibitCard = ({ ex, step, color }: { ex: Exhibit; step: number; color: string }) => {
    const entered = step >= ex.step;
    const voided = ex.void === true && entered;
    return (
        <motion.div className="relative min-h-0 flex-1" animate={{ opacity: entered ? 1 : 0, x: entered ? 0 : 12 }} transition={{ duration: 0.4, ease: EASE_OUT }}>
            <Panel state={ex.step === step ? 'active' : 'idle'} glow={voided ? C.risk : color} className="h-full">
                <div className="flex h-full flex-col justify-center gap-1 px-3.5 py-2" style={{ opacity: voided ? 0.6 : 1 }}>
                    <div className="flex items-center justify-between gap-2">
                        <span className="whitespace-nowrap text-[15px] font-semibold" style={{ color }}>{ex.who}</span>
                        {voided ? (
                            <span className="-rotate-3 whitespace-nowrap rounded-md border-2 px-2 py-0.5 font-mono text-[15px] font-bold"
                                style={{ borderColor: C.risk, color: C.risk }}>NÃO SE REPETIU</span>
                        ) : <Tag kind={ex.kind}>{ex.kindLabel}</Tag>}
                    </div>
                    <span className="text-[15px] leading-snug text-gray-100" style={{ textDecoration: voided ? 'line-through' : 'none' }}>{ex.finding}</span>
                </div>
            </Panel>
        </motion.div>
    );
};

const Column = ({ title, items, step, color }: { title: string; items: readonly Exhibit[]; step: number; color: string }) => (
    <div className="flex w-[350px] shrink-0 flex-col gap-2">
        <span className="font-mono text-[15px] font-bold uppercase tracking-wide" style={{ color }}>{title}</span>
        {items.map(ex => <ExhibitCard key={ex.id} ex={ex} step={step} color={color} />)}
    </div>
);

const CenterExtra = ({ step }: { step: number }) => {
    if (step === 3) return (
        <div className="flex flex-col gap-1.5">
            <div className="flex items-center gap-2 text-[15px]">
                {['pH 7,2', 'ATP 500 nM', 'lactato 10 mM'].map((m, i) => (
                    <span key={m} className="flex items-center gap-2">
                        {i > 0 && <span className="text-gray-400">+</span>}
                        <span className="rounded-full border border-orange-300/60 px-2.5 py-0.5 text-orange-200">{m}</span>
                    </span>
                ))}
            </div>
            <SourceLine>Pollak 2014 (humano, n = 10). Receptores ASIC3, P2X e TRPV1: Light 2008 (camundongo).</SourceLine>
        </div>
    );
    if (step === 4) return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-1.5">
                <span className="text-[15px] text-gray-300">co-réus:</span>
                {ACCOMPLICES.map(a => <span key={a} className="rounded-full border border-white/20 px-2.5 py-0.5 text-[15px] text-gray-100">{a}</span>)}
            </div>
            <SourceLine>Cairns 2006 (revisão); Allen 2008 (revisão, base animal).</SourceLine>
        </div>
    );
    return null;
};

const FatigueCourtSim = () => {
    const { step, setStep } = useSlideSteps(COURT_STEPS.length);
    const plan = COURT_STEPS[step];
    const verdict = step === COURT_STEPS.length - 1;
    return (
        <SimShell tabs={COURT_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="court-tabs"
            chips={<Tag kind="ilustrativo">balança: leitura didática</Tag>}>
            <Column title="Acusação" items={PROSECUTION} step={step} color={C.acid} />
            <Panel className="flex min-w-0 flex-1 flex-col items-center gap-2 px-4 py-3" state={verdict ? 'active' : 'idle'} glow={C.stone}>
                <Scale tilt={plan.tilt} />
                {verdict && (
                    <motion.div className="flex items-center gap-2 rounded-lg border-2 px-3 py-1 font-body text-[1.35rem] font-semibold"
                        style={{ borderColor: C.stone, color: C.stone }} initial={{ scale: 1.4, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ duration: 0.35, ease: EASE_OUT }}>
                        <Gavel size={22} aria-hidden /> cúmplice, não chefe
                    </motion.div>
                )}
                <StepText step={step} headline={verdict ? 'O veredito' : plan.headline} text={plan.text} accent={verdict ? C.stone : '#fff'} className="w-full" />
                <div className="mt-auto w-full"><CenterExtra step={step} /></div>
            </Panel>
            <Column title="Defesa" items={DEFENSE} step={step} color={C.base} />
        </SimShell>
    );
};

export default FatigueCourtSim;
