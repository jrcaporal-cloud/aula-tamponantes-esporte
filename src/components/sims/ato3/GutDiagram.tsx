import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/** Trato GI esquemático (viewBox 500 × 372): estômago com CO₂, intestino que puxa água, pele à direita. */

export const GW = 500;
export const GH = 372;

interface GutDiagramProps {
    /** Destaque dos dois lugares do sintoma. */
    sites: boolean;
    on: ReadonlySet<string>;
    /** Movimento reduzido: bolhas e gotas ficam paradas (sem os laços SMIL). */
    reduce: boolean;
}

const STOMACH = 'M120 40 C112 70 108 100 130 130 C150 160 200 190 250 178 C300 166 318 130 300 100 C285 76 250 84 236 70 C220 54 200 40 150 34 Z';
const GUT = 'M300 150 C330 170 340 200 320 214 C280 240 140 220 120 250 C100 280 160 290 220 284 C300 276 380 270 380 300 C380 330 260 336 200 334';

// Laços SMIL com begin negativo: cada bolha/gota já nasce no meio do seu ciclo, sem esperar o próprio atraso.
const Bubbles = ({ dim, reduce }: { dim: boolean; reduce: boolean }) => (
    <g opacity={dim ? 0.35 : 1}>
        {[150, 172, 196, 222, 248, 270, 186, 236].map((x, i) => (
            <circle key={x} cx={x} cy={reduce ? 150 - (i % 4) * 18 : 150} r={5 + (i % 3) * 2.5} fill="none" stroke={C.co2} strokeWidth={2}>
                {!reduce && <animate attributeName="cy" values={`${158 - (i % 2) * 8};72;${158 - (i % 2) * 8}`} dur={`${2 + i * 0.3}s`} begin={`-${i * 0.25}s`} repeatCount="indefinite" />}
                {!reduce && <animate attributeName="opacity" values="0;1;0" dur={`${2 + i * 0.3}s`} begin={`-${i * 0.25}s`} repeatCount="indefinite" />}
            </circle>
        ))}
    </g>
);

const Water = ({ reduce }: { reduce: boolean }) => (
    <g>
        {[[170, 230], [260, 262], [330, 290], [240, 318]].map(([x, y], i) => (
            <path key={x} d={`M${x} ${y - 30} q-6 10 0 15 q6 -5 0 -15`} fill="#60A5FA">
                {!reduce && <animateTransform attributeName="transform" type="translate" values="0 -8; 0 10; 0 -8" dur="1.8s" begin={`-${i * 0.35}s`} repeatCount="indefinite" />}
            </path>
        ))}
    </g>
);

/** Marcador de estratégia ligada: pílula com o nome curto, perto do lugar onde age. */
const Pin = ({ x, y, text, color }: { x: number; y: number; text: string; color: string }) => (
    <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3 }}
        style={{ transformBox: 'fill-box', transformOrigin: 'center' }}>
        <rect x={x} y={y - 16} width={text.length * 9 + 22} height={30} rx={15} fill="rgba(4,8,15,0.85)" stroke={color} strokeWidth={2} />
        <SvgText x={x + 11} y={y + 5} text={text} size={16} weight={700} color={color} />
    </motion.g>
);

export const GutDiagram = ({ sites, on, reduce }: GutDiagramProps) => (
    <svg viewBox={`0 0 ${GW} ${GH}`} width="100%" height="100%" role="img" aria-label="Esquema do trato gastrintestinal">
        <path d="M128 0 C126 14 124 26 122 40" fill="none" stroke="rgba(255,255,255,0.35)" strokeWidth={16} strokeLinecap="round" />
        <path d={GUT} fill="none" stroke="rgba(251,113,133,0.22)" strokeWidth={34} strokeLinecap="round" />
        <path d={GUT} fill="none" stroke={C.risk} strokeOpacity={0.7} strokeWidth={2} />
        <path d={STOMACH} fill="rgba(251,146,60,0.12)" stroke={C.acid} strokeWidth={2.5} />
        {on.has('refeicao') && [[160, 150], [190, 162], [222, 158]].map(([x, y]) => <rect key={x} x={x} y={y} width={22} height={12} rx={4} fill={C.lactate} opacity={0.75} />)}
        <Bubbles dim={!sites && !on.size} reduce={reduce} />
        {sites && <Water reduce={reduce} />}
        {sites && (
            <g>
                <SvgText x={300} y={50} text="CO₂: estufamento" size={17} weight={700} color={C.co2} />
                <SvgText x={20} y={360} text="soluto puxa água: diarreia" size={17} weight={700} color="#93C5FD" />
            </g>
        )}
        {/* Fora do estômago, à esquerda: as bolhas de CO₂ sobem pelo meio dele e cobriam o rótulo. */}
        {!sites && <SvgText x={102} y={98} text="estômago" anchor="end" size={17} weight={700} color={C.acid} />}
        {!sites && <SvgText x={395} y={250} text="intestino" anchor="middle" size={17} weight={700} color={C.risk} />}
        <rect x={470} y={20} width={22} height={330} rx={6} fill="rgba(253,186,116,0.15)" stroke="rgba(253,186,116,0.4)" />
        <SvgText x={481} y={364} text="pele" anchor="middle" size={16} weight={600} color={C.muted} />
        {on.has('tempo') && <Pin x={300} y={92} text="120–180 min" color={C.ok} />}
        {on.has('multidia') && <Pin x={300} y={128} text="3–7 dias" color={C.base} />}
        {on.has('fracionar') && <Pin x={150} y={14} text="doses menores" color={C.base} />}
        {on.has('refeicao') && <Pin x={20} y={196} text="com comida" color={C.ok} />}
        {on.has('capsula') && <Pin x={160} y={300} text="abre no intestino" color={C.ok} />}
        {on.has('hidrogel') && <Pin x={250} y={212} text="gel passa o piloro" color={C.lactate} />}
        {on.has('locao') && (
            <g>
                <Pin x={250} y={344} text="loção: sangue igual" color={C.risk} />
                <path d="M466 160 l-26 0" stroke={C.risk} strokeWidth={3} />
                <SvgText x={432} y={166} text="✕" anchor="middle" size={20} weight={800} color={C.risk} />
            </g>
        )}
    </svg>
);
