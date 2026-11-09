import { motion, useReducedMotion } from 'framer-motion';
import { useState } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { Frame, Tag } from './ato3/Frame';
import { GutDiagram } from './ato3/GutDiagram';
import { ErasePanel, PricePanel, SitesPanel, StrategyList } from './ato3/GutPanels';
import { GUT_DEFAULT_ON, GUT_FEET, GUT_TABS } from './ato3/intestino';
import { C } from './kit/palette';

/**
 * Slide 47 — "O Preço no Intestino". Passos: o preço (Miller 2025, Kahle 2013) → onde dói → o GI apaga o efeito
 * (Saunders 2014) → estratégias com dado → estratégias sem prova. As estratégias são interruptores no esquema.
 */

const GutSim = () => {
    const { step, setStep } = useSlideSteps(GUT_TABS.length);
    const reduce = useReducedMotion() ?? false;
    // Cada passo abre com as suas estratégias ligadas; o clique muda só dentro do passo.
    const [override, setOverride] = useState<{ step: number; on: readonly string[] } | null>(null);
    const onList = override?.step === step ? override.on : GUT_DEFAULT_ON[step];
    const on = new Set(onList);
    const toggle = (id: string) => setOverride({ step, on: on.has(id) ? onList.filter(x => x !== id) : [...onList, id] });

    return (
        <Frame tabs={GUT_TABS} step={step} setStep={setStep} layoutId="gut-tab" foot={GUT_FEET[step]}
            chips={<Tag color={C.muted}>esquema</Tag>}>
            <div className="h-full grid gap-5" style={{ gridTemplateColumns: '480px 1fr' }}>
                <GutDiagram sites={step <= 1} on={on} reduce={reduce} />
                <motion.div key={step} className="flex flex-col justify-center" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
                    {step === 0 && <PricePanel />}
                    {step === 1 && <SitesPanel />}
                    {step === 2 && <ErasePanel />}
                    {step >= 3 && <StrategyList ids={GUT_DEFAULT_ON[step]} on={on} toggle={toggle} />}
                    {step === 4 && (
                        <div className="mt-3 flex flex-col gap-2 text-[16px] leading-snug text-gray-200">
                            <p>Loção: o único positivo mecanístico (pH intramuscular +0,13 em repouso) foi financiado em parte pela empresa (Gibson 2023).</p>
                            <p>E ninguém comparou as estratégias entre si; 26 de 101 estudos nem testaram o GI estatisticamente (Winter 2026).</p>
                        </div>
                    )}
                </motion.div>
            </div>
        </Frame>
    );
};

export default GutSim;
