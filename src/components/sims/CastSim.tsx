import { useMemo } from 'react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { CAST } from './ato1/content';
import { CastCard } from './ato1/CastCard';
import { Tabs, Tag } from './ato1/ui';

/**
 * "Quatro Atletas, um Problema" (slide 12). Passo 1: o elenco, cada um com seu esforço na mesma régua de tempo.
 * Passos 2–5: o dilema de cada personagem acende, um por vez. Casos fictícios (dossiê 06, Parte 5).
 */

const CastSim = () => {
    const { step, setStep } = useSlideSteps(CAST.length + 1);
    const tabs = useMemo(() => ['Elenco', ...CAST.map(m => m.name)], []);

    const stateOf = (i: number): 'idle' | 'active' | 'dim' => {
        if (step === 0) return 'idle';
        if (i === step - 1) return 'active';
        return i < step ? 'idle' : 'dim';
    };

    return (
        <div className="not-prose flex w-full select-none flex-col gap-3 font-body text-white" style={{ height: 516 }}>
            <div className="flex h-10 items-center justify-between gap-3">
                <Tabs labels={tabs} step={step} onSelect={setStep} layoutId="cast-tabs" />
                <Tag color={C.caveat}>casos fictícios</Tag>
            </div>

            <div className="grid min-h-0 flex-1 grid-cols-4 gap-3">
                {CAST.map((member, i) => (
                    <CastCard key={member.name} member={member} revealed={step > i} state={stateOf(i)} />
                ))}
            </div>
        </div>
    );
};

export default CastSim;
