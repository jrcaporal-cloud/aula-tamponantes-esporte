import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { Appear, Move } from '../ato2/protonSources.svg';
import { WINDOW_SEC } from './cases';
import { ContraVisual, RecordVisual, RulesVisual } from './protocolCards';

/**
 * Mini-visuais do slide 95, um por passo (SVG com SMIL, que reinicia quando o passo remonta).
 * 1 régua da janela · 4 escada das 4 fases do AIS + 23 remadores · 6 bifurcação da decisão.
 * Os passos 2, 3 e 5 (semáforo, portas, prontuário) ficam em protocolCards.tsx.
 */

const VIS_W = 580;
const VIS_H = 240;

/** Selo SVG (retângulo com texto); largura estimada pelo número de caracteres. */
const Tag = ({ x, y, text, color, anchor = 'middle' }: { x: number; y: number; text: string; color: string; anchor?: 'start' | 'middle' }) => {
    const w = text.length * 8.4 + 22;
    const left = anchor === 'middle' ? x - w / 2 : x;
    return (
        <g>
            <rect x={left} y={y} width={w} height={28} rx={8} fill={`${color}1f`} stroke={`${color}aa`} strokeWidth={1.5} />
            <SvgText x={left + w / 2} y={y + 19.5} text={text} size={16} anchor="middle" color={color} weight={700} />
        </g>
    );
};

/* ---------- 1 · a régua da janela ---------- */

const T0 = 5;
const T1 = 1800;
const RX0 = 12;
const RX1 = VIS_W - 12;
const sx = (s: number) => RX0 + (Math.log(s / T0) / Math.log(T1 / T0)) * (RX1 - RX0);
const TICKS = [
    { s: 10, label: '10 s' }, { s: 30, label: '30 s' }, { s: 60, label: '1 min' },
    { s: 120, label: '2 min' }, { s: 300, label: '5 min' }, { s: 720, label: '12 min' },
] as const;

const WindowVisual = ({ reduce }: { reduce: boolean }) => {
    const [w0, w1] = WINDOW_SEC;
    const bandY = 108;
    const bandH = 46;
    const axisY = bandY + bandH;
    const mid = (sx(w0) + sx(w1)) / 2;
    return (
        <svg viewBox={`0 0 ${VIS_W} ${VIS_H}`} width={VIS_W} height={VIS_H} role="img"
            aria-label="Régua do tempo de esforço: a janela do tampão vai de 30 s a cerca de 12 min">
            <line x1={RX0} x2={RX1} y1={axisY} y2={axisY} stroke="rgba(255,255,255,0.35)" />
            <Appear reduce={reduce} begin={0.05}>
                <rect x={sx(w0)} y={bandY} width={sx(w1) - sx(w0)} height={bandH} rx={8} fill={`${C.base}26`} stroke={`${C.base}99`} strokeWidth={1.5} />
                <SvgText x={mid} y={bandY + 29} text="janela do tampão" size={17} anchor="middle" color={C.baseSoft} weight={700} />
            </Appear>
            {TICKS.map(t => (
                <g key={t.s}>
                    <line x1={sx(t.s)} x2={sx(t.s)} y1={axisY} y2={axisY + 6} stroke="rgba(255,255,255,0.45)" />
                    <SvgText x={sx(t.s)} y={axisY + 23} text={t.label} size={16} anchor="middle" color="#CBD5E1" weight={500} />
                </g>
            ))}
            {/* cabem na janela: descem para dentro da faixa */}
            {[{ text: '400–1.500 m ✓', x: mid - 82 }, { text: 'remo 2.000 m ✓', x: mid + 86 }].map((t, i) => (
                <Appear key={t.text} reduce={reduce} begin={0.3 + i * 0.12}>
                    <Move reduce={reduce} begin={0.3 + i * 0.12} dur={0.5} from="0 -16" to="0 0">
                        <Tag x={t.x} y={44} text={t.text} color={C.ok} />
                        <line x1={t.x} x2={t.x} y1={74} y2={bandY - 4} stroke={`${C.ok}aa`} strokeWidth={2} strokeDasharray="3 4" />
                    </Move>
                </Appear>
            ))}
            {/* ficam de fora: à esquerda dos 30 s */}
            {['sprint < 10 s ✗', 'força máxima ✗'].map((text, i) => (
                <Appear key={text} reduce={reduce} begin={0.6 + i * 0.12}>
                    <Tag x={RX0} y={44 + i * 36} text={text} color={C.risk} anchor="start" />
                </Appear>
            ))}
            {/* acima de 10 min o efeito também aparece */}
            <Appear reduce={reduce} begin={0.85}>
                <line x1={sx(600)} x2={RX1} y1={axisY + 40} y2={axisY + 40} stroke={C.baseSoft} strokeWidth={2.5} strokeDasharray="5 5" />
                <line x1={sx(600)} x2={sx(600)} y1={axisY + 33} y2={axisY + 47} stroke={C.baseSoft} strokeWidth={2.5} />
                <SvgText x={RX1} y={axisY + 66} text="acima de 10 min: ES 0,22" size={16} anchor="end" color={C.baseSoft} weight={600} />
            </Appear>
        </svg>
    );
};

/* ---------- 4 · a escada do AIS + os 23 remadores ---------- */

const PHASES = ['preparação', 'repouso', 'treino', 'prova menor'] as const;
const TREAD_W = 139;
const tread = (i: number) => ({ x: 12 + i * TREAD_W, top: 112 - i * 24 });
const ROWERS = 23;
const LIT_ROWER = 15;

const TestVisual = ({ reduce }: { reduce: boolean }) => {
    const stops = PHASES.map((_, i) => `${tread(i).x + TREAD_W / 2} ${tread(i).top - 11}`);
    return (
        <svg viewBox={`0 0 ${VIS_W} ${VIS_H}`} width={VIS_W} height={VIS_H} role="img"
            aria-label="Plano do AIS em 4 fases: preparação, repouso, treino, prova menor; só 1 de 23 remadores tinha o pico aos 60 min">
            {PHASES.map((p, i) => {
                const { x, top } = tread(i);
                return (
                    <Appear key={p} reduce={reduce} begin={0.05 + i * 0.12}>
                        <rect x={x} y={top} width={TREAD_W - 4} height={130 - top} rx={6}
                            fill={`${C.base}${['1a', '2b', '3d', '55'][i]}`} stroke={`${C.base}aa`} strokeWidth={1.5} />
                        <SvgText x={x + (TREAD_W - 4) / 2} y={150} text={`${i + 1} ${p}`} size={16} anchor="middle" color="#F3F4F6" weight={700} />
                    </Appear>
                );
            })}
            <Appear reduce={reduce} begin={0.3}>
                <SvgText x={tread(1).x + (TREAD_W - 4) / 2} y={169} text="HCO₃⁻ a cada 30 min" size={15} anchor="middle" color={C.baseSoft} weight={500} />
            </Appear>
            {/* o atleta sobe a escada, fase a fase */}
            <g transform={`translate(${reduce ? stops[3] : stops[0]})`}>
                {!reduce && (
                    <animateTransform attributeName="transform" type="translate" values={stops.join(';')}
                        keyTimes="0;0.33;0.66;1" dur="1.2s" begin="0.3s" fill="freeze" />
                )}
                <circle r={9} fill={C.acid} stroke="#04080F" strokeWidth={2} />
            </g>
            {/* 23 remadores; um só tinha o pico aos 60 min */}
            {Array.from({ length: ROWERS }, (_, i) => {
                const lit = i === LIT_ROWER;
                return (
                    <Appear key={i} reduce={reduce} begin={0.5 + i * 0.015}>
                        <circle cx={18 + i * 11.5} cy={202} r={lit ? 6.5 : 4.5} fill={lit ? C.base : 'rgba(255,255,255,0.28)'}
                            stroke={lit ? '#fff' : 'none'} strokeWidth={1.5} />
                    </Appear>
                );
            })}
            <Appear reduce={reduce} begin={0.85}>
                <SvgText x={290} y={197} text="só 1 de 23 remadores" size={17} anchor="start" color={C.baseSoft} weight={700} />
                <SvgText x={290} y={218} text="tinha o pico aos 60 min" size={16} anchor="start" color="#E5E7EB" weight={500} />
                <SvgText x={290} y={237} text="Boegman 2020" size={15} anchor="start" color="#9CA3AF" weight={500} />
            </Appear>
        </svg>
    );
};

/* ---------- 6 · a bifurcação da decisão ---------- */

const START = { x: 12, y: 66, w: 150, h: 52 };
const PILL_X = 330;
const PILL_W = 236;
const BRANCHES = [
    { label: 'usar', color: C.ok, y: 30, h: 40 },
    { label: 'ajustar', color: C.lactate, y: 92, h: 40 },
    { label: 'abandonar', sub: 'também é bom resultado', color: C.co2, y: 158, h: 52 },
] as const;

const DecideVisual = ({ reduce }: { reduce: boolean }) => {
    const fx = START.x + START.w;
    const fy = START.y + START.h / 2;
    const loopX = START.x + START.w / 2;
    const loopY = 214;
    return (
        <svg viewBox={`0 0 ${VIS_W} ${VIS_H}`} width={VIS_W} height={VIS_H} role="img"
            aria-label="Do teste do atleta saem três caminhos: usar, ajustar ou abandonar; e reavaliar na temporada seguinte">
            <rect x={START.x} y={START.y} width={START.w} height={START.h} rx={12} fill={`${C.base}2b`} stroke={C.base} strokeWidth={2} />
            <SvgText x={START.x + START.w / 2} y={fy + 6} text="teste do atleta" size={16} anchor="middle" color="#fff" weight={700} />
            {BRANCHES.map((b, i) => {
                const begin = 0.1 + i * 0.15;
                return (
                    <g key={b.label}>
                        <path d={`M${fx},${fy} C${fx + 90},${fy} ${PILL_X - 90},${b.y} ${PILL_X},${b.y}`} fill="none" stroke={b.color}
                            strokeWidth={3} pathLength={1} strokeDasharray="1" strokeDashoffset={reduce ? 0 : 1}>
                            {!reduce && <animate attributeName="stroke-dashoffset" from="1" to="0" begin={`${begin}s`} dur="0.6s" fill="freeze" />}
                        </path>
                        <Appear reduce={reduce} begin={begin + 0.35}>
                            <rect x={PILL_X} y={b.y - b.h / 2} width={PILL_W} height={b.h} rx={b.h / 2} fill={`${b.color}22`} stroke={b.color} strokeWidth={2} />
                            <SvgText x={PILL_X + PILL_W / 2} y={b.y + ('sub' in b ? -2 : 6)} text={b.label} size={18} anchor="middle" color={b.label === 'abandonar' ? '#E2E8F0' : b.color} weight={700} />
                            {'sub' in b && <SvgText x={PILL_X + PILL_W / 2} y={b.y + 17} text={b.sub} size={15} anchor="middle" color="#E5E7EB" weight={500} />}
                        </Appear>
                    </g>
                );
            })}
            {/* volta: reavaliar na temporada seguinte */}
            <Appear reduce={reduce} begin={0.8}>
                <path d={`M${PILL_X + PILL_W / 2},${BRANCHES[2].y + BRANCHES[2].h / 2 + 2} V${loopY} H${loopX} V${START.y + START.h + 12}`}
                    fill="none" stroke={C.baseSoft} strokeWidth={2.5} strokeDasharray="7 5" strokeLinejoin="round">
                    {!reduce && <animate attributeName="stroke-dashoffset" from="24" to="0" dur="1s" repeatCount="indefinite" />}
                </path>
                <polyline points={`${loopX - 7},${START.y + START.h + 14} ${loopX},${START.y + START.h + 4} ${loopX + 7},${START.y + START.h + 14}`}
                    fill="none" stroke={C.baseSoft} strokeWidth={2.5} strokeLinecap="round" strokeLinejoin="round" />
                <SvgText x={(loopX + PILL_X + PILL_W / 2) / 2} y={loopY + 22} text="reavaliar na temporada seguinte" size={16} anchor="middle" color={C.baseSoft} weight={600} />
            </Appear>
        </svg>
    );
};

const VISUALS = {
    janela: WindowVisual,
    contra: ContraVisual,
    regras: RulesVisual,
    teste: TestVisual,
    registrar: RecordVisual,
    decidir: DecideVisual,
} as const;

/** Mini-visual do passo (pelo id do nó). */
export const StepVisual = ({ id, reduce }: { id: string; reduce: boolean }) => {
    const Visual = VISUALS[id as keyof typeof VISUALS];
    return Visual ? <Visual reduce={reduce} /> : null;
};
