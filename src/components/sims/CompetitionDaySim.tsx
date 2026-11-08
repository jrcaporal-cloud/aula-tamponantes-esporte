import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { DAYS } from './ato7/day';
import { DayTimeline } from './ato7/DayTimeline';
import { Chip, FadeSwap, Fictional, Shell, Source } from './ato7/ui';

/**
 * Slide 93 — O Dia de Prova. Um passo por personagem (fictícios): o dia em horas, as janelas
 * de GI e de alcalose de cada dose (Urwin 2023) e os três conflitos numerados. Passar o mouse num conflito acende o marcador.
 */

const Legend = () => (
    <div className="flex items-center gap-4 text-[15px] text-gray-300">
        <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-sm" style={{ background: `${C.risk}66` }} /> pico de GI (35–50 min)</span>
        <span className="flex items-center gap-1.5"><span className="h-3.5 w-3.5 rounded-sm border" style={{ background: `${C.base}44`, borderColor: C.base }} /> HCO₃⁻ ≥ +6 (2–3 h)</span>
    </div>
);

const CompetitionDaySim = () => {
    const { step, setStep } = useSlideSteps(DAYS.length);
    const [focus, setFocus] = useState<number | null>(null);
    const day = DAYS[step];

    return (
        <Shell tabs={DAYS.map(d => d.name)} step={step} setStep={i => { setFocus(null); setStep(i); }} layoutId="day-tabs"
            chips={<><Chip color={C.co2}>horários ilustrativos</Chip><Fictional /></>}>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <FadeSwap id={`h-${step}`} className="px-1">
                    <p className="m-0 truncate text-[18px] text-gray-100">
                        <span className="font-display text-[24px] font-semibold text-white">{day.name}</span>
                        <span className="text-gray-300"> · {day.who}</span>
                    </p>
                </FadeSwap>
                <Panel className="h-[226px] shrink-0 px-4 pb-1 pt-3" state="active">
                    <div className="flex h-full flex-col">
                        <div className="flex items-center justify-between gap-3">
                            <span className="font-mono text-[15px]" style={{ color: C.sodium }}>{day.dose} (cálculo)</span>
                            <Legend />
                        </div>
                        <FadeSwap id={`t-${step}`} className="min-h-0 flex-1">
                            <DayTimeline day={day} focus={focus} />
                        </FadeSwap>
                    </div>
                </Panel>
                <FadeSwap id={`c-${step}`} className="grid min-h-0 flex-1 grid-cols-3 gap-3">
                    {day.conflicts.map(c => (
                        <div key={c.n} onMouseEnter={() => setFocus(c.n)} onMouseLeave={() => setFocus(null)}
                            className="flex flex-col gap-1.5 overflow-hidden rounded-2xl border px-4 py-3 transition-colors"
                            style={{ borderColor: focus === c.n ? `${C.lactate}cc` : 'rgba(255,255,255,0.1)', background: 'rgba(4,10,20,0.74)' }}>
                            <div className="flex items-center gap-2">
                                <span className="flex h-[26px] w-[26px] shrink-0 items-center justify-center rounded-full text-[16px] font-extrabold"
                                    style={{ background: C.lactate, color: '#04080F' }}>{c.n}</span>
                                <span className="font-display text-[19px] font-semibold leading-tight text-white">{c.title}</span>
                            </div>
                            <p className="m-0 text-[16px] leading-snug text-gray-100">{c.text}</p>
                            <div className="mt-auto"><Source>{c.source}</Source></div>
                        </div>
                    ))}
                </FadeSwap>
            </div>
        </Shell>
    );
};

export default CompetitionDaySim;
