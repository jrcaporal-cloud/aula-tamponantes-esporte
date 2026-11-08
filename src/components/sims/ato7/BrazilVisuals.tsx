import { motion, useReducedMotion } from 'framer-motion';
import { Ban, Check, CircleHelp, Pill } from 'lucide-react';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { AIS_DOSES, CFN_DUTIES, GRAY_ZONES, LABEL_DOSES, LOAD_RACES, LOAD_TARGET_G, NOT_AUTHORIZED, SHELVES } from './brazil';
import { useRamp } from './useRamp';

/** Visuais do slide 91 (E no Brasil?). Área útil: 650 × 410. */
const W = 650;

const hourX = (h: number) => 150 + ((h - 6) / 16) * (W - 230);
const doseR = (mg: number) => 5 + Math.sqrt(mg) * 0.45;

/** Passo 1: o dia de tomadas do rótulo contra o regime do AIS. */
export const LabelDay = () => {
    const reduce = useReducedMotion();
    const rows = [
        { id: 'ais', label: 'AIS', sub: '4 × 1,6 g', total: '6,4 g', doses: AIS_DOSES, color: C.carnoSoft, y: 70 },
        { id: 'in28', label: 'Rótulo IN 28', sub: '≤ 300 mg a cada 2 h', total: '2 g', doses: LABEL_DOSES, color: C.carno, y: 170 },
    ];
    return (
        <div className="flex h-full flex-col gap-3">
            <svg viewBox={`0 0 ${W} 250`} width="100%" style={{ aspectRatio: `${W} / 250` }} role="img" aria-label="Tomadas de β-alanina ao longo do dia">
                {[6, 10, 14, 18, 22].map(h => (
                    <g key={h}>
                        <line x1={hourX(h)} x2={hourX(h)} y1={30} y2={210} stroke="rgba(255,255,255,0.07)" />
                        <SvgText x={hourX(h)} y={236} text={`${h}h`} anchor="middle" size={16} color={C.muted} weight={500} />
                    </g>
                ))}
                {rows.map(r => (
                    <g key={r.id}>
                        <SvgText x={0} y={r.y} text={r.label} size={19} weight={700} color={r.color} />
                        <SvgText x={0} y={r.y + 22} text={r.sub} size={16} weight={500} color={C.muted} />
                        <line x1={hourX(6)} x2={hourX(22)} y1={r.y} y2={r.y} stroke="rgba(255,255,255,0.18)" />
                        {r.doses.map((d, i) => (
                            <motion.circle key={d.h} cx={hourX(d.h)} cy={r.y} r={doseR(d.mg)} fill={r.color} fillOpacity={0.8}
                                initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: reduce ? 0 : 0.2 + i * 0.12 }} />
                        ))}
                        <SvgText x={W} y={r.y + 7} text={r.total} anchor="end" size={22} weight={700} color="#fff" />
                    </g>
                ))}
            </svg>
            <div className="flex items-center gap-2">
                <span className="text-[16px] font-semibold text-gray-100">Não autorizada:</span>
                {NOT_AUTHORIZED.map(n => (
                    <span key={n} className="flex items-center gap-1.5 rounded-lg border px-3 py-1 text-[16px] font-semibold"
                        style={{ borderColor: `${C.risk}88`, color: C.risk, background: `${C.risk}14` }}>
                        <Ban size={16} aria-hidden /> {n}
                    </span>
                ))}
            </div>
            <p className="m-0 text-[16px] leading-snug text-gray-200">Círculo proporcional à dose. O rótulo fecha 2 g com 6 × 300 mg + 1 × 200 mg (cálculo).</p>
        </div>
    );
};

/** Passo 2: corrida até 179 g em cada regime (eixo em dias). */
export const LoadRace = () => {
    const reduce = useReducedMotion() ?? false;
    const maxDay = 95;
    const day = useRamp(2600, reduce, 250) * maxDay;
    const x0 = 170;
    const sx = (d: number) => x0 + (d / maxDay) * (W - x0 - 70);
    return (
        <svg viewBox={`0 0 ${W} 410`} width="100%" height="100%" role="img" aria-label="Dias até 179 g de β-alanina">
            <SvgText x={W} y={30} text={`dia ${Math.round(day)}`} anchor="end" size={24} weight={700} color="#fff" />
            {[0, 30, 60, 90].map(d => (
                <g key={d}>
                    <line x1={sx(d)} x2={sx(d)} y1={50} y2={330} stroke="rgba(255,255,255,0.07)" />
                    <SvgText x={sx(d)} y={354} text={String(d)} anchor="middle" size={16} color={C.muted} weight={500} />
                </g>
            ))}
            <SvgText x={(x0 + W - 70) / 2} y={380} text="dias de suplementação" anchor="middle" size={16} color="#CBD5E1" weight={500} />
            {LOAD_RACES.map((r, i) => {
                const y = 90 + i * 90;
                const finish = LOAD_TARGET_G / r.gPerDay;
                const done = day >= finish;
                const reach = Math.min(day, finish);
                const color = r.id === 'anvisa' ? C.carno : C.carnoSoft;
                return (
                    <g key={r.id}>
                        <SvgText x={0} y={y + 2} text={r.label} size={19} weight={700} color={color} />
                        <SvgText x={0} y={y + 24} text={r.sub} size={16} weight={500} color={C.muted} />
                        <rect x={x0} y={y - 16} width={Math.max(sx(reach) - x0, 0)} height={30} rx={6} fill={color} fillOpacity={0.75} />
                        <SvgText x={sx(reach) + 10} y={y + 6}
                            text={done ? `179 g no dia ${Math.round(finish)}` : `${br(reach * r.gPerDay, 0)} g`}
                            size={18} weight={700} color={done ? '#fff' : '#E5E7EB'} />
                    </g>
                );
            })}
            <SvgText x={0} y={406} text="Meta: 179 g, a mediana total de Hobson 2012 · dias = cálculo" size={16} color={C.muted} weight={500} />
        </svg>
    );
};

const SHELF_LOOK = {
    sim: { Icon: Check, color: C.ok, tag: 'permitido' },
    nao: { Icon: Ban, color: C.risk, tag: 'não existe' },
    med: { Icon: Pill, color: C.lactate, tag: 'medicamento' },
} as const;

/** Passo 3: três prateleiras e a conta do sódio. */
export const Shelves = () => (
    <div className="flex h-full flex-col gap-3">
        {SHELVES.map((s, i) => {
            const look = SHELF_LOOK[s.mark];
            return (
                <motion.div key={s.id} className="flex items-center gap-4 rounded-xl border px-4 py-3"
                    style={{ borderColor: `${look.color}77`, background: `${look.color}10` }}
                    initial={{ opacity: 0, x: 14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15 + i * 0.15 }}>
                    <look.Icon size={30} color={look.color} aria-hidden className="shrink-0" />
                    <div className="min-w-0 flex-1">
                        <p className="m-0 font-display text-[20px] font-semibold leading-tight text-white">{s.title}</p>
                        <p className="m-0 mt-0.5 text-[16px] leading-snug text-gray-200">{s.text}</p>
                    </div>
                    <span className="shrink-0 font-mono text-[15px] uppercase" style={{ color: look.color }}>{look.tag}</span>
                </motion.div>
            );
        })}
        <div className="mt-auto rounded-xl border border-white/12 bg-white/[0.03] px-4 py-3">
            <p className="m-0 text-[17px] leading-snug text-gray-100">
                A dose de 70 kg (21 g) leva <strong style={{ color: C.sodium }}>5,75 g de sódio</strong>: o mesmo que
                <strong style={{ color: C.sodium }}> 5 litros</strong> da bebida de eletrólitos mais salgada que a IN 28 admite.
            </p>
            <p className="m-0 mt-1 text-[15px] text-gray-300">Cálculo: 5,75 g ÷ 1,15 g/L (ISSN 2026; IN 28).</p>
        </div>
    </div>
);

/** Passo 4: o que a 656 exige e as duas zonas cinzentas. */
export const CfnZones = () => (
    <div className="flex h-full flex-col gap-3">
        <p className="m-0 font-mono text-[15px] uppercase tracking-wider text-gray-300">O que a 656 exige</p>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {CFN_DUTIES.map(d => (
                <li key={d} className="flex gap-2 text-[16px] leading-snug text-gray-100">
                    <Check size={17} color={C.ok} className="mt-[3px] shrink-0" aria-hidden /> {d}
                </li>
            ))}
        </ul>
        <div className="grid flex-1 grid-cols-2 gap-3">
            {GRAY_ZONES.map((z, i) => (
                <motion.div key={z.id} className="flex flex-col gap-1.5 rounded-xl border border-dashed px-4 py-3"
                    style={{ borderColor: `${C.co2}aa`, background: 'repeating-linear-gradient(135deg, rgba(148,163,184,0.07) 0 10px, rgba(148,163,184,0.02) 10px 20px)' }}
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.2 }}>
                    <span className="flex items-center gap-2 font-mono text-[15px] uppercase tracking-wider text-slate-300">
                        <CircleHelp size={17} aria-hidden /> zona cinzenta
                    </span>
                    <p className="m-0 font-display text-[19px] font-semibold leading-tight text-white">{z.title}</p>
                    <p className="m-0 text-[15px] leading-snug text-gray-200">{z.why}</p>
                    <p className="m-0 mt-auto text-[15px] font-semibold text-slate-300">Parecer específico do CFN: não localizado.</p>
                </motion.div>
            ))}
        </div>
    </div>
);
