import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import type { StationId } from './jornada';

/** Esquema copo → estômago → intestino → sangue → fibra (viewBox 1096 × 220). Partículas com <animate> do SVG. */

export const JW = 1096;
export const JH = 220;

const LABELS: Record<StationId | 'copo', { x: number; text: string }> = {
    copo: { x: 70, text: 'copo' },
    estomago: { x: 290, text: 'estômago' },
    intestino: { x: 545, text: 'intestino' },
    sangue: { x: 790, text: 'sangue' },
    fibra: { x: 1000, text: 'fibra muscular' },
};

const Arrow = ({ x }: { x: number }) => (
    <path d={`M${x} 92 l14 12 l-14 12`} fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" />
);

// Laços SMIL com begin negativo (cada partícula já nasce no meio do ciclo); com `reduce`, ficam paradas.
const Bubbles = ({ on, reduce }: { on: boolean; reduce: boolean }) => (
    <g opacity={on ? 1 : 0.35}>
        {[250, 275, 300, 322, 345, 262, 312].map((x, i) => (
            <circle key={x} cx={x} cy={reduce ? 140 - (i % 4) * 18 : 140} r={5 + (i % 3) * 2} fill="none" stroke={C.co2} strokeWidth={2}>
                {!reduce && <animate attributeName="cy" values="150;62;150" dur={`${2.2 + i * 0.35}s`} begin={`-${i * 0.3}s`} repeatCount="indefinite" />}
                {!reduce && <animate attributeName="opacity" values="0;1;0" dur={`${2.2 + i * 0.35}s`} begin={`-${i * 0.3}s`} repeatCount="indefinite" />}
            </circle>
        ))}
    </g>
);

const Drops = ({ on, reduce }: { on: boolean; reduce: boolean }) => (
    <g opacity={on ? 1 : 0}>
        {[490, 545, 600].map((x, i) => (
            <path key={x} d={`M${x} 30 q-7 12 0 18 q7 -6 0 -18`} fill="#60A5FA">
                {!reduce && <animateTransform attributeName="transform" type="translate" values="0 -6; 0 22; 0 -6" dur="1.8s" begin={`-${i * 0.4}s`} repeatCount="indefinite" />}
            </path>
        ))}
    </g>
);

const BloodDots = ({ many, reduce }: { many: boolean; reduce: boolean }) => (
    <g>
        {Array.from({ length: many ? 9 : 4 }, (_, i) => (
            <circle key={i} cx={reduce ? 728 + i * 15 : 720} cy={92 + (i % 3) * 12} r={5} fill={C.base}>
                {!reduce && <animate attributeName="cx" values="720;860" dur={`${2.4 + (i % 4) * 0.4}s`} begin={`-${i * 0.33}s`} repeatCount="indefinite" />}
            </circle>
        ))}
    </g>
);

const Protons = ({ out, reduce }: { out: boolean; reduce: boolean }) => (
    <g>
        {[0, 1, 2, 3, 4].map(i => (
            <g key={i}>
                <circle cx={1000} cy={70 + i * 16} r={6} fill={C.acid}>
                    {out && !reduce && <animate attributeName="cx" values="1010;900" dur={`${1.8 + i * 0.3}s`} begin={`-${i * 0.4}s`} repeatCount="indefinite" />}
                </circle>
            </g>
        ))}
    </g>
);

export const JourneyPipe = ({ active, reduce }: { active: StationId; reduce: boolean }) => {
    const dim = (id: StationId) => (id === active ? 1 : 0.4);
    return (
        <svg viewBox={`0 0 ${JW} ${JH}`} width="100%" height="100%" role="img" aria-label="Caminho do bicarbonato do copo à fibra">
            {/* copo */}
            <g opacity={active === 'estomago' ? 1 : 0.5}>
                <path d="M40 55 h60 l-8 100 h-44 Z" fill="rgba(255,255,255,0.05)" stroke="rgba(255,255,255,0.5)" strokeWidth={2} />
                <path d="M45 85 h50 l-5.5 70 h-39 Z" fill={C.base} opacity={0.5} />
            </g>
            <Arrow x={128} />
            {/* estômago */}
            <g opacity={dim('estomago')}>
                <path d="M200 70 C200 30 270 30 300 50 C340 75 390 70 385 120 C380 175 300 180 260 160 C215 140 200 110 200 70 Z"
                    fill="rgba(251,146,60,0.12)" stroke={C.acid} strokeWidth={2.5} />
                <Bubbles on={active === 'estomago'} reduce={reduce} />
                {active === 'estomago' && <SvgText x={292} y={28} text="CO₂" anchor="middle" size={20} weight={700} color={C.co2} />}
            </g>
            <Arrow x={404} />
            {/* intestino */}
            <g opacity={dim('intestino')}>
                <path d="M440 104 q26 -46 52 0 t52 0 t52 0 t52 0" fill="none" stroke="rgba(251,113,133,0.35)" strokeWidth={30} strokeLinecap="round" />
                <path d="M440 104 q26 -46 52 0 t52 0 t52 0 t52 0" fill="none" stroke={C.risk} strokeWidth={2} />
                <Drops on={active === 'intestino'} reduce={reduce} />
            </g>
            <Arrow x={672} />
            {/* sangue */}
            <g opacity={dim('sangue')}>
                <rect x={710} y={74} width={160} height={60} rx={30} fill="rgba(239,68,68,0.14)" stroke="#F87171" strokeWidth={2} />
                <BloodDots many={active === 'sangue' || active === 'fibra'} reduce={reduce} />
                <SvgText x={790} y={60} text="HCO₃⁻ ↑" anchor="middle" size={18} weight={700} color={C.base} />
            </g>
            {/* fibra */}
            <g opacity={dim('fibra')}>
                <rect x={920} y={50} width={160} height={116} rx={18} fill="rgba(251,146,60,0.08)" stroke="#FDA4AF" strokeWidth={2} />
                {[945, 975, 1005, 1035, 1060].map(x => <line key={x} x1={x} x2={x} y1={58} y2={158} stroke="rgba(253,164,175,0.25)" strokeWidth={3} />)}
                <Protons out={active === 'fibra'} reduce={reduce} />
                {active === 'fibra' && <SvgText x={895} y={40} text="← H⁺ e lactato saem" anchor="middle" size={17} weight={700} color={C.acid} />}
            </g>
            {(Object.keys(LABELS) as (StationId | 'copo')[]).map(id => (
                <SvgText key={id} x={LABELS[id].x} y={206} text={LABELS[id].text} anchor="middle" size={19} weight={700}
                    color={id === active ? '#fff' : C.muted} />
            ))}
        </svg>
    );
};
