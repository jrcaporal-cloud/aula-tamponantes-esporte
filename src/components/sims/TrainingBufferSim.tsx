import { motion } from 'framer-motion';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { br, signed } from './kit/format';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { BUFFER_ROWS, MEDBO, TRAINING_STEPS } from './ato2/training.content';
import { BODY_H, SimShell, SourceLine, StepText, Tag } from './ato2/ui';

/**
 * Slide 30 — "O Treino, o Primeiro Tampão". Barras de variação do βm entrando passo a passo:
 * sprint, intervalado × contínuo, treinados, e o treino que passa do ponto. No último passo,
 * o pH sanguíneo mínimo de velocistas × fundistas. Só a variação % é comparável entre estudos.
 */

const W = 700;
const H = BODY_H;
const LABEL_W = 300;
const X0 = LABEL_W;
const X1 = W - 70;
const DOMAIN = [-15, 40] as const;
const TOP = 50;
const ROW_H = 68;
const sx = (v: number) => X0 + ((v - DOMAIN[0]) / (DOMAIN[1] - DOMAIN[0])) * (X1 - X0);

const BarChart = ({ step }: { step: number }) => {
    const axisY = TOP + ROW_H * BUFFER_ROWS.length + 6;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="Variação da capacidade tamponante muscular com o treino">
            <SvgText x={20} y={32} text="variação do βm (capacidade tamponante do músculo)" size={16} color={C.muted} weight={500} />
            {[-10, 0, 10, 20, 30, 40].map(t => (
                <g key={t}>
                    <line x1={sx(t)} x2={sx(t)} y1={TOP - 6} y2={axisY} stroke={t === 0 ? 'rgba(255,255,255,0.5)' : 'rgba(255,255,255,0.07)'} strokeDasharray={t === 0 ? '5 5' : undefined} />
                    <SvgText x={sx(t)} y={axisY + 24} text={`${t > 0 ? '+' : ''}${t}%`} anchor="middle" size={16} color="#CBD5E1" weight={500} />
                </g>
            ))}
            {BUFFER_ROWS.map((r, i) => {
                const cy = TOP + ROW_H * i + ROW_H / 2;
                const shown = step >= r.step;
                const current = r.step === step;
                const neg = r.pct < 0;
                const color = neg ? C.risk : r.pct < 5 ? C.co2 : C.base;
                const x = Math.min(sx(0), sx(r.pct));
                const w = Math.abs(sx(r.pct) - sx(0));
                return (
                    <g key={r.id} style={{ opacity: shown ? (current ? 1 : 0.55) : 0, transition: 'opacity 0.5s' }}>
                        <SvgText x={20} y={cy - 4} text={r.label} size={18} color="#fff" weight={700} />
                        <SvgText x={20} y={cy + 20} text={r.sub} size={16} color={C.muted} weight={500} />
                        <motion.rect x={x} y={cy - 14} width={w} height={28} rx={6} fill={color} fillOpacity={0.85}
                            style={{ transformBox: 'fill-box', originX: neg ? 1 : 0 }}
                            initial={false} animate={{ scaleX: shown ? 1 : 0 }} transition={{ duration: 0.7, ease: EASE_OUT }} />
                        <SvgText x={neg ? x - 8 : x + w + 8} y={cy + 7} text={`${signed(r.pct)}%`} anchor={neg ? 'end' : 'start'} size={20} color={color} weight={700} />
                    </g>
                );
            })}
        </svg>
    );
};

const MedboGauge = () => {
    const sxp = (ph: number) => ((7.4 - ph) / 0.4) * 100;
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[15px] text-gray-300">pH sanguíneo mínimo (escala 7,40 → 7,00)</span>
            {MEDBO.map((m, i) => (
                <div key={m.id} className="flex items-center gap-3 text-[15px]">
                    <span className="w-[84px] shrink-0 text-gray-100">{m.label}</span>
                    <div className="relative h-4 flex-1 rounded-full bg-gradient-to-r from-cyan-400/40 to-orange-400/60 [container-type:inline-size]">
                        {/* marcador anda em unidades da trilha (cqw): invólucro de largura zero, nada vaza para os lados */}
                        <motion.div className="pointer-events-none absolute inset-y-0 left-0 w-0"
                            initial={{ x: '0cqw' }} animate={{ x: `${sxp(m.ph)}cqw` }} transition={{ duration: 0.8, delay: i * 0.2, ease: EASE_IN_OUT }}>
                            <span className="absolute left-0 top-1/2 h-6 w-1.5 -translate-y-1/2 rounded bg-white" />
                        </motion.div>
                    </div>
                    <span className="w-[56px] shrink-0 text-right font-mono text-white">{br(m.ph, 3)}</span>
                </div>
            ))}
            <SourceLine>Lactato de pico 12,5 × 16,7 mmol/L; tamponamento do sangue igual. Medbø 1985 (humano, 6 + 6).</SourceLine>
        </div>
    );
};

const TrainingBufferSim = () => {
    const { step, setStep } = useSlideSteps(TRAINING_STEPS.length);
    const plan = TRAINING_STEPS[step];
    const rows = BUFFER_ROWS.filter((r, i, all) => r.step === step && all.findIndex(o => o.kindLabel === r.kindLabel && o.step === step) === i);
    return (
        <SimShell tabs={TRAINING_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="training-tabs"
            chips={<><Tag kind="humano">HUMANO</Tag><Tag kind="ilustrativo">unidades diferentes: compare a direção</Tag></>}>
            <Panel className="shrink-0" glow={C.base}><BarChart step={step} /></Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-3 p-5" state={step === 3 ? 'active' : 'idle'} glow={C.risk}>
                <StepText step={step} headline={plan.headline} text={plan.text} accent={step === 3 ? C.risk : C.baseSoft} />
                <motion.div key={step} className="mt-auto flex flex-col gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: DUR.text, ease: EASE_OUT }}>
                    {step === 4 ? <MedboGauge /> : (
                        <>
                            <div className="flex flex-wrap gap-1.5">{rows.map(r => <Tag key={r.id} kind={r.kind}>{`HUMANO · ${r.kindLabel}`}</Tag>)}</div>
                            {step === 3 && <SourceLine>Destreino: McGinley 2016 (humano, n = 16) — o βm in vitro nem tinha mudado; os transportadores sim.</SourceLine>}
                        </>
                    )}
                </motion.div>
            </Panel>
        </SimShell>
    );
};

export default TrainingBufferSim;
