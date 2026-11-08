import { useMemo, useRef } from 'react';
import { C } from '../../sims/kit/palette';
import { HudBox } from './hudParts';
import { toPath, useRaf } from './hudUtils';
import { br, gainAtWeek, loadingGain, playWeek, washoutWeeks, WEEK_AXIS, type LoadPlan } from './model';
import { useCarnoSim } from './store';

/*
 * Curva de carga da etapa 5: ganho de carnosina (% acima do basal) semana a semana para a dose e a
 * duração escolhidas no painel, e a volta devagar depois de parar. Modelo ilustrativo ajustado aos pontos
 * de Harris 2006 e Hill 2007 (ver model.ts); o cursor percorre 0–40 semanas no mesmo relógio que enche o tanque da cena.
 */

const W = 380;
const H = 196;
const X0 = 46;
const X1 = 364;
const Y0 = 160;
const Y1 = 14;
const YMAX = 150;
const sx = (w: number) => X0 + (w / WEEK_AXIS) * (X1 - X0);
const sy = (pct: number) => Y0 - (Math.min(pct, YMAX) / YMAX) * (Y0 - Y1);

const curve = (plan: LoadPlan) => toPath(Array.from({ length: 161 }, (_, k) => {
    const w = (k / 160) * WEEK_AXIS;
    return [sx(w), sy(gainAtWeek(w, plan))] as const;
}));

export const LoadHud = () => {
    const gpd = useCarnoSim(s => s.gpd);
    const weeks = useCarnoSim(s => s.weeks);
    const plan = useMemo<LoadPlan>(() => ({ gpd, weeks }), [gpd, weeks]);
    const path = useMemo(() => curve(plan), [plan]);
    const peak = loadingGain(gpd * 7 * weeks);
    const back = washoutWeeks(plan);
    const line = useRef<SVGLineElement>(null);
    const dot = useRef<SVGCircleElement>(null);
    const read = useRef<HTMLSpanElement>(null);

    useRaf(sec => {
        const w = playWeek(sec);
        const g = gainAtWeek(w, plan);
        const x = sx(w);
        line.current?.setAttribute('x1', `${x}`);
        line.current?.setAttribute('x2', `${x}`);
        dot.current?.setAttribute('cx', `${x}`);
        dot.current?.setAttribute('cy', `${sy(g)}`);
        if (read.current) read.current.textContent = `semana ${br(w)} · +${br(g)}%`;
    });

    return (
        <HudBox title={`Carga · ${br(gpd, 1)} g/d × ${weeks} sem`} chip="ilustrativo">
            <svg viewBox={`0 0 ${W} ${H}`} width={W - 32} height={((W - 32) * H) / W} className="block">
                {[0, 50, 100, 150].map(v => (
                    <g key={v}>
                        <line x1={X0} x2={X1} y1={sy(v)} y2={sy(v)} stroke="#ffffff14" />
                        <text x={X0 - 6} y={sy(v) + 5} textAnchor="end" fontSize={16} fill="#9CA3AF">{v}</text>
                    </g>
                ))}
                {[0, 10, 20, 30, 40].map(w => <text key={w} x={sx(w)} y={Y0 + 22} textAnchor="middle" fontSize={16} fill="#9CA3AF">{w}</text>)}
                <line x1={sx(weeks)} x2={sx(weeks)} y1={Y1} y2={Y0} stroke={C.carnoSoft} strokeDasharray="5 5" strokeOpacity={0.7} />
                <text x={sx(weeks) + 6} y={Y1 + 14} fontSize={16} fill={C.carnoSoft}>para</text>
                <path d={path} fill="none" stroke={C.carno} strokeWidth={3} />
                <line ref={line} y1={Y1} y2={Y0} stroke="#ffffff66" strokeWidth={1.2} />
                <circle ref={dot} r={5.5} fill={C.carno} stroke="#fff" strokeWidth={1.5} />
            </svg>
            <div className="flex items-center justify-between text-[14px] mt-0.5">
                <span ref={read} className="font-mono text-gray-200" />
                <span className="text-gray-300">pico +{br(peak)}% · basal em ~{br(back)} sem</span>
            </div>
            <p className="text-[14px] text-gray-400 mt-1 leading-snug">
                Curva ajustada aos pontos medidos: +42% e +64% em 4 sem (Harris 2006); +59% em 4 sem e +80% em 10 sem (Hill 2007).
            </p>
        </HudBox>
    );
};
