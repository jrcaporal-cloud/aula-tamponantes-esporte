import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { br } from '../kit/format';
import { PH_EXHAUSTION, PH_REST, mixHex } from './race';

/** Medidor vertical do pH muscular (slide 10). Extremos de SAHLIN1976; o trajeto entre eles é ilustrativo. */

export const GAUGE_W = 398;
export const GAUGE_H = 234;

const TOP = 7.15;
const BOTTOM = 6.5;
const Y0 = 48;
const Y1 = 204;
const X0 = 34;
const X1 = 62;
const py = (ph: number) => Y0 + ((TOP - ph) / (TOP - BOTTOM)) * (Y1 - Y0);

export const PhGauge = ({ ph }: { ph: number }) => {
    const k = (PH_REST - ph) / (PH_REST - PH_EXHAUSTION);
    const color = mixHex(C.base, C.acid, k);
    const y = py(ph);
    return (
        <svg viewBox={`0 0 ${GAUGE_W} ${GAUGE_H}`} className="h-full w-full" role="img" aria-label={`pH muscular ${br(ph, 2)}`}>
            <defs>
                <linearGradient id="ato1-ph-tube" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={C.base} />
                    <stop offset="100%" stopColor={C.acid} />
                </linearGradient>
            </defs>
            <SvgText x={20} y={30} text="pH muscular (vasto lateral)" color={C.muted} size={17} />

            <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} rx={14} fill="url(#ato1-ph-tube)" opacity={0.2} />
            <rect x={X0} y={y} width={X1 - X0} height={Math.max(Y1 - y, 0)} rx={10} fill="url(#ato1-ph-tube)" opacity={0.8} />
            <rect x={X0} y={Y0} width={X1 - X0} height={Y1 - Y0} rx={14} fill="none" stroke={C.co2} strokeOpacity={0.5} />

            {[{ ph: PH_REST, label: 'repouso' }, { ph: PH_EXHAUSTION, label: 'exaustão' }].map(m => (
                <g key={m.label}>
                    <line x1={X1 + 2} x2={X1 + 14} y1={py(m.ph)} y2={py(m.ph)} stroke={C.text} strokeOpacity={0.7} strokeWidth={2} />
                    <SvgText x={X1 + 20} y={py(m.ph) + 6} text={`${br(m.ph, 2)} ${m.label}`} color={C.text} size={16} />
                </g>
            ))}

            {/* Ponteiro */}
            <line x1={X0 - 8} x2={X1 + 8} y1={y} y2={y} stroke={color} strokeWidth={3} />
            <path d={`M ${X0 - 18} ${y - 7} L ${X0 - 8} ${y} L ${X0 - 18} ${y + 7} Z`} fill={color} />

            <SvgText x={378} y={104} text="agora" color={C.muted} size={16} anchor="end" />
            <SvgText x={378} y={162} text={br(ph, 2)} color={color} size={64} anchor="end" weight={700} />
            <SvgText x={20} y={GAUGE_H - 6} text="7,08 e 6,60: biópsia, Sahlin 1976" color={C.muted} size={16} />
        </svg>
    );
};
