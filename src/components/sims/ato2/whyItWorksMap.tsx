import { motion } from 'framer-motion';
import { EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { HYPOTHESES } from './whyItWorks.content';
import { MEM_H, MEM_W } from './MembraneScene';

/**
 * Slide 15, passo 5 — "Soma de mecanismos". A fibra esquemática com os cinco lugares onde a alcalose
 * pode agir; cada um acende em sequência com a prova que tem (humano × animal/in vitro, dossiê 03).
 */

type HypothesisId = (typeof HYPOTHESES)[number]['id'];

/** Onde cada mecanismo mora no desenho. */
const SPOT: Record<HypothesisId, { x: number; y: number }> = {
    efflux: { x: 246, y: 116 },
    glyco: { x: 84, y: 112 },
    k: { x: 280, y: 212 },
    xb: { x: 150, y: 226 },
    sense: { x: 132, y: 382 },
};

const BOX_X = 316;
const BOX_W = 316;
const BOX_H = 76;
const BOX_GAP = 8;
const BOX_Y0 = 14;

const Fiber = ({ reduce }: { reduce: boolean }) => (
    <g>
        <rect x={20} y={58} width={226} height={250} rx={26} fill="rgba(251,146,60,0.09)" stroke={C.acidSoft} strokeOpacity={0.5} strokeWidth={2} />
        <SvgText x={34} y={46} text="fibra" size={17} color={C.acidSoft} weight={700} />
        {/* porta MCT na membrana */}
        <rect x={232} y={96} width={28} height={40} rx={7} fill="#0B1220" stroke={C.lactate} strokeWidth={2} />
        {/* engrenagem da glicólise */}
        <g transform="translate(84 112)">
            <g>
                {Array.from({ length: 8 }, (_, i) => <rect key={i} x={-4} y={-20} width={8} height={9} rx={2} fill={C.acidSoft} transform={`rotate(${i * 45})`} />)}
                <circle r={13} fill="none" stroke={C.acidSoft} strokeWidth={5} />
                {!reduce && <animateTransform attributeName="transform" type="rotate" from="0" to="360" dur="3s" repeatCount="indefinite" />}
            </g>
        </g>
        {/* filamentos: actina fina, miosina grossa com cabeças (ponte cruzada) */}
        {[204, 248].map(y => <line key={y} x1={44} x2={226} y1={y} y2={y} stroke="#CBD5E1" strokeWidth={2} opacity={0.6} />)}
        <line x1={70} x2={200} y1={226} y2={226} stroke={C.carnoSoft} strokeWidth={7} strokeLinecap="round" opacity={0.85} />
        {[84, 108, 132, 156, 180].map(x => (
            <g key={x} stroke={C.carnoSoft} strokeWidth={3} strokeLinecap="round">
                <path d={`M${x} 222 l8 -14`} />
                <path d={`M${x} 230 l8 14`} />
            </g>
        ))}
        {/* K⁺ do lado de fora */}
        {[[272, 190], [292, 206], [274, 228], [296, 236]].map(([x, y]) => <circle key={`${x}${y}`} cx={x} cy={y} r={6} fill="#E5E7EB" opacity={0.85} />)}
        {/* aferente III–IV até o cérebro */}
        <path d="M150 308 C150 336 132 344 132 360" fill="none" stroke={C.co2} strokeWidth={3} />
        {!reduce && (
            <circle r={4} fill="#fff">
                <animateMotion dur="1.6s" repeatCount="indefinite" path="M150 290 C150 336 132 344 132 368" />
            </circle>
        )}
        <path d="M108 382 C104 364 124 356 132 364 C140 354 162 362 158 380 C166 390 156 404 144 400 C136 410 116 408 114 398 C102 398 100 386 108 382 Z"
            fill="rgba(148,163,184,0.18)" stroke={C.co2} strokeWidth={2} />
    </g>
);

export const MechanismMap = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox={`0 0 ${MEM_W} ${MEM_H}`} width={MEM_W} height={MEM_H} role="img" aria-label="Mapa dos cinco mecanismos da alcalose na fibra">
        <Fiber reduce={reduce} />
        {HYPOTHESES.map((h, i) => {
            const y = BOX_Y0 + i * (BOX_H + BOX_GAP);
            const s = SPOT[h.id];
            const delay = reduce ? 0 : 0.2 + i * 0.35;
            const other = h.other === '—' ? 'animal/in vitro: —' : `animal/in vitro: ${h.other}`;
            return (
                <motion.g key={h.id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.35, delay, ease: EASE_OUT }}>
                    <path d={`M${BOX_X} ${y + BOX_H / 2} C${BOX_X - 30} ${y + BOX_H / 2} ${s.x + 30} ${s.y} ${s.x} ${s.y}`} fill="none" stroke={C.base} strokeOpacity={0.55} strokeWidth={1.5} />
                    <circle cx={s.x} cy={s.y} r={15} fill="none" stroke={C.base} strokeWidth={2.5}>
                        {!reduce && <animate attributeName="r" values="13;19;13" dur="2.4s" begin={`${delay}s`} repeatCount="indefinite" />}
                    </circle>
                    <rect x={BOX_X} y={y} width={BOX_W} height={BOX_H} rx={12} fill="rgba(4,8,15,0.88)" stroke="rgba(255,255,255,0.14)" />
                    <circle cx={BOX_X + 18} cy={y + 22} r={11} fill={C.baseDeep} />
                    <SvgText x={BOX_X + 18} y={y + 28} text={`${i + 1}`} anchor="middle" size={16} color="#fff" weight={800} />
                    <SvgText x={BOX_X + 36} y={y + 28} text={h.label} size={16} color="#fff" weight={700} />
                    <SvgText x={BOX_X + 12} y={y + 50} text={`humano: ${h.human}`} size={15} color={C.ok} weight={500} />
                    <SvgText x={BOX_X + 12} y={y + 69} text={other} size={15} color="#FDE68A" weight={500} />
                </motion.g>
            );
        })}
        <SvgText x={20} y={432} text="peso de cada um: incerto" size={16} color="#CBD5E1" weight={600} />
    </svg>
);
