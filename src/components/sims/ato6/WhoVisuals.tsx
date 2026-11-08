import { motion, useReducedMotion } from 'framer-motion';
import { C, PANEL_BG } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { BICARB_BARS, CAST, TIERS } from './whoContent';

/** Desenhos do "Quem é Estudado?" (caixa 696 × 440). */

export const WV_W = 696;
export const WV_H = 440;
const WOMEN = C.lactate;
const MEN = C.co2;

/** 100 participantes: 23 mulheres (Smith 2022). */
export const Waffle = () => {
    const reduce = useReducedMotion() ?? false;
    return (
        <svg width={WV_W} height={WV_H} viewBox={`0 0 ${WV_W} ${WV_H}`} role="img" aria-label="23 de cada 100 participantes são mulheres">
            {Array.from({ length: 100 }, (_, i) => {
                const woman = i < 23;
                return (
                    <motion.circle key={i} cx={60 + (i % 10) * 34} cy={60 + Math.floor(i / 10) * 34} r={13}
                        fill={woman ? WOMEN : MEN} fillOpacity={woman ? 0.95 : 0.45}
                        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.012, duration: 0.2 }} />
                );
            })}
            <SvgText x={430} y={110} text="23%" color={WOMEN} size={64} weight={700} />
            <SvgText x={430} y={142} text="dos 34.889 participantes" color={C.text} size={17} />
            <SvgText x={430} y={166} text="eram mulheres" color={C.text} size={17} />
            <SvgText x={430} y={236} text="34%" color={C.text} size={34} weight={700} />
            <SvgText x={430} y={262} text="dos estudos com ≥ 1 mulher" color={C.muted} size={16} weight={500} />
            <SvgText x={430} y={322} text="0–8%" color={C.text} size={34} weight={700} />
            <SvgText x={430} y={348} text="dos estudos só com mulheres" color={C.muted} size={16} weight={500} />
            <SvgText x={60} y={418} text="1.826 estudos de 6 suplementos de desempenho" color={C.muted} size={16} weight={500} />
        </svg>
    );
};

/** Estudos classificáveis por nível de McKay. */
export const TierBars = () => {
    const x0 = 60;
    const bw = 88;
    const gap = 12;
    const y = (pct: number) => 330 - pct * 7;
    return (
        <svg width={WV_W} height={WV_H} viewBox={`0 0 ${WV_W} ${WV_H}`} role="img" aria-label="Estudos por nível de participante">
            <SvgText x={28} y={36} text="% dos estudos classificáveis, por nível do participante" color={C.text} size={18} weight={700} />
            {TIERS.map((t, i) => {
                const bx = x0 + i * (bw + gap);
                const low = t.tier <= 2;
                return (
                    <g key={t.tier}>
                        <rect x={bx} y={y(t.pct)} width={bw} height={Math.max(330 - y(t.pct), 3)} rx={8}
                            fill={low ? C.co2 : C.base} fillOpacity={low ? 0.6 : 0.85} />
                        <SvgText x={bx + bw / 2} y={y(t.pct) - 10} anchor="middle" text={`${br(t.pct, t.pct % 1 ? 1 : 0)}%`} color={low ? C.text : C.base} size={18} weight={700} />
                        <SvgText x={bx + bw / 2} y={356} anchor="middle" text={`nível ${t.tier}`} color={C.text} size={16} weight={700} />
                        <SvgText x={bx + bw / 2} y={378} anchor="middle" text={t.name} color={C.muted} size={15} weight={500} />
                    </g>
                );
            })}
            <path d={`M ${x0} 398 L ${x0} 408 L ${x0 + 3 * bw + 2 * gap} 408 L ${x0 + 3 * bw + 2 * gap} 398`} fill="none" stroke={C.text} strokeWidth={2} />
            <SvgText x={x0 + 1.5 * bw + gap} y={430} anchor="middle" text="~70%: níveis 0–2" color={C.text} size={17} weight={700} />
            <path d={`M ${x0 + 4 * (bw + gap)} 398 L ${x0 + 4 * (bw + gap)} 408 L ${x0 + 6 * bw + 5 * gap} 408 L ${x0 + 6 * bw + 5 * gap} 398`} fill="none" stroke={C.base} strokeWidth={2} />
            <SvgText x={x0 + 5 * (bw + gap) - gap / 2} y={430} anchor="middle" text="10%: elite e classe mundial" color={C.base} size={17} weight={700} />
        </svg>
    );
};

/** Bicarbonato e mulheres: três recortes. */
export const BicarbWomen = () => (
    <svg width={WV_W} height={WV_H} viewBox={`0 0 ${WV_W} ${WV_H}`} role="img" aria-label="Estudos de bicarbonato com mulheres">
        <SvgText x={28} y={40} text="Estudos de bicarbonato e mulheres" color={C.text} size={18} weight={700} />
        {BICARB_BARS.map((b, i) => {
            const y = 80 + i * 96;
            return (
                <g key={b.label}>
                    <SvgText x={28} y={y + 4} text={b.label} color={C.text} size={17} />
                    <rect x={28} y={y + 16} width={600} height={30} rx={8} fill="rgba(255,255,255,0.06)" />
                    <rect x={28} y={y + 16} width={Math.max(600 * (b.pct / 100), 6)} height={30} rx={8} fill={WOMEN} fillOpacity={0.9} />
                    <SvgText x={40 + 600 * (b.pct / 100)} y={y + 38} text={`${br(b.pct, b.pct % 1 ? 1 : 0)}%`} color={WOMEN} size={20} weight={700} />
                    <SvgText x={628} y={y + 4} anchor="end" text={b.note} color={C.muted} size={15} weight={500} />
                </g>
            );
        })}
        <SvgText x={28} y={392} text="Efeito em mulheres (11 estudos): 0,37, CrI95% −0,06 a 0,92" color={WOMEN} size={17} weight={700} />
        <SvgText x={28} y={418} text="Recortes diferentes de bases diferentes: o ponto comum é a escassez." color={C.muted} size={16} weight={500} />
    </svg>
);

/** Os quatro personagens da aula (casos fictícios) contra o participante típico. */
export const CastCards = () => (
    <div className="p-4 grid grid-cols-2 gap-3" style={{ width: WV_W, height: WV_H }}>
        {CAST.map(p => (
            <div key={p.name} className="rounded-xl border border-white/10 p-4 flex flex-col gap-2" style={PANEL_BG}>
                <p className="flex items-baseline justify-between gap-2">
                    <span className="font-display text-[1.4rem] font-semibold text-white">{p.name}</span>
                    <span className="text-[15px] text-gray-300">{p.who}</span>
                </p>
                <p className="text-[16px] leading-snug text-gray-100">{p.gap}</p>
            </div>
        ))}
    </div>
);
