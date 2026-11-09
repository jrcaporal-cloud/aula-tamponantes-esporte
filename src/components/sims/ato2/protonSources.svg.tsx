import type { ReactNode } from 'react';

/**
 * Peças SVG do slide 24 (De Onde Vem o H⁺?). Animação por SMIL (<animate>/<animateTransform>),
 * que reinicia quando o <svg> monta de novo a cada passo. Com `reduce`, tudo nasce no estado final.
 */

const EASE = { calcMode: 'spline', keyTimes: '0;1', keySplines: '0.4 0 0.2 1' } as const;

interface TimedProps {
    reduce: boolean;
    begin: number;
    dur?: number;
    children: ReactNode;
}

/** Aparece (opacidade 0 → 1). */
export const Appear = ({ reduce, begin, dur = 0.4, children }: TimedProps) => (
    <g opacity={reduce ? 1 : 0}>
        {!reduce && <animate attributeName="opacity" from="0" to="1" begin={`${begin}s`} dur={`${dur}s`} fill="freeze" />}
        {children}
    </g>
);

/** Some (opacidade 1 → 0). */
export const Vanish = ({ reduce, begin, dur = 0.4, children }: TimedProps) => (
    <g opacity={reduce ? 0 : 1}>
        {!reduce && <animate attributeName="opacity" from="1" to="0" begin={`${begin}s`} dur={`${dur}s`} fill="freeze" />}
        {children}
    </g>
);

/** Desloca de `from` para `to` (pares "x y"). */
export const Move = ({ reduce, begin, dur = 0.8, from, to, children }: TimedProps & { from: string; to: string }) => (
    <g transform={`translate(${reduce ? to : from})`}>
        {!reduce && <animateTransform attributeName="transform" type="translate" from={from} to={to} begin={`${begin}s`} dur={`${dur}s`} fill="freeze" {...EASE} />}
        {children}
    </g>
);

/**
 * Surge crescendo de 60% (nada nasce do zero) enquanto esmaece, e fica em (x, y); filhos desenhados em torno de 0,0.
 * Antes do `begin` fica invisível pela opacidade (o Appear), não pela escala.
 */
export const Pop = ({ reduce, begin, dur = 0.45, x, y, to = 1, children }: TimedProps & { x: number; y: number; to?: number }) => (
    <g transform={`translate(${x} ${y})`}>
        <Appear reduce={reduce} begin={begin} dur={dur}>
            <g transform={`scale(${reduce ? to : 0.6 * to})`}>
                {!reduce && <animateTransform attributeName="transform" type="scale" from={`${0.6 * to}`} to={`${to}`} begin={`${begin}s`} dur={`${dur}s`} fill="freeze" {...EASE} />}
                {children}
            </g>
        </Appear>
    </g>
);

/** Gira em torno de (cx, cy) de 0 até `deg` graus. */
export const Tilt = ({ reduce, begin, dur = 0.9, deg, cx, cy, children }: TimedProps & { deg: number; cx: number; cy: number }) => (
    <g transform={`rotate(${reduce ? deg : 0} ${cx} ${cy})`}>
        {!reduce && <animateTransform attributeName="transform" type="rotate" from={`0 ${cx} ${cy}`} to={`${deg} ${cx} ${cy}`} begin={`${begin}s`} dur={`${dur}s`} fill="freeze" {...EASE} />}
        {children}
    </g>
);

const LABEL_STYLE = { fontFamily: 'var(--font-body)' } as const;

/** Íon/molécula: bolha com rótulo dentro (desenhada em torno de 0,0). */
export const Ion = ({ label, color, r = 22, size = 17, solid = false }: { label: string; color: string; r?: number; size?: number; solid?: boolean }) => (
    <g>
        <circle r={r} fill={solid ? color : `${color}33`} stroke={color} strokeWidth={2.5} />
        <text y={size * 0.36} textAnchor="middle" fontSize={size} fontWeight={700} fill={solid ? '#04080F' : '#fff'} style={LABEL_STYLE}>{label}</text>
    </g>
);

/** Brilho que pulsa devagar (vida discreta no H⁺ em destaque). */
export const Pulse = ({ reduce, r, color }: { reduce: boolean; r: number; color: string }) => (
    <circle r={r} fill="none" stroke={color} strokeWidth={2} opacity={reduce ? 0.35 : 0}>
        {!reduce && <animate attributeName="opacity" values="0;0.55;0" dur="2.4s" begin="0.8s" repeatCount="indefinite" />}
    </circle>
);

/** Seta reta com ponta. */
export const Arrow = ({ x1, y1, x2, y2, color = 'rgba(255,255,255,0.45)', width = 2.5 }: { x1: number; y1: number; x2: number; y2: number; color?: string; width?: number }) => {
    const a = Math.atan2(y2 - y1, x2 - x1);
    const h = 10;
    const p1 = `${x2 - h * Math.cos(a - 0.45)},${y2 - h * Math.sin(a - 0.45)}`;
    const p2 = `${x2 - h * Math.cos(a + 0.45)},${y2 - h * Math.sin(a + 0.45)}`;
    return (
        <g stroke={color} strokeWidth={width} strokeLinecap="round" fill="none">
            <line x1={x1} y1={y1} x2={x2} y2={y2} />
            <polyline points={`${p1} ${x2},${y2} ${p2}`} strokeLinejoin="round" />
        </g>
    );
};
