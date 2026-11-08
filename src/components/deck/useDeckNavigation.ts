import { useCallback, useEffect, useRef, useState } from 'react';
import { useSlideStepStore } from '../../store/useSlideSteps';

const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter']);
const PREV_KEYS = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace']);
const WHEEL_THRESHOLD = 70;
const WHEEL_COOLDOWN_MS = 850;

const readHash = (total: number): number => {
    const match = window.location.hash.match(/^#\/?(\d+)/);
    const n = match ? parseInt(match[1], 10) : NaN;
    return Number.isFinite(n) ? Math.min(Math.max(n - 1, 0), total - 1) : 0;
};

const isTypingTarget = (el: EventTarget | null) =>
    el instanceof HTMLElement && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName));

/** Sobe a árvore a partir do alvo procurando algo que ainda consiga rolar na direção pedida. */
const canScrollInside = (target: EventTarget | null, deltaY: number, stop: HTMLElement | null) => {
    let el = target instanceof HTMLElement ? target : null;
    while (el && el !== stop?.parentElement) {
        const style = getComputedStyle(el);
        const scrollable = /(auto|scroll)/.test(style.overflowY) && el.scrollHeight > el.clientHeight + 1;
        if (scrollable) {
            const atTop = el.scrollTop <= 0;
            const atBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 1;
            if ((deltaY > 0 && !atBottom) || (deltaY < 0 && !atTop)) return true;
        }
        el = el.parentElement;
    }
    return false;
};

interface DeckNavigationOptions {
    total: number;
    paused: boolean;
    rootRef: React.RefObject<HTMLElement | null>;
    onToggleOverview: () => void;
    onCloseOverlays: () => void;
}

/**
 * Teclado, passador (PageUp/PageDown), roda do mouse e #hash da URL.
 * O hash permite recarregar a página e voltar ao mesmo slide (ex.: …/#/12).
 */
export const useDeckNavigation = ({ total, paused, rootRef, onToggleOverview, onCloseOverlays }: DeckNavigationOptions) => {
    const [index, setIndex] = useState(() => readHash(total));
    const [direction, setDirection] = useState<1 | -1>(1);
    const wheelAcc = useRef(0);
    const lastWheelNav = useRef(0);

    const indexRef = useRef(index);

    const goTo = useCallback((target: number, atEnd = false) => {
        const clamped = Math.min(Math.max(target, 0), total - 1);
        if (clamped === indexRef.current) return;
        useSlideStepStore.getState().prepareEntry(atEnd);
        setDirection(clamped > indexRef.current ? 1 : -1);
        indexRef.current = clamped;
        setIndex(clamped);
    }, [total]);

    // O passador percorre os passos do slide antes de trocar de slide.
    const next = useCallback(() => {
        const { step, count, setStep } = useSlideStepStore.getState();
        if (step < count - 1) setStep(step + 1);
        else goTo(indexRef.current + 1);
    }, [goTo]);

    const prev = useCallback(() => {
        const { step, setStep } = useSlideStepStore.getState();
        if (step > 0) setStep(step - 1);
        else goTo(indexRef.current - 1, true);
    }, [goTo]);

    // O endereço acompanha slide e passo (#/27/3): recarregar no meio do slide volta ao mesmo ponto.
    const step = useSlideStepStore(s => s.step);
    const pendingStep = useSlideStepStore(s => s.pendingStep);
    useEffect(() => {
        // Slides sem passos nunca consomem o passo da URL: libera depois da primeira carga. A espera é
        // longa porque o simulador chega sob demanda; trocar de slide antes disso já zera o pedido.
        const timer = window.setTimeout(() => useSlideStepStore.getState().clearPendingStep(), 8000);
        return () => window.clearTimeout(timer);
    }, []);
    useEffect(() => {
        if (pendingStep != null) return;
        const hash = step > 0 ? `#/${index + 1}/${step + 1}` : `#/${index + 1}`;
        if (window.location.hash !== hash) window.history.replaceState(null, '', hash);
    }, [index, step, pendingStep]);

    useEffect(() => {
        const onHashChange = () => goTo(readHash(total));
        window.addEventListener('hashchange', onHashChange);
        return () => window.removeEventListener('hashchange', onHashChange);
    }, [goTo, total]);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (paused || isTypingTarget(e.target) || e.metaKey || e.ctrlKey || e.altKey) return;
            const key = e.key;

            // Setas verticais rolam slides longos antes de trocar de slide.
            if (key === 'ArrowDown' || key === 'ArrowUp') {
                const stage = rootRef.current?.querySelector<HTMLElement>('.deck-stage[data-scrolls]');
                const delta = key === 'ArrowDown' ? 1 : -1;
                if (stage && canScrollInside(stage, delta, stage)) {
                    e.preventDefault();
                    stage.scrollBy({ top: delta * stage.clientHeight * 0.6, behavior: 'smooth' });
                    return;
                }
            }

            if (NEXT_KEYS.has(key)) {
                if (key === 'Enter' && e.target instanceof HTMLButtonElement) return;
                e.preventDefault();
                next();
            } else if (PREV_KEYS.has(key)) {
                e.preventDefault();
                prev();
            } else if (key === 'Home') {
                goTo(0);
            } else if (key === 'End') {
                goTo(total - 1);
            } else if (key === 'g' || key === 'G' || key === 'o' || key === 'O') {
                onToggleOverview();
            } else if (key === 'Escape') {
                onCloseOverlays();
            } else if (key === 'f' || key === 'F') {
                if (document.fullscreenElement) void document.exitFullscreen();
                else void document.documentElement.requestFullscreen?.();
            }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [paused, next, prev, goTo, total, rootRef, onToggleOverview, onCloseOverlays]);

    useEffect(() => {
        const root = rootRef.current;
        if (!root) return;
        const onWheel = (e: WheelEvent) => {
            if (paused || Math.abs(e.deltaY) < Math.abs(e.deltaX)) return;
            if (canScrollInside(e.target, e.deltaY, root)) return;
            e.preventDefault();
            const now = performance.now();
            if (now - lastWheelNav.current < WHEEL_COOLDOWN_MS) return;
            wheelAcc.current += e.deltaY;
            if (Math.abs(wheelAcc.current) >= WHEEL_THRESHOLD) {
                if (wheelAcc.current > 0) next();
                else prev();
                wheelAcc.current = 0;
                lastWheelNav.current = now;
            }
        };
        root.addEventListener('wheel', onWheel, { passive: false });
        return () => root.removeEventListener('wheel', onWheel);
    }, [paused, next, prev, rootRef]);

    return { index, direction, goTo, next, prev };
};
