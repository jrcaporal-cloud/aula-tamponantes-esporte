import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { LocateFixed, X } from 'lucide-react';
import type { Modal3DProps } from '../registry';
import { FiberScene } from '../fibra/FiberScene';
import { LoadingVeil } from '../fibra/LoadingVeil';
import { ControlsBox, Legend, StepText, StructureCard } from '../fibra/Panel';
import { PhMeter } from '../fibra/PhMeter';
import { useSelection } from '../fibra/selection';
import { createSim, type SimCtrl } from '../fibra/sim';
import { FIBER_STEPS, type Controls } from '../fibra/steps';
import { Timeline } from '../fibra/Timeline';
import { useFiberKeys } from '../fibra/useFiberKeys';

/*
 * Modelo 3D "fibra-acida" (slides 26 e 29): o H⁺ nasce na fibra e passa pelas quatro linhas de
 * defesa — tampões intracelulares, portas do sarcolema, sangue e ventilação —, com bicarbonato e
 * beta-alanina como interruptores.
 */

const PANEL_W = 420;
const ACCENT = '#FB923C';
const LAST = FIBER_STEPS.length - 1;

const FADE_BOTTOM = {
    maskImage: 'linear-gradient(to bottom, #000 calc(100% - 24px), transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 24px), transparent)',
} as const;

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const FibraAcidaModal = ({ onClose }: Modal3DProps) => {
    const [step, setStep] = useState(0);
    const [settled, setSettled] = useState(-1);
    const [controls, setControls] = useState<Controls>(FIBER_STEPS[0].preset);
    const [ready, setReady] = useState(false);
    const [recenterKey, setRecenterKey] = useState(0);
    const [reduced] = useState(prefersReduced);
    const [sim] = useState(createSim);
    const simRef = useRef(sim);
    const ctrlRef = useRef<SimCtrl>({ stage: 0, ...FIBER_STEPS[0].preset, reduced });
    const stepRef = useRef(0);
    const pin = useSelection(s => s.pin);
    const hovering = useSelection(s => s.hoverId !== null);
    const release = useSelection(s => s.release);

    // a simulação lê os controles por quadro, sem re-render
    useEffect(() => { ctrlRef.current = { stage: step, ...controls, reduced }; }, [step, controls, reduced]);
    useEffect(() => {
        useSelection.getState().reset();
        return () => useSelection.getState().reset();
    }, []);

    // trocar de etapa solta a fixação e liga os controles que a etapa pede
    const go = useCallback((target: number) => {
        const next = Math.min(Math.max(target, 0), LAST);
        if (next === stepRef.current) return;
        stepRef.current = next;
        release();
        setSettled(-1);
        setStep(next);
        setControls(FIBER_STEPS[next].preset);
    }, [release]);
    const onSettled = useCallback((s: number) => setSettled(s), []);
    const onReady = useCallback(() => setReady(true), []);
    const recenter = useCallback(() => { release(); setRecenterKey(k => k + 1); }, [release]);

    useFiberKeys({
        next: () => go(stepRef.current + 1),
        prev: () => go(stepRef.current - 1),
        escape: () => { if (useSelection.getState().pin) release(); else onClose(); },
        close: onClose,
    });

    const data = FIBER_STEPS[step];
    return (
        <motion.div
            role="dialog"
            aria-label="Fibra muscular e as linhas de defesa contra o H⁺, em 3D"
            className="absolute inset-0 z-50 bg-[#04080F] font-body"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.35 }}
        >
            <div className="absolute top-0 bottom-0 left-0" style={{ right: PANEL_W }}>
                <Canvas
                    dpr={[1, 1.5]}
                    camera={{ position: FIBER_STEPS[0].pose.pos as [number, number, number], fov: 40, near: 0.1, far: 300 }}
                    gl={{ antialias: false, powerPreference: 'high-performance' }}
                    resize={{ offsetSize: true }}
                    className={`${pin || hovering ? 'cursor-pointer' : 'cursor-grab'} active:cursor-grabbing`}
                >
                    <Suspense fallback={null}>
                        <FiberScene
                            step={step} settled={settled} pin={pin} recenterKey={recenterKey} reduced={reduced}
                            onSettled={onSettled} onReady={onReady} simRef={simRef} ctrlRef={ctrlRef}
                        />
                    </Suspense>
                </Canvas>
                <button
                    type="button"
                    onClick={recenter}
                    aria-label="Recentrar a câmera na pose da etapa"
                    className="absolute z-[46] top-6 right-6 flex items-center gap-2 pl-3.5 pr-4 h-10 rounded-full text-[14px] font-semibold text-gray-100 hover:text-white bg-black/60 hover:bg-white/15 border border-white/15 backdrop-blur-xl"
                >
                    <LocateFixed size={16} aria-hidden />
                    Recentrar
                </button>
                <div className="absolute z-[45] left-6 bottom-6 pointer-events-none">
                    <PhMeter simRef={simRef} />
                </div>
                <AnimatePresence>{!ready && <LoadingVeil reduced={reduced} />}</AnimatePresence>
            </div>

            <header className="absolute z-[45] top-0 left-0 px-8 pt-6 pb-10 pointer-events-none bg-gradient-to-b from-[#04080F]/90 via-[#04080F]/70 to-transparent" style={{ right: PANEL_W }}>
                <p className="text-[14px] font-mono uppercase tracking-[0.28em] text-orange-300/90 mb-1">Modelo 3D interativo · fibra muscular</p>
                <h2 className="font-display text-3xl font-semibold text-white">O caminho do H⁺</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="px-2.5 py-1 rounded-full text-[14px] font-mono tracking-wide text-amber-200 bg-amber-400/10 border border-amber-300/30">
                        esquema · escalas fora de proporção
                    </span>
                    <span className="text-[14px] text-gray-400">Arraste para girar · role para aproximar · clique para fixar</span>
                </div>
            </header>

            <aside className="absolute right-5 top-5 bottom-5 flex flex-col rounded-2xl bg-[rgba(6,12,24,0.86)] border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden" style={{ width: PANEL_W - 30 }}>
                <button type="button" onClick={onClose} aria-label="Fechar modelo 3D (Esc)"
                    className="absolute z-10 top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10">
                    <X size={17} />
                </button>
                <div className="flex-1 overflow-y-auto px-5 pt-5 pb-6" style={FADE_BOTTOM}>
                    <StepText data={data} step={step} last={LAST} />
                    <ControlsBox value={controls} onChange={setControls} />
                    <Legend />
                </div>
                <div className="shrink-0 px-5 pb-4 pt-2.5 border-t border-white/10">
                    <StructureCard />
                </div>
            </aside>

            <footer className="absolute bottom-6 flex flex-col items-end gap-2 pointer-events-none" style={{ right: PANEL_W + 24, left: 340 }}>
                <p className="px-3 py-1 rounded-full text-[14px] font-mono tracking-wide text-orange-100 bg-black/55 border border-orange-300/25 backdrop-blur-md" aria-hidden>
                    <span className="text-orange-300">{step + 1}/{LAST + 1}</span> · {data.short}
                </p>
                <Timeline steps={FIBER_STEPS} step={step} accent={ACCENT} onGo={go} />
            </footer>
        </motion.div>
    );
};

export default FibraAcidaModal;
