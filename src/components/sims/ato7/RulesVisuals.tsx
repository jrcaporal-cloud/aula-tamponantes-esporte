import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { Check } from 'lucide-react';
import { ForestPlot } from '../kit/ForestPlot';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { Chip } from './ui';
import { HORSE_ROWS, LIST_CLASSES, POTS, VOLUME_BARS } from './rules';

/** Visuais do slide 90 (As Regras do Jogo). Área útil: 650 × 410. */
const VIS_W = 650;
const VIS_H = 410;

const SUBSTANCES = [
    { name: 'Bicarbonato de sódio', color: C.base },
    { name: 'Citrato de sódio', color: C.baseSoft },
    { name: 'β-alanina', color: C.carno },
];

/** Passo 1: varre as classes da lista e nenhuma acende. */
export const ListScan = () => {
    const reduce = useReducedMotion();
    return (
        <div className="flex h-full flex-col justify-center gap-6">
            <div className="grid grid-cols-7 gap-2">
                {LIST_CLASSES.map((cls, i) => (
                    <motion.div key={cls} className="flex h-[58px] flex-col items-center justify-center rounded-xl border border-white/15 bg-white/[0.03]"
                        initial={reduce ? false : { opacity: 0.2 }} animate={{ opacity: [0.2, 1, 0.55] }}
                        transition={{ duration: 0.5, delay: reduce ? 0 : i * 0.04, ease: EASE_OUT }}>
                        <span className="font-mono text-[18px] font-semibold text-gray-100">{cls}</span>
                        <span className="text-[16px] text-gray-400">—</span>
                    </motion.div>
                ))}
            </div>
            <div className="flex flex-col gap-2">
                {SUBSTANCES.map((s, i) => (
                    <motion.div key={s.name} className="flex items-center justify-between rounded-xl border px-4 py-2.5"
                        style={{ borderColor: `${s.color}77`, background: `${s.color}12` }}
                        initial={reduce ? false : { opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: DUR.enter, ease: EASE_OUT, delay: reduce ? 0 : stagger(i, 0.3) }}>
                        <span className="font-body text-[20px] font-semibold" style={{ color: s.color }}>{s.name}</span>
                        <span className="flex items-center gap-2 text-[16px] font-semibold" style={{ color: C.ok }}>
                            <Check size={18} aria-hidden /> oral: fora da lista
                        </span>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};

/** Passo 2: barras de volume contra o limite de 100 mL em 12 h. */
export const VolumeBars = () => {
    const reduce = useReducedMotion();
    const x0 = 190;
    const sx = (ml: number) => x0 + (ml / 1700) * (VIS_W - x0 - 20);
    const limitX = sx(100);
    return (
        <svg viewBox={`0 0 ${VIS_W} ${VIS_H}`} width="100%" height="100%" role="img" aria-label="Volume de bicarbonato IV contra o limite M2.2">
            <line x1={limitX} x2={limitX} y1={40} y2={330} stroke={C.risk} strokeWidth={2} strokeDasharray="6 5" />
            <SvgText x={limitX + 8} y={34} text="100 mL / 12 h" color={C.risk} size={17} />
            {VOLUME_BARS.map((b, i) => {
                const y = 80 + i * 95;
                const w = sx(b.ml) - x0;
                const big = b.ml > 1000;
                const color = b.id === 'lim' ? C.risk : C.base;
                return (
                    <g key={b.id}>
                        <SvgText x={0} y={y + 4} text={b.label} size={18} color="#F3F4F6" weight={700} />
                        <SvgText x={0} y={y + 26} text={b.sub} size={16} color={C.muted} weight={500} />
                        <motion.rect x={x0} y={y - 18} width={w} height={40} rx={8} fill={color} fillOpacity={b.id === 'lim' ? 0.35 : 0.75}
                            style={{ transformBox: 'fill-box', transformOrigin: 'left center' }}
                            initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ duration: DUR.bar, ease: EASE_OUT, delay: reduce ? 0 : stagger(i, 0.15) }} />
                        {big ? (
                            <text x={x0 + w - 14} y={y + 9} textAnchor="end" fontSize={21} fontWeight={700} fill="#04080F"
                                style={{ fontFamily: 'var(--font-body)' }}>{`${b.ml.toLocaleString('pt-BR')} mL`}</text>
                        ) : (
                            <SvgText x={x0 + w + 10} y={y + 8} text={`${b.ml.toLocaleString('pt-BR')} mL`} size={20} weight={700} color="#F3F4F6" />
                        )}
                    </g>
                );
            })}
            <SvgText x={0} y={378} text="Concentrada: 2,5× o limite. Na diluição da bula: ~17×." size={18} color="#E5E7EB" weight={600} />
            <SvgText x={0} y={402} text="21 g = 70 kg × 0,3 g/kg · cálculo" size={16} color={C.muted} weight={500} />
        </svg>
    );
};

/** Densidade normal (forma ilustrativa das curvas de TCO₂). */
const gauss = (x: number, mu: number, sd: number) => Math.exp(-((x - mu) ** 2) / (2 * sd * sd));

/** Passo 3: histograma de TCO₂ com a "corcova" dos trotadores e os limites de 36 e 37. */
export const Tco2Curve = () => {
    const reduce = useReducedMotion();
    const [d0, d1] = [26, 39];
    const left = 30;
    const right = VIS_W - 20;
    const base = 320;
    const sx = (v: number) => left + ((v - d0) / (d1 - d0)) * (right - left);
    const path = (f: (x: number) => number) => {
        const pts = Array.from({ length: 131 }, (_, i) => d0 + (i / 130) * (d1 - d0));
        return `M${sx(d0)},${base} ` + pts.map(x => `L${sx(x).toFixed(1)},${(base - f(x) * 230).toFixed(1)}`).join(' ') + ` L${sx(d1)},${base} Z`;
    };
    const total = (x: number) => 0.8 * gauss(x, 30.2, 1.2) + 0.2 * gauss(x, 32.3, 1.0);
    const hump = (x: number) => 0.2 * gauss(x, 32.3, 1.0);
    return (
        <div className="relative h-full w-full">
            <div className="absolute right-0 top-0"><Chip>forma ilustrativa</Chip></div>
            <svg viewBox={`0 0 ${VIS_W} ${VIS_H}`} width="100%" height="100%" role="img" aria-label="Distribuição de TCO₂ em cavalos">
                <motion.g style={{ transformBox: 'fill-box', transformOrigin: 'center bottom' }}
                    initial={reduce ? false : { scaleY: 0, opacity: 0 }} animate={{ scaleY: 1, opacity: 1 }} transition={{ duration: 0.9, ease: EASE_OUT }}>
                    <path d={path(total)} fill={C.co2} fillOpacity={0.28} stroke={C.co2} strokeWidth={2} />
                    <path d={path(hump)} fill={C.acid} fillOpacity={0.45} stroke={C.acid} strokeWidth={2} />
                </motion.g>
                {[{ v: 36, label: 'limite 36', color: C.lactate, y: 70 }, { v: 37, label: 'ação > 37', color: C.risk, y: 100 }].map(l => (
                    <g key={l.v}>
                        <line x1={sx(l.v)} x2={sx(l.v)} y1={l.y - 14} y2={base} stroke={l.color} strokeWidth={2} strokeDasharray="6 5" />
                        <SvgText x={sx(l.v) - 8} y={l.y} text={l.label} color={l.color} size={17} anchor="end" />
                    </g>
                ))}
                <SvgText x={sx(30.2)} y={70} text="média 30,2" anchor="middle" color="#E5E7EB" size={17} />
                <SvgText x={sx(32.3) + 30} y={250} text="~20%: 32,3" color={C.acidSoft} size={17} />
                <line x1={left} x2={right} y1={base} y2={base} stroke="rgba(255,255,255,0.3)" />
                {[26, 28, 30, 32, 34, 36, 38].map(t => (
                    <SvgText key={t} x={sx(t)} y={base + 24} text={String(t)} anchor="middle" size={16} color={C.muted} weight={500} />
                ))}
                <SvgText x={(left + right) / 2} y={base + 50} text="TCO₂ no plasma (mmol/L)" anchor="middle" size={16} color="#CBD5E1" weight={500} />
                <SvgText x={left} y={VIS_H - 6} text="A fraude discreta fica escondida abaixo do limite." size={18} color="#E5E7EB" />
            </svg>
        </div>
    );
};

/** Passo 4: o forest dos cavalos colado no zero + o caso O'Neill. */
export const HorseVerdict = () => (
    <div className="flex h-full flex-col gap-3">
        <div style={{ width: VIS_W, height: 220 }}>
            <ForestPlot rows={HORSE_ROWS} width={VIS_W} height={220} domain={[-0.8, 0.8]} ticks={[-0.5, 0, 0.5]}
                axisLabel="tamanho de efeito (IC95%)" sides={['pior', 'melhor com bicarbonato']} labelWidth={250} valueWidth={170} />
        </div>
        <div className="grid flex-1 grid-cols-2 gap-3">
            <div className="rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3">
                <p className="font-mono text-[15px] uppercase tracking-wider text-amber-200">Del Mar, 25/08/2010</p>
                <p className="mt-1 text-[16px] leading-snug text-gray-100">TCO₂ acima do permitido. Treinador suspenso 45 dias e multado em US$ 15.000 — sem milkshake.</p>
            </div>
            <div className="rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3">
                <p className="font-mono text-[15px] uppercase tracking-wider text-rose-200">Responsabilidade objetiva</p>
                <p className="mt-1 text-[16px] leading-snug text-gray-100">O treinador é o "responsável final" — o mesmo espírito da strict liability do atleta.</p>
            </div>
        </div>
    </div>
);

/** Passo 5: 100 potes, os contaminados acesos. */
export const PotGrid = () => {
    const reduce = useReducedMotion();
    return (
        <div className="grid h-full grid-cols-2 gap-5">
            {POTS.map(p => (
                <div key={p.id} className="flex flex-col gap-2">
                    <span className="font-display text-[40px] font-semibold leading-none" style={{ color: C.risk }}>{p.title}</span>
                    <svg viewBox="0 0 300 300" width="100%" style={{ aspectRatio: '1 / 1', maxHeight: 250 }} role="img" aria-label={`${br(p.pct, 1)} contaminados`}>
                        {Array.from({ length: 100 }, (_, i) => {
                            const hit = i < p.dots;
                            return (
                                <motion.circle key={i} cx={15 + (i % 10) * 30} cy={15 + Math.floor(i / 10) * 30} r={11}
                                    fill={hit ? C.risk : 'rgba(255,255,255,0.12)'}
                                    initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }}
                                    transition={{ duration: 0.25, delay: reduce ? 0 : (hit ? 0.6 : 0) + i * 0.006, ease: EASE_OUT }} />
                            );
                        })}
                    </svg>
                    <p className="text-[15px] leading-snug text-gray-200">{p.sub}</p>
                </div>
            ))}
        </div>
    );
};
