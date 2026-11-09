import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Cena da lançadeira de lactato: fibra glicolítica → sangue → fibra oxidativa, coração e fígado.
 * As partículas andam com <animateMotion> (SVG nativo); com movimento reduzido, ficam só as rotas.
 * Quantidades de partículas por rota são ilustrativas (≈ 4/5 oxidado, 1/5 glicose).
 */

export const SCENE_W = 744;
export const SCENE_H = 440;

const EXIT = 'M150 230 L252 230 L372 230';
interface Route {
    id: string;
    d: string;
    count: number;
    color: string;
}
const ROUTES: readonly Route[] = [
    { id: 'fibra', d: `${EXIT} L372 125 L494 125 L640 125`, count: 4, color: C.lactate },
    { id: 'coracao', d: `${EXIT} L372 272 L494 272 L640 272`, count: 3, color: C.lactate },
    // Entra no fígado abaixo do rótulo "vira glicose" (y 390): a partícula não passa por cima do texto.
    { id: 'figado', d: `${EXIT} L372 410 L494 410 L620 410`, count: 2, color: C.lactate },
];

/** Lactato parado dentro da fibra glicolítica (posições fixas). */
const POOL = Array.from({ length: 14 }, (_, i) => ({ x: 52 + (i % 5) * 40 + (i % 2) * 10, y: 150 + Math.floor(i / 5) * 46 + (i % 3) * 8 }));

interface ShuttleSceneProps {
    step: number;
    reduce: boolean;
}

const Box = ({ x, y, w, h, title, sub, color }: { x: number; y: number; w: number; h: number; title: string; sub: string; color: string }) => (
    <g>
        <rect x={x} y={y} width={w} height={h} rx={18} fill={`${color}14`} stroke={`${color}88`} strokeWidth={2} />
        <SvgText x={x + 22} y={y + 28} text={title} size={18} color={color} weight={700} />
        <SvgText x={x + 22} y={y + 50} text={sub} size={16} color="#CBD5E1" weight={500} />
    </g>
);

const Door = ({ x, y, label, side = 'top' }: { x: number; y: number; label: string; side?: 'top' | 'left' }) => (
    <g>
        <rect x={x - 9} y={y - 18} width={18} height={36} rx={5} fill="#0B1220" stroke={C.lactate} strokeWidth={2} />
        {side === 'top'
            ? <SvgText x={x} y={y - 26} text={label} anchor="middle" size={16} color={C.lactate} weight={700} />
            : <SvgText x={x - 14} y={y - 12} text={label} anchor="end" size={16} color={C.lactate} weight={700} />}
    </g>
);

export const ShuttleScene = ({ step, reduce }: ShuttleSceneProps) => {
    const flowing = step >= 1;
    const split = step >= 2;
    const recovery = step === 3;
    const dur = recovery ? 7 : 3.6;
    const routes = split ? ROUTES : ROUTES.slice(0, 1);
    return (
        <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} width={SCENE_W} height={SCENE_H} role="img" aria-label="Lançadeira de lactato entre tecidos">
            <Box x={16} y={60} w={236} h={330} title="fibra glicolítica" sub="tipo II · produz" color={C.acid} />
            <rect x={334} y={16} width={76} height={408} rx={30} fill="rgba(148,163,184,0.10)" stroke="rgba(148,163,184,0.45)" />
            <SvgText x={372} y={44} text="sangue" anchor="middle" size={16} color="#CBD5E1" weight={700} />
            <Box x={494} y={66} w={236} h={110} title="fibra oxidativa" sub="tipo I · oxida" color={C.base} />
            <Box x={494} y={210} w={236} h={110} title="coração" sub="oxida" color={C.base} />
            <g style={{ opacity: split ? 1 : 0.35, transition: 'opacity 0.5s' }}>
                <Box x={494} y={340} w={236} h={84} title="fígado" sub="vira glicose" color={C.co2} />
            </g>

            {/* Lactato acumulado na fibra rápida: esvazia na recuperação. */}
            {POOL.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r={8} fill={C.lactate}
                    style={{ opacity: recovery ? (i < 3 ? 0.9 : 0.08) : 0.9, transition: 'opacity 1.2s' }}>
                    {!reduce && !recovery && <animate attributeName="r" values="7;9;7" dur={`${1.6 + (i % 4) * 0.3}s`} repeatCount="indefinite" />}
                </circle>
            ))}
            <SvgText x={134} y={360} text="glicose → piruvato → lactato" anchor="middle" size={16} color={C.acidSoft} weight={600} />

            <g style={{ opacity: flowing ? 1 : 0, transition: 'opacity 0.5s' }}>
                <Door x={252} y={230} label="MCT4" />
                <Door x={494} y={125} label="MCT1" side="left" />
                <Door x={494} y={272} label="MCT1" side="left" />
                {routes.map(r => <path key={r.id} d={r.d} fill="none" stroke={C.lactate} strokeOpacity={0.25} strokeWidth={3} strokeDasharray="6 8" />)}
                {flowing && !reduce && routes.flatMap(r => Array.from({ length: r.count }, (_, k) => (
                    <circle key={`${r.id}-${k}`} r={7} fill={r.color} stroke="#04080F" strokeWidth={1.5}>
                        <animateMotion dur={`${dur}s`} begin={`-${((k * dur) / r.count).toFixed(2)}s`} repeatCount="indefinite" path={r.d} />
                    </circle>
                )))}
            </g>
            <g style={{ opacity: split ? 1 : 0, transition: 'opacity 0.5s' }}>
                <SvgText x={700} y={154} text="→ CO₂" anchor="end" size={16} color={C.co2} weight={700} />
                <SvgText x={700} y={300} text="→ CO₂" anchor="end" size={16} color={C.co2} weight={700} />
            </g>
        </svg>
    );
};
