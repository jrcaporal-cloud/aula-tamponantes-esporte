import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { LocateFixed, X } from 'lucide-react';
import { C } from '../../sims/kit/palette';
import type { Modal3DProps } from '../registry';
import type { TimeState } from '../shared/Label3D';
import { BloodHud } from '../carnosina/BloodHud';
import { BufferHud } from '../carnosina/BufferHud';
import { CarnoScene } from '../carnosina/CarnoScene';
import { LoadingVeil } from '../carnosina/LoadingVeil';
import { PlasmaHud } from '../carnosina/PlasmaHud';
import { LoadHud } from '../carnosina/LoadHud';
import { StepControls } from '../carnosina/StepControls';
import { CARNO_STEPS } from '../carnosina/steps';
import { useCarnoSim, useSelection } from '../carnosina/store';
import { StepTimeline } from '../carnosina/StepTimeline';
import { StructureCard } from '../carnosina/StructureCard';
import { useCarnoKeys } from '../carnosina/useCarnoKeys';

/** Tempo de leitura depois que a etapa assenta, no modo ▶. */
const DWELL_MS = 4200;
const PANEL_W = 412;
const ACCENT = C.carno;

/** Esmaece a borda de baixo da área rolável: avisa que há mais texto. */
const FADE_BOTTOM = {
    maskImage: 'linear-gradient(to bottom, #000 calc(100% - 28px), transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 28px), transparent)',
} as const;

const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const StepHud = ({ step }: { step: number }) => {
    if (step === 0) return <PlasmaHud withSlow={false} />;
    if (step === 1) return <BloodHud />;
    if (step === 4) return <LoadHud />;
    if (step === 5) return <BufferHud />;
    if (step === 6) return <PlasmaHud withSlow />;
    return null;
};

/** Modelo 3D "carnosina": da β-alanina engolida ao tampão no músculo e ao formigamento na pele. */
const CarnosinaModal = ({ onClose }: Modal3DProps) => {
    const [step, setStep] = useState(0);
    const [settled, setSettled] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const [recenterKey, setRecenterKey] = useState(0);
    const [reduced] = useState(prefersReduced);
    const timeRef = useRef<TimeState>({ t: 0 });
    const stepRef = useRef(0);
    const pin = useSelection(s => s.pin);
    const hovering = useSelection(s => s.hoverId !== null);
    const release = useSelection(s => s.release);
    const last = CARNO_STEPS.length - 1;
    const data = CARNO_STEPS[step];

    const go = useCallback((target: number) => {
        const next = Math.min(Math.max(target, 0), last);
        if (next === stepRef.current) return;
        stepRef.current = next;
        release();
        setSettled(-1);
        setStep(next);
    }, [last, release]);
    const goManual = useCallback((target: number) => { setPlaying(false); go(target); }, [go]);
    const onSettled = useCallback((s: number) => setSettled(s), []);
    const onReady = useCallback(() => setReady(true), []);
    const recenter = useCallback(() => { release(); setRecenterKey(k => k + 1); }, [release]);

    useEffect(() => {
        useSelection.getState().reset();
        useCarnoSim.getState().reset();
        return () => { useSelection.getState().reset(); };
    }, []);

    useEffect(() => {
        if (!playing || settled !== step) return;
        const t = window.setTimeout(() => {
            if (step >= last) setPlaying(false);
            else go(step + 1);
        }, step >= last ? 0 : DWELL_MS);
        return () => window.clearTimeout(t);
    }, [playing, settled, step, last, go]);

    const togglePlay = useCallback(() => {
        setPlaying(p => {
            if (!p && stepRef.current === last) go(0);
            return !p;
        });
    }, [last, go]);

    useCarnoKeys({
        next: () => goManual(stepRef.current + 1),
        prev: () => goManual(stepRef.current - 1),
        togglePlay,
        escape: () => { if (useSelection.getState().pin) release(); else onClose(); },
        close: onClose,
    });

    return (
        <motion.div role="dialog" aria-label="Carnosina em 3D" className="absolute inset-0 z-50 bg-[#05040f] font-body"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}>
            <div className="absolute top-0 bottom-0 left-0" style={{ right: PANEL_W }}>
                <Canvas dpr={[1, 1.75]} camera={{ position: [...CARNO_STEPS[0].cam.pos], fov: 40, near: 0.1, far: 900 }}
                    gl={{ antialias: false, powerPreference: 'high-performance' }} resize={{ offsetSize: true }}
                    className={`${pin || hovering ? 'cursor-pointer' : 'cursor-grab'} active:cursor-grabbing`}>
                    <Suspense fallback={null}>
                        <CarnoScene step={step} settled={settled} reduced={reduced} pin={pin} recenterKey={recenterKey}
                            onSettled={onSettled} onReady={onReady} timeRef={timeRef} />
                    </Suspense>
                </Canvas>
                <div className="absolute left-6 bottom-[88px] z-[46] pointer-events-none">
                    <motion.div key={step} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
                        <StepHud step={step} />
                    </motion.div>
                </div>
                <button type="button" onClick={recenter} aria-label="Recentrar a câmera na pose da etapa"
                    className="absolute z-[46] top-6 right-6 flex items-center gap-2 pl-3.5 pr-4 h-10 rounded-full text-[14px] font-semibold text-gray-100 hover:text-white bg-black/60 hover:bg-white/15 border border-white/15 backdrop-blur-xl">
                    <LocateFixed size={16} aria-hidden /> Recentrar
                </button>
                <AnimatePresence>{!ready && <LoadingVeil reduced={reduced} />}</AnimatePresence>
            </div>

            <header className="absolute z-[45] top-0 left-0 px-8 pt-6 pb-10 pointer-events-none bg-gradient-to-b from-[#05040f]/90 to-transparent" style={{ right: PANEL_W }}>
                <p className="text-[14px] font-mono uppercase tracking-[0.28em] text-violet-300/90 mb-1">Modelo 3D interativo · beta-alanina</p>
                <h2 className="font-display text-3xl font-semibold text-white">Do intestino ao tampão</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="px-2.5 py-1 rounded-full text-[14px] font-mono tracking-wide text-amber-200 bg-amber-400/10 border border-amber-300/30">
                        esquemático · escalas fora de proporção
                    </span>
                    <span className="text-[14px] text-gray-400">Arraste para girar · clique numa estrutura para fixar</span>
                </div>
            </header>

            <aside className="absolute right-5 top-5 bottom-5 flex flex-col rounded-2xl bg-[rgba(10,8,22,0.86)] border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden" style={{ width: PANEL_W - 30 }}>
                <div className="flex items-center justify-between px-6 pt-5 pb-3">
                    <span className="px-3 py-1 text-[14px] font-mono tracking-widest text-violet-200 bg-violet-500/15 border border-violet-400/25 rounded-full">
                        {step + 1} · {data.badge}
                    </span>
                    <button type="button" onClick={onClose} aria-label="Fechar modelo 3D (Esc)"
                        className="w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10">
                        <X size={18} />
                    </button>
                </div>
                <div className="flex-1 min-h-0 overflow-y-auto px-6 pb-6 border-t border-white/10 pt-3" style={FADE_BOTTOM}>
                    <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <h3 className="font-display text-[24px] font-semibold text-white leading-tight mb-2">{data.title}</h3>
                        <p className="text-[15px] text-gray-200 leading-relaxed">{data.text}</p>
                        <div className="mt-3"><StepControls step={step} /></div>
                        <p className="mt-3 text-[14px] text-gray-400 leading-snug">
                            <span className="text-gray-300 font-semibold">Fontes: </span>{data.sources.join(' · ')}
                        </p>
                    </motion.div>
                </div>
                <div className="shrink-0 px-6 pb-4 pt-2.5 border-t border-white/10">
                    <StructureCard color={ACCENT} />
                </div>
            </aside>

            <footer className="absolute bottom-6 left-0 flex justify-center pointer-events-none" style={{ right: PANEL_W }}>
                <StepTimeline steps={CARNO_STEPS} step={step} playing={playing} accent={ACCENT} onGo={goManual} onTogglePlay={togglePlay} />
            </footer>
        </motion.div>
    );
};

export default CarnosinaModal;
