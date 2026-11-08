import { useReducedMotion } from 'framer-motion';
import type { ComponentType, ReactNode } from 'react';
import { Appear, Arrow, Move, Pop, Pulse, Tilt } from '../ato2/protonSources.svg';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { WINDOW_SEC } from './cases';
import { SIGNAL } from './shared';

/**
 * Visuais do slide 96 (O que Levar para Segunda-feira): uma cena SVG por mensagem.
 * Animação por SMIL (reinicia quando o <svg> monta de novo a cada passo); com movimento reduzido, nasce pronta.
 * Números: de Oliveira 2022, ISSN 2021, Diaconu 2022, Boegman 2020, Kahle 2013, Geyer 2004, Duiven 2021 (dossiês 01 e 06).
 */

const W = 680;
const H = 350;
const INK = '#F3F4F6';
const AXIS = 'rgba(255,255,255,0.35)';
const OFF = 'rgba(255,255,255,0.08)';
const SPLINE = { calcMode: 'spline', keyTimes: '0;1', keySplines: '0.4 0 0.2 1' } as const;

interface SceneProps {
    reduce: boolean;
}

/** Cresce na vertical a partir da base (filhos desenhados para cima de 0,0). */
const GrowY = ({ reduce, begin, dur = 1, x, y, children }: { reduce: boolean; begin: number; dur?: number; x: number; y: number; children: ReactNode }) => (
    <g transform={`translate(${x} ${y})`}>
        <g transform={`scale(1 ${reduce ? 1 : 0})`}>
            {!reduce && <animateTransform attributeName="transform" type="scale" from="1 0" to="1 1" begin={`${begin}s`} dur={`${dur}s`} fill="freeze" {...SPLINE} />}
            {children}
        </g>
    </g>
);

const Divider = ({ x }: { x: number }) => (
    <line x1={x} x2={x} y1={40} y2={290} stroke="rgba(255,255,255,0.18)" strokeWidth={2} strokeDasharray="6 8" />
);

/* ── 1 · o prêmio é pequeno e tem endereço ───────────────────────────── */

const ES_X0 = 70;
const ES_X1 = 640;
const esX = (v: number) => ES_X0 + (v / 0.4) * (ES_X1 - ES_X0);
const ES_TICKS = [{ v: 0, l: '0' }, { v: 0.1, l: '0,1' }, { v: 0.2, l: '0,2' }, { v: 0.3, l: '0,3' }, { v: 0.4, l: '0,4' }] as const;

/** Escala log do tempo de esforço (5 s → 30 min). */
const tX = (s: number) => ES_X0 + (Math.log(s / 5) / Math.log(1800 / 5)) * (ES_X1 - ES_X0);
const T_TICKS = [
    { s: 10, l: '10 s' }, { s: 30, l: '30 s' }, { s: 60, l: '1 min' },
    { s: 120, l: '2 min' }, { s: 300, l: '5 min' }, { s: 720, l: '12 min' },
] as const;

const PrizeScene = ({ reduce }: SceneProps) => {
    const p = esX(0.17);
    const [w0, w1] = WINDOW_SEC;
    return (
        <>
            {/* tamanho do efeito: ES 0,17 (0,12–0,21) — de Oliveira 2022 */}
            <SvgText x={20} y={26} text="tamanho do efeito do bicarbonato" size={17} color={C.muted} />
            <line x1={ES_X0} x2={ES_X0} y1={70} y2={130} stroke={AXIS} strokeWidth={2} strokeDasharray="4 5" />
            <SvgText x={ES_X0 + 8} y={62} text="zero = sem efeito" size={16} color={C.muted} weight={500} />
            <line x1={ES_X0} x2={ES_X1} y1={130} y2={130} stroke={AXIS} strokeWidth={2} />
            {ES_TICKS.map(t => (
                <g key={t.v}>
                    <line x1={esX(t.v)} x2={esX(t.v)} y1={130} y2={137} stroke={AXIS} strokeWidth={2} />
                    <SvgText x={esX(t.v)} y={156} text={t.l} size={16} anchor="middle" color="#CBD5E1" weight={500} />
                </g>
            ))}
            <Appear reduce={reduce} begin={1.2}>
                <line x1={esX(0.12)} x2={esX(0.21)} y1={102} y2={102} stroke={C.base} strokeWidth={5} strokeLinecap="round" />
                <line x1={esX(0.12)} x2={esX(0.12)} y1={92} y2={112} stroke={C.base} strokeWidth={4} strokeLinecap="round" />
                <line x1={esX(0.21)} x2={esX(0.21)} y1={92} y2={112} stroke={C.base} strokeWidth={4} strokeLinecap="round" />
                <SvgText x={esX(0.21) + 14} y={108} text="IC 0,12–0,21" size={17} color={C.baseSoft} />
            </Appear>
            <Move reduce={reduce} begin={0.3} dur={1} from={`${ES_X0 - p} 0`} to="0 0">
                <circle cx={p} cy={102} r={11} fill={C.base} stroke="#04080F" strokeWidth={3} />
                <SvgText x={p} y={80} text="ES 0,17" size={22} anchor="middle" color={C.base} weight={700} />
            </Move>
            <Appear reduce={reduce} begin={1.8}>
                <SvgText x={ES_X1} y={62} text="pequeno, mas longe do zero" size={17} anchor="end" color={INK} />
            </Appear>

            {/* endereço: janela do tampão de 30 s a ~12 min */}
            <SvgText x={20} y={204} text="onde ele aparece: duração do esforço" size={17} color={C.muted} />
            <line x1={ES_X0} x2={ES_X1} y1={270} y2={270} stroke={AXIS} strokeWidth={2} />
            {T_TICKS.map(t => (
                <g key={t.s}>
                    <line x1={tX(t.s)} x2={tX(t.s)} y1={270} y2={277} stroke={AXIS} strokeWidth={2} />
                    <SvgText x={tX(t.s)} y={296} text={t.l} size={16} anchor="middle" color="#CBD5E1" weight={500} />
                </g>
            ))}
            <Appear reduce={reduce} begin={0.9} dur={0.6}>
                <rect x={tX(w0)} y={232} width={tX(w1) - tX(w0)} height={38} rx={8} fill={`${C.base}2e`} stroke={`${C.base}aa`} strokeWidth={2} />
                <SvgText x={(tX(w0) + tX(w1)) / 2} y={257} text="janela: 30 s a ~12 min" size={17} anchor="middle" color={INK} weight={700} />
            </Appear>
            <Appear reduce={reduce} begin={1.6}>
                <rect x={ES_X0} y={232} width={tX(w0) - ES_X0 - 6} height={38} rx={8} fill="rgba(148,163,184,0.1)" stroke={`${C.co2}88`} strokeWidth={2} strokeDasharray="5 5" />
                <g stroke={C.co2} strokeWidth={4} strokeLinecap="round">
                    <line x1={tX(10) - 8} x2={tX(10) + 8} y1={243} y2={259} />
                    <line x1={tX(10) - 8} x2={tX(10) + 8} y1={259} y2={243} />
                </g>
                <SvgText x={ES_X0} y={326} text="fora: força máxima e sprint de 10 s" size={17} color={C.co2} />
            </Appear>
        </>
    );
};

/* ── 2 · bicarbonato é de horas; β-alanina, de semanas ───────────────── */

const CLOCK = { cx: 160, cy: 165, r: 100 } as const;
/** Ponto no relógio: θ em graus a partir do 12, sentido horário. */
const onClock = (deg: number, r: number = CLOCK.r) => {
    const a = (deg * Math.PI) / 180;
    return { x: CLOCK.cx + r * Math.sin(a), y: CLOCK.cy - r * Math.cos(a) };
};
const WEEK_X0 = 444;
const WEEK_DX = 31;
const WEEK_Y0 = 72;
const WEEK_DY = 32;
const PILL = { x: 444, y: 226, w: 186, h: 30 } as const;

const ClockScene = ({ reduce }: SceneProps) => {
    const { cx, cy, r } = CLOCK;
    const a = onClock(-90);
    const b = onClock(-30);
    const m3 = onClock(-90, r + 14);
    const m1 = onClock(-30, r + 14);
    const seg = (PILL.w - 6) / 4;
    return (
        <>
            {/* relógio: a dose vai de 180 a 60 min antes da prova (ISSN) */}
            <circle cx={cx} cy={cy} r={r} fill="rgba(255,255,255,0.03)" stroke={AXIS} strokeWidth={3} />
            {Array.from({ length: 12 }, (_, i) => {
                const o = onClock(i * 30, r - 4);
                const n = onClock(i * 30, r - 14);
                return <line key={i} x1={o.x} y1={o.y} x2={n.x} y2={n.y} stroke={AXIS} strokeWidth={i % 3 === 0 ? 4 : 2} strokeLinecap="round" />;
            })}
            <Appear reduce={reduce} begin={0.3} dur={0.6}>
                <path d={`M${cx},${cy} L${a.x},${a.y} A${r},${r} 0 0 1 ${b.x},${b.y} Z`} fill={`${C.base}40`} stroke={C.base} strokeWidth={2.5} />
                <SvgText x={m3.x - 4} y={m3.y + 6} text="−3 h" size={17} anchor="end" color={C.baseSoft} weight={700} />
                <SvgText x={m1.x - 2} y={m1.y} text="−1 h" size={17} anchor="end" color={C.baseSoft} weight={700} />
            </Appear>
            <SvgText x={cx} y={cy - r - 18} text="prova" size={18} anchor="middle" color={INK} weight={700} />
            <polygon points={`${cx - 8},${cy - r - 12} ${cx + 8},${cy - r - 12} ${cx},${cy - r - 2}`} fill={INK} />
            <Tilt reduce={reduce} begin={0.8} dur={1.8} deg={90} cx={cx} cy={cy}>
                <line x1={cx} y1={cy} x2={cx - r + 26} y2={cy} stroke={INK} strokeWidth={6} strokeLinecap="round" />
            </Tilt>
            <circle cx={cx} cy={cy} r={8} fill={INK} />
            <SvgText x={cx} y={302} text="bicarbonato: 60–180 min antes" size={18} anchor="middle" color={C.base} weight={700} />
            <SvgText x={cx} y={326} text="horas antes da prova" size={17} anchor="middle" color={C.muted} weight={500} />

            <Divider x={340} />
            <SvgText x={336} y={176} text="≠" size={34} anchor="middle" color={INK} weight={700} />

            {/* semanas: a carnosina sobe dia após dia */}
            <SvgText x={WEEK_X0 + 3 * WEEK_DX} y={40} text="todo dia, por semanas" size={17} anchor="middle" color={C.carnoSoft} />
            {[0, 1, 2, 3].map(w => (
                <g key={w}>
                    <SvgText x={WEEK_X0 - 18} y={WEEK_Y0 + w * WEEK_DY + 6} text={`sem ${w + 1}`} size={16} anchor="end" color="#CBD5E1" weight={500} />
                    {Array.from({ length: 7 }, (_, d) => (
                        <circle key={d} cx={WEEK_X0 + d * WEEK_DX} cy={WEEK_Y0 + w * WEEK_DY} r={9} fill={OFF} stroke="rgba(255,255,255,0.2)" />
                    ))}
                    <Appear reduce={reduce} begin={0.4 + w * 0.45}>
                        {Array.from({ length: 7 }, (_, d) => (
                            <circle key={d} cx={WEEK_X0 + d * WEEK_DX} cy={WEEK_Y0 + w * WEEK_DY} r={9} fill={C.carno} />
                        ))}
                        <rect x={PILL.x + 3 + w * seg + 1} y={PILL.y + 3} width={seg - 2} height={PILL.h - 6} rx={5} fill={C.carno} />
                    </Appear>
                </g>
            ))}
            <SvgText x={PILL.x} y={PILL.y - 10} text="carnosina no músculo" size={16} color={C.carnoSoft} weight={500} />
            <rect x={PILL.x} y={PILL.y} width={PILL.w} height={PILL.h} rx={9} fill="none" stroke={`${C.carno}99`} strokeWidth={2} />
            <SvgText x={WEEK_X0 + 3 * WEEK_DX} y={302} text="β-alanina: ≥ 4 semanas" size={18} anchor="middle" color={C.carno} weight={700} />
            <SvgText x={WEEK_X0 + 3 * WEEK_DX} y={326} text="semanas antes da temporada" size={17} anchor="middle" color={C.muted} weight={500} />
        </>
    );
};

/* ── 3 · a dose é a mesma; o paciente, não ───────────────────────────── */

const Person = ({ ring }: { ring: string }) => (
    <g>
        <circle r={54} fill={`${ring}1a`} stroke={ring} strokeWidth={3} />
        <circle cy={-16} r={14} fill={INK} />
        <path d="M-28,34 Q-28,4 0,4 Q28,4 28,34 Z" fill={INK} />
    </g>
);

const FLAGS = ['diurético', 'rim', 'idade', 'compulsão'] as const;

const PatientScene = ({ reduce }: SceneProps) => {
    const yellow = SIGNAL.amarelo.color;
    const red = SIGNAL.vermelho.color;
    return (
        <>
            {/* uma dose só, dois contextos (Diaconu 2022: 20 g/d por 1 semana, 69 anos, rim doente → pH 7,61) */}
            <rect x={280} y={14} width={120} height={72} rx={14} fill={`${C.base}1f`} stroke={C.base} strokeWidth={2.5} />
            <SvgText x={340} y={47} text="20 g" size={26} anchor="middle" color={C.base} weight={700} />
            <SvgText x={340} y={73} text="mesma dose" size={16} anchor="middle" color={C.baseSoft} weight={500} />
            <Arrow x1={290} y1={92} x2={210} y2={124} />
            <Arrow x1={390} y1={92} x2={440} y2={124} />

            <Pop reduce={reduce} begin={0.3} x={170} y={182}><Person ring={yellow} /></Pop>
            <Appear reduce={reduce} begin={0.6}>
                <SvgText x={170} y={262} text="adulto saudável" size={18} anchor="middle" color={INK} weight={700} />
                <SvgText x={170} y={285} text="dose pontual, testada no treino" size={16} anchor="middle" color={yellow} weight={500} />
            </Appear>

            <Pop reduce={reduce} begin={0.7} x={480} y={182}><Person ring={red} /></Pop>
            <g transform="translate(480 182)"><Pulse reduce={reduce} r={64} color={red} /></g>
            <Appear reduce={reduce} begin={1}>
                <SvgText x={480} y={262} text="69 anos, rim doente" size={18} anchor="middle" color={INK} weight={700} />
                <SvgText x={480} y={285} text="20 g/d por 1 semana" size={16} anchor="middle" color={red} weight={500} />
            </Appear>
            <Pop reduce={reduce} begin={1.1} x={612} y={182}>
                <rect x={-58} y={-26} width={116} height={52} rx={12} fill={`${red}26`} stroke={red} strokeWidth={2.5} />
                <SvgText x={0} y={9} text="pH 7,61" size={24} anchor="middle" color={red} weight={700} />
            </Pop>

            <SvgText x={20} y={330} text="mudam a cor:" size={17} color={C.muted} />
            {FLAGS.map((f, i) => (
                <Appear key={f} reduce={reduce} begin={1.4 + i * 0.2}>
                    <rect x={140 + i * 134} y={306} width={122} height={36} rx={10} fill={`${red}1f`} stroke={`${red}cc`} strokeWidth={2} />
                    <SvgText x={140 + i * 134 + 61} y={330} text={f} size={17} anchor="middle" color={INK} weight={700} />
                </Appear>
            ))}
        </>
    );
};

/* ── 4 · intestino e relógio antes do pódio ──────────────────────────── */

const ROWER_LIT = 9;

const GutClockScene = ({ reduce }: SceneProps) => (
    <>
        {/* relógio: só 1 de 23 remadores no pico aos 60 min (Boegman 2020) */}
        <SvgText x={170} y={30} text="pico de HCO₃⁻ aos 60 min?" size={17} anchor="middle" color={C.muted} />
        {Array.from({ length: 23 }, (_, i) => {
            const x = 50 + (i % 6) * 48;
            const y = 70 + Math.floor(i / 6) * 44;
            return (
                <Pop key={i} reduce={reduce} begin={0.1 + i * 0.025} x={x} y={y}>
                    <circle r={15} fill={OFF} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                </Pop>
            );
        })}
        <Appear reduce={reduce} begin={0.8}>
            <g transform={`translate(${50 + (ROWER_LIT % 6) * 48} ${70 + Math.floor(ROWER_LIT / 6) * 44})`}>
                <circle r={15} fill={C.lactate} />
                <Pulse reduce={reduce} r={22} color={C.lactate} />
            </g>
        </Appear>
        <Appear reduce={reduce} begin={0.9}>
            <SvgText x={170} y={264} text="1 de 23" size={30} anchor="middle" color={C.lactate} weight={700} />
            <SvgText x={170} y={290} text="remadores no pico aos 60 min" size={17} anchor="middle" color={INK} weight={500} />
        </Appear>

        <Divider x={340} />

        {/* intestino: diarreia em 10 de 11 (Kahle 2013) */}
        <SvgText x={510} y={30} text="intestino: diarreia" size={17} anchor="middle" color={C.muted} />
        {Array.from({ length: 11 }, (_, i) => {
            const x = 432 + (i % 4) * 52;
            const y = 76 + Math.floor(i / 4) * 52;
            return (
                <g key={i}>
                    <Pop reduce={reduce} begin={0.2 + i * 0.03} x={x} y={y}>
                        <circle r={17} fill={OFF} stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
                    </Pop>
                    {i < 10 && (
                        <Appear reduce={reduce} begin={0.9 + i * 0.05}>
                            <circle cx={x} cy={y} r={17} fill={C.risk} />
                        </Appear>
                    )}
                </g>
            );
        })}
        <Appear reduce={reduce} begin={1.5}>
            <SvgText x={510} y={264} text="10 de 11" size={30} anchor="middle" color={C.risk} weight={700} />
            <SvgText x={510} y={290} text="voluntários com diarreia" size={17} anchor="middle" color={INK} weight={500} />
        </Appear>

        <Appear reduce={reduce} begin={1.8}>
            <SvgText x={340} y={336} text="teste no treino, nunca na final" size={19} anchor="middle" color={INK} weight={700} />
        </Appear>
    </>
);

/* ── 5 · regra e produto também são evidência ────────────────────────── */

const JARS = [
    { x: 50, pct: 0.148, label: '14,8%', study: 'Geyer 2004', n: '634 produtos' },
    { x: 210, pct: 0.38, label: '38%', study: 'Duiven 2021', n: '66 de alto risco' },
] as const;
const JAR = { top: 82, bottom: 250, w: 120 } as const;

const RULES = [
    { title: 'IN 28/2018', sub: 'rótulo · Anvisa' },
    { title: 'WADA 2026', sub: 'Código Mundial' },
    { title: 'prontuário', sub: 'a justificativa por escrito' },
] as const;

const ProductScene = ({ reduce }: SceneProps) => {
    const inner = JAR.bottom - JAR.top - 12;
    return (
        <>
            {/* potes com substância proibida não declarada */}
            <SvgText x={190} y={26} text="suplementos contaminados" size={17} anchor="middle" color={C.muted} />
            {JARS.map((j, i) => (
                <g key={j.study}>
                    <rect x={j.x + 18} y={JAR.top - 16} width={JAR.w - 36} height={16} rx={4} fill="rgba(255,255,255,0.18)" />
                    <rect x={j.x} y={JAR.top} width={JAR.w} height={JAR.bottom - JAR.top} rx={16} fill="rgba(255,255,255,0.04)" stroke={AXIS} strokeWidth={2.5} />
                    <GrowY reduce={reduce} begin={0.3 + i * 0.3} x={j.x + 6} y={JAR.bottom - 6}>
                        <rect x={0} y={-j.pct * inner} width={JAR.w - 12} height={j.pct * inner} rx={10} fill={C.acid} />
                    </GrowY>
                    <Appear reduce={reduce} begin={0.8 + i * 0.3}>
                        <SvgText x={j.x + JAR.w / 2} y={JAR.top - 26} text={j.label} size={26} anchor="middle" color={C.acid} weight={700} />
                    </Appear>
                    <SvgText x={j.x + JAR.w / 2} y={276} text={j.study} size={17} anchor="middle" color={INK} weight={700} />
                    <SvgText x={j.x + JAR.w / 2} y={298} text={j.n} size={16} anchor="middle" color={C.muted} weight={500} />
                </g>
            ))}

            <Arrow x1={348} y1={170} x2={388} y2={170} color={`${C.acid}cc`} width={3} />

            <SvgText x={535} y={26} text="entram na decisão" size={17} anchor="middle" color={C.muted} />
            {RULES.map((r, i) => {
                const y = 56 + i * 72;
                return (
                    <g key={r.title}>
                        <rect x={400} y={y} width={270} height={58} rx={12} fill={`${C.acid}12`} stroke={`${C.acid}66`} strokeWidth={2} />
                        <SvgText x={454} y={y + 25} text={r.title} size={18} color={INK} weight={700} />
                        <SvgText x={454} y={y + 47} text={r.sub} size={16} color={C.muted} weight={500} />
                        <circle cx={427} cy={y + 29} r={15} fill="none" stroke={`${C.acid}88`} strokeWidth={2} />
                        <Pop reduce={reduce} begin={1.1 + i * 0.3} x={427} y={y + 29}>
                            <circle r={15} fill={C.acid} />
                            <polyline points="-7,0 -2,6 8,-6" fill="none" stroke="#04080F" strokeWidth={3.5} strokeLinecap="round" strokeLinejoin="round" />
                        </Pop>
                    </g>
                );
            })}

            <Appear reduce={reduce} begin={2}>
                <SvgText x={W / 2} y={338} text="o risco antidoping real é o pote, não a substância" size={18} anchor="middle" color={INK} weight={700} />
            </Appear>
        </>
    );
};

const SCENES: readonly ComponentType<SceneProps>[] = [PrizeScene, ClockScene, PatientScene, GutClockScene, ProductScene];

/** Cena da mensagem ativa; o `key` remonta o <svg> e reinicia a animação SMIL. */
export const TakeawayVisual = ({ index, label }: { index: number; label: string }) => {
    const reduce = Boolean(useReducedMotion());
    const Scene = SCENES[Math.min(index, SCENES.length - 1)];
    return (
        <svg key={index} viewBox={`0 0 ${W} ${H}`} className="block h-auto w-full" role="img" aria-label={label}>
            <Scene reduce={reduce} />
        </svg>
    );
};
