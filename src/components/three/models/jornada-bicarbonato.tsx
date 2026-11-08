import { Suspense, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Canvas } from '@react-three/fiber';
import { AnimatePresence, motion } from 'framer-motion';
import { LocateFixed, X } from 'lucide-react';
import type { Modal3DProps } from '../registry';
import type { TimeState } from '../shared/Label3D';
import { LoadingVeil, StepTimeline, StructureCard } from '../jornada/Chrome';
import { LAST_STEP, STEPS, STRATEGIES, stepText, type StrategyId } from '../jornada/content';
import { curvesFor, jonesRanges, summarize } from '../jornada/dose';
import { JourneyHud } from '../jornada/JourneyHud';
import { JourneyScene } from '../jornada/JourneyScene';
import { AlkalineToggle, AthletePicker, DoseControls, StrategySwitches } from '../jornada/PanelControls';
import { useSelection } from '../jornada/selection';
import { makeJourneyState, type JourneyState } from '../jornada/state';
import { useJourneyKeys } from '../jornada/useJourneyKeys';

/*
 * Modelo 3D "Do copo ao músculo" (slides 42 e 46): a jornada do bicarbonato do estômago à fibra,
 * em 6 etapas com câmera, rótulos 3D, clique para fixar, HUD de números e controles de dose.
 */

const DWELL_MS = 5200;
const PANEL_W = 412;
const FADE_BOTTOM = {
    maskImage: 'linear-gradient(to bottom, #000 calc(100% - 28px), transparent)',
    WebkitMaskImage: 'linear-gradient(to bottom, #000 calc(100% - 28px), transparent)',
} as const;
const prefersReduced = () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** Intensidade de gás e água: dose em gramas (24 g ≈ 1) × estratégias ligadas. */
const gutLoad = (powder: number, active: readonly StrategyId[], key: 'gas' | 'water') =>
    STRATEGIES.reduce((acc, s) => (active.includes(s.id) ? acc * s[key] : acc), Math.min(Math.max(powder / 24, 0.12), 1.5));

const JornadaBicarbonato = ({ onClose }: Modal3DProps) => {
    const [step, setStepLocal] = useState(0);
    const [settled, setSettled] = useState(0);
    const [playing, setPlaying] = useState(false);
    const [ready, setReady] = useState(false);
    const [recenterKey, setRecenterKey] = useState(0);
    const [reduced] = useState(prefersReduced);
    const [mass, setMass] = useState(70);
    const [doseGkg, setDose] = useState(0.3);
    const [active, setActive] = useState<readonly StrategyId[]>([]);
    const [athlete, setAthlete] = useState(2);
    const [alkaline, setAlkaline] = useState(true);
    const timeRef = useRef<TimeState>({ t: 0 });
    const stateRef = useRef<JourneyState>(makeJourneyState());
    const stepRef = useRef(0);
    const scroller = useRef<HTMLDivElement>(null);
    const pin = useSelection(s => s.pin);
    const hovering = useSelection(s => s.hoverId !== null);
    const release = useSelection(s => s.release);

    const dose = useMemo(() => summarize(mass, Math.round(doseGkg * 100) / 100), [mass, doseGkg]);
    const curves = useMemo(() => curvesFor(dose.dose), [dose.dose]);
    const tested = jonesRanges(dose.dose).tested;
    const gas = gutLoad(dose.powder, active, 'gas');
    const water = gutLoad(dose.powder, active, 'water');

    // entradas da cena: escritas na ref que os quadros leem
    useEffect(() => {
        stateRef.current.in = { powder: dose.powder, gas, water, alkaline, curve: curves[athlete], discs: dose.sodium / 0.5 };
    }, [dose, gas, water, alkaline, curves, athlete]);

    const go = useCallback((target: number) => {
        const next = Math.min(Math.max(target, 0), LAST_STEP);
        if (next === stepRef.current) return;
        stepRef.current = next;
        release();
        setSettled(-1);
        setStepLocal(next);
    }, [release]);
    const goManual = useCallback((target: number) => { setPlaying(false); go(target); }, [go]);
    const onSettled = useCallback((s: number) => setSettled(s), []);
    const onReady = useCallback(() => setReady(true), []);
    const recenter = useCallback(() => { release(); setRecenterKey(k => k + 1); }, [release]);
    const toggleStrategy = useCallback((id: StrategyId) => setActive(a => (a.includes(id) ? a.filter(x => x !== id) : [...a, id])), []);

    useEffect(() => { scroller.current?.scrollTo({ top: 0, behavior: reduced ? 'auto' : 'smooth' }); }, [step, reduced]);
    useEffect(() => {
        useSelection.getState().reset();
        return () => useSelection.getState().reset();
    }, []);

    // ▶: espera a etapa assentar, dá tempo de leitura e avança; para na última.
    useEffect(() => {
        if (!playing || settled !== step) return;
        const t = window.setTimeout(() => {
            if (step >= LAST_STEP) setPlaying(false);
            else go(step + 1);
        }, step >= LAST_STEP ? 0 : DWELL_MS);
        return () => window.clearTimeout(t);
    }, [playing, settled, step, go]);

    const togglePlay = useCallback(() => {
        setPlaying(p => {
            if (!p && stepRef.current === LAST_STEP) go(0);
            return !p;
        });
    }, [go]);

    useJourneyKeys({
        next: () => goManual(stepRef.current + 1),
        prev: () => goManual(stepRef.current - 1),
        togglePlay,
        escape: () => { if (useSelection.getState().pin) release(); else onClose(); },
        close: onClose,
    });

    // depois de mexer num controle, o foco sai dele: o passador (setas) volta a trocar etapas
    const dropFocus = useCallback(() => {
        const el = document.activeElement;
        if (el instanceof HTMLElement && el !== document.body) window.setTimeout(() => el.blur(), 0);
    }, []);

    const data = STEPS[step];
    return (
        <motion.div
            role="dialog" aria-label="Jornada do bicarbonato em 3D"
            className="absolute inset-0 z-50 bg-[#04080f] font-body"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.35 }}
            onPointerUp={dropFocus}
        >
            <div className="absolute top-0 bottom-0 left-0" style={{ right: PANEL_W }}>
                <Canvas
                    dpr={[1, 1.5]}
                    camera={{ position: [...STEPS[0].pose.pos], fov: 40, near: 0.1, far: 400 }}
                    gl={{ antialias: false, powerPreference: 'high-performance' }}
                    resize={{ offsetSize: true }}
                    className={`${pin || hovering ? 'cursor-pointer' : 'cursor-grab'} active:cursor-grabbing`}
                >
                    <Suspense fallback={null}>
                        <JourneyScene
                            step={step} settled={settled} reduced={reduced} pin={pin} recenterKey={recenterKey} dose={dose}
                            onSettled={onSettled} onReady={onReady} stateRef={stateRef} timeRef={timeRef}
                        />
                    </Suspense>
                </Canvas>
                {step > 0 && <div className="absolute left-4 right-4 bottom-[92px] flex pointer-events-none">
                    <motion.div key={step} className={step === 3 ? '' : 'flex-1'} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35, delay: 0.2 }}>
                        <JourneyHud step={step} dose={dose} gas={gas} water={water} alkaline={alkaline} curves={curves} athlete={athlete} onAthlete={setAthlete}
                            active={active} onToggle={toggleStrategy} onAlkaline={setAlkaline} stateRef={stateRef} />
                    </motion.div>
                </div>}
                <button
                    type="button" onClick={recenter} aria-label="Recentrar a câmera na pose da etapa"
                    className="absolute z-[46] top-6 right-6 flex items-center gap-2 pl-3.5 pr-4 h-10 rounded-full text-[14px] font-semibold text-gray-100 hover:text-white bg-black/60 hover:bg-white/15 border border-white/15 backdrop-blur-xl"
                >
                    <LocateFixed size={16} aria-hidden /> Recentrar
                </button>
                <AnimatePresence>{!ready && <LoadingVeil reduced={reduced} />}</AnimatePresence>
            </div>

            <header className="absolute z-[45] top-0 left-0 px-8 pt-6 pb-10 pointer-events-none bg-gradient-to-b from-[#04080f]/90 via-[#04080f]/55 to-transparent" style={{ right: PANEL_W }}>
                <p className="text-[14px] font-mono uppercase tracking-[0.28em] text-cyan-300/90 mb-1">Modelo 3D interativo · bicarbonato de sódio</p>
                <h2 className="font-display text-3xl font-semibold text-white">Do copo ao músculo</h2>
                <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="px-2.5 py-1 rounded-full text-[14px] font-mono tracking-wide text-amber-200 bg-amber-400/10 border border-amber-300/30">
                        corte esquemático · escalas fora de proporção
                    </span>
                    <span className="text-[14px] text-gray-400">Arraste para girar · role para aproximar · clique numa estrutura para fixar</span>
                </div>
            </header>

            <aside className="absolute right-5 top-5 bottom-5 flex flex-col rounded-2xl bg-[rgba(4,10,20,0.86)] border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden" style={{ width: PANEL_W - 30 }}>
                <div className="flex items-center gap-2 px-6 pt-5 pb-3">
                    <span className="flex-1 text-[14px] font-mono uppercase tracking-widest text-cyan-200/90">Jornada do bicarbonato</span>
                    <button type="button" onClick={onClose} aria-label="Fechar modelo 3D (Esc)"
                        className="shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-gray-300 hover:text-white bg-white/5 hover:bg-white/15 border border-white/10">
                        <X size={18} />
                    </button>
                </div>
                <div ref={scroller} className="flex-1 overflow-y-auto px-6 pb-8 border-t border-white/10 pt-3" style={FADE_BOTTOM}>
                    <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
                        <div className="flex items-center justify-between mt-1 mb-3">
                            <span className="inline-block px-3 py-1 text-[14px] font-mono tracking-widest text-cyan-200 bg-cyan-500/15 border border-cyan-400/25 rounded-full">
                                {data.badge}
                            </span>
                            <span className="text-[14px] font-mono text-gray-400" aria-label={`Etapa ${step + 1} de ${STEPS.length}`}>{step + 1}/{STEPS.length}</span>
                        </div>
                        <h3 className="font-display text-[26px] font-semibold text-white leading-tight mb-2.5">{data.title}</h3>
                        <p className="text-[16px] text-gray-200 leading-relaxed">{stepText(step, dose)}</p>
                        <p className="mt-2 text-[14px] font-mono text-gray-400">Fontes: {data.sources}</p>
                    </motion.div>
                    {step === 2 && <StrategySwitches active={active} onToggle={toggleStrategy} />}
                    {step === 3 && <AthletePicker curves={curves} selected={athlete} tested={tested} onSelect={setAthlete} />}
                    {step === 4 && <AlkalineToggle on={alkaline} onChange={setAlkaline} />}
                    {step !== 4 && <DoseControls dose={dose} onMass={setMass} onDose={setDose} />}
                </div>
                <div className="shrink-0 px-6 pb-4 pt-2.5 border-t border-white/10">
                    <StructureCard />
                </div>
            </aside>

            <footer className="absolute bottom-6 left-0 flex justify-center pointer-events-none" style={{ right: PANEL_W }}>
                <StepTimeline step={step} playing={playing} onGo={goManual} onTogglePlay={togglePlay} />
            </footer>
        </motion.div>
    );
};

export default JornadaBicarbonato;
