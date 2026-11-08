import type { CSSProperties } from 'react';
import { useReducedMotion } from 'framer-motion';
import { SvgText } from './ui';
import { useCountUp, type CountUpOptions } from './useCountUp';

interface CountUpProps extends CountUpOptions {
    text: string;
    className?: string;
    style?: CSSProperties;
}

/** Número-chave que sobe até o valor quando aparece. Algarismos de largura fixa: o texto não treme. */
export const CountUp = ({ text, className = '', style, ...options }: CountUpProps) => {
    const reduce = useReducedMotion() ?? false;
    const shown = useCountUp(text, reduce, options);
    return (
        <span className={`tabular-nums ${className}`} style={style} aria-label={text}>
            <span aria-hidden>{shown}</span>
        </span>
    );
};

type SvgTextProps = Parameters<typeof SvgText>[0];

/** Mesmo efeito dentro de um SVG (rótulo de gráfico). */
export const CountSvgText = ({ text, delay, duration, run, ...rest }: SvgTextProps & CountUpOptions) => {
    const reduce = useReducedMotion() ?? false;
    const shown = useCountUp(text, reduce, { delay, duration, run });
    return <SvgText {...rest} text={shown} />;
};
