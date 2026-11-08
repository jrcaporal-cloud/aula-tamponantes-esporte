import { C } from '../kit/palette';
import type { Sport } from './content';

/**
 * Ilustrações geométricas dos quatro esportes (slide 12). Sem texto dentro: o viewBox pode ser qualquer um.
 * O movimento é `<animate>` do próprio SVG; com movimento reduzido ele simplesmente não é desenhado.
 */

export const ART_W = 260;
export const ART_H = 112;

interface ArtProps {
    color: string;
    animate: boolean;
}

const LINE = { fill: 'none', stroke: C.co2, strokeOpacity: 0.45, strokeWidth: 1.5 } as const;

const stadium = (cx: number, cy: number, half: number, r: number) =>
    `M ${cx - half} ${cy - r} L ${cx + half} ${cy - r} A ${r} ${r} 0 0 1 ${cx + half} ${cy + r} L ${cx - half} ${cy + r} A ${r} ${r} 0 0 1 ${cx - half} ${cy - r} Z`;

const Track = ({ color, animate }: ArtProps) => {
    const lane = stadium(130, 56, 52, 34);
    return (
        <g>
            {[26, 30, 34, 38, 42].map(r => <path key={r} d={stadium(130, 56, 52, r)} {...LINE} />)}
            <path d={`M 78 ${56 - 34} A 34 34 0 0 0 78 ${56 + 34} L 182 ${56 + 34}`} fill="none" stroke={C.acid} strokeOpacity={0.5} strokeWidth={14} />
            <circle r={6} fill={color}>
                {animate && <animateMotion dur="7s" repeatCount="indefinite" path={lane} keyPoints="0;1" keyTimes="0;1" />}
            </circle>
            {!animate && <circle cx={182} cy={90} r={6} fill={color} />}
        </g>
    );
};

const Mat = ({ color, animate }: ArtProps) => (
    <g>
        {[0, 1, 2, 3, 4, 5].map(i => (
            <rect key={i} x={70 + (i % 3) * 40} y={14 + Math.floor(i / 3) * 42} width={40} height={42} {...LINE} />
        ))}
        <rect x={70} y={14} width={120} height={84} fill={color} fillOpacity={0.06} stroke={color} strokeOpacity={0.5} />
        <g>
            {animate && <animateTransform attributeName="transform" type="rotate" values="0 130 56;360 130 56" dur="9s" repeatCount="indefinite" />}
            <line x1={112} y1={56} x2={148} y2={56} stroke={C.text} strokeOpacity={0.5} strokeWidth={3} />
            <circle cx={110} cy={56} r={12} fill={color} />
            <circle cx={150} cy={56} r={12} fill={C.text} fillOpacity={0.85} />
        </g>
    </g>
);

const Rowing = ({ color, animate }: ArtProps) => (
    <g>
        {[30, 56, 82].map(y => (
            <path key={y} d={`M 10 ${y} q 15 -6 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0 t 30 0`} {...LINE} strokeOpacity={0.3} />
        ))}
        {[20, 60, 100, 140, 180, 220].map(x => <circle key={x} cx={x + 10} cy={100} r={2.5} fill={C.co2} fillOpacity={0.6} />)}
        <ellipse cx={130} cy={56} rx={74} ry={6} fill={color} fillOpacity={0.85} />
        {[96, 130, 164].map(x => (
            <g key={x}>
                {animate && <animateTransform attributeName="transform" type="rotate" values={`-22 ${x} 56;22 ${x} 56;-22 ${x} 56`} dur="2.2s" repeatCount="indefinite" />}
                <line x1={x} y1={56} x2={x - 10} y2={14} stroke={C.text} strokeOpacity={0.7} strokeWidth={2} />
                <line x1={x} y1={56} x2={x - 10} y2={98} stroke={C.text} strokeOpacity={0.7} strokeWidth={2} />
            </g>
        ))}
    </g>
);

const Pool = ({ color, animate }: ArtProps) => (
    <g>
        <rect x={20} y={10} width={220} height={92} rx={4} fill={C.base} fillOpacity={0.05} stroke={C.co2} strokeOpacity={0.5} />
        {[33, 56, 79].map(y => <line key={y} x1={20} x2={240} y1={y} y2={y} stroke={C.co2} strokeOpacity={0.55} strokeDasharray="2 5" strokeWidth={2} />)}
        <circle cy={44.5} r={6} fill={color} cx={36}>
            {animate && <animate attributeName="cx" values="36;224;36;224;36" dur="10s" repeatCount="indefinite" />}
        </circle>
        <path d="M 20 70 q 10 -5 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0 t 20 0" fill="none" stroke={color} strokeOpacity={0.35} strokeWidth={1.5} />
    </g>
);

export const SportArt = ({ sport, color, animate }: { sport: Sport; color: string; animate: boolean }) => (
    <svg viewBox={`0 0 ${ART_W} ${ART_H}`} className="h-full w-full" aria-hidden>
        {sport === 'pista' && <Track color={color} animate={animate} />}
        {sport === 'tatame' && <Mat color={color} animate={animate} />}
        {sport === 'remo' && <Rowing color={color} animate={animate} />}
        {sport === 'piscina' && <Pool color={color} animate={animate} />}
    </svg>
);
