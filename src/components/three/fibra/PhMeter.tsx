import { useEffect, useRef, type RefObject } from 'react';
import { C } from '../../sims/kit/palette';
import type { SimRef } from './types';

/*
 * Medidor de pH ILUSTRATIVO (fibra e sangue) e da saída relativa de H⁺/lactato. Atualizado por
 * requestAnimationFrame direto no DOM: nada de estado do React por quadro. As marcas são as âncoras
 * do dossiê 03 (SAHLIN1976 na fibra, NIELSEN2002 no sangue).
 */

const PH_MIN = 6.5;
const PH_MAX = 7.6;
const pct = (ph: number) => `${(((ph - PH_MIN) / (PH_MAX - PH_MIN)) * 100).toFixed(2)}%`;
const fmt = (v: number) => v.toFixed(2).replace('.', ',');

const Tick = ({ ph, label }: { ph: number; label: string }) => (
    <div className="absolute top-0 h-full" style={{ left: pct(ph) }}>
        <div className="w-px h-full bg-white/50" />
        <span className="absolute top-[11px] -translate-x-1/2 whitespace-nowrap text-[14px] leading-none font-mono text-gray-400">{label}</span>
    </div>
);

interface RowProps {
    name: string;
    color: string;
    ticks: readonly [number, string][];
    valueRef: RefObject<HTMLSpanElement | null>;
    markerRef: RefObject<HTMLDivElement | null>;
}

const Row = ({ name, color, ticks, valueRef, markerRef }: RowProps) => (
    <div className="flex items-start gap-3 h-[34px]">
        <span className="w-[52px] text-[14px] font-semibold text-gray-200 leading-[10px] pt-0.5">{name}</span>
        <div className="relative flex-1 h-[8px] mt-0.5 rounded-full" style={{ background: `linear-gradient(90deg, ${C.acid}B0, #334155 55%, ${C.base}B0)` }}>
            {ticks.map(([ph, l]) => <Tick key={l} ph={ph} label={l} />)}
            <div ref={markerRef} className="absolute top-1/2 w-3.5 h-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-white" style={{ background: color, left: '50%', boxShadow: `0 0 10px ${color}, 0 0 2px #000` }} />
        </div>
        <span ref={valueRef} className="w-[46px] text-right text-[18px] leading-[12px] font-mono font-semibold" style={{ color }}>–</span>
    </div>
);

export const PhMeter = ({ simRef }: { simRef: SimRef }) => {
    const mValue = useRef<HTMLSpanElement>(null);
    const mMarker = useRef<HTMLDivElement>(null);
    const bValue = useRef<HTMLSpanElement>(null);
    const bMarker = useRef<HTMLDivElement>(null);
    const efflux = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let raf = 0;
        const paint = () => {
            const m = simRef.current.meter;
            const rows = [[mValue.current, mMarker.current, m.pHi], [bValue.current, bMarker.current, m.pHe]] as const;
            for (const [value, marker, ph] of rows) {
                if (value) value.textContent = fmt(ph);
                if (marker) marker.style.left = pct(ph);
            }
            if (efflux.current) efflux.current.style.width = `${(Math.min(m.efflux, 1) * 100).toFixed(1)}%`;
            raf = requestAnimationFrame(paint);
        };
        raf = requestAnimationFrame(paint);
        return () => cancelAnimationFrame(raf);
    }, [simRef]);

    return (
        <div className="w-[300px] px-3.5 pt-2.5 pb-3 rounded-xl bg-[rgba(4,10,20,0.84)] border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between mb-2.5">
                <span className="text-[14px] font-mono uppercase tracking-wider text-gray-300">pH</span>
                <span className="px-2 py-0.5 rounded-full text-[14px] font-mono text-amber-200 bg-amber-400/10 border border-amber-300/30">valores ilustrativos</span>
            </div>
            <Row name="Fibra" color={C.acidSoft} ticks={[[6.6, '6,60'], [7.08, '7,08']]} valueRef={mValue} markerRef={mMarker} />
            <Row name="Sangue" color={C.baseSoft} ticks={[[7.07, '7,07'], [7.42, '7,42']]} valueRef={bValue} markerRef={bMarker} />
            <div className="flex items-center gap-3 mt-0.5">
                <span className="w-[52px] text-[14px] font-semibold text-gray-200 leading-tight">Saída</span>
                <div className="flex-1 h-[8px] rounded-full bg-white/10 overflow-hidden">
                    <div ref={efflux} className="h-full rounded-full" style={{ width: '0%', background: `linear-gradient(90deg, ${C.acid}, ${C.lactate})` }} />
                </div>
                <span className="w-[46px] text-right text-[14px] text-gray-400">H⁺/lac</span>
            </div>
        </div>
    );
};
