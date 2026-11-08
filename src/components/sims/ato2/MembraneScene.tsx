import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { EFFLUX } from './whyItWorks.content';

/**
 * Membrana da fibra em corte: H⁺ e lactato dentro, bicarbonato fora, três portas MCT.
 * Com alcalose, mais bicarbonato fora e mais partículas atravessando (proporção do efluxo
 * medido por Hollidge 2000; posições e contagens ilustrativas). Partículas em <animateMotion>.
 */

export const MEM_W = 640;
export const MEM_H = 440;
const MEM_X = 312;
const DOORS = [130, 220, 310] as const;

/** Pontos fixos (sem sorteio) dentro e fora da fibra. */
const spread = (n: number, x0: number, w: number, seed: number) => Array.from({ length: n }, (_, i) => ({
    x: x0 + ((seed + (i + 1) * 0.7548776662) % 1) * w,
    y: 80 + ((seed * 0.5 + (i + 1) * 0.5698402910) % 1) * 290,
}));
const INSIDE = spread(16, 30, 230, 0.13);
const OUTSIDE = spread(18, 370, 240, 0.41);

interface MembraneSceneProps {
    alkalosis: boolean;
    showEfflux: boolean;
    showK: boolean;
    reduce: boolean;
}

export const MembraneScene = ({ alkalosis, showEfflux, showK, reduce }: MembraneSceneProps) => {
    const outside = alkalosis ? 18 : 10;
    const perDoor = alkalosis ? 3 : 1;
    const efflux = alkalosis ? EFFLUX.alcalose : EFFLUX.controle;
    return (
        <svg viewBox={`0 0 ${MEM_W} ${MEM_H}`} width={MEM_W} height={MEM_H} role="img"
            aria-label={`Membrana da fibra, ${alkalosis ? 'com alcalose' : 'controle'}: efluxo ${br(efflux, 1)} mmol/min`}>
            <rect x={0} y={0} width={MEM_X} height={MEM_H} fill="rgba(251,146,60,0.07)" />
            <rect x={MEM_X + 24} y={0} width={MEM_W - MEM_X - 24} height={MEM_H} fill={alkalosis ? 'rgba(34,211,238,0.12)' : 'rgba(34,211,238,0.04)'}
                style={{ transition: 'fill 0.6s' }} />
            <SvgText x={20} y={36} text="dentro da fibra" size={18} color={C.acidSoft} weight={700} />
            <SvgText x={MEM_W - 20} y={36} text={alkalosis ? 'fora · alcalose' : 'fora · controle'} anchor="end" size={18} color={C.baseSoft} weight={700} />
            <rect x={MEM_X} y={0} width={24} height={MEM_H} fill="rgba(148,163,184,0.25)" />
            {DOORS.map(y => (
                <g key={y}>
                    <rect x={MEM_X - 6} y={y - 20} width={36} height={40} rx={8} fill="#0B1220" stroke={C.lactate} strokeWidth={2} />
                    <SvgText x={MEM_X + 12} y={y + 6} text="MCT" anchor="middle" size={16} color={C.lactate} weight={700} />
                </g>
            ))}
            {INSIDE.map((p, i) => <circle key={`in${i}`} cx={p.x} cy={p.y} r={7} fill={i % 2 ? C.lactate : C.acid} opacity={0.85} />)}
            {OUTSIDE.map((p, i) => (
                <g key={`out${i}`} style={{ opacity: i < outside ? 1 : 0, transition: 'opacity 0.5s' }}>
                    <circle cx={p.x} cy={p.y} r={10} fill="none" stroke={C.base} strokeWidth={2.5} />
                    <circle cx={p.x} cy={p.y} r={3} fill={C.base} />
                </g>
            ))}
            {/* O bicarbonato não atravessa: seta bloqueada. */}
            <g opacity={0.9}>
                <line x1={420} x2={352} y1={392} y2={392} stroke={C.base} strokeWidth={3} />
                <line x1={346} x2={366} y1={382} y2={402} stroke={C.risk} strokeWidth={3} />
                <line x1={366} x2={346} y1={382} y2={402} stroke={C.risk} strokeWidth={3} />
                <SvgText x={430} y={398} text="HCO₃⁻ não entra" size={16} color={C.baseSoft} weight={600} />
            </g>
            {showEfflux && !reduce && DOORS.flatMap(y => Array.from({ length: perDoor }, (_, k) => {
                const path = `M${MEM_X - 70} ${y} L${MEM_X + 110} ${y}`;
                return (
                    <g key={`${y}-${k}-${perDoor}`}>
                        <circle r={7} fill={C.acid}>
                            <animateMotion dur="2.2s" begin={`-${((k * 2.2) / perDoor).toFixed(2)}s`} repeatCount="indefinite" path={path} />
                        </circle>
                        <circle r={6} fill={C.lactate}>
                            <animateMotion dur="2.2s" begin={`-${((k * 2.2) / perDoor + 0.18).toFixed(2)}s`} repeatCount="indefinite" path={`M${MEM_X - 70} ${y + 12} L${MEM_X + 110} ${y + 12}`} />
                        </circle>
                    </g>
                );
            }))}
            {showEfflux && (
                <g>
                    <SvgText x={20} y={MEM_H - 22} text="efluxo de lactato da perna" size={16} color="#CBD5E1" weight={500} />
                    <rect x={214} y={MEM_H - 38} width={90} height={20} rx={6} fill="rgba(255,255,255,0.08)" />
                    <SvgText x={214} y={MEM_H - 46} text={`${br(efflux, 1)} mmol/min`} size={17} color={C.lactate} weight={700} />
                    <rect x={214} y={MEM_H - 38} width={90 * (efflux / EFFLUX.alcalose)} height={20} rx={6} fill={C.lactate} style={{ transition: 'width 0.6s' }} />
                </g>
            )}
            {showK && (
                <SvgText x={MEM_W - 20} y={70} text={alkalosis ? 'K⁺ intersticial 8,0 mM' : 'K⁺ intersticial 11,0 mM'} anchor="end" size={16} color="#E5E7EB" weight={700} />
            )}
        </svg>
    );
};
