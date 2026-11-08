import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { CFN_ALSO, CFN_FLOW, GRAY_ZONES, SHELVES } from './brazil';
import { Light } from './ui';

/**
 * Passos 3 e 4 do slide 91 (E no Brasil?): as três "prateleiras" do bicarbonato desenhadas e a conta
 * da dose em antiácido e em sódio; depois, o caminho CFN 656 → IN 28 → prescrição e as zonas cinzentas.
 */

const W = 650;
const H = 410;
const PHARMA = C.lactate;

const Bottle = ({ x, y, s = 1, fill = 0.65, delay = 0, reduce }: { x: number; y: number; s?: number; fill?: number; delay?: number; reduce: boolean }) => (
    <g transform={`translate(${x} ${y}) scale(${s})`}>
        <rect x={-6} y={-4} width={12} height={6} rx={2} fill={C.co2} />
        <rect x={-5} y={2} width={10} height={8} fill="none" stroke={C.sodium} strokeWidth={2} />
        <motion.rect x={-12} y={10 + 46 * (1 - fill)} width={24} height={46 * fill} rx={4} fill={C.sodium} fillOpacity={0.55}
            style={{ transformBox: 'fill-box', transformOrigin: 'bottom' }}
            initial={reduce ? false : { scaleY: 0 }} animate={{ scaleY: 1 }} transition={{ duration: 0.5, delay }} />
        <rect x={-14} y={10} width={28} height={48} rx={7} fill="none" stroke={C.sodium} strokeWidth={2.5} />
    </g>
);

const Capsule = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y}) rotate(-30)`}>
        <rect x={-38} y={-15} width={38} height={30} rx={15} fill={C.co2} fillOpacity={0.7} />
        <rect x={0} y={-15} width={38} height={30} rx={15} fill={C.base} fillOpacity={0.6} />
        <rect x={-38} y={-15} width={76} height={30} rx={15} fill="none" stroke="#E5E7EB" strokeOpacity={0.6} strokeWidth={2} />
    </g>
);

const Ban = ({ x, y, r = 40 }: { x: number; y: number; r?: number }) => (
    <g stroke={C.risk} strokeWidth={5} fill="none">
        <circle cx={x} cy={y} r={r} />
        <line x1={x - r * 0.7} y1={y + r * 0.7} x2={x + r * 0.7} y2={y - r * 0.7} />
    </g>
);

const Box = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`}>
        <rect x={-40} y={-30} width={80} height={60} rx={8} fill={`${PHARMA}22`} stroke={PHARMA} strokeWidth={2.5} />
        <rect x={-6} y={-18} width={12} height={36} rx={2} fill={PHARMA} />
        <rect x={-18} y={-6} width={36} height={12} rx={2} fill={PHARMA} />
    </g>
);

const Sachet = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`}>
        <rect x={-10} y={-14} width={20} height={28} rx={3} fill={`${PHARMA}33`} stroke={PHARMA} strokeWidth={1.8} />
        <line x1={-10} x2={10} y1={-8} y2={-8} stroke={PHARMA} strokeWidth={1.5} strokeDasharray="2 2" />
    </g>
);

const SHELF_COLOR = { sim: C.ok, nao: C.risk, med: PHARMA } as const;
const SHELF_TAG = { sim: 'permitido', nao: 'não existe', med: 'medicamento' } as const;
const COL_X = [108, 325, 542] as const;

/** Passo 3: o que existe na prateleira e o tamanho da dose de 70 kg em antiácido e em sódio. */
export const BicarbShelves = () => {
    const reduce = useReducedMotion() ?? false;
    const fade = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay } });
    return (
        <svg viewBox={`0 0 ${W} ${H}`} width="100%" height="100%" role="img" aria-label="Bicarbonato no Brasil: suplemento líquido, cápsula e medicamento">
            {SHELVES.map((s, i) => {
                const cx = COL_X[i];
                const color = SHELF_COLOR[s.mark];
                return (
                    <motion.g key={s.id} {...fade(0.1 + i * 0.15)}>
                        {s.mark === 'sim' && <Bottle x={cx} y={14} s={1.45} reduce={reduce} delay={0.3} />}
                        {s.mark === 'nao' && <><Capsule x={cx} y={58} /><Ban x={cx} y={58} r={44} /></>}
                        {s.mark === 'med' && <Box x={cx} y={58} />}
                        <rect x={cx - 62} y={118} width={124} height={26} rx={6} fill={`${color}1f`} stroke={`${color}99`} />
                        <text x={cx} y={136} textAnchor="middle" fontSize={15} fontWeight={700} fill={color}
                            style={{ fontFamily: 'var(--font-mono)', textTransform: 'uppercase', letterSpacing: 1 }}>{SHELF_TAG[s.mark]}</text>
                        <SvgText x={cx} y={172} anchor="middle" text={s.short} color={C.text} size={17} weight={700} />
                        <SvgText x={cx} y={194} anchor="middle" text={s.sub[0]} color="#CBD5E1" size={16} weight={500} />
                        <SvgText x={cx} y={214} anchor="middle" text={s.sub[1]} color="#CBD5E1" size={16} weight={500} />
                    </motion.g>
                );
            })}
            <line x1={0} x2={W} y1={234} y2={234} stroke="white" strokeOpacity={0.12} />
            <SvgText x={0} y={256} text="A dose de 70 kg: 21 g de bicarbonato de uma vez" color={C.text} size={17} weight={700} />
            <SvgText x={0} y={294} text="em antiácido" color={PHARMA} size={16} weight={700} />
            {Array.from({ length: 8 }, (_, i) => (
                <motion.g key={i} {...fade(0.5 + i * 0.05)}><Sachet x={170 + i * 28} y={288} /></motion.g>
            ))}
            <SvgText x={400} y={294} text="≈ 8 doses de 2,5 g" color={PHARMA} size={18} weight={700} />
            <SvgText x={0} y={350} text="em sódio: 5,75 g" color={C.sodium} size={16} weight={700} />
            {Array.from({ length: 5 }, (_, i) => (
                <Bottle key={i} x={172 + i * 36} y={320} s={0.82} fill={1} reduce={reduce} delay={0.7 + i * 0.1} />
            ))}
            <SvgText x={400} y={344} text="= 5 litros da bebida" color={C.sodium} size={18} weight={700} />
            <SvgText x={400} y={364} text="de eletrólitos mais salgada" color="#CBD5E1" size={16} weight={500} />
            <SvgText x={400} y={384} text="que a IN 28 admite" color="#CBD5E1" size={16} weight={500} />
            <SvgText x={0} y={408} text="Cálculos: 21 ÷ 2,5 g; 5,75 g ÷ 1,15 g/L (ISSN 2026; IN 28)." color={C.muted} size={16} weight={500} />
        </svg>
    );
};

const FlowBox = ({ title, sub, color }: { title: string; sub: string; color: string }) => (
    <div className="flex min-w-0 flex-1 flex-col justify-center rounded-xl border-2 px-3 py-1.5 text-center" style={{ borderColor: `${color}aa`, background: `${color}14` }}>
        <span className="font-display text-[18px] font-semibold leading-tight text-white">{title}</span>
        <span className="text-[15px] leading-snug text-gray-300">{sub}</span>
    </div>
);

const Arrow = ({ label }: { label?: string }) => (
    <div className="flex w-[78px] shrink-0 flex-col items-center justify-center gap-0.5">
        <svg width={64} height={16} viewBox="0 0 64 16" aria-hidden>
            <line x1={2} x2={54} y1={8} y2={8} stroke={C.co2} strokeWidth={2.5} />
            <path d="M 52 2 L 62 8 L 52 14 Z" fill={C.co2} />
        </svg>
        {label && <span className="text-center text-[15px] leading-tight text-gray-300">{label}</span>}
    </div>
);

/** Semáforo vertical: nesta aula a zona cinzenta acende o amarelo (nem liberado, nem proibido). */
const Semaphore = () => (
    <div className="flex shrink-0 flex-col items-center gap-1.5 rounded-xl border border-white/15 bg-black/40 px-1.5 py-2">
        <Light signal="vermelho" size={18} on={false} />
        <Light signal="amarelo" size={18} />
        <Light signal="verde" size={18} on={false} />
    </div>
);

/** Passo 4: o caminho da norma e as duas zonas cinzentas sem parecer localizado. */
export const CfnFlow = () => {
    const reduce = useReducedMotion() ?? false;
    const enter = (delay: number) => (reduce ? {} : { initial: { opacity: 0, y: 8 }, animate: { opacity: 1, y: 0 }, transition: { duration: 0.3, delay } });
    return (
        <div className="flex h-full flex-col gap-2.5">
            <motion.div className="flex items-stretch" {...enter(0.05)}>
                <FlowBox title={CFN_FLOW[0].title} sub={CFN_FLOW[0].sub} color={C.co2} />
                <Arrow label={CFN_FLOW[0].arrow} />
                <FlowBox title={CFN_FLOW[1].title} sub={CFN_FLOW[1].sub} color={C.carno} />
                <Arrow />
                <FlowBox title={CFN_FLOW[2].title} sub={CFN_FLOW[2].sub} color={C.ok} />
            </motion.div>
            <motion.div className="flex flex-col gap-1.5" {...enter(0.3)}>
                <span className="font-mono text-[15px] uppercase tracking-wider text-gray-300">A 656 também exige</span>
                <div className="grid grid-cols-2 gap-1.5">
                    {CFN_ALSO.map(d => (
                        <span key={d} className="flex items-start gap-2 rounded-lg border border-white/10 bg-white/[0.03] px-2.5 py-0.5 text-[15px] leading-snug text-gray-100">
                            <span className="mt-[7px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: C.ok }} />{d}
                        </span>
                    ))}
                </div>
            </motion.div>
            <div className="grid min-h-0 flex-1 grid-cols-2 gap-3">
                {GRAY_ZONES.map((z, i) => (
                    <motion.div key={z.id} className="flex gap-3 rounded-xl border border-dashed px-3 py-2.5"
                        style={{ borderColor: `${C.co2}aa`, background: 'repeating-linear-gradient(135deg, rgba(148,163,184,0.07) 0 10px, rgba(148,163,184,0.02) 10px 20px)' }}
                        {...enter(0.55 + i * 0.2)}>
                        <Semaphore />
                        <div className="flex min-w-0 flex-col gap-1">
                            <span className="font-mono text-[15px] uppercase tracking-wider text-slate-300">zona cinzenta</span>
                            <p className="m-0 font-display text-[17px] font-semibold leading-tight text-white">{z.title}</p>
                            <p className="m-0 text-[15px] leading-snug text-gray-200">{z.why}</p>
                            <p className="m-0 mt-auto text-[15px] font-semibold" style={{ color: C.lactate }}>Parecer do CFN: não localizado.</p>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
