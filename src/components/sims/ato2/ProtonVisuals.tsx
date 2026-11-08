import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { Appear } from './protonSources.svg';

/** Peças do slide 24: os glifos das três escolas e o gráfico do acordo (termômetro × fogo). */

const P_COLOR = '#94A3B8';

/** Glifo da 1ª escola: ATP (três fosfatos) soltando um H⁺. */
const AtpGlyph = () => (
    <>
        <rect x={2} y={22} width={14} height={14} rx={4} fill="none" stroke={P_COLOR} strokeWidth={2} />
        <line x1={16} x2={44} y1={29} y2={29} stroke={P_COLOR} strokeWidth={2} />
        <circle cx={22} cy={29} r={5} fill={P_COLOR} />
        <circle cx={34} cy={29} r={5} fill={P_COLOR} />
        <circle cx={47} cy={36} r={5} fill={P_COLOR} />
        <circle cx={46} cy={14} r={8} fill={C.acid} />
    </>
);

/** Glifo da 2ª escola: ácido lático partindo em lactato⁻ + H⁺. */
const LacticGlyph = () => (
    <>
        <circle cx={14} cy={28} r={10} fill="none" stroke={C.lactate} strokeWidth={2.5} />
        <path d="M26,28 h10" stroke="rgba(255,255,255,0.5)" strokeWidth={2} strokeDasharray="3 3" />
        <circle cx={44} cy={28} r={8} fill={C.acid} />
    </>
);

/** Glifo da 3ª escola: balança de íons fortes inclinada. */
const SidGlyph = () => (
    <>
        <line x1={6} x2={50} y1={16} y2={26} stroke="#E5E7EB" strokeWidth={2.5} strokeLinecap="round" />
        <polygon points="28,21 22,42 34,42" fill="none" stroke={P_COLOR} strokeWidth={2} />
        <circle cx={8} cy={10} r={4} fill="#E5E7EB" />
        <circle cx={44} cy={20} r={4} fill={C.lactate} />
        <circle cx={52} cy={20} r={4} fill={C.lactate} />
        <circle cx={48} cy={42} r={7} fill={C.acid} />
    </>
);

const GLYPHS = [AtpGlyph, LacticGlyph, SidGlyph] as const;

export const SchoolGlyph = ({ index, active }: { index: number; active: boolean }) => {
    const G = GLYPHS[index];
    return (
        <svg viewBox="0 0 56 50" width={44} height={40} aria-hidden style={{ opacity: active ? 1 : 0.55, transition: 'opacity .4s' }}>
            <G />
        </svg>
    );
};

const SW = 740;
const SH = 250;
const PX0 = 62;
const PX1 = 500;
const PY0 = 18;
const PY1 = SH - 56;
const MAX = 25;
const sx = (v: number) => PX0 + (v / MAX) * (PX1 - PX0);
const sy = (v: number) => PY1 - (v / MAX) * (PY1 - PY0);
/** Pontos ilustrativos em torno da reta do estudo (determinísticos, sem sorteio). */
const POINTS = Array.from({ length: 18 }, (_, i) => {
    const x = 1.2 + i * 1.32;
    return { x, y: Math.max(0.3, 0.98 * x + 1.6 * Math.sin(i * 2.3)) };
});

/** Chama (o H⁺: o fogo), desenhada em torno de 0,0. */
const Flame = () => (
    <g>
        <path d="M0,-46 C14,-28 26,-14 22,6 C19,22 8,30 0,30 C-8,30 -19,22 -22,6 C-25,-10 -10,-18 -6,-34 C-2,-24 2,-20 0,-46 Z"
            fill={`${C.acid}44`} stroke={C.acid} strokeWidth={2.5} />
        <path d="M0,-6 C7,2 10,10 8,18 C6,25 -6,25 -8,18 C-10,10 -4,6 0,-6 Z" fill={C.acid} />
    </g>
);

/** Termômetro (o lactato: a medida), desenhado em torno de 0,0; o líquido sobe. */
const Thermometer = ({ reduce }: { reduce: boolean }) => (
    <g>
        <rect x={-9} y={-46} width={18} height={66} rx={9} fill="rgba(255,255,255,0.05)" stroke="#E5E7EB" strokeWidth={2} />
        <circle cy={30} r={14} fill={C.lactate} stroke="#E5E7EB" strokeWidth={2} />
        <rect x={-4} y={reduce ? -36 : 20} width={8} height={reduce ? 60 : 4} rx={4} fill={C.lactate}>
            {!reduce && <animate attributeName="y" from="20" to="-36" begin="0.3s" dur="1.2s" fill="freeze" />}
            {!reduce && <animate attributeName="height" from="4" to="60" begin="0.3s" dur="1.2s" fill="freeze" />}
        </rect>
    </g>
);

export const AgreementPlot = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" height={SH} role="img" aria-label="H⁺ gerado contra lactato: inclinação 0,98; o lactato é o termômetro, o H⁺ é o fogo">
        <line x1={PX0} x2={PX1} y1={PY1} y2={PY1} stroke="rgba(255,255,255,0.3)" />
        <line x1={PX0} x2={PX0} y1={PY0} y2={PY1} stroke="rgba(255,255,255,0.3)" />
        {[0, 5, 10, 15, 20, 25].map(t => (
            <g key={t}>
                <SvgText x={sx(t)} y={PY1 + 22} text={`${t}`} anchor="middle" size={16} color="#CBD5E1" weight={500} />
                <SvgText x={PX0 - 10} y={sy(t) + 6} text={`${t}`} anchor="end" size={16} color="#CBD5E1" weight={500} />
            </g>
        ))}
        <SvgText x={(PX0 + PX1) / 2} y={PY1 + 46} text="lactato acumulado (mM)" anchor="middle" size={16} color={C.lactate} />
        <SvgText x={PX0 + 10} y={PY0 + 6} text="H⁺ gerado (mM)" size={16} color={C.acid} />
        <line x1={sx(0)} y1={sy(0)} x2={sx(25)} y2={sy(25 * 0.98)} stroke="#fff" strokeWidth={3} strokeDasharray="8 6" />
        {POINTS.map((p, i) => (
            <circle key={i} cx={sx(p.x)} cy={sy(p.y)} r={7} fill={C.acid} fillOpacity={0.85} stroke={C.lactate} strokeWidth={2}
                opacity={reduce ? 1 : 0}>
                {!reduce && <animate attributeName="opacity" from="0" to="1" dur="0.3s" begin={`${0.1 + i * 0.06}s`} fill="freeze" />}
            </circle>
        ))}
        <SvgText x={sx(11)} y={sy(3)} text={`inclinação ${br(0.98, 2)} · r² = ${br(0.86, 2)}`} size={19} color="#fff" weight={700} />

        {/* termômetro × fogo */}
        <line x1={530} x2={530} y1={10} y2={SH - 10} stroke="rgba(255,255,255,0.12)" />
        <Appear reduce={reduce} begin={0.2}>
            <g transform="translate(588 92)"><Thermometer reduce={reduce} /></g>
            <SvgText x={588} y={160} text="lactato" size={17} anchor="middle" color={C.lactate} weight={700} />
            <SvgText x={588} y={182} text="o termômetro" size={16} anchor="middle" color="#E5E7EB" />
        </Appear>
        <Appear reduce={reduce} begin={0.5}>
            <g transform="translate(688 92)"><Flame /></g>
            <SvgText x={688} y={160} text="H⁺" size={17} anchor="middle" color={C.acid} weight={700} />
            <SvgText x={688} y={182} text="o fogo" size={16} anchor="middle" color="#E5E7EB" />
        </Appear>
        <Appear reduce={reduce} begin={0.9}>
            <SvgText x={638} y={222} text="sobem juntos," size={16} anchor="middle" color="#CBD5E1" />
            <SvgText x={638} y={242} text="quase 1 : 1" size={16} anchor="middle" color="#CBD5E1" />
        </Appear>
    </svg>
);
