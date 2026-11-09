import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { signed } from './kit/format';
import { NoisePlot } from './ato6/NoisePlot';
import { ttChange, tteChange } from './ato6/noiseModel';
import { GAIN_OPTIONS, NOISE_STEPS, type Evidence } from './ato6/testNoiseContent';
import { BigStat, IllustrativeChip, Narration, Segmented, SimFrame, Src } from './ato6/ui';

/**
 * "O Teste Decide o Tamanho do Efeito" (Ato VI). O mesmo ganho de potência medido por tempo até a
 * exaustão (carga fixa) e por contrarrelógio (trabalho fixo): % enorme com ruído enorme × % pequeno
 * com ruído pequeno. Curva ilustrativa; os números reais entram como cartões de evidência.
 */

const EvidenceTable = ({ rows }: { rows: readonly Evidence[] }) => (
    <div className="flex flex-col gap-1">
        <div className="grid grid-cols-[1fr_76px_118px] gap-2 text-[15px] text-gray-300 border-b border-white/10 pb-1">
            <span />
            <span className="text-right" style={{ color: C.lactate }}>TTE</span>
            <span className="text-right" style={{ color: C.ok }}>contrarrelógio</span>
        </div>
        {rows.map(r => (
            <div key={r.label} className="grid grid-cols-[1fr_76px_118px] gap-2 items-center">
                <span className="leading-tight">
                    <span className="block text-[16px] text-gray-100">{r.label}</span>
                    <span className="block text-[15px] text-gray-400">{r.note}</span>
                </span>
                <span className="text-right font-body text-[1.25rem] font-semibold tabular-nums" style={{ color: C.lactate }}>{r.tte}</span>
                <span className="text-right font-body text-[1.25rem] font-semibold tabular-nums" style={{ color: C.ok }}>{r.tt}</span>
            </div>
        ))}
    </div>
);

interface Override { step: number; gain: number }

const TestNoiseSim = () => {
    const { step, setStep } = useSlideSteps(NOISE_STEPS.length);
    const plan = NOISE_STEPS[step];
    const [override, setOverride] = useState<Override | null>(null);
    const gain = override?.step === step ? override.gain : 2;

    return (
        <SimFrame tabs={NOISE_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="ato6-noise-tab"
            chips={<IllustrativeChip text="curva ilustrativa · dados reais à direita" />}>
            <div className="h-full flex gap-3">
                <Panel className="shrink-0">
                    <NoisePlot gain={gain} showNoise={plan.showNoise} />
                </Panel>
                <Panel className="flex-1 min-w-0 p-4 flex flex-col gap-3">
                    <Narration stepKey={step} headline={plan.headline} text={plan.text} />
                    {plan.evidence.length === 0 ? (
                        <div className="flex gap-6 pt-1">
                            <BigStat value={`${signed(tteChange(gain), 0)}%`} label="tempo até a exaustão" color={C.lactate} />
                            <BigStat value={`${signed(ttChange(gain), 1)}%`} label="tempo no contrarrelógio" color={C.ok} />
                        </div>
                    ) : (
                        <EvidenceTable rows={plan.evidence} />
                    )}
                    <div className="mt-auto flex flex-col gap-2">
                        <Segmented label="ganho real" options={GAIN_OPTIONS} value={gain}
                            onChange={v => setOverride({ step, gain: v })} />
                        <Src>{plan.source}</Src>
                    </div>
                </Panel>
            </div>
        </SimFrame>
    );
};

export default TestNoiseSim;
