import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';

/**
 * Neurônio sensorial da pele com MrgprD (esquema). β-alanina liga no receptor, a cascata (MrgprD → PKA → TRPA1 → Ca²⁺)
 * dispara potenciais que correm até o gânglio da raiz dorsal. O mastócito fica apagado: a via não usa histamina.
 * A cascata PKA → TRPA1 vem de modelo em camundongo (Wang 2019).
 */

const W = 670;
const H = 400;
const AXON = 'M300 74 C 300 160, 250 210, 190 250 S 110 320, 110 330';
const TIPS = [{ x: 262, y: 40 }, { x: 300, y: 30 }, { x: 338, y: 40 }] as const;
const CASCADE = ['β-alanina', 'MrgprD', 'PKA', 'TRPA1', 'entra Ca²⁺', 'disparo'] as const;
const LIGANDS = [{ x: 240, y: 22 }, { x: 322, y: 16 }, { x: 360, y: 26 }, { x: 278, y: 12 }] as const;

export const ItchNeuron = ({ reduce }: { reduce: boolean }) => (
    <svg width={W} height={H} viewBox={`0 0 ${W} ${H}`} role="img" aria-label="Neurônio da pele com o receptor MrgprD disparando">
        <rect x={0} y={0} width={W} height={92} fill="#F9A8D4" fillOpacity={0.07} />
        <line x1={0} x2={W} y1={92} y2={92} stroke={C.risk} strokeOpacity={0.35} />
        <SvgText x={14} y={30} text="pele" color={C.risk} size={17} weight={700} />

        <path d={AXON} fill="none" stroke={C.text} strokeOpacity={0.75} strokeWidth={5} strokeLinecap="round" />
        {TIPS.map(t => (
            <g key={t.x}>
                <line x1={300} y1={78} x2={t.x} y2={t.y + 8} stroke={C.text} strokeOpacity={0.75} strokeWidth={3.5} strokeLinecap="round" />
                <path d={`M${t.x - 7} ${t.y - 4} L${t.x} ${t.y + 6} L${t.x + 7} ${t.y - 4}`} fill="none" stroke={C.carno} strokeWidth={3.5} strokeLinecap="round" />
            </g>
        ))}
        {LIGANDS.map(l => <circle key={`${l.x}-${l.y}`} cx={l.x} cy={l.y} r={5.5} fill={C.carnoSoft} />)}
        <SvgText x={372} y={70} text="MrgprD" color={C.carno} size={17} weight={700} />

        <circle cx={110} cy={340} r={30} fill={`${C.text}14`} stroke={C.text} strokeOpacity={0.7} strokeWidth={3} />
        <SvgText x={152} y={346} text="gânglio da raiz dorsal" color={C.text} size={16} />
        {!reduce && [0, 0.6, 1.2].map(begin => (
            <circle key={begin} r={7} fill={C.risk}>
                <animateMotion dur="1.8s" begin={`${begin}s`} repeatCount="indefinite" path={AXON} />
            </circle>
        ))}

        <g>
            <circle cx={620} cy={46} r={24} fill="none" stroke={C.co2} strokeOpacity={0.6} strokeWidth={2.5} strokeDasharray="5 5" />
            <line x1={603} y1={29} x2={637} y2={63} stroke={C.co2} strokeWidth={2.5} />
            <SvgText x={584} y={40} text="mastócito:" anchor="end" color={C.co2} size={16} />
            <SvgText x={584} y={62} text="sem histamina" anchor="end" color={C.co2} size={16} />
        </g>

        {CASCADE.map((label, i) => {
            const y = 128 + i * 44;
            const last = i === CASCADE.length - 1;
            return (
                <g key={label}>
                    <rect x={448} y={y - 20} width={190} height={32} rx={9}
                        fill={last ? `${C.risk}26` : '#04080F'} stroke={i === 0 ? C.carnoSoft : last ? C.risk : 'rgba(255,255,255,0.25)'} />
                    <SvgText x={543} y={y + 2} text={label} anchor="middle" color={i < 2 ? C.carnoSoft : last ? C.risk : C.text} size={16} weight={700} />
                    {!last && <path d={`M543 ${y + 13} v9 m-5 -5 l5 5 l5 -5`} fill="none" stroke={C.muted} strokeWidth={2} />}
                </g>
            );
        })}
        <SvgText x={W - 8} y={H - 6} text="cascata: modelo em camundongo" anchor="end" color={C.muted} size={16} weight={500} />
    </svg>
);
