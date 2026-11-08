import { useEffect, useMemo, useRef } from 'react';
import { C } from '../../sims/kit/palette';
import { MEAN_RISE, THRESHOLD, br, riseAt, windowAbove, type Curve } from './dose';
import type { JourneyStateRef } from './state';

/*
 * HUD da etapa 3: HCO₃⁻ × tempo com uma curva por atleta (picos e alturas dentro das faixas de
 * JONES2016; a forma é ilustrativa) e o "relógio" do atleta escolhido: a janela acima de +5 mmol/L,
 * o pico e o ponteiro do tempo. O cursor corre por quadro, escrito direto no SVG (sem React).
 * SVG em pixels reais (sem viewBox): o texto tem o tamanho que está escrito.
 */

const W = 500;
const H = 214;
const PAD = { l: 50, r: 14, t: 16, b: 38 };
const X_MAX = 240;
const Y_MAX = 13;
const sx = (m: number) => PAD.l + (m / X_MAX) * (W - PAD.l - PAD.r);
const sy = (v: number) => H - PAD.b - (v / Y_MAX) * (H - PAD.t - PAD.b);

const pathOf = (c: Curve) => {
    let d = '';
    for (let m = 0; m <= X_MAX; m += 4) d += `${m === 0 ? 'M' : 'L'}${sx(m).toFixed(1)},${sy(riseAt(c, m)).toFixed(1)}`;
    return d;
};

/* relógio: 240 min numa volta, começando no alto, no sentido horário */
const DIAL = 128;
const R = 46;
const CX = DIAL / 2;
const CY = 66;
const ang = (m: number) => (m / X_MAX) * Math.PI * 2 - Math.PI / 2;
const at = (m: number, r: number) => [CX + Math.cos(ang(m)) * r, CY + Math.sin(ang(m)) * r] as const;
const arc = (a: number, b: number, r: number) => {
    const [x0, y0] = at(a, r);
    const [x1, y1] = at(b, r);
    return `M${x0},${y0} A${r},${r} 0 ${b - a > X_MAX / 2 ? 1 : 0} 1 ${x1},${y1}`;
};

interface BloodChartProps {
    curves: Curve[];
    selected: number;
    onSelect: (i: number) => void;
    stateRef: JourneyStateRef;
}

export const BloodChart = ({ curves, selected, onSelect, stateRef }: BloodChartProps) => {
    const cursor = useRef<SVGLineElement>(null);
    const dot = useRef<SVGCircleElement>(null);
    const hand = useRef<SVGLineElement>(null);
    const readout = useRef<HTMLSpanElement>(null);
    const paths = useMemo(() => curves.map(pathOf), [curves]);
    const cur = curves[selected];
    const win = useMemo(() => windowAbove(cur, THRESHOLD), [cur]);
    const at60 = riseAt(cur, 60);

    useEffect(() => {
        let raf = 0;
        let last = '';
        const tick = () => {
            raf = requestAnimationFrame(tick);
            const { minute, rise, ph } = stateRef.current.f;
            const x = sx(minute);
            cursor.current?.setAttribute('x1', `${x}`);
            cursor.current?.setAttribute('x2', `${x}`);
            dot.current?.setAttribute('cx', `${x}`);
            dot.current?.setAttribute('cy', `${sy(rise)}`);
            const [hx, hy] = at(minute, R - 6);
            hand.current?.setAttribute('x2', `${hx}`);
            hand.current?.setAttribute('y2', `${hy}`);
            const txt = `${Math.round(minute)} min · +${br(rise)} mmol/L · pH ${br(ph, 2)}`;
            if (txt !== last && readout.current) { readout.current.textContent = txt; last = txt; }
        };
        tick();
        return () => cancelAnimationFrame(raf);
    }, [stateRef]);

    return (
        <div className="pointer-events-auto flex gap-3 rounded-xl px-3 py-2.5" style={{ background: 'rgba(4,10,20,0.9)', border: `1px solid ${C.base}40` }}>
            <div>
                <div className="flex items-baseline justify-between gap-4 pr-1">
                    <p className="text-[14px] font-semibold text-gray-100">HCO₃⁻ acima do basal × minutos após a dose</p>
                    <span className="shrink-0 px-2 py-0.5 rounded-full text-[14px] font-mono text-amber-200 bg-amber-400/10 border border-amber-300/30">valores ilustrativos</span>
                </div>
                <svg width={W} height={H} role="img" aria-label="Curvas de bicarbonato no sangue por atleta">
                    {[0, 5, 10].map(v => (
                        <g key={v}>
                            <line x1={PAD.l} x2={W - PAD.r} y1={sy(v)} y2={sy(v)} stroke="#ffffff" strokeOpacity={v === 0 ? 0.3 : 0.08} />
                            <text x={PAD.l - 8} y={sy(v) + 5} textAnchor="end" fontSize={14} fill={C.muted}>{v === 0 ? '0' : `+${v}`}</text>
                        </g>
                    ))}
                    <line x1={PAD.l} x2={W - PAD.r} y1={sy(THRESHOLD)} y2={sy(THRESHOLD)} stroke={C.base} strokeOpacity={0.55} strokeDasharray="5 5" />
                    <text x={W - PAD.r} y={sy(THRESHOLD) - 6} textAnchor="end" fontSize={14} fill={C.baseSoft}>+5 mmol/L</text>
                    <text x={PAD.l + 4} y={sy(MEAN_RISE) - 22} fontSize={14} fill={C.muted} stroke="#04080f" strokeWidth={4} paintOrder="stroke">média de 189 estudos: +5,2</text>
                    {[0, 60, 120, 180, 240].map(m => (
                        <text key={m} x={sx(m)} y={H - PAD.b + 20} textAnchor="middle" fontSize={14} fill={C.muted}>{m}</text>
                    ))}
                    <text x={W - PAD.r} y={H - 2} textAnchor="end" fontSize={14} fill={C.muted}>min</text>
                    <line x1={sx(60)} x2={sx(60)} y1={PAD.t} y2={H - PAD.b} stroke={C.text} strokeOpacity={0.5} strokeDasharray="3 4" />
                    <text x={sx(60) - 5} y={PAD.t + 12} textAnchor="end" fontSize={14} fill={C.text}>largada fixa</text>
                    {paths.map((d, i) => (
                        <g key={curves[i].id} onClick={() => onSelect(i)} style={{ cursor: 'pointer' }}>
                            <path d={d} fill="none" stroke="transparent" strokeWidth={14} />
                            <path d={d} fill="none" stroke={i === selected ? C.base : C.co2} strokeOpacity={i === selected ? 1 : 0.45} strokeWidth={i === selected ? 3.2 : 1.5} />
                        </g>
                    ))}
                    <circle cx={sx(cur.peak)} cy={sy(cur.rise)} r={5} fill={C.base} />
                    <text x={sx(cur.peak)} y={sy(cur.rise) - 10} textAnchor="middle" fontSize={14} fontWeight={600} fill={C.baseSoft} stroke="#04080f" strokeWidth={4} paintOrder="stroke">pico {cur.peak} min</text>
                    <line ref={cursor} y1={PAD.t} y2={H - PAD.b} stroke={C.lactate} strokeOpacity={0.8} />
                    <circle ref={dot} r={5.5} fill={C.lactate} stroke="#04080f" strokeWidth={2} />
                </svg>
                <p className="text-[14px] text-gray-300 leading-tight">
                    <span className="font-mono text-amber-200" ref={readout}>—</span>
                    <span className="text-gray-400"> · pH por cálculo (PCO₂ 40)</span>
                </p>
            </div>
            <div className="flex flex-col items-center" style={{ width: DIAL }}>
                <div className="flex items-center gap-1">
                    <button type="button" aria-label="Atleta anterior" onClick={() => onSelect((selected + curves.length - 1) % curves.length)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] text-gray-200 hover:text-white bg-white/10 hover:bg-white/20">‹</button>
                    <p className="text-[14px] font-semibold text-gray-100 whitespace-nowrap">{cur.label}</p>
                    <button type="button" aria-label="Próximo atleta" onClick={() => onSelect((selected + 1) % curves.length)}
                        className="w-7 h-7 rounded-full flex items-center justify-center text-[16px] text-gray-200 hover:text-white bg-white/10 hover:bg-white/20">›</button>
                </div>
                <svg width={DIAL} height={134} aria-label={`Relógio do ${cur.label}`}>
                    <circle cx={CX} cy={CY} r={R} fill="none" stroke="#ffffff" strokeOpacity={0.14} strokeWidth={8} />
                    {win && <path d={arc(win[0], win[1], R)} fill="none" stroke={C.base} strokeWidth={8} strokeLinecap="round" />}
                    {[0, 60, 120, 180].map(m => {
                        const [x0, y0] = at(m, R + 6);
                        const [x1, y1] = at(m, R + 11);
                        return <line key={m} x1={x0} y1={y0} x2={x1} y2={y1} stroke={m === 60 ? C.text : C.muted} strokeWidth={2} />;
                    })}
                    {(() => { const [x, y] = at(cur.peak, R); return <circle cx={x} cy={y} r={6} fill={C.baseSoft} stroke="#04080f" strokeWidth={2} />; })()}
                    <line ref={hand} x1={CX} y1={CY} x2={CX} y2={CY - R} stroke={C.lactate} strokeWidth={2.5} strokeLinecap="round" />
                    <circle cx={CX} cy={CY} r={3.5} fill={C.lactate} />
                    <text x={CX} y={CY + R + 22} textAnchor="middle" fontSize={14} fill={C.muted}>0 min no alto</text>
                </svg>
                <p className="text-[14px] text-gray-300 text-center leading-snug">
                    aos 60 min: <span className="font-mono text-white">+{br(at60)}</span>
                    <br />{win ? <>≥ +5: {win[0]}–{win[1]} min</> : 'nunca ≥ +5'}
                </p>
            </div>
        </div>
    );
};
