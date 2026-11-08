import { useEffect } from 'react';
import { useThree } from '@react-three/fiber';
import { DRAG_PX, pinOrRelease } from './selection';

/*
 * Camada de clique dentro do Canvas: ponteiro subiu sem arrastar → fixa a estrutura armada na
 * descida (ou solta, se foi no vazio); arrastou → foi a câmera, nada muda.
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
            pinOrRelease(true, false); // descarta armação antiga; o R3F arma a nova logo depois
        };
        const onMove = (e: PointerEvent) => {
            if (from && Math.hypot(e.clientX - from.x, e.clientY - from.y) > DRAG_PX) dragged = true;
        };
        const onUp = (e: PointerEvent) => {
            if (e.button !== 0 || !from) return;
            from = null;
            pinOrRelease(false, dragged);
        };
        const onCancel = () => { from = null; pinOrRelease(true, false); };
        el.addEventListener('pointerdown', onDown);
        el.addEventListener('pointermove', onMove);
        el.addEventListener('pointerup', onUp);
        el.addEventListener('pointercancel', onCancel);
        return () => {
            el.removeEventListener('pointerdown', onDown);
            el.removeEventListener('pointermove', onMove);
            el.removeEventListener('pointerup', onUp);
            el.removeEventListener('pointercancel', onCancel);
        };
    }, [el]);

    return null;
};
