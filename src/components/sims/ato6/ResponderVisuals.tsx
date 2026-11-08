import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br, signed } from '../kit/format';
import { FROIO_SESSIONS, RESPONDER_CUT } from './responderContent';

/** Cascatas (suplemento × controle) e o painel das 4 tentativas de Froio 2015. Caixa 696 × 440. */

export const RV_W = 696;
export const RV_H = 440;
const LO = -10;
const HI = 12;
const TOP = 70;
const BOT = 380;
const y = (v: number) => BOT - ((Math.min(Math.max(v, LO), HI) - LO) / (HI - LO)) * (BOT - TOP);

const tone = (v: number) => (v > RESPONDER_CUT ? C.ok : v <= 0 ? C.risk : C.co2);

interface WaterfallProps {
    x0: number;
    title: string;
    titleColor: string;
    /** Valores já ordenados, na escala atual (mistura verdade → medido). */
    values: readonly number[];
    colored: boolean;
    trueEffect: number;
}

const Waterfall = ({ x0, title, titleColor, values, colored, trueEffect }: WaterfallProps) => {
    const bw = 15;
    return (
        <g>
            <SvgText x={x0} y={40} text={title} color={titleColor} size={18} weight={700} />
            <line x1={x0} x2={x0 + values.length * bw} y1={y(trueEffect)} y2={y(trueEffect)} stroke={C.base} strokeWidth={2} strokeDasharray="6 5" />
            {values.map((v, i) => (
                <rect key={i} x={x0 + i * bw + 1} y={Math.min(y(v), y(0))} width={bw - 3} height={Math.max(Math.abs(y(v) - y(0)), 2)} rx={2}
                    fill={colored ? tone(v) : C.base} fillOpacity={0.85} />
            ))}
        </g>
    );
};

interface CascadeProps {
    supplement: readonly number[];
    control: readonly number[] | null;
    colored: boolean;
}

export const Cascades = ({ supplement, control, colored }: CascadeProps) => (
    <svg width={RV_W} height={RV_H} viewBox={`0 0 ${RV_W} ${RV_H}`} role="img" aria-label="Mudanças individuais">
        {[-8, -4, 0, 4, 8].map(v => (
            <g key={v}>
                <line x1={56} x2={RV_W - 16} y1={y(v)} y2={y(v)} stroke={v === 0 ? 'rgba(255,255,255,0.45)' : 'rgba(255,255,255,0.07)'} />
                <SvgText x={48} y={y(v) + 6} anchor="end" text={`${signed(v, 0)}%`} color={C.muted} size={16} weight={500} />
            </g>
        ))}
        <Waterfall x0={66} title="Suplemento (efeito real +2%)" titleColor={C.baseSoft} values={supplement} colored={colored} trueEffect={2} />
        {control
            ? <Waterfall x0={380} title="Placebo (efeito real 0)" titleColor={C.text} values={control} colored={colored} trueEffect={0} />
            : <SvgText x={530} y={230} anchor="middle" text="grupo controle: ainda não olhamos" color={C.muted} size={17} />}
        {colored && (
            <g>
                <rect x={66} y={408} width={14} height={14} rx={3} fill={C.ok} />
                <SvgText x={86} y={421} text={`"respondedor" (> +${RESPONDER_CUT}%)`} color={C.text} size={16} weight={500} />
                <rect x={330} y={408} width={14} height={14} rx={3} fill={C.risk} />
                <SvgText x={350} y={421} text={'"não respondedor" (≤ 0)'} color={C.text} size={16} weight={500} />
                <SvgText x={RV_W - 16} y={421} anchor="end" text="--- efeito real" color={C.base} size={16} weight={500} />
            </g>
        )}
    </svg>
);

/** Froio 2015: as 4 sessões do grupo e o destino dos 15 atletas. */
export const FourTrials = () => {
    const by = (v: number) => 330 - v * 34;
    return (
        <svg width={RV_W} height={RV_H} viewBox={`0 0 ${RV_W} ${RV_H}`} role="img" aria-label="Quatro sessões com bicarbonato">
            <SvgText x={28} y={40} text="Mesmo grupo, mesma dose, 4 sessões: trabalho vs. placebo" color={C.text} size={18} weight={700} />
            <line x1={60} x2={400} y1={by(0)} y2={by(0)} stroke="rgba(255,255,255,0.4)" />
            {FROIO_SESSIONS.map((v, i) => (
                <g key={i}>
                    <rect x={78 + i * 80} y={by(v)} width={56} height={by(0) - by(v)} rx={6} fill={C.base} fillOpacity={0.7} />
                    <SvgText x={106 + i * 80} y={by(v) - 10} anchor="middle" text={`+${br(v, 1)}%`} color={C.baseSoft} size={18} weight={700} />
                    <SvgText x={106 + i * 80} y={by(0) + 26} anchor="middle" text={`sessão ${i + 1}`} color={C.muted} size={16} weight={500} />
                </g>
            ))}
            <SvgText x={60} y={398} text="todas p > 0,05 · alcalose igual nas 4" color={C.muted} size={16} weight={500} />

            <SvgText x={440} y={108} text="Os 15 atletas" color={C.text} size={18} weight={700} />
            {Array.from({ length: 15 }, (_, i) => (
                <circle key={i} cx={460 + (i % 5) * 44} cy={150 + Math.floor(i / 5) * 44} r={16}
                    fill={i < 10 ? C.ok : C.risk} fillOpacity={0.85} stroke="#04080F" strokeWidth={2} />
            ))}
            <SvgText x={440} y={300} text="10 melhoraram além do ruído" color={C.ok} size={17} weight={700} />
            <SvgText x={440} y={322} text="em pelo menos 1 sessão" color={C.ok} size={16} weight={500} />
            <SvgText x={440} y={356} text="5 nunca melhoraram" color={C.risk} size={17} weight={700} />

        </svg>
    );
};
