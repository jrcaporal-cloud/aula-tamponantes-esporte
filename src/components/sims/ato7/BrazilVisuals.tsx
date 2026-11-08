import { motion, useReducedMotion } from 'framer-motion';
import { Ban } from 'lucide-react';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { AIS_DOSES, LABEL_DOSES, LOAD_RACES, LOAD_TARGET_G, NOT_AUTHORIZED } from './brazil';
import { useRamp } from './useRamp';

/** Visuais dos passos 1 e 2 do slide 91 (E no Brasil?); passos 3 e 4 em BrazilScenes. Área útil: 650 × 410. */
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
