import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../lib/motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel, StepTabs } from './kit/ui';
import { BALL_ROWS, GREENHAFF_BARS, LESSONS, LOWCARB_STEPS, type DesignCell } from './ato5/lowCarbContent';
import { BOARD_H, BOARD_W, CaseBoard } from './ato5/CaseBoard';
import { SIM_HEIGHT, SourceNote, StepFade, StepText, StepTitle } from './ato5/ui';

/**
 * Slide 72 · "A dieta que acidificava", contado como caso de detetive.
 * Passos: a cena (1988) → o suspeito (pH) → o teste (1996, bicarbonato × CaCO₃) → o resultado → o culpado e a lição.
 */

const MAX_S = 240;

const Bars = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex flex-col gap-2.5">
            <p className="text-[16px] text-gray-300">Tempo até a exaustão a 100% do VO₂máx (s)</p>
            {GREENHAFF_BARS.map((b, i) => (
                <div key={b.label} className="grid items-center gap-3" style={{ gridTemplateColumns: '190px minmax(0,1fr)' }}>
                    <span className="text-[16px] text-gray-100">{b.label}</span>
                    <div className="relative h-[30px] rounded-md bg-white/[0.05]">
                        <motion.div className="absolute inset-y-0 left-0 rounded-md flex items-center justify-end pr-2"
                            // Ardósia cheia (sem transparência): o número escuro por cima passa de 4,3:1 para ~7,7:1.
                            style={{ background: b.hot ? C.acid : C.co2, width: `${(b.seconds / MAX_S) * 100}%` }}
                            initial={reduce ? false : { clipPath: 'inset(0 100% 0 0 round 6px)' }} animate={{ clipPath: 'inset(0 0% 0 0 round 6px)' }}
                            transition={{ duration: DUR.bar, delay: stagger(i, 0, 0.15), ease: EASE_OUT }}>
                            <span className="font-mono text-[16px] font-semibold text-[#04080F]">{b.seconds}</span>
                        </motion.div>
                    </div>
                </div>
            ))}
        </div>
    );
};

const TONE: Record<DesignCell['tone'], { color: string; bg: string }> = {
    neutral: { color: C.text, bg: 'rgba(255,255,255,0.05)' },
    acid: { color: C.acid, bg: `${C.acid}1f` },
    fixed: { color: C.risk, bg: `${C.risk}1f` },
    unknown: { color: C.muted, bg: 'rgba(255,255,255,0.03)' },
};

const Cell = ({ cell }: { cell: DesignCell }) => (
    <div className="rounded-lg px-3 py-2 text-[16px] leading-snug font-semibold flex items-center min-h-[52px]"
        style={{ color: TONE[cell.tone].color, background: TONE[cell.tone].bg }}>{cell.text}</div>
);

const DesignTable = ({ showResult }: { showResult: boolean }) => (
    <div className="grid gap-2" style={{ gridTemplateColumns: '130px minmax(0,1fr) minmax(0,1fr)' }}>
        <span />
        <span className="text-[16px] text-gray-300">CaCO₃ (placebo)</span>
        <span className="text-[16px]" style={{ color: C.base }}>NaHCO₃</span>
        {BALL_ROWS.map(r => (
            <div key={r.diet} className="contents">
                <span className="text-[16px] text-gray-100 self-center">{r.diet}</span>
                <Cell cell={r.placebo} />
                <Cell cell={showResult ? r.bicarb : { text: '?', tone: 'unknown' }} />
            </div>
        ))}
    </div>
);

const Lessons = () => (
    <ol className="flex flex-col gap-2.5">
        {LESSONS.map((l, i) => (
            <li key={l} className="flex gap-3 text-[1.05rem] leading-snug text-gray-100">
                <span className="font-mono text-[16px] pt-0.5" style={{ color: C.risk }}>{i + 1}</span>
                <span>{l}</span>
            </li>
        ))}
    </ol>
);

const LowCarbSim = () => {
    const { step, setStep } = useSlideSteps(LOWCARB_STEPS.length);
    const info = LOWCARB_STEPS[step];

    return (
        <div className="not-prose w-full font-body text-white select-none flex flex-col gap-3" style={{ height: SIM_HEIGHT }}>
            <StepTabs labels={LOWCARB_STEPS.map(s => `${s.year} · ${s.tab}`)} step={step} onSelect={setStep} layoutId="ato5-lowcarb-tab" />
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: `${BOARD_W + 4}px minmax(0,1fr)` }}>
                <Panel className="flex items-center justify-center">
                    <div style={{ width: BOARD_W, height: BOARD_H }}>
                        <CaseBoard step={step} />
                    </div>
                </Panel>
                <Panel state="active" glow={step >= 3 ? C.risk : C.acid} className="p-5 flex flex-col gap-4">
                    <StepFade stepKey={step} className="flex flex-col gap-2">
                        <span className="font-mono text-[16px]" style={{ color: C.lactate }}>autos · {info.year}</span>
                        <StepTitle>{info.title}</StepTitle>
                        <StepText>{info.text}</StepText>
                    </StepFade>
                    {step <= 1 && <Bars />}
                    {(step === 2 || step === 3) && <DesignTable showResult={step === 3} />}
                    {step === 4 && <Lessons />}
                    <div className="mt-auto">
                        <SourceNote>{info.source}</SourceNote>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default LowCarbSim;
