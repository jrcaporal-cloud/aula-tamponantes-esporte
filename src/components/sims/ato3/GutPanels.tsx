import { motion } from 'framer-motion';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { CountUp } from '../kit/CountUp';
import { MILLER, STRATEGIES } from './intestino';

/** Painéis à direita do intestino (slide 47). */

export const PricePanel = () => (
    <div className="flex flex-col gap-4">
        <span className="font-mono text-[15px] text-rose-300">MILLER 2025 · 11 ECRs · 126 PESSOAS</span>
        {MILLER.map((m, i) => (
            <div key={m.label} className="flex flex-col gap-1.5">
                <span className="text-[16px] text-gray-100 font-semibold">{m.label}</span>
                {[{ v: m.sb, l: 'bicarbonato', c: C.risk }, { v: m.pla, l: 'placebo', c: C.co2 }].map(b => (
                    <div key={b.l} className="flex items-center gap-3">
                        <span className="w-[104px] text-[15px] text-gray-300">{b.l}</span>
                        <div className="flex-1 h-[20px] rounded bg-white/[0.04] overflow-hidden">
                            <motion.div className="h-full rounded" style={{ background: b.c }} initial={{ width: 0 }}
                                animate={{ width: `${(b.v / 32) * 100}%` }} transition={{ duration: 0.7, delay: 0.2 * i }} />
                        </div>
                        <CountUp text={`${br(b.v, 1)}%`} delay={0.2 * i} duration={0.7} className="w-[64px] text-right text-[17px] font-bold" style={{ color: b.c }} />
                    </div>
                ))}
            </div>
        ))}
        <div className="flex items-center gap-3 pt-1">
            <div className="flex gap-1">
                {Array.from({ length: 11 }, (_, i) => (
                    <span key={i} className="w-[16px] h-[16px] rounded-full" style={{ background: i < 10 ? C.risk : C.co2 }} />
                ))}
            </div>
            <span className="text-[16px] text-gray-100">diarreia em 10 de 11 (Kahle 2013)</span>
        </div>
    </div>
);

export const SitesPanel = () => (
    <div className="flex flex-col gap-3">
        <div className="rounded-xl border bg-white/[0.03] p-4" style={{ borderColor: `${C.co2}66` }}>
            <p className="font-display text-[1.3rem] font-semibold text-white">Estômago</p>
            <p className="text-[16px] leading-snug text-gray-100">HCl + HCO₃⁻ → CO₂: distensão, náusea, vômito, dor abdominal (ISSN 2021).</p>
        </div>
        <div className="rounded-xl border bg-white/[0.03] p-4" style={{ borderColor: '#93C5FD66' }}>
            <p className="font-display text-[1.3rem] font-semibold text-white">Intestino</p>
            <p className="text-[16px] leading-snug text-gray-100">Diarreia osmótica: a cápsula entérica protege o estômago, mas "provavelmente não" a evita (ISSN 2021).</p>
        </div>
        <p className="text-[16px] leading-snug text-gray-300">Pico dos sintomas ~90 min após 0,3 g/kg em solução (Carr 2011).</p>
    </div>
);

export const ErasePanel = () => (
    <div className="flex flex-col gap-3">
        <span className="font-mono text-[15px] text-cyan-300">SAUNDERS 2014 · 21 HOMENS · CCT110</span>
        <div className="flex flex-wrap gap-1.5 max-w-[340px]">
            {Array.from({ length: 21 }, (_, i) => (
                <span key={i} className="w-[22px] h-[22px] rounded-full" style={{ background: i < 4 ? C.risk : C.base, opacity: i < 4 ? 1 : 0.75 }} />
            ))}
        </div>
        <div className="grid gap-x-3 gap-y-1 items-baseline" style={{ gridTemplateColumns: 'auto 1fr' }}>
            <span className="font-display text-[1.5rem] font-semibold text-gray-300">p = 0,16</span>
            <span className="text-[16px] text-gray-100">todos os 21 (d = 0,14)</span>
            <span className="font-display text-[1.5rem] font-semibold" style={{ color: C.base }}>p = 0,01</span>
            <span className="text-[16px] text-gray-100">sem os 4 com desconforto GI</span>
        </div>
        <p className="text-[16px] leading-snug text-gray-300">Em CrossFit, mais GI andou junto com menos potência média (r = −0,674) — correlação, não prova (Durkalec 2023).</p>
    </div>
);

export const StrategyList = ({ ids, on, toggle }: { ids: readonly string[]; on: ReadonlySet<string>; toggle: (id: string) => void }) => (
    <div className="flex flex-col gap-2">
        {STRATEGIES.filter(s => ids.includes(s.id)).map(s => {
            const active = on.has(s.id);
            return (
                <button key={s.id} type="button" onClick={() => toggle(s.id)} aria-pressed={active}
                    className="text-left rounded-xl border px-3 py-2 flex items-center gap-3 cursor-pointer transition-colors"
                    style={{ borderColor: active ? `${s.color}aa` : 'rgba(255,255,255,0.1)', background: active ? `${s.color}12` : 'rgba(255,255,255,0.02)' }}>
                    <span className="w-[34px] h-[20px] rounded-full relative shrink-0" style={{ background: active ? s.color : 'rgba(255,255,255,0.15)' }}>
                        <span className="absolute top-[2px] w-[16px] h-[16px] rounded-full bg-white transition-all" style={{ left: active ? 16 : 2 }} />
                    </span>
                    <span className="flex-1 min-w-0">
                        <span className="flex items-baseline justify-between gap-2">
                            <span className="text-[17px] font-semibold text-white">{s.name}</span>
                            <span className="font-mono text-[15px] shrink-0" style={{ color: s.color }}>{s.evidence}</span>
                        </span>
                        <span className="block text-[15px] leading-snug text-gray-300">{s.finding}</span>
                    </span>
                </button>
            );
        })}
    </div>
);
