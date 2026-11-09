import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel, StepTabs } from './kit/ui';
import { br, signed } from './kit/format';
import { BASAL, CITRATE_STEPS, CURVES, CURVE_COLOR, RACE_DEFAULT, SODIUM_70KG, THRESHOLD, hco3At } from './ato5/citrateContent';
import { CHART_H, CHART_W, CitrateChart } from './ato5/CitrateChart';
import { BigNumber, SIM_HEIGHT, SourceNote, StepFade, StepText, StepTitle, Tag } from './ato5/ui';

/**
 * Slide 70 · "Citrato: a mesma alcalose, outro relógio". Passos: mesma altura → outro relógio → a prova na janela
 * (mouse arrasta a prova) → a mesma pessoa em duas visitas → veredito.
 */

const Pair = ({ left, right }: { left: { v: string; l: string }; right: { v: string; l: string } }) => (
    <div className="grid grid-cols-2 gap-3">
        <BigNumber value={left.v} label={left.l} color={CURVE_COLOR.bic} />
        <BigNumber value={right.v} label={right.l} color={CURVE_COLOR.cit} />
    </div>
);

const RaceControl = ({ raceMin, onChange }: { raceMin: number; onChange: (v: number) => void }) => (
    <div className="flex flex-col gap-2">
        <label className="flex items-center justify-between text-[16px] text-gray-200">
            <span>Arraste a prova</span>
            <span className="font-mono" style={{ color: C.acid }}>{raceMin} min após a dose</span>
        </label>
        <input type="range" min={30} max={290} step={5} value={raceMin} onChange={e => onChange(Number(e.target.value))}
            className="w-full cursor-pointer" style={{ accentColor: C.acid }} aria-label="Minutos entre a dose e a prova" />
        <div className="grid grid-cols-2 gap-3">
            {CURVES.map(c => {
                const delta = hco3At(c, raceMin) - BASAL;
                const inWindow = delta >= THRESHOLD;
                return (
                    <div key={c.id} className="rounded-lg border px-3 py-1.5" style={{ borderColor: `${CURVE_COLOR[c.id]}66` }}>
                        <p className="text-[16px] text-gray-300">{c.label}</p>
                        <p className="font-mono text-[1.15rem] leading-tight" style={{ color: CURVE_COLOR[c.id] }}>{signed(delta, 1)} mmol/L</p>
                        <p className="text-[16px]" style={{ color: inWindow ? C.ok : C.muted }}>{inWindow ? 'na janela' : 'fora da janela'}</p>
                    </div>
                );
            })}
        </div>
    </div>
);

const StepWidget = ({ step, raceMin, onRace }: { step: number; raceMin: number; onRace: (v: number) => void }) => {
    if (step === 0) return <Pair left={{ v: br(33.6), l: 'mmol/L, bicarbonato' }} right={{ v: br(34.2), l: 'mmol/L, citrato (p = 0,308)' }} />;
    if (step === 1) return (
        <div className="flex flex-col gap-3">
            <Pair left={{ v: '2–3 h', l: 'janela ≥ +6 mmol/L' }} right={{ v: '3–4 h', l: 'janela ≥ +6 mmol/L' }} />
            <p className="text-[16px] leading-snug" style={{ color: C.risk }}>Pico GI: 35–50 min (bicarbonato) × 80–90 min (citrato), com número e gravidade iguais.</p>
        </div>
    );
    if (step === 2) return (
        <div className="flex flex-col gap-3">
            <RaceControl raceMin={raceMin} onChange={onRace} />
            <BigNumber value="0,0% (±1,3%)" label="citrato em 2011: 16 estudos (IC 90%)" color={C.text} />
        </div>
    );
    if (step === 3) return (
        <div className="grid grid-cols-2 gap-3">
            <BigNumber value="0,07" label="ICC do tempo até o pico (erro típico 49 min)" color={C.ok} />
            <BigNumber value="≥ 80%" label="de chance de passar +5 mmol/L entre 2 e 4 h" color={C.text} />
        </div>
    );
    return (
        <div className="flex flex-col gap-3">
            <BigNumber value="β = 0,10" label="bicarbonato > citrato; IC −0,02 a 0,22 (cruza o zero)" color={C.base} />
            <div className="grid grid-cols-2 gap-3">
                <BigNumber value={SODIUM_70KG.bic} label="de sódio: bicarbonato, 70 kg" color={C.sodium} />
                <BigNumber value={SODIUM_70KG.cit} label="de sódio: citrato, 70 kg" color={C.sodium} />
            </div>
        </div>
    );
};

const CitrateSim = () => {
    const { step, setStep } = useSlideSteps(CITRATE_STEPS.length);
    const [raceMin, setRaceMin] = useState(RACE_DEFAULT);
    const info = CITRATE_STEPS[step];

    return (
        <div className="not-prose w-full font-body text-white select-none flex flex-col gap-3" style={{ height: SIM_HEIGHT }}>
            <StepTabs labels={CITRATE_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato5-citrate-tab" />
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: `${CHART_W + 4}px minmax(0,1fr)` }}>
                <Panel className="flex items-center justify-center">
                    <div style={{ width: CHART_W, height: CHART_H }}>
                        <CitrateChart step={step} raceMin={raceMin} />
                    </div>
                </Panel>
                <Panel state="active" glow={step === 4 ? C.base : C.ok} className="p-4 flex flex-col gap-3">
                    <StepFade stepKey={step} className="flex flex-col gap-3">
                        <StepTitle>{info.title}</StepTitle>
                        <StepText>{info.text}</StepText>
                    </StepFade>
                    <StepWidget step={step} raceMin={raceMin} onRace={setRaceMin} />
                    <div className="mt-auto flex flex-col gap-2">
                        <SourceNote>{info.source}</SourceNote>
                        <Tag color={C.caveat}>forma das curvas ilustrativa</Tag>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default CitrateSim;
