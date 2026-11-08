import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { KERN_PAIRS, KERN_QUOTE, MLG_META } from './eliteContent';

/**
 * Passo 4 do slide 66 ("spin", Kern & Robinson 2011): à esquerda, o resumo com a conclusão grifada;
 * à direita, o que os números mostram (pares β-alanina × placebo n.s. e o IC da meta-análise cruzando o zero).
 */

const PINK = C.risk;

/** Linha "de texto" esquemática do resumo (não é texto: só a forma do parágrafo). */
const Skeleton = ({ widths }: { widths: readonly number[] }) => (
    <div className="flex flex-col gap-[7px]">
        {widths.map((w, i) => <span key={i} className="block h-[8px] rounded-full bg-white/12" style={{ width: `${w}%` }} />)}
    </div>
);

const AbstractCard = ({ reduce }: { reduce: boolean }) => (
    <div className="relative flex h-full flex-col gap-3 rounded-xl border border-white/15 bg-white/[0.04] p-4">
        <span className="font-mono text-[15px] uppercase tracking-wider text-gray-300">Resumo · JSCR 2011</span>
        <div className="flex flex-col gap-1.5">
            <span className="text-[15px] font-semibold text-gray-300">Métodos</span>
            <Skeleton widths={[96, 88, 70]} />
        </div>
        <div className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold text-gray-300">Resultados</span>
            <span className="text-[16px] leading-snug" style={{ color: C.co2 }}>nenhuma diferença significativa (p &gt; 0,05)</span>
        </div>
        <div className="flex flex-col gap-1">
            <span className="text-[15px] font-semibold text-gray-300">Conclusão</span>
            <p className="m-0 font-display text-[1.32rem] font-semibold leading-snug text-white">
                <motion.span className="px-1"
                    style={{ backgroundImage: `linear-gradient(${PINK}55, ${PINK}55)`, backgroundRepeat: 'no-repeat', backgroundPosition: 'left center' }}
                    initial={reduce ? false : { backgroundSize: '0% 100%' }} animate={{ backgroundSize: '100% 100%' }}
                    transition={{ duration: 0.8, delay: 0.25, ease: 'easeInOut' }}>
                    “{KERN_QUOTE}”
                </motion.span>
            </p>
        </div>
        <motion.span className="absolute right-4 bottom-4 rounded-lg border-2 px-3 py-0.5 font-display text-[1.5rem] font-semibold uppercase"
            style={{ color: PINK, borderColor: PINK, rotate: -8 }}
            initial={reduce ? false : { opacity: 0, scale: 1.6 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: 0.95 }}>
            spin
        </motion.span>
    </div>
);

const NW = 330;
const NH = 400;
const ZERO = 185;
const UNIT = 60;

/** Barra que cresce a partir do zero (transform, não atributo geométrico). */
const Bar = ({ y, value, color, delay, reduce }: { y: number; value: number; color: string; delay: number; reduce: boolean }) => {
    const w = Math.abs(value) * UNIT;
    const x = value < 0 ? ZERO - w : ZERO;
    return (
        <motion.rect x={x} y={y} width={w} height={20} rx={5} fill={color} fillOpacity={0.85}
            style={{ transformBox: 'fill-box', transformOrigin: value < 0 ? 'right center' : 'left center' }}
            initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay }} />
    );
};

const NumbersPanel = ({ reduce }: { reduce: boolean }) => {
    const ciX = (v: number) => ZERO + v * 150;
    return (
        <svg width={NW} height={NH} viewBox={`0 0 ${NW} ${NH}`} role="img" aria-label="Resultados de Kern 2011 e meta-análise de massa livre de gordura">
            <SvgText x={0} y={20} text="O que os números mostram" color={C.text} size={17} weight={700} />
            {KERN_PAIRS.map((p, i) => {
                const y0 = 56 + i * 112;
                return (
                    <g key={p.label}>
                        <SvgText x={0} y={y0} text={p.label} color={C.text} size={16} />
                        <line x1={ZERO} x2={ZERO} y1={y0 + 8} y2={y0 + 66} stroke="white" strokeOpacity={0.4} />
                        <Bar y={y0 + 14} value={p.ba} color={C.carno} delay={0.15 + i * 0.25} reduce={reduce} />
                        <Bar y={y0 + 42} value={p.pl} color={C.co2} delay={0.25 + i * 0.25} reduce={reduce} />
                        <SvgText x={0} y={y0 + 30} text="β-alanina" color={C.carnoSoft} size={16} weight={700} />
                        <SvgText x={0} y={y0 + 58} text="placebo" color={C.co2} size={16} weight={600} />
                        <SvgText x={NW} y={y0 + 30} anchor="end" text={p.baText} color={C.carnoSoft} size={16} weight={700} />
                        <SvgText x={NW} y={y0 + 58} anchor="end" text={p.plText} color={C.co2} size={16} weight={600} />
                        <SvgText x={NW} y={y0} anchor="end" text="n.s." color={PINK} size={17} weight={700} />
                    </g>
                );
            })}
            <line x1={0} x2={NW} y1={282} y2={282} stroke="white" strokeOpacity={0.1} />
            <SvgText x={0} y={306} text={MLG_META.label} color={C.text} size={16} />
            <line x1={ZERO} x2={ZERO} y1={318} y2={360} stroke={C.text} strokeOpacity={0.6} strokeDasharray="4 4" />
            <motion.rect x={ciX(MLG_META.lo)} y={338} width={ciX(MLG_META.hi) - ciX(MLG_META.lo)} height={5} rx={2.5} fill={C.carno}
                style={{ transformBox: 'fill-box', transformOrigin: 'center' }}
                initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: 0.5, delay: 0.6 }} />
            <rect x={ciX(MLG_META.est) - 7} y={333} width={14} height={14} fill={C.carnoSoft} transform={`rotate(45 ${ciX(MLG_META.est)} 340)`} />
            <SvgText x={ciX(MLG_META.lo)} y={378} anchor="middle" text="−0,71" color={C.muted} size={16} weight={500} />
            <SvgText x={ZERO} y={378} anchor="middle" text="0" color={C.text} size={16} weight={700} />
            <SvgText x={ciX(MLG_META.hi)} y={378} anchor="middle" text="0,82" color={C.muted} size={16} weight={500} />
            <SvgText x={ZERO} y={398} anchor="middle" text={MLG_META.verdict} color={PINK} size={16} weight={700} />
        </svg>
    );
};

export const SpinVisual = ({ reduce }: { reduce: boolean }) => (
    <div className="flex h-full items-stretch gap-4">
        <div className="min-w-0 flex-1"><AbstractCard reduce={reduce} /></div>
        <div className="flex shrink-0 items-center"><NumbersPanel reduce={reduce} /></div>
    </div>
);
