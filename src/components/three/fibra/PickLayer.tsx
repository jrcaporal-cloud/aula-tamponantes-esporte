import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DRAG_PX, takeArmed, useSelection } from './selection';

/*
 * Clique no canvas: subiu sem arrastar → fixa a estrutura armada na descida (ou solta, se foi no
 * vazio). Arrastou → foi a câmera; nada muda.
 */
export const PickLayer = () => {
    const el = useThree(s => s.gl.domElement);

    useEffect(() => {
        let from: { x: number; y: number } | null = null;
        let dragged = false;
        const onDown = (e: PointerEvent) => {
            if (e.button !== 0) return;
            from = { x: e.clientX, y: e.clientY };
            dragged = false;
            takeArmed(); // descarta armação antiga; o R3F (no contêiner) arma a nova logo depois
        };
        const onMove = (e: PointerEvent) => {
            if (from && Math.hypot(e.clientX - from.x, e.clientY - from.y) > DRAG_PX) dragged = true;
        };
        const onUp = (e: PointerEvent) => {
            if (e.button !== 0 || !from) return;
            from = null;
            const id = takeArmed();
            if (dragged) return;
            const sel = useSelection.getState();
            if (id) sel.pinStructure(id);
            else sel.release();
        };
        const onCancel = () => { from = null; takeArmed(); };
        // captura: o R3F arma a estrutura no mesmo pointerdown, depois deste listener
        el.addEventListener('pointerdown', onDown, true);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onCancel);
        return () => {
            el.removeEventListener('pointerdown', onDown, true);
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerup', onUp);
            el.removeEventListener('pointercancel', onCancel);
        };
    }, [el]);

    return null;
};

/**
 * Cursor do canvas escrito direto no elemento (sem estado do React): mãozinha sobre uma estrutura ou
 * com algo fixado, "pegar" no vazio e "agarrando" enquanto o botão está apertado.
 */
export const CursorSync = () => {
    const get = useThree(s => s.get);

    useEffect(() => {
        const el = get().gl.domElement;
        let down = false;
        const apply = () => {
            const s = useSelection.getState();
            el.style.cursor = down ? 'grabbing' : s.pin || s.hoverId ? 'pointer' : 'grab';
        };
        const onDown = (e: PointerEvent) => { if (e.button === 0) { down = true; apply(); } };
        const onUp = () => { if (down) { down = false; apply(); } };
        apply();
        const unsub = useSelection.subscribe(apply);
        el.addEventListener('pointerdown', onDown);
        window.addEventListener('pointerup', onUp);
        window.addEventListener('pointercancel', onUp);
        return () => {
            unsub();
            el.removeEventListener('pointerdown', onDown);
            window.removeEventListener('pointerup', onUp);
            window.removeEventListener('pointercancel', onUp);
            el.style.cursor = '';
        };
    }, [get]);

    return null;
};
