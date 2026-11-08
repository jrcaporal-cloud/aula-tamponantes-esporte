import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { shape } from './pico';
import { DAY_END, FIGHTS, WEIGH_IN, type DoseTiming } from './tatame';

/** Slide 26 — dia de competição ILUSTRATIVO do Rafael (viewBox 1096 × 270): dose, curva de HCO₃⁻, pesagem e lutas. */

export const TW = 1096;
export const TH = 270;
const X0 = 40;
const X1 = 1070;
const BASE = 170;
const AMP = 8;
const TP = 120;
const sx = (t: number) => X0 + (t / DAY_END) * (X1 - X0);
const sy = (v: number) => BASE - (v / 10) * 120;

const hco3 = (t: number, doseT: number) => (t <= doseT ? 0 : AMP * shape(t - doseT, TP));

export const MatTimeline = ({ timing }: { timing: DoseTiming }) => {
    const doseT = timing === 'antes' ? 0 : WEIGH_IN + 12;
    const pts = Array.from({ length: 121 }, (_, i) => (i / 120) * DAY_END);
    const area = `M${sx(0)} ${BASE} ` + pts.map(t => `L${sx(t).toFixed(1)} ${sy(hco3(t, doseT)).toFixed(1)}`).join(' ') + ` L${sx(DAY_END)} ${BASE} Z`;
    return (
        <svg viewBox={`0 0 ${TW} ${TH}`} width="100%" height="100%" role="img" aria-label="Dia de competição do Rafael">
            <line x1={X0} x2={X1} y1={sy(5)} y2={sy(5)} stroke={C.lactate} strokeDasharray="6 6" strokeOpacity={0.6} />
            <SvgText x={X1} y={sy(5) - 8} text="+5 mmol/L" anchor="end" size={16} weight={700} color={C.lactate} />
            <path d={area} fill={C.base} fillOpacity={0.18} stroke={C.base} strokeWidth={2.5} style={{ transition: 'd 0.6s' }} />
            <SvgText x={X0} y={22} text="Δ HCO₃⁻ (forma e horários ilustrativos)" size={16} weight={600} color="#CBD5E1" />
            {/* dose */}
            <g>
                <rect x={sx(doseT) - 4} y={36} width={8} height={BASE - 36} rx={4} fill={C.base} opacity={0.5} />
                <SvgText x={sx(doseT) + 10} y={52} text="dose 0,3 g/kg" size={17} weight={700} color={C.base} />
            </g>
            {/* pesagem */}
            <g>
                <line x1={sx(WEIGH_IN)} x2={sx(WEIGH_IN)} y1={10} y2={BASE + 50} stroke="#fff" strokeWidth={2.5} strokeDasharray="5 4" />
                <SvgText x={sx(WEIGH_IN) + 10} y={22} text="pesagem de quimono · tentativa única" size={17} weight={700} color="#fff" />
            </g>
            <line x1={X0} x2={X1} y1={BASE} y2={BASE} stroke="rgba(255,255,255,0.3)" />
            {FIGHTS.map((f, i) => {
                const covered = hco3(f.start, doseT) >= 5;
                const color = covered ? C.base : C.co2;
                return (
                    <g key={f.start}>
                        <rect x={sx(f.start)} y={BASE + 14} width={Math.max(sx(f.start + f.dur) - sx(f.start), 18)} height={30} rx={6}
                            fill={color} opacity={covered ? 0.9 : 0.45} />
                        <SvgText x={sx(f.start) + 12} y={BASE + 66} text={`luta ${i + 1}`} anchor="middle" size={16} weight={700} color={color} />
                        {!covered && i === 0 && (
                            <SvgText x={sx(f.start) + 24} y={BASE + 36} text="sem tampão" size={16} weight={700} color={C.co2} />
                        )}
                    </g>
                );
            })}
            {[0, 60, 120, 180, 240, 300, 360].map(t => (
                <SvgText key={t} x={sx(t)} y={TH - 4} text={`${t} min`} anchor={t === 0 ? 'start' : t === DAY_END ? 'end' : 'middle'} size={16} weight={500} color={C.muted} />
            ))}
        </svg>
    );
};
