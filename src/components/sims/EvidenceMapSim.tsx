import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { BODY_FONT, C } from './kit/palette';
import { Panel, StepTabs } from './kit/ui';
import { CACO3_REVEALED, EVIDENCE_STEPS, WITNESSES, type Witness } from './ato5/evidenceContent';
import { EvidenceMap, MAP_H, MAP_W } from './ato5/EvidenceMap';
import { SIM_HEIGHT, SourceNote, StepFade, Tag } from './ato5/ui';

/**
 * Slide 71 · "O banco das testemunhas fracas". Cada passo chama um grupo de fichas ao mapa
 * (fortes → sangue → músculo → prateleira); no último, o carbonato de cálcio se revela o placebo dos ensaios.
 * Clicar numa ficha abre o porquê no painel da direita.
 */

interface Detail {
    label: string;
    color: string;
    verdict: string;
    lines: readonly string[];
    source: string;
    alert?: Witness['alert'];
}

const detailOf = (w: Witness, revealed: boolean): Detail =>
    w.id === 'caco3' && revealed
        ? { label: 'Carbonato de cálcio', color: C.risk, ...CACO3_REVEALED }
        : { label: w.id === 'caco3' ? 'Carbonato de cálcio' : w.label, color: w.color, verdict: w.verdict, lines: w.lines, source: w.source, alert: w.alert };

const DetailCard = ({ d }: { d: Detail }) => (
    <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1.5">
            <h3 className="font-body text-[1.55rem] font-semibold leading-tight text-balance" style={{ ...BODY_FONT, color: d.color }}>{d.label}</h3>
            <Tag color={d.color}>{d.verdict}</Tag>
        </div>
        {d.alert && (
            <div className="rounded-lg border-2 px-3 py-2" style={{ borderColor: C.risk, background: `${C.risk}14` }}>
                <p className="font-body text-[1.45rem] font-semibold" style={{ color: C.risk }}>⚠ {d.alert.value}</p>
                <p className="text-[16px] leading-snug text-gray-100">{d.alert.text}</p>
            </div>
        )}
        <ul className="flex flex-col gap-2">
            {d.lines.map(line => <li key={line} className="text-[1.05rem] leading-snug text-gray-100">{line}</li>)}
        </ul>
    </div>
);

const EvidenceMapSim = () => {
    const { step, setStep } = useSlideSteps(EVIDENCE_STEPS.length);
    const [pick, setPick] = useState<{ step: number; id: string } | null>(null);
    const info = EVIDENCE_STEPS[step];
    const revealed = step === EVIDENCE_STEPS.length - 1;
    // O clique vale só dentro do passo em que aconteceu; ao avançar, o foco volta à ficha da história.
    const selectedId = pick && pick.step === step ? pick.id : info.focus;
    const selected = WITNESSES.find(w => w.id === selectedId) ?? WITNESSES[0];
    const detail = detailOf(selected, revealed);

    return (
        <div className="not-prose w-full font-body text-white select-none flex flex-col gap-3" style={{ height: SIM_HEIGHT }}>
            <StepTabs labels={EVIDENCE_STEPS.map(s => s.tab)} step={step} onSelect={setStep} layoutId="ato5-evidence-tab" />
            <div className="flex-1 min-h-0 grid gap-3" style={{ gridTemplateColumns: `${MAP_W + 34}px minmax(0,1fr)` }}>
                <Panel className="p-4 flex flex-col">
                    <div className="flex items-baseline justify-between pb-1">
                        <span className="text-[16px] text-gray-200">↑ efeito no desempenho · força da evidência →</span>
                        <Tag color={C.caveat}>posições qualitativas</Tag>
                    </div>
                    <div style={{ height: MAP_H }}>
                        <EvidenceMap groups={info.groups} selected={selectedId} revealed={revealed}
                            onSelect={id => setPick({ step, id })} />
                    </div>
                </Panel>
                <Panel state="active" glow={detail.color} className="p-4 flex flex-col gap-3">
                    <StepFade stepKey={step}>
                        <p className="text-[16px] leading-snug text-gray-300">{info.caption}</p>
                    </StepFade>
                    <StepFade stepKey={`${step}-${selectedId}`} className="flex flex-col gap-3">
                        <DetailCard d={detail} />
                    </StepFade>
                    <div className="mt-auto flex flex-col gap-1.5">
                        <SourceNote>{detail.source}</SourceNote>
                        <p className="text-[16px] text-gray-400">Clique numa ficha para ver o porquê.</p>
                    </div>
                </Panel>
            </div>
        </div>
    );
};

export default EvidenceMapSim;
