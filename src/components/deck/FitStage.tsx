import { useLayoutEffect, useRef, useState, type ReactNode } from 'react';
import { useReducedMotion } from 'framer-motion';

/** Largura de referência em que todos os slides foram desenhados. */
export const DESIGN_WIDTH = 1280;

/**
 * Largura de diagramação dos slides: exatamente o max-w do ProseSlide (1200, com px-8 = 1136 px úteis).
 * Em 1280 sobravam 40 px vazios de cada lado que o palco ainda somava à própria margem — num projetor 4:3
 * (1024 px) isso derrubava a escala a 0,71. Diagramar em 1200 não muda nada dentro do slide (a mesma caixa
 * de 1200) e devolve essa sobra à escala. Mais estreito que isso não dá: vários simuladores têm 1096–1136 px fixos.
 */
export const SLIDE_WIDTH = 1200;

/** Teto de ampliação — evita texto gigante em slides curtos num projetor 4K. */
const MAX_SCALE = 1.9;
/** Abaixo disso o texto fica ilegível; o slide passa a rolar em vez de encolher. */
const MIN_READABLE_SCALE = 0.82;

/** Respiro lateral do palco para conteúdos sem margem própria. */
const PAD_X = 56;
/**
 * Folga lateral mínima para conteúdos que já trazem a própria margem (slides: px-8 do ProseSlide;
 * capa, citação, cortina e quadro têm px próprio): o palco não soma outra margem e o slide ganha escala.
 */
export const PAD_X_SELF = 8;

/**
 * Margens proporcionais à altura da tela: num projetor 1280×720 cada pixel conta,
 * então o slide ganha espaço; em telas altas mantém o respiro de antes.
 * A de baixo guarda a faixa do contador de passos (bottom 20 px + ~38 px de pílula).
 */
const padTop = (h: number) => Math.min(56, Math.max(24, Math.round(h * 0.05)));
const padBottom = (h: number) => Math.min(64, Math.max(44, Math.round(h * 0.07)));

interface Fit {
    scale: number;
    height: number;
    scrolls: boolean;
}

interface FitStageProps {
    children: ReactNode;
    /** Largura de diagramação (px de projeto). */
    width?: number;
    /** Respiro lateral do palco, em px de tela. Use PAD_X_SELF quando o conteúdo já tem margem própria. */
    padX?: number;
}

/**
 * Renderiza o slide numa largura fixa e aplica `transform: scale` para caber na tela —
 * no notebook ou no projetor o slide ocupa o mesmo espaço visual.
 * Se o conteúdo for alto demais para caber legível, mantém uma escala mínima e rola.
 */
export const FitStage = ({ children, width = DESIGN_WIDTH, padX = PAD_X }: FitStageProps) => {
    const outerRef = useRef<HTMLDivElement>(null);
    const innerRef = useRef<HTMLDivElement>(null);
    const reduce = useReducedMotion();
    const [fit, setFit] = useState<Fit>({ scale: 1, height: 0, scrolls: false });
    const [pads, setPads] = useState({ top: 56, bottom: 64 });

    useLayoutEffect(() => {
        const outer = outerRef.current;
        const inner = innerRef.current;
        if (!outer || !inner) return;

        const measure = () => {
            const availW = Math.max(outer.clientWidth - padX * 2, 320);
            const top = padTop(outer.clientHeight);
            const bottom = padBottom(outer.clientHeight);
            const availH = Math.max(outer.clientHeight - top - bottom, 240);
            // offsetHeight ignora transforms: é a altura "natural" na largura de diagramação.
            const naturalH = inner.offsetHeight;
            const widthScale = availW / width;
            const heightScale = availH / Math.max(naturalH, 1);
            const floor = Math.min(widthScale, MIN_READABLE_SCALE);

            let scale = Math.min(widthScale, heightScale, MAX_SCALE);
            let scrolls = false;
            if (scale < floor) {
                scale = floor;
                scrolls = true;
            }
            setPads(prev => (prev.top === top && prev.bottom === bottom ? prev : { top, bottom }));
            setFit(prev =>
                Math.abs(prev.scale - scale) < 0.002 && prev.height === naturalH && prev.scrolls === scrolls
                    ? prev
                    : { scale, height: naturalH, scrolls }
            );
        };

        const observer = new ResizeObserver(measure);
        observer.observe(outer);
        observer.observe(inner);
        measure();
        return () => observer.disconnect();
    }, [width, padX]);

    return (
        <div
            ref={outerRef}
            className="deck-stage absolute inset-0 flex justify-center overscroll-contain"
            data-scrolls={fit.scrolls || undefined}
            style={{
                overflowY: fit.scrolls ? 'auto' : 'hidden',
                // Arte decorativa que vaza da largura do slide (marca d'água da capa) é cortada, nunca rola de lado.
                overflowX: 'hidden',
                alignItems: fit.scrolls ? 'flex-start' : 'center',
                paddingTop: pads.top,
                paddingBottom: pads.bottom,
            }}
        >
            <div
                className="relative flex-shrink-0"
                style={{ width: width * fit.scale, height: fit.height * fit.scale }}
            >
                <div
                    ref={innerRef}
                    className="absolute top-0 left-0 origin-top-left"
                    style={{
                        width,
                        transform: `scale(${fit.scale})`,
                        transition: reduce ? 'none' : 'transform 320ms cubic-bezier(0.16, 1, 0.3, 1)',
                    }}
                >
                    {children}
                </div>
            </div>
        </div>
    );
};
