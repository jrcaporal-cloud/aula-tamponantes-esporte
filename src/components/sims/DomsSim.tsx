import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel } from './kit/ui';
import { DOMS_STEPS } from './ato2/doms.content';
import { Chronology, DOMS_H as H, DOMS_W as W, Lane } from './ato2/domsScenes';
import { SimShell, SourceLine, StepText, Tag } from './ato2/ui';

/**
 * Slide 14 — "A Dor que Vem Descendo o Morro". Passos 1–2: os dois treinos de Schwane 1983 lado a
 * lado (plano intenso × descida leve; corredor, perna e CK) e quem doeu. Passo 3: eixo do tempo
 * quebrado — o lactato some em minutos, a dor chega em dias.
 */

const DomsSim = () => {
    const { step, setStep } = useSlideSteps(DOMS_STEPS.length);
    const reduce = useReducedMotion() ?? false;
    const plan = DOMS_STEPS[step];
    const chrono = step === 2;
    return (
        <SimShell tabs={DOMS_STEPS.map(s => s.tab)} step={step} setStep={setStep} layoutId="doms-tabs"
            chips={<><Tag kind="humano">HUMANO · n = 7</Tag>{chrono && <Tag kind="ilustrativo">forma da curva de dor ilustrativa</Tag>}</>}>
            <div className="flex min-w-0 flex-1 flex-col gap-3">
                <Panel className="shrink-0" glow={C.risk} state={step === 1 ? 'active' : 'idle'}>
                    <motion.svg key={chrono ? 'c' : 'l'} viewBox={`0 0 ${W} ${H}`} width="100%" height={H} role="img"
                        aria-label={chrono ? 'Lactato some em minutos, dor aparece em dias' : 'Corrida no plano e em descida'}
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
                        {chrono ? <Chronology reduce={reduce} /> : (
                            <>
                                <Lane x={0} title="no plano" pct={78} slope={0} color={C.acid} reveal={step >= 1} descent={false} reduce={reduce} />
                                <line x1={568} x2={568} y1={16} y2={H - 16} stroke="rgba(255,255,255,0.12)" />
                                <Lane x={578} title="em descida" pct={57} slope={70} color={C.co2} reveal={step >= 1} descent reduce={reduce} />
                            </>
                        )}
                    </motion.svg>
                </Panel>
                <Panel className="min-h-0 flex-1 px-5 py-3">
                    <StepText step={step} headline={plan.headline} text={plan.text} accent={step === 0 ? '#fff' : C.risk}
                        footer={<SourceLine>{plan.source}</SourceLine>} />
                </Panel>
            </div>
        </SimShell>
    );
};

export default DomsSim;
