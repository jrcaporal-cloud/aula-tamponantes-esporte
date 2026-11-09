import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../lib/motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { DENNIG_STEPS, RESERVE, type NoteLine } from './ato2/dennig.content';
import { BODY_H, SimShell, StepText, Tag } from './ato2/ui';

/**
 * Slide 23 — "O Homem que se Acidificou de Propósito". Uma página de caderno de laboratório se
 * escreve a cada passo (reconstituição; dados de Dennig et al. 1931). À direita, o dado do dia:
 * o sujeito, a corrida encurtada, a reserva alcalina e a hipótese que ficou para depois.
 */

const INK = '#1E2A5A';
const RED_INK = '#B42318';
const LINE = 33;
const HAND = { fontFamily: 'Georgia, "Times New Roman", serif', fontStyle: 'italic' } as const;

const Line = ({ line, delay, reduce }: { line: NoteLine; delay: number; reduce: boolean }) => (
    <motion.div className="whitespace-nowrap text-[18px]" style={{
        ...HAND, height: LINE, lineHeight: `${LINE}px`,
        color: line.ink === 'red' ? RED_INK : INK,
        textDecoration: line.ink === 'underline' ? 'underline' : 'none',
        textDecorationColor: RED_INK,
    }}
        initial={reduce ? false : { clipPath: 'inset(0 100% 0 0)' }} animate={{ clipPath: 'inset(0 0% 0 0)' }}
        transition={{ duration: 0.45, delay, ease: 'linear' }}>
        {line.text}
    </motion.div>
);

const Notebook = ({ step, reduce }: { step: number; reduce: boolean }) => (
    <div className="relative shrink-0 overflow-hidden rounded-2xl" style={{
        width: 650, height: BODY_H, background: '#F1E8D0',
        backgroundImage: `repeating-linear-gradient(to bottom, transparent 0 ${LINE - 1}px, rgba(30,42,90,0.16) ${LINE - 1}px ${LINE}px)`,
        backgroundPosition: '0 14px', boxShadow: 'inset 0 0 40px rgba(120,90,40,0.25)',
    }}>
        <div className="absolute bottom-0 top-0 w-[2px]" style={{ left: 104, background: 'rgba(180,35,24,0.45)' }} />
        <div className="relative flex flex-col pl-[118px] pr-4 pt-[14px]">
            <div className="whitespace-nowrap text-[18px] font-semibold" style={{ ...HAND, fontStyle: 'normal', color: INK, height: LINE, lineHeight: `${LINE}px` }}>
                Harvard Fatigue Laboratory · sujeito H. D.
            </div>
            {DENNIG_STEPS.slice(0, step + 1).map((s, si) => (
                <div key={s.tab} className="relative">
                    <span className="absolute text-[16px]" style={{ ...HAND, color: RED_INK, left: -110, width: 98, textAlign: 'right', lineHeight: `${LINE}px` }}>
                        {s.date}
                    </span>
                    {s.lines.map((l, li) => (
                        <Line key={l.text} line={l} reduce={reduce} delay={si === step ? 0.1 + li * 0.32 : 0} />
                    ))}
                </div>
            ))}
        </div>
    </div>
);

const Bar = ({ label, value, max, color, text }: { label: string; value: number; max: number; color: string; text: string }) => (
    <div className="flex items-center gap-3 text-[16px]">
        <span className="w-[104px] shrink-0 text-gray-200">{label}</span>
        <div className="h-5 flex-1 overflow-hidden rounded bg-white/10">
            <motion.div className="h-full rounded" style={{ background: color, width: `${(value / max) * 100}%`, originX: 0 }}
                initial={{ scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, ease: EASE_OUT }} />
        </div>
        <span className="w-[72px] shrink-0 text-right font-mono text-white">{text}</span>
    </div>
);

const TONE = { acid: C.acid, neutral: C.co2, base: C.base } as const;

const StepVisual = ({ step }: { step: number }) => {
    if (step === 0) return (
        <div className="flex items-baseline gap-4">
            <span className="font-display text-[4.2rem] font-semibold leading-none text-white">n = 1</span>
            <span className="text-[16px] leading-snug text-gray-300">sem placebo, sem cegamento, sem atleta</span>
        </div>
    );
    if (step === 1) return (
        <div className="flex flex-col gap-2">
            <span className="text-[15px] text-gray-300">duração da corrida até a exaustão</span>
            <Bar label="outros dias" value={20} max={20} color={C.co2} text="18–20 min" />
            <Bar label="em acidose" value={15} max={20} color={C.acid} text="15 min" />
        </div>
    );
    if (step === 2) return (
        <div className="flex flex-col gap-1.5">
            <span className="text-[15px] text-gray-300">reserva para neutralizar ácido (normal = 100)</span>
            {RESERVE.map(r => <Bar key={r.id} label={r.label} value={r.value} max={130} color={TONE[r.tone]} text={`${r.value}`} />)}
        </div>
    );
    return (
        <div className="flex items-center gap-2 text-[16px]">
            {[['1931', 'n = 1'], ['1977', '5 homens'], ['2022', '189 estudos']].map(([y, n], i) => (
                <div key={y} className="flex items-center gap-2">
                    {i > 0 && <span className="text-gray-400">→</span>}
                    <div className="rounded-xl border border-white/15 px-3 py-2 text-center">
                        <div className="font-body text-[1.3rem] font-semibold text-yellow-300">{y}</div>
                        <div className="text-gray-200">{n}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const DennigSim = () => {
    const { step, setStep } = useSlideSteps(DENNIG_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = DENNIG_STEPS[step];
    return (
        <SimShell tabs={DENNIG_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="dennig-tabs"
            chips={<><Tag kind="humano">HUMANO · n = 1</Tag><Tag kind="ilustrativo">página reconstituída · dados do artigo</Tag></>}>
            <Notebook step={step} reduce={reduce} />
            <Panel className="flex min-w-0 flex-1 flex-col justify-between gap-4 p-5" glow={step === 2 ? C.risk : C.base} state={step === 2 ? 'active' : 'idle'}>
                <StepText step={step} headline={plan.headline} text={plan.text} accent={step === 2 ? C.risk : C.baseSoft} />
                <motion.div key={step} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.text, ease: EASE_OUT }}>
                    <StepVisual step={step} />
                </motion.div>
                <p className="text-[15px] leading-snug text-gray-300">
                    Dennig H, Talbott JH, Edwards HT, Dill DB. J Clin Invest 1931 — texto completo.{step === 3 ? ' 1977: Jones (Ato III). 2022: de Oliveira, meta-análise.' : ''}
                </p>
            </Panel>
        </SimShell>
    );
};

export default DennigSim;
