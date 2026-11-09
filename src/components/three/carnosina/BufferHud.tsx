import { useRef } from 'react';
import { C } from '../../sims/kit/palette';
import { HudBox } from './hudParts';
import { setText, useRaf } from './hudUtils';
import { autoPh, br, protonatedFraction } from './model';
import { useCarnoSim } from './store';

/*
 * Leitura da etapa 6: pH do sarcoplasma (ciclo ilustrativo ou o do slider), fração do imidazol com
 * H⁺ (Henderson–Hasselbalch, pKa 6,83 — cálculo) e a fatia da carnosina no tampão muscular (~7%).
 */

export const BufferHud = () => {
    const ph = useRef<HTMLSpanElement>(null);
    const frac = useRef<HTMLSpanElement>(null);
    const bar = useRef<HTMLDivElement>(null);

    useRaf(sec => {
        const p = useCarnoSim.getState().ph ?? autoPh(sec);
        const f = protonatedFraction(p);
        setText(ph.current, br(p, 2));
        setText(frac.current, `${br(f * 100)}%`);
        // barra em décimos de ponto: o mesmo desenho, sem reescrever o estilo a cada quadro à toa
        const width = `${Math.round(f * 1000) / 10}%`;
        if (bar.current && bar.current.style.width !== width) bar.current.style.width = width;
    });

    return (
        <HudBox title="Sarcoplasma" chip="valores ilustrativos" width={360}>
            <div className="flex items-end justify-between gap-4">
                <div>
                    <div className="text-[14px] text-gray-400">pH</div>
                    <span ref={ph} className="font-mono text-[30px] font-semibold leading-none" style={{ color: C.acid }} />
                </div>
                <div className="text-right">
                    <div className="text-[14px] text-gray-400">imidazol com H⁺</div>
                    <span ref={frac} className="font-mono text-[30px] font-semibold leading-none" style={{ color: C.base }} />
                </div>
            </div>
            <div className="h-2.5 rounded-full bg-white/10 overflow-hidden mt-2">
                <div ref={bar} className="h-full rounded-full" style={{ background: `linear-gradient(90deg, ${C.base}, ${C.acid})` }} />
            </div>
            <p className="text-[14px] text-gray-400 mt-1">Cálculo: Henderson–Hasselbalch, pKa 6,83 (Sale 2010).</p>
            <div className="mt-2.5 text-[14px] text-gray-300">Capacidade tamponante do músculo humano</div>
            <div className="flex h-5 rounded-md overflow-hidden mt-1 border border-white/10">
                <div className="h-full flex items-center justify-center text-[14px] font-semibold text-white" style={{ width: '7%', minWidth: 34, background: C.carno }}>7%</div>
                <div className="h-full flex-1 flex items-center pl-2 text-[14px] text-gray-300 bg-white/5">demais tampões</div>
            </div>
            <p className="text-[14px] text-gray-400 mt-1">Carnosina ≈ 7% (Mannion 1992): real, mas modesto.</p>
        </HudBox>
    );
};
