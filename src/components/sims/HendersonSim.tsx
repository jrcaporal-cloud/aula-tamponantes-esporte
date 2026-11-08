import { useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { br } from './kit/format';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { useTween } from './kit/useTween';
import { CO2_SOLUBILITY, HCO3_RANGE, HH_STEPS, PCO2_RANGE, phOf } from './ato2/henderson.content';
import { TitrationChart } from './ato2/TitrationChart';
import { BODY_H, SimShell, SourceLine, StepText, Tag } from './ato2/ui';
import { useStepOverride } from './ato2/useStepOverride';

/**
 * Slide 21 — "Henderson–Hasselbalch sem Medo". Passos 1–4: dois sliders (HCO₃⁻ e PCO₂) e a
 * equação se recalculando; as duas colunas mostram a razão e o termômetro mostra o pH.
 * Passo 5: curvas de tamponamento — cada tampão rende mais perto do próprio pKa.
 */

const LEFT_W = 660;
const SVG_H = 352;
const BAR_TOP = 46;
const BAR_BOTTOM = 290;
const PH_TOP = 7.6;
const PH_BOTTOM = 6.8;

const barY = (mmol: number) => BAR_BOTTOM - (mmol / HCO3_RANGE[1]) * (BAR_BOTTOM - BAR_TOP);
const thermoY = (ph: number) => BAR_TOP + ((PH_TOP - Math.min(Math.max(ph, PH_BOTTOM), PH_TOP)) / (PH_TOP - PH_BOTTOM)) * (BAR_BOTTOM - BAR_TOP);
const phColor = (ph: number) => (ph >= 7.35 ? C.base : ph >= 7.15 ? C.acidSoft : C.acid);

const Balance = ({ hco3, pco2 }: { hco3: number; pco2: number }) => {
    const co2 = CO2_SOLUBILITY * pco2;
    const ph = phOf(hco3, pco2);
    const thermoX = 566;
    return (
        <svg viewBox={`0 0 ${LEFT_W} ${SVG_H}`} width={LEFT_W} height={SVG_H} role="img" aria-label={`Razão ${br(hco3 / co2, 1)} para 1, pH ${br(ph, 2)}`}>
            <line x1={40} x2={360} y1={BAR_BOTTOM} y2={BAR_BOTTOM} stroke="rgba(255,255,255,0.3)" />
            {/* Mesma escala para os dois: o CO₂ dissolvido quase não aparece. */}
            <rect x={70} y={barY(hco3)} width={90} height={BAR_BOTTOM - barY(hco3)} rx={6} fill={C.base} fillOpacity={0.75} />
            <SvgText x={115} y={barY(hco3) - 12} text={br(hco3, 0)} anchor="middle" size={22} color={C.base} weight={700} />
            <SvgText x={115} y={BAR_BOTTOM + 26} text="HCO₃⁻" anchor="middle" size={18} color={C.base} weight={700} />
            <rect x={240} y={barY(co2)} width={90} height={Math.max(BAR_BOTTOM - barY(co2), 2)} rx={4} fill={C.co2} fillOpacity={0.85} />
            <SvgText x={285} y={barY(co2) - 12} text={br(co2, 2)} anchor="middle" size={22} color="#CBD5E1" weight={700} />
            <SvgText x={285} y={BAR_BOTTOM + 26} text="CO₂ dissolvido" anchor="middle" size={18} color="#CBD5E1" weight={700} />
            <SvgText x={285} y={BAR_BOTTOM + 50} text={`0,03 × ${br(pco2, 0)} mmHg`} anchor="middle" size={16} color={C.muted} weight={500} />
            <SvgText x={115} y={BAR_BOTTOM + 50} text="mmol/L" anchor="middle" size={16} color={C.muted} weight={500} />
            <SvgText x={432} y={210} text={`${br(hco3 / co2, 1)} : 1`} anchor="middle" size={30} color="#fff" weight={700} />
            <SvgText x={432} y={236} text="razão HCO₃⁻ / CO₂" anchor="middle" size={16} color={C.muted} weight={500} />

            {/* Termômetro de pH. */}
            <rect x={thermoX - 10} y={BAR_TOP} width={20} height={BAR_BOTTOM - BAR_TOP} rx={10} fill="rgba(255,255,255,0.08)" stroke="rgba(255,255,255,0.2)" />
            {[7.6, 7.4, 7.2, 7.0, 6.8].map(t => (
                <g key={t}>
                    <line x1={thermoX + 12} x2={thermoX + 22} y1={thermoY(t)} y2={thermoY(t)} stroke="rgba(255,255,255,0.4)" />
                    <SvgText x={thermoX + 28} y={thermoY(t) + 6} text={br(t, 1)} size={16} color="#CBD5E1" weight={500} />
                </g>
            ))}
            <rect x={thermoX - 10} y={thermoY(ph)} width={20} height={BAR_BOTTOM - thermoY(ph)} rx={10} fill={phColor(ph)} fillOpacity={0.85} />
            <line x1={thermoX - 70} x2={thermoX - 12} y1={thermoY(7.4)} y2={thermoY(7.4)} stroke={C.base} strokeDasharray="4 4" strokeOpacity={0.6} />
            <SvgText x={thermoX - 74} y={thermoY(7.4) + 5} text="repouso" anchor="end" size={16} color={C.baseSoft} weight={500} />
            <SvgText x={thermoX} y={BAR_TOP - 16} text={`pH ${br(ph, 2)}`} anchor="middle" size={24} color={phColor(ph)} weight={700} />
        </svg>
    );
};

const Equation = ({ hco3, pco2 }: { hco3: number; pco2: number }) => (
    <div className="flex flex-col gap-1 px-5 pt-4 font-mono text-[18px] text-gray-100">
        <span>pH = 6,1 + log ( <span className="text-cyan-300">[HCO₃⁻]</span> / (0,03 × <span className="text-slate-300">PCO₂</span>) )</span>
        <span className="text-[20px]">
            <strong style={{ color: phColor(phOf(hco3, pco2)) }}>{br(phOf(hco3, pco2), 2)}</strong>
            {' '}= 6,1 + log ( <span className="text-cyan-300">{br(hco3, 1)}</span> / {br(CO2_SOLUBILITY * pco2, 2)} )
        </span>
    </div>
);

interface SliderProps {
    label: string;
    unit: string;
    value: number;
    range: readonly [number, number];
    color: string;
    onChange: (v: number) => void;
}

const Slider = ({ label, unit, value, range, color, onChange }: SliderProps) => (
    <label className="flex flex-col gap-1 text-[15px] text-gray-200">
        <span className="flex justify-between"><span>{label}</span><span className="font-mono" style={{ color }}>{br(value, 1)} {unit}</span></span>
        <input type="range" min={range[0]} max={range[1]} step={0.1} value={value} aria-label={label}
            onChange={e => onChange(Number(e.target.value))} className="w-full" style={{ accentColor: color }} />
    </label>
);

const HendersonSim = () => {
    const { step, setStep } = useSlideSteps(HH_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = HH_STEPS[step];
    const [values, setValues] = useStepOverride(step, { hco3: plan.hco3, pco2: plan.pco2 });
    const hco3 = useTween(values.hco3, reduce);
    const pco2 = useTween(values.pco2, reduce);

    return (
        <SimShell tabs={HH_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="hh-tabs"
            chips={<Tag kind="cálculo">CÁLCULO · pKa 6,1</Tag>}>
            <Panel className="flex shrink-0 flex-col" glow={C.base}>
                <div style={{ width: LEFT_W, height: BODY_H }} className="flex flex-col justify-between">
                    {plan.curves ? <TitrationChart width={LEFT_W} height={BODY_H} reduce={reduce} /> : (
                        <>
                            <Equation hco3={hco3} pco2={pco2} />
                            <Balance hco3={hco3} pco2={pco2} />
                        </>
                    )}
                </div>
            </Panel>
            <Panel className="flex min-w-0 flex-1 flex-col gap-4 p-5">
                {!plan.curves && (
                    <div className="flex flex-col gap-2">
                        <Slider label="Bicarbonato (HCO₃⁻)" unit="mmol/L" value={values.hco3} range={HCO3_RANGE} color={C.base}
                            onChange={v => setValues({ ...values, hco3: v })} />
                        <Slider label="PCO₂" unit="mmHg" value={values.pco2} range={PCO2_RANGE} color={C.co2}
                            onChange={v => setValues({ ...values, pco2: v })} />
                    </div>
                )}
                <StepText step={step} headline={plan.headline} text={plan.text} accent={plan.curves ? C.carnoSoft : C.baseSoft}
                    footer={<SourceLine>{plan.source}</SourceLine>} />
                {plan.curves && (
                    <p className="mt-auto rounded-xl border border-amber-300/30 bg-amber-400/10 px-4 py-2.5 text-[15px] leading-snug text-amber-50">
                        As três curvas têm a mesma concentração: o desenho compara a <strong>forma</strong>, não quanto de cada tampão existe no músculo.
                    </p>
                )}
            </Panel>
        </SimShell>
    );
};

export default HendersonSim;
