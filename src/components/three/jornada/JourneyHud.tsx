import type { ReactNode } from 'react';
import { C } from '../../sims/kit/palette';
import { BloodChart } from './BloodChart';
import { STRATEGIES, type StrategyId } from './content';
import { ANTACID_POWDER_G, br, type Curve, type DoseSummary } from './dose';
import type { JourneyStateRef } from './state';

/*
 * Faixa de números no rodapé da cena, um conjunto por etapa. Os valores vêm dos controles (estado do
 * React); só o gráfico da etapa 3 lê o quadro por rAF. Conta própria e simulação levam chip.
 */

const Chip = ({ kind }: { kind: 'calc' | 'ilus' }) => (
    <span className={`ml-1.5 px-1.5 rounded-full text-[14px] font-mono ${kind === 'calc' ? 'text-sky-200 bg-sky-400/10 border border-sky-300/30' : 'text-amber-200 bg-amber-400/10 border border-amber-300/30'}`}>
        {kind === 'calc' ? 'cálculo' : 'ilustrativo'}
    </span>
);

interface CellProps { label: string; value: ReactNode; unit?: string; chip?: 'calc' | 'ilus'; color?: string; wide?: boolean }

const Cell = ({ label, value, unit, chip, color = C.text, wide }: CellProps) => (
    <div className={`${wide ? 'flex-[1.6]' : 'flex-1'} min-w-0 rounded-lg px-2.5 py-1.5 bg-white/[0.04] border border-white/10`}>
        <p className="text-[14px] text-gray-400 leading-tight whitespace-nowrap overflow-hidden text-ellipsis">{label}{chip && <Chip kind={chip} />}</p>
        <p className="flex items-baseline gap-1 leading-tight whitespace-nowrap">
            <span className="text-[19px] font-mono font-semibold tabular-nums" style={{ color }}>{value}</span>
            {unit && <span className="text-[14px] text-gray-400">{unit}</span>}
        </p>
    </div>
);

const Meter = ({ label, value, color }: { label: string; value: number; color: string }) => (
    <div className="flex-1 min-w-0 rounded-lg px-2.5 py-1.5 bg-white/[0.04] border border-white/10">
        <p className="text-[14px] text-gray-400 leading-tight whitespace-nowrap">{label}<Chip kind="ilus" /></p>
        <div className="mt-1.5 h-3 rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-[width] duration-700" style={{ width: `${Math.min(value / 1.5, 1) * 100}%`, background: color }} />
        </div>
    </div>
);

export interface JourneyHudProps {
    step: number;
    dose: DoseSummary;
    gas: number;
    water: number;
    alkaline: boolean;
    curves: Curve[];
    athlete: number;
    onAthlete: (i: number) => void;
    active: readonly StrategyId[];
    onToggle: (id: StrategyId) => void;
    onAlkaline: (v: boolean) => void;
    stateRef: JourneyStateRef;
}

const Strip = ({ children }: { children: ReactNode }) => (
    <div className="flex items-stretch gap-1.5 rounded-xl px-2.5 py-2" style={{ background: 'rgba(4,10,20,0.9)', border: '1px solid rgba(255,255,255,0.12)' }}>
        {children}
    </div>
);

export const JourneyHud = ({ step, dose, gas, water, alkaline, curves, athlete, onAthlete, active, onToggle, onAlkaline, stateRef }: JourneyHudProps) => {
    if (step === 3) return <BloodChart curves={curves} selected={athlete} onSelect={onAthlete} stateRef={stateRef} />;
    if (step === 1) return (
        <Strip>
            <Cell wide label="No estômago" value="NaHCO₃ + HCl → NaCl + H₂O + CO₂" color={C.baseSoft} />
            <Cell label="CO₂ teórico máximo" value={`≤ ${br(dose.co2)}`} unit="L" chip="calc" color={C.co2} />
            <Meter label="Gás no estômago" value={gas} color={C.risk} />
        </Strip>
    );
    if (step === 2) return (
        <Strip>
            <div className="flex-[1.5] min-w-0 flex flex-wrap content-center gap-1.5 pointer-events-auto">
                {STRATEGIES.map(s => {
                    const on = active.includes(s.id);
                    return (
                        <button key={s.id} type="button" role="switch" aria-checked={on} onClick={() => onToggle(s.id)}
                            className={`px-2.5 h-8 rounded-full text-[14px] border ${on ? 'text-white border-cyan-300/70 bg-cyan-400/20' : 'text-gray-300 border-white/15 bg-white/5 hover:bg-white/10'}`}>
                            {on ? '● ' : '○ '}{s.chip}
                        </button>
                    );
                })}
            </div>
            <Meter label="Gás no estômago" value={gas} color={C.risk} />
            <Meter label="Água no intestino" value={water} color={C.text} />
        </Strip>
    );
    if (step === 4) return (
        <Strip>
            <div className="flex-[1.5] min-w-0 rounded-lg px-2.5 py-1.5 bg-white/[0.04] border border-white/10 pointer-events-auto">
                <p className="text-[14px] text-gray-400 leading-tight whitespace-nowrap">Efluxo de lactato da perna (mmol/min)</p>
                <div className="flex gap-1.5 mt-1" role="radiogroup">
                    {([[false, 'controle 4,2', C.acid], [true, 'alcalino 10,0', C.base]] as const).map(([v, label, color]) => (
                        <button key={label} type="button" role="radio" aria-checked={alkaline === v} onClick={() => onAlkaline(v)}
                            className="px-2.5 h-7 rounded-full text-[14px] font-mono border whitespace-nowrap"
                            style={alkaline === v ? { borderColor: color, background: `${color}26`, color: '#fff' } : { borderColor: 'rgba(255,255,255,0.15)', color: '#9ca3af' }}>
                            {label}
                        </button>
                    ))}
                </div>
            </div>
            <Cell wide label="No capilar" value="H⁺ + HCO₃⁻ → H₂O + CO₂" color={C.baseSoft} />
            <Cell label="pH da fibra em repouso" value="igual" unit="com e sem" color={C.text} />
        </Strip>
    );
    const over = dose.powder > ANTACID_POWDER_G;
    return (
        <Strip>
            <Cell label="Pó de NaHCO₃" value={br(dose.powder)} unit="g" />
            <Cell label="Sódio" value={br(dose.sodium)} unit="g" chip="calc" color={C.sodium} />
            <Cell label="× teto da OMS" value={`${br(dose.whoTimes)}×`} color={dose.whoTimes > 1 ? C.risk : C.ok} />
            <Cell label="Cápsulas de 840 mg" value={dose.capsules} />
            {step === 5 && <Cell label="Antiácido, máx. 24 h" value="16,8 g" unit={over ? 'passou' : 'abaixo'} color={over ? C.risk : C.ok} />}
        </Strip>
    );
};
