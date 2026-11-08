import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { br } from './kit/format';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { useTween } from './kit/useTween';
import { MARKS, MAX_DOTS, NM_PER_DOT, PH_MAX, PH_MIN, PH_STEPS, nanomolar } from './ato2/phScale.content';
import { BODY_H, SimShell, SourceLine, StepText, Tag } from './ato2/ui';
import { useStepOverride } from './ato2/useStepOverride';

/**
 * Slide 20 — "Uma Escala de Nanomols". Régua logarítmica viva: o ponteiro desce o pH e o campo
 * de cima ganha um ponto a cada 5 nmol/L de H⁺. O passador visita sangue, músculo parado,
 * músculo exausto e sangue após o 2.000 m; o slider deixa explorar qualquer pH.
 */

const W = 744;
const H = BODY_H;
const X0 = 44;
const X1 = 676;
const RULER_Y = 318;
const FIELD = { x: 24, y: 44, w: 696, h: 200 };
const DOUBLINGS = [40, 80, 160, 320] as const;

const xOfPh = (ph: number) => X0 + ((PH_MAX - ph) / (PH_MAX - PH_MIN)) * (X1 - X0);

/** Sequência de Halton: pontos espalhados sem sorteio (os que já estão não se mexem). */
const halton = (i: number, base: number) => {
    let f = 1;
    let r = 0;
    for (let n = i + 1; n > 0; n = Math.floor(n / base)) {
        f /= base;
        r += f * (n % base);
    }
    return r;
};
const DOTS = Array.from({ length: MAX_DOTS }, (_, i) => ({
    x: FIELD.x + 14 + halton(i, 2) * (FIELD.w - 28),
    y: FIELD.y + 34 + halton(i, 3) * (FIELD.h - 46),
}));

/** Cor do ponteiro: ciano no alcalino, laranja quando o H⁺ sobe. */
const phColor = (ph: number) => (ph >= 7.3 ? C.base : ph >= 6.9 ? C.acidSoft : C.acid);

const Ruler = ({ ph, step }: { ph: number; step: number }) => {
    const x = xOfPh(ph);
    const ticks = Array.from({ length: 13 }, (_, i) => PH_MAX - i * 0.1);
    return (
        <g>
            <line x1={X0} x2={X1} y1={RULER_Y} y2={RULER_Y} stroke="rgba(255,255,255,0.45)" strokeWidth={2} />
            {ticks.map((t, i) => (
                <g key={t.toFixed(1)}>
                    <line x1={xOfPh(t)} x2={xOfPh(t)} y1={RULER_Y - 6} y2={RULER_Y + 6} stroke="rgba(255,255,255,0.45)" />
                    {i % 2 === 0 && <SvgText x={xOfPh(t)} y={RULER_Y + 28} text={br(t, 1)} anchor="middle" size={16} color="#CBD5E1" />}
                </g>
            ))}
            <SvgText x={X1 + 26} y={RULER_Y + 6} text="pH" size={16} color={C.muted} />
            {/* Escala de cima: cada 0,3 de pH dobra o H⁺. */}
            {DOUBLINGS.map(nm => {
                const tx = xOfPh(9 - Math.log10(nm));
                return (
                    <g key={nm}>
                        <line x1={tx} x2={tx} y1={RULER_Y - 22} y2={RULER_Y - 8} stroke={C.acidSoft} strokeOpacity={0.7} />
                        <SvgText x={tx} y={RULER_Y - 30} text={`${nm}`} anchor="middle" size={16} color={C.acidSoft} />
                    </g>
                );
            })}
            <SvgText x={X0} y={RULER_Y - 54} text="nmol/L de H⁺ — dobra a cada 0,3 de pH" size={16} color={C.acidSoft} weight={500} />
            {MARKS.map((m, i) => {
                if (i > step) return null;
                const mx = xOfPh(m.ph);
                const row = m.where === 'sangue' ? 0 : 1;
                const color = m.where === 'sangue' ? C.base : C.acid;
                const y = RULER_Y + 62 + row * 36;
                return (
                    <g key={m.id} style={{ opacity: i === step ? 1 : 0.6, transition: 'opacity 0.4s' }}>
                        <line x1={mx} x2={mx} y1={RULER_Y + 8} y2={y - 16} stroke={color} strokeDasharray="3 4" />
                        <circle cx={mx} cy={RULER_Y} r={6} fill={color} />
                        <SvgText x={mx} y={y} text={`${m.label} ${br(m.ph, 2)}`} anchor="middle" size={16} color={color} />
                    </g>
                );
            })}
            {/* Ponteiro do pH atual. */}
            <g style={{ transform: `translateX(${x}px)` }}>
                <line x1={0} x2={0} y1={RULER_Y - 18} y2={RULER_Y + 10} stroke={phColor(ph)} strokeWidth={3} />
                <polygon points="-9,-30 9,-30 0,-18" transform={`translate(0 ${RULER_Y})`} fill={phColor(ph)} />
            </g>
        </g>
    );
};

const PhScaleSim = () => {
    const { step, setStep } = useSlideSteps(PH_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = PH_STEPS[step];
    const [target, setTarget, manual] = useStepOverride(step, plan.ph);
    const ph = useTween(target, reduce, 900);
    const nm = nanomolar(ph);
    const dots = Math.round(nm / NM_PER_DOT);
    const vsBlood = nm / nanomolar(MARKS[0].ph);

    return (
        <SimShell tabs={PH_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ph-scale-tabs"
            chips={<><Tag kind="humano">HUMANO · biópsia e sangue arterial</Tag><Tag kind="cálculo">[H⁺] = 10^(9 − pH)</Tag></>}>
            <Panel className="shrink-0" glow={C.acid}>
                <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`pH ${br(ph, 2)}: ${nm.toFixed(0)} nanomols de H⁺ por litro`}>
                    <rect x={FIELD.x} y={FIELD.y} width={FIELD.w} height={FIELD.h} rx={14} fill="rgba(251,146,60,0.05)" stroke="rgba(251,146,60,0.25)" />
                    <SvgText x={FIELD.x + 14} y={FIELD.y + 24} text={`1 litro · cada ponto = ${NM_PER_DOT} nmol de H⁺`} size={16} color={C.acidSoft} weight={500} />
                    <SvgText x={FIELD.x + FIELD.w - 14} y={FIELD.y + 24} text={`${dots} pontos`} anchor="end" size={16} color={C.acid} weight={700} />
                    {DOTS.map((d, i) => (
                        <circle key={i} cx={d.x} cy={d.y} r={6} fill={C.acid}
                            style={{ opacity: i < dots ? 0.9 : 0, transition: reduce ? 'none' : 'opacity 0.35s' }} />
                    ))}
                    <Ruler ph={ph} step={step} />
                </svg>
            </Panel>

            <Panel className="flex min-w-0 flex-1 flex-col gap-3 p-5">
                <div className="flex items-baseline justify-between">
                    <span className="font-display text-[2.6rem] font-semibold leading-none" style={{ color: phColor(ph) }}>pH {br(ph, 2)}</span>
                    <span className="font-mono text-[16px] text-gray-300">×{br(vsBlood, 1)} o sangue</span>
                </div>
                <div className="flex flex-col gap-1.5">
                    <span className="text-[16px] text-gray-200"><strong className="text-[1.5rem] font-semibold text-orange-300">{br(nm, 0)}</strong> nmol/L de H⁺</span>
                    {/* A mesma grandeza em escala linear: aqui a multiplicação aparece. */}
                    <div className="h-3 w-full overflow-hidden rounded-full bg-white/10">
                        <div className="h-full rounded-full" style={{ width: `${(nm / nanomolar(PH_MIN)) * 100}%`, background: C.acid }} />
                    </div>
                    <span className="text-[15px] text-gray-400">barra em escala linear (0 a 400 nmol/L)</span>
                </div>
                <label className="flex flex-col gap-1 text-[15px] text-gray-300">
                    <span>{manual ? 'pH escolhido no slider' : 'arraste para explorar o pH'}</span>
                    <input type="range" min={0} max={PH_MAX - PH_MIN} step={0.01} value={PH_MAX - target}
                        onChange={e => setTarget(Math.round((PH_MAX - Number(e.target.value)) * 100) / 100)}
                        className="w-full accent-orange-400" aria-label="pH" />
                </label>
                <StepText step={step} headline={plan.headline} text={plan.text} accent={phColor(plan.ph)}
                    footer={<SourceLine>{plan.source}</SourceLine>} />
            </Panel>
        </SimShell>
    );
};

export default PhScaleSim;
