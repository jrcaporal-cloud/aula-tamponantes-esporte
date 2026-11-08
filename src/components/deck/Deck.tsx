import { Suspense, useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useStore } from '../../store/useStore';
import { TitleSlide } from '../presentation/TitleSlide';
import { ProseSlide } from '../presentation/ProseSlide';
import { QuoteSlide } from '../presentation/QuoteSlide';
import { FitStage } from './FitStage';
import { SlideErrorBoundary } from './SlideErrorBoundary';
import { preloadAllSims } from '../presentation/slideContent';
import { DeckChrome } from './DeckChrome';
import { Overview } from './Overview';
import { DECK, MODEL_3D_BY_SLIDE, type DeckSlide, type Model3D } from './slides';
import { useDeckNavigation } from './useDeckNavigation';
import { useSlideStepStore } from '../../store/useSlideSteps';
import { PRESENTER_CHANNEL, openPresenterWindow, type PresenterMessage } from './presenterChannel';
import { toggleDetails } from '../../lib/detailsEvent';
import { MODALS_3D, preloadAll3D } from '../three/registry';

const renderSlide = ({ slide }: DeckSlide) => {
    if (slide.id === 0) return <TitleSlide slide={slide} />;
    if (!slide.title.trim()) return <QuoteSlide slide={slide} />;
    return <ProseSlide slide={slide} />;
};

const IDLE_MS = 2600;

// Os modelos 3D (cena + pós-processamento) só são baixados quando alguém os abre (ou na pré-carga).
// Cada arquivo de `three/models/` é um modelo: export default de um modal que recebe `onClose`.

export const Deck = () => {
    const rootRef = useRef<HTMLDivElement>(null);
    const setSlide = useStore(s => s.setSlide);
    const modalOpen = useStore(s => s.modalOpen);
    const setModalOpen = useStore(s => s.setModalOpen);
    const [overview, setOverview] = useState(false);
    const [open3D, setOpen3D] = useState<Model3D | null>(null);
    const [idle, setIdle] = useState(false);

    const toggleOverview = useCallback(() => setOverview(o => !o), []);
    const closeOverlays = useCallback(() => setOverview(false), []);

    const { index, direction, goTo, next, prev } = useDeckNavigation({
        total: DECK.length,
        paused: modalOpen,
        rootRef,
        onToggleOverview: toggleOverview,
        onCloseOverlays: closeOverlays,
    });

    const current = DECK[index];
    const model3D = MODEL_3D_BY_SLIDE.get(current.slide.id) ?? null;
    const has3D = model3D !== null;
    const show3D = open3D !== null;
    const Open3D = open3D ? MODALS_3D[open3D] : undefined;

    useEffect(() => setSlide(index), [index, setSlide]);

    // Depois que a capa aparece, baixa o resto da aula em segundo plano.
    useEffect(() => {
        const start = window.setTimeout(() => {
            void preloadAllSims().then(preloadAll3D);
        }, 2500);
        return () => window.clearTimeout(start);
    }, []);

    // Sincroniza com a janela do apresentador (P): envia estado, recebe comandos.
    const step = useSlideStepStore(st => st.step);
    const stepCount = useSlideStepStore(st => st.count);
    const channelRef = useRef<BroadcastChannel | null>(null);
    const navRef = useRef({ next, prev, goTo });
    useEffect(() => { navRef.current = { next, prev, goTo }; }, [next, prev, goTo]);
    const stateRef = useRef({ index, step, stepCount });

    useEffect(() => {
        stateRef.current = { index, step, stepCount };
        channelRef.current?.postMessage({ type: 'state', index, step, stepCount } satisfies PresenterMessage);
    }, [index, step, stepCount]);

    useEffect(() => {
        const channel = new BroadcastChannel(PRESENTER_CHANNEL);
        channelRef.current = channel;
        channel.onmessage = (e: MessageEvent<PresenterMessage>) => {
            const msg = e.data;
            if (msg.type === 'next') navRef.current.next();
            else if (msg.type === 'prev') navRef.current.prev();
            else if (msg.type === 'goto') navRef.current.goTo(msg.index);
            else if (msg.type === 'hello') channel.postMessage({ type: 'state', ...stateRef.current } satisfies PresenterMessage);
        };
        return () => { channel.close(); channelRef.current = null; };
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (modalOpen || e.metaKey || e.ctrlKey || e.altKey) return;
            if (e.key === 'p' || e.key === 'P') openPresenterWindow(stateRef.current.index);
            if (e.key === 'd' || e.key === 'D') toggleDetails();
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [modalOpen]);
    useEffect(() => setModalOpen(show3D), [show3D, setModalOpen]);

    // Atalho "3" abre o modelo 3D do slide, quando ele tem um.
    useEffect(() => {
        if (!model3D || modalOpen) return;
        const onKey = (e: KeyboardEvent) => { if (e.key === '3') setOpen3D(model3D); };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [model3D, modalOpen]);

    // Controles e cursor somem quando o mouse fica parado (projeção limpa).
    useEffect(() => {
        let timer = window.setTimeout(() => setIdle(true), IDLE_MS);
        const wake = () => {
            setIdle(false);
            window.clearTimeout(timer);
            timer = window.setTimeout(() => setIdle(true), IDLE_MS);
        };
        window.addEventListener('mousemove', wake);
        window.addEventListener('mousedown', wake);
        return () => {
            window.clearTimeout(timer);
            window.removeEventListener('mousemove', wake);
            window.removeEventListener('mousedown', wake);
        };
    }, []);

    return (
        <div
            ref={rootRef}
            data-idle={idle || undefined}
            className={`deck-root absolute inset-0 z-10 overflow-hidden font-body selection:bg-brand-deep selection:text-white ${idle && !overview ? 'cursor-none' : ''}`}
        >
            <AnimatePresence initial={false} custom={direction}>
                <motion.section
                    key={index}
                    custom={direction}
                    className="absolute inset-0"
                    aria-roledescription="slide"
                    aria-label={`${index + 1} de ${DECK.length}: ${current.label}`}
                    variants={{
                        enter: (d: number) => ({ opacity: 0, y: d * 40 }),
                        center: { opacity: 1, y: 0 },
                        exit: (d: number) => ({ opacity: 0, y: d * -40 }),
                    }}
                    initial="enter"
                    animate="center"
                    exit="exit"
                    transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                >
                    <FitStage><SlideErrorBoundary resetKey={index}>{renderSlide(current)}</SlideErrorBoundary></FitStage>
                </motion.section>
            </AnimatePresence>

            <DeckChrome
                index={index}
                total={DECK.length}
                section={current.section}
                idle={idle}
                has3D={has3D}
                onPrev={prev}
                onNext={next}
                onOverview={toggleOverview}
                on3D={() => setOpen3D(model3D)}
                onPresenter={() => openPresenterWindow(index)}
            />

            <AnimatePresence>
                {overview && (
                    <Overview
                        current={index}
                        onSelect={i => { goTo(i); setOverview(false); }}
                        onClose={() => setOverview(false)}
                    />
                )}
            </AnimatePresence>

            <Suspense fallback={null}>
                <AnimatePresence>
                    {Open3D && <Open3D key={open3D} onClose={() => setOpen3D(null)} />}
                </AnimatePresence>
            </Suspense>
        </div>
    );
};
