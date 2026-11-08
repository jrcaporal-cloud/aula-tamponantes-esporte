import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { DEFENSE_STEPS, LINES } from './ato2/defense.content';
import { SimShell, StepText, Tag } from './ato2/ui';

/**
 * Slide 26 — "As Quatro Linhas de Defesa". Um corte da fibra ao pulmão: cada passo acende uma
 * linha e o H⁺ avança por ela (tampão → porta → bicarbonato → CO₂ soprado). O último passo
 * mostra as quatro juntas e onde cada suplemento atua. O modelo 3D da fibra é de outro módulo.
 */

const W = 1136;
const H = 236;
const COLS = [
    { x: 12, w: 404 }, { x: 430, w: 150 }, { x: 594, w: 300 }, { x: 908, w: 216 },
] as const;
const COL_COLOR = [C.carno, C.lactate, C.base, C.co2] as const;
const H_ROUTE = 'M220 186 L505 150 L760 150';
const CO2_ROUTE = 'M760 150 L1016 150 L1016 106';

const Pill = ({ x, y, text, color }: { x: number; y: number; text: string; color: string }) => (
    <g>
        <rect x={x} y={y - 22} width={text.length * 10.6 + 26} height={32} rx={16} fill={`${color}1f`} stroke={`${color}99`} />
        <SvgText x={x + 13} y={y} text={text} size={16} color="#F3F4F6" weight={600} />
    </g>
);

const Scene = ({ step, reduce }: { step: number; reduce: boolean }) => {
    const all = step === DEFENSE_STEPS.length - 1;
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img" aria-label="Quatro linhas de defesa contra o H⁺, da fibra ao pulmão">
            {LINES.map((line, i) => {
                const col = COLS[i];
                const color = COL_COLOR[i];
                const lit = all || i === step;
                const seen = all || i <= step;
                return (
                    <g key={line.id} style={{ opacity: seen ? 1 : 0.28, transition: 'opacity 0.5s' }}>
                        <rect x={col.x} y={12} width={col.w} height={H - 24} rx={18} fill={`${color}${lit ? '1a' : '0a'}`}
                            stroke={color} strokeOpacity={lit ? 0.9 : 0.3} strokeWidth={lit ? 2.5 : 1.5} />
                        <SvgText x={col.x + 16} y={40} text={`${i + 1}ª · ${line.title}`} size={18} color={color} weight={700} />
                        {line.items.map((item, k) => {
                            if (i === 0) return <Pill key={item} x={col.x + 16 + (k % 2) * 262} y={84 + Math.floor(k / 2) * 44} text={item} color={color} />;
                            if (i === 1) return <Pill key={item} x={col.x + 14} y={88 + k * 44} text={item} color={color} />;
                            return <Pill key={item} x={col.x + 16} y={84 + k * 44} text={item} color={color} />;
                        })}
                    </g>
                );
            })}
            <SvgText x={COLS[2].x + 16} y={200} text="H⁺ + HCO₃⁻ → CO₂ + H₂O" size={17} color={C.baseSoft} weight={600} />
            {/* H⁺ preso aos tampões da fibra (pontos laranja com anel ciano). */}
            {[[60, 184], [120, 198], [320, 188], [372, 200]].map(([x, y]) => (
                <g key={`${x}`}><circle cx={x} cy={y} r={8} fill={C.acid} /><circle cx={x} cy={y} r={13} fill="none" stroke={C.carno} strokeWidth={2} /></g>
            ))}
            <path d={H_ROUTE} fill="none" stroke={C.acid} strokeOpacity={step >= 1 || all ? 0.35 : 0} strokeDasharray="6 8" strokeWidth={2.5} />
            <path d={CO2_ROUTE} fill="none" stroke={C.co2} strokeOpacity={step >= 3 || all ? 0.45 : 0} strokeDasharray="6 8" strokeWidth={2.5} />
            {!reduce && (step >= 1 || all) && [0, 1, 2].map(k => (
                <circle key={`h${k}`} r={8} fill={C.acid}>
                    <animateMotion dur="3s" begin={`-${k}s`} repeatCount="indefinite" path={H_ROUTE} />
                </circle>
            ))}
            {!reduce && (step >= 3 || all) && [0, 1, 2].map(k => (
                <circle key={`c${k}`} r={8} fill={C.co2}>
                    <animateMotion dur="3s" begin={`-${k}s`} repeatCount="indefinite" path={CO2_ROUTE} />
                </circle>
            ))}
            {all && (
                <g>
                    <SvgText x={COLS[0].x + COLS[0].w - 16} y={40} text="β-alanina ↑" anchor="end" size={17} color={C.carnoSoft} weight={700} />
                    <SvgText x={COLS[2].x + COLS[2].w - 16} y={40} text="bicarbonato ↑" anchor="end" size={17} color={C.baseSoft} weight={700} />
                </g>
            )}
        </svg>
    );
};

const DefenseLinesSim = () => {
    const { step, setStep } = useSlideSteps(DEFENSE_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = DEFENSE_STEPS[step];
    return (
        <SimShell tabs={DEFENSE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="defense-tabs"
            chips={<Tag kind="ilustrativo">esquema · sem proporções</Tag>}>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <Panel className="shrink-0"><Scene step={step} reduce={reduce} /></Panel>
                <div className="flex min-h-0 flex-1 gap-3">
                    <Panel className="min-w-0 flex-1 px-5 py-4">
                        <StepText step={step} headline={plan.headline} text={plan.text} accent={step === DEFENSE_STEPS.length - 1 ? '#fff' : COL_COLOR[step]} />
                    </Panel>
                    <Panel className="w-[470px] shrink-0 px-5 py-4">
                        <motion.ul key={step} className="flex flex-col gap-3" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3, delay: 0.15 }}>
                            {plan.facts.map(f => (
                                <li key={f.text} className="text-[16px] leading-snug text-gray-100">
                                    {f.text}{' '}
                                    {f.kind && <Tag kind={f.kind}>{`${f.kind.toUpperCase()} · ${f.label ?? ''}`}</Tag>}
                                </li>
                            ))}
                        </motion.ul>
                    </Panel>
                </div>
            </div>
        </SimShell>
    );
};

export default DefenseLinesSim;
