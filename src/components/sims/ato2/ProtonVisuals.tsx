import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { STEWART_SHARES } from './protonSources.content';

/** Depoimentos visuais do slide 24: duas reações, a barra de Stewart e o gráfico do acordo. */

const Pill = ({ children, color, struck = false }: { children: ReactNode; color: string; struck?: boolean }) => (
    <span className="mx-1 inline-flex items-center rounded-full border-2 px-2.5 py-0.5 font-semibold"
        style={{ borderColor: color, color, background: `${color}22`, textDecoration: struck ? 'line-through' : 'none' }}>
        {children}
    </span>
);

const Reaction = ({ left, right, note, delay }: { left: ReactNode; right: ReactNode; note: string; delay: number }) => (
    <motion.div className="flex items-center gap-4" initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.4, delay }}>
        <div className="flex flex-[1.4] items-center justify-end whitespace-nowrap font-mono text-[19px] text-white">{left}</div>
        <span className="font-mono text-[24px] text-gray-400">→</span>
        <div className="flex flex-1 items-center whitespace-nowrap font-mono text-[19px] text-white">{right}</div>
        <span className="w-[150px] shrink-0 text-[15px] leading-snug text-gray-300">{note}</span>
    </motion.div>
);

export const AtpTestimony = () => (
    <div className="flex flex-col gap-5">
        <Reaction delay={0.1} left="ATP" right={<>ADP + Pi +<Pill color={C.acid}>H⁺</Pill></>} note="cada ATP quebrado libera um H⁺" />
        <Reaction delay={0.5} left={<>piruvato + NADH +<Pill color={C.base} struck>H⁺</Pill></>} right="lactato + NAD⁺"
            note="a LDH consome um H⁺ ao formar lactato" />
    </div>
);

export const LacticTestimony = () => (
    <div className="flex flex-col gap-5">
        <Reaction delay={0.1} left="ácido lático" right={<>lactato⁻ +<Pill color={C.acid}>H⁺</Pill></>} note="1 H⁺ para cada lactato" />
        <motion.p className="rounded-xl border border-yellow-300/30 bg-yellow-400/10 px-4 py-2.5 text-[16px] leading-snug text-yellow-50"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}>
            pKa do ácido lático ≈ 3,86 (constante de manual): no pH da célula, mais de 99,9% está dissociado.
        </motion.p>
    </div>
);

const SHARE_COLOR: Record<(typeof STEWART_SHARES)[number]['id'], string> = {
    sid: C.acid, atot: C.lactate, pco2: C.co2, ka: '#64748B',
};

export const StewartTestimony = () => (
    <div className="flex flex-col gap-3">
        <span className="text-[15px] text-gray-300">de onde vem a subida do [H⁺] intracelular no exercício intenso</span>
        <div className="flex h-12 w-full overflow-hidden rounded-lg">
            {STEWART_SHARES.map((s, i) => (
                <motion.div key={s.id} className="flex h-full items-center justify-center font-mono text-[17px] font-bold text-gray-950"
                    style={{ background: SHARE_COLOR[s.id] }}
                    initial={{ width: 0 }} animate={{ width: `${s.pct}%` }} transition={{ duration: 0.6, delay: 0.15 * i }}>
                    {s.pct}%
                </motion.div>
            ))}
        </div>
        <div className="grid grid-cols-2 gap-x-6 gap-y-1">
            {STEWART_SHARES.map(s => (
                <span key={s.id} className="flex items-center gap-2 text-[15px] text-gray-200">
                    <span className="h-3 w-3 shrink-0 rounded-sm" style={{ background: SHARE_COLOR[s.id] }} />
                    {s.pct}% · {s.label}
                </span>
            ))}
        </div>
    </div>
);

const SW = 740;
const SH = 216;
const PX0 = 70;
const PX1 = SW - 24;
const PY0 = 20;
const PY1 = SH - 50;
const MAX = 25;
const sx = (v: number) => PX0 + (v / MAX) * (PX1 - PX0);
const sy = (v: number) => PY1 - (v / MAX) * (PY1 - PY0);
/** Pontos ilustrativos em torno da reta do estudo (determinísticos, sem sorteio). */
const POINTS = Array.from({ length: 18 }, (_, i) => {
    const x = 1.2 + i * 1.32;
    return { x, y: Math.max(0.3, 0.98 * x + 1.6 * Math.sin(i * 2.3)) };
});

export const AgreementPlot = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox={`0 0 ${SW} ${SH}`} width="100%" height={SH} role="img" aria-label="H⁺ gerado contra lactato: inclinação 0,98">
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
        <SvgText x={sx(14)} y={sy(22)} text={`inclinação ${br(0.98, 2)} · r² = ${br(0.86, 2)}`} size={20} color="#fff" weight={700} />
    </svg>
);
