import { useMemo, useRef } from 'react';
import { C } from '../../sims/kit/palette';
import { HudBox } from './hudParts';
import { toPath, useRaf } from './hudUtils';
import { br, firing, HOUR_AXIS, ITCH_THRESHOLD, PEAK, plasma, playHour, type Release } from './model';
import { useCarnoSim } from './store';

/*
 * Curva plasmática de β-alanina depois de 1,6 g (picos de Décombaz 2012). Na etapa 1 só a pura;
 * na etapa 7, pura × liberação lenta e o limiar do formigamento (ilustrativo). O cursor percorre
 * 0–4 h no mesmo relógio que a cena usa para acender o neurônio.
 */

const W = 380;
const H = 196;
const X0 = 46;
const X1 = 364;
const Y0 = 160;
const Y1 = 14;
const YMAX = 300;
const sx = (h: number) => X0 + (h / HOUR_AXIS) * (X1 - X0);
const sy = (c: number) => Y0 - (c / YMAX) * (Y0 - Y1);

const curve = (mode: Release) => toPath(Array.from({ length: 121 }, (_, k) => {
    const h = (k / 120) * HOUR_AXIS;
    return [sx(h), sy(plasma(h, mode))] as const;
}));

export const PlasmaHud = ({ withSlow }: { withSlow: boolean }) => {
    const release = useCarnoSim(s => s.release);
    const mode: Release = withSlow ? release : 'pura';
    const paths = useMemo(() => ({ pura: curve('pura'), lenta: curve('lenta') }), []);
    const line = useRef<SVGLineElement>(null);
    const dot = useRef<SVGCircleElement>(null);
    const read = useRef<HTMLSpanElement>(null);
    const state = useRef<HTMLSpanElement>(null);

    useRaf(sec => {
        const h = playHour(sec);
        const c = plasma(h, mode);
        const x = sx(h);
        line.current?.setAttribute('x1', `${x}`);
        line.current?.setAttribute('x2', `${x}`);
        dot.current?.setAttribute('cx', `${x}`);
        dot.current?.setAttribute('cy', `${sy(c)}`);
        if (read.current) read.current.textContent = `${br(h, 1)} h · ${br(c)} µM`;
        if (state.current && withSlow) {
            const on = firing(h, mode) > 0;
            state.current.textContent = on ? 'formigando' : 'abaixo do limiar';
            state.current.style.color = on ? C.risk : '#9CA3AF';
        }
    });

    const color = mode === 'pura' ? C.carno : C.carnoSoft;
    return (
        <HudBox title="β-alanina · 1,6 g" chip={withSlow ? 'ilustrativo' : undefined}>
            <svg viewBox={`0 0 ${W} ${H}`} width={W - 32} height={((W - 32) * H) / W} className="block">
                {[0, 100, 200, 300].map(v => (
                    <g key={v}>
                        <line x1={X0} x2={X1} y1={sy(v)} y2={sy(v)} stroke="#ffffff14" />
                        <text x={X0 - 6} y={sy(v) + 5} textAnchor="end" fontSize={16} fill="#9CA3AF">{v}</text>
                    </g>
                ))}
                {[0, 1, 2, 3, 4].map(h => <text key={h} x={sx(h)} y={Y0 + 22} textAnchor="middle" fontSize={16} fill="#9CA3AF">{h} h</text>)}
                {withSlow && (
                    <g>
                        <line x1={X0} x2={X1} y1={sy(ITCH_THRESHOLD)} y2={sy(ITCH_THRESHOLD)} stroke={C.risk} strokeDasharray="6 5" strokeWidth={1.6} />
                        <text x={X1} y={sy(ITCH_THRESHOLD) - 6} textAnchor="end" fontSize={16} fill={C.risk}>limiar (ilustrativo)</text>
                    </g>
                )}
                {withSlow && <path d={mode === 'pura' ? paths.lenta : paths.pura} fill="none" stroke="#ffffff38" strokeWidth={2} />}
                <path d={paths[mode]} fill="none" stroke={color} strokeWidth={3} />
                <text x={sx(PEAK[mode].t) + 10} y={sy(PEAK[mode].c) + (mode === 'pura' ? 6 : -10)} fontSize={16} fill={color} fontWeight={600}>
                    {PEAK[mode].c} µM
                </text>
                <line ref={line} y1={Y1} y2={Y0} stroke="#ffffff66" strokeWidth={1.2} />
                <circle ref={dot} r={5.5} fill={color} stroke="#fff" strokeWidth={1.5} />
            </svg>
            <div className="flex items-center justify-between text-[14px] mt-0.5">
                <span ref={read} className="font-mono text-gray-200" />
                {withSlow
                    ? <span ref={state} className="font-semibold" />
                    : <span className="text-gray-400">basal em ~2 h</span>}
            </div>
            <p className="text-[14px] text-gray-400 mt-1">Picos: Décombaz 2012 (n = 11, jejum). µM no eixo vertical.</p>
        </HudBox>
    );
};
