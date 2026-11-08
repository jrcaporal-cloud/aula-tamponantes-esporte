import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { C } from './kit/palette';
import { Panel, SvgText } from './kit/ui';
import { DOMS_STEPS } from './ato2/doms.content';
import { remaining } from './ato2/shuttle.content';
import { SimShell, SourceLine, StepText, Tag } from './ato2/ui';

/**
 * Slide 28 — "A Dor que Vem Descendo o Morro". Passos 1–2: os dois treinos de Schwane 1983 lado a
 * lado (plano intenso × descida leve) e quem doeu. Passo 3: eixo do tempo quebrado — o lactato
 * some em minutos, a dor chega em dias.
 */

const W = 1136;
const H = 270;

const Lane = ({ x, title, pct, slope, color, result, resultColor, showResult, reduce }: {
    x: number; title: string; pct: number; slope: number; color: string;
    result: string; resultColor: string; showResult: boolean; reduce: boolean;
}) => {
    const x0 = x + 30;
    const x1 = x + 480;
    const y1 = 170;
    const y0 = y1 - slope;
    const track = `M${x0} ${y0 - 14} L${x1} ${y1 - 14}`;
    return (
        <g>
            <SvgText x={x0} y={40} text={title} size={20} color={color} weight={700} />
            <path d={`M${x0} ${y0} L${x1} ${y1} L${x1} ${y1 + 8} L${x0} ${y1 + 8} Z`} fill={`${color}22`} stroke={color} strokeWidth={2} />
            <circle r={12} fill="#fff" cx={reduce ? (x0 + x1) / 2 : 0} cy={reduce ? (y0 + y1) / 2 - 14 : 0}>
                {!reduce && <animateMotion dur={slope ? '3.2s' : '2.4s'} repeatCount="indefinite" path={track} />}
            </circle>
            <SvgText x={x0} y={214} text="intensidade" size={16} color={C.muted} weight={500} />
            <rect x={x0 + 100} y={200} width={340} height={16} rx={8} fill="rgba(255,255,255,0.08)" />
            <rect x={x0 + 100} y={200} width={340 * (pct / 100)} height={16} rx={8} fill={color} />
            <SvgText x={x0 + 100 + 340 * (pct / 100) + 10} y={214} text={`${pct}% VO₂máx`} size={16} color="#fff" weight={700} />
            <g style={{ opacity: showResult ? 1 : 0, transition: 'opacity 0.5s' }}>
                <SvgText x={x0} y={254} text={result} size={20} color={resultColor} weight={700} />
            </g>
        </g>
    );
};

/** Eixo quebrado: 0–60 min à esquerda, 1–5 dias à direita. */
const Chronology = () => {
    const top = 50;
    const bottom = 210;
    const ax = (t: number) => 70 + (t / 60) * 440;
    const bx = (d: number) => 600 + ((d - 0.5) / 4.5) * 500;
    const y = (f: number) => bottom - f * (bottom - top);
    const lact = Array.from({ length: 61 }, (_, t) => `${t ? 'L' : 'M'}${ax(t).toFixed(1)} ${y(remaining(t)).toFixed(1)}`).join(' ');
    const sore = Array.from({ length: 46 }, (_, i) => {
        const d = 0.5 + i * 0.1;
        return `${i ? 'L' : 'M'}${bx(d).toFixed(1)} ${y(Math.exp(-((d - 2) ** 2) / 1.3)).toFixed(1)}`;
    }).join(' ');
    return (
        <g>
            <line x1={60} x2={520} y1={bottom} y2={bottom} stroke="rgba(255,255,255,0.35)" />
            <line x1={590} x2={1110} y1={bottom} y2={bottom} stroke="rgba(255,255,255,0.35)" />
            <SvgText x={555} y={bottom + 6} text="//" anchor="middle" size={20} color={C.muted} />
            {[0, 15, 30, 45, 60].map(t => <SvgText key={t} x={ax(t)} y={bottom + 26} text={`${t}`} anchor="middle" size={16} color="#CBD5E1" weight={500} />)}
            <SvgText x={290} y={bottom + 52} text="minutos de recuperação" anchor="middle" size={16} color={C.muted} />
            {[1, 2, 3, 4, 5].map(d => <SvgText key={d} x={bx(d)} y={bottom + 26} text={`${d}`} anchor="middle" size={16} color="#CBD5E1" weight={500} />)}
            <SvgText x={850} y={bottom + 52} text="dias depois" anchor="middle" size={16} color={C.muted} />
            <path d={lact} fill="none" stroke={C.lactate} strokeWidth={4} />
            <SvgText x={ax(9.5) + 12} y={y(0.5) - 8} text="lactato no músculo: metade a cada 9,5 min" size={17} color={C.lactate} weight={700} />
            <path d={sore} fill="none" stroke={C.risk} strokeWidth={4} />
            <SvgText x={bx(2) + 14} y={top - 6} text="dor muscular tardia" size={17} color={C.risk} weight={700} />
        </g>
    );
};

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
                        {chrono ? <Chronology /> : (
                            <>
                                <Lane x={10} title="no plano" pct={78} slope={0} color={C.acid} reduce={reduce}
                                    result="sem dor tardia, sem alta de CK" resultColor={C.baseSoft} showResult={step >= 1} />
                                <line x1={568} x2={568} y1={20} y2={H - 20} stroke="rgba(255,255,255,0.12)" />
                                <Lane x={586} title="em descida (−10%)" pct={57} slope={80} color={C.co2} reduce={reduce}
                                    result="dor tardia + CK +351% em 24 h" resultColor={C.risk} showResult={step >= 1} />
                            </>
                        )}
                    </motion.svg>
                </Panel>
                <Panel className="min-h-0 flex-1 px-5 py-4">
                    <StepText step={step} headline={plan.headline} text={plan.text} accent={step === 0 ? '#fff' : C.risk}
                        footer={<SourceLine>{plan.source}</SourceLine>} />
                </Panel>
            </div>
        </SimShell>
    );
};

export default DomsSim;
