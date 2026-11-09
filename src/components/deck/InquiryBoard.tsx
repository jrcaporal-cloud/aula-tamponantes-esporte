import { useEffect } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Check, Lock } from 'lucide-react';
import { ACCUSATIONS, CHAPTERS, VERDICT_LOOK, type Accusation } from '../sims/ato1/content';
import { FitStage, PAD_X_SELF } from './FitStage';
import { JUDGED_IN, ROMANS, cardState, type BoardState, type CardState } from './inquiry';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';
import { CURTAIN_WIPE_S } from './ActCurtain';

const NEXT_KEYS = new Set(['ArrowRight', 'ArrowDown', 'PageDown', ' ', 'Enter']);
const BACK_KEYS = new Set(['ArrowLeft', 'ArrowUp', 'PageUp', 'Backspace', 'Escape']);
const MUTED = 'rgba(255,255,255,0.14)';

/** 'wipe': o quadro sai pela mesma varredura com que a cortina do ato entra (um gesto só); 'fade': só esmaece. */
export type BoardExit = 'fade' | 'wipe';

interface InquiryBoardProps {
    board: BoardState;
    exitMode: BoardExit;
    onContinue: () => void;
    onBack: () => void;
}

/** Linha dos 7 atos: fechados preenchidos, o próximo pulsando, os demais apagados. */
const ActRail = ({ board }: { board: BoardState }) => {
    const reduce = useReducedMotion();
    return (
        <ol className="m-0 flex list-none items-start p-0">
            {CHAPTERS.map((ch, i) => {
                const closed = i <= board.closedThrough;
                const upcoming = i === board.upcoming;
                return (
                    <li key={ch.roman} className="relative flex flex-1 flex-col items-center gap-2">
                        {i > 0 && (
                            <span className="absolute top-[21px] right-1/2 h-[2px] w-full"
                                style={{ background: i <= board.upcoming ? `${CHAPTERS[i - 1].color}aa` : MUTED }} />
                        )}
                        <span
                            className="relative z-10 flex h-[44px] w-[44px] items-center justify-center rounded-full border-2 font-display text-[17px] font-semibold"
                            style={{
                                borderColor: closed || upcoming ? ch.color : MUTED,
                                background: closed ? `${ch.color}33` : '#070b14',
                                color: closed || upcoming ? '#fff' : '#9CA3AF',
                            }}
                        >
                            {/* Pulso do próximo ato: o brilho é fixo e só a opacidade dele anima (composição, sem repintar). */}
                            {upcoming && !reduce && (
                                <motion.span aria-hidden className="pointer-events-none absolute -inset-[2px] rounded-full"
                                    style={{ boxShadow: `0 0 22px ${ch.color}cc` }}
                                    initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0] }}
                                    transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }} />
                            )}
                            {closed ? <Check size={20} strokeWidth={2.6} aria-label={`Ato ${ch.roman} fechado`} /> : ch.roman}
                        </span>
                        <span className={`max-w-[150px] text-center text-[15px] leading-tight ${closed || upcoming ? 'text-gray-100' : 'text-gray-400'}`}>
                            {ch.title}
                        </span>
                    </li>
                );
            })}
        </ol>
    );
};

const Stamp = ({ a, state }: { a: Accusation; state: CardState }) => {
    const reduce = useReducedMotion();
    const look = VERDICT_LOOK[a.verdict];
    const fresh = state === 'fresh';
    return (
        <motion.span
            className="shrink-0 rounded-md border-2 px-2.5 py-0.5 font-display text-[17px] font-bold uppercase tracking-wide"
            style={{ borderColor: look.color, color: look.color, background: `${look.color}14`, opacity: fresh ? 1 : 0.8 }}
            initial={fresh && !reduce ? { opacity: 0, scale: 1.8, rotate: -14 } : false}
            animate={{ opacity: fresh ? 1 : 0.8, scale: 1, rotate: -4 }}
            transition={{ type: 'spring', stiffness: 300, damping: 15, delay: 0.5 }}
        >
            {look.label}
        </motion.span>
    );
};

const AccusationCard = ({ a, board, order }: { a: Accusation; board: BoardState; order: number }) => {
    const reduce = useReducedMotion();
    const state = cardState(a, board);
    const look = VERDICT_LOOK[a.verdict];
    const act = JUDGED_IN.get(a.id) ?? -1;
    const pending = state === 'pending';
    const fresh = state === 'fresh';
    return (
        <motion.div
            className="flex min-h-[150px] flex-col gap-2 rounded-2xl border px-4 py-3"
            style={{
                borderColor: pending ? MUTED : `${look.color}${fresh ? 'ee' : '66'}`,
                borderStyle: pending ? 'dashed' : 'solid',
                background: pending ? 'rgba(4,10,20,0.6)' : `linear-gradient(165deg, ${look.color}${fresh ? '26' : '12'}, rgba(4,10,20,0.88) 60%)`,
                boxShadow: fresh ? `0 0 30px -10px ${look.color}` : 'none',
            }}
            initial={reduce ? false : { opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 + order * 0.05 }}
        >
            <div className="flex items-start justify-between gap-2">
                <span className="font-mono text-[15px] text-gray-300">{String(a.id).padStart(2, '0')} · {a.suspect}</span>
                {!pending && <Stamp a={a} state={state} />}
            </div>
            <p className={`m-0 font-display text-[19px] font-semibold leading-snug ${pending ? 'text-gray-300' : 'text-white'}`}>“{a.claim}”</p>
            <p className="m-0 mt-auto flex items-center gap-1.5 text-[15px]" style={{ color: pending ? '#9CA3AF' : look.color }}>
                {pending
                    ? <><Lock size={14} aria-hidden /> em julgamento · Ato {ROMANS[act]}</>
                    : <>{fresh ? 'julgada agora' : 'julgada'} no Ato {ROMANS[act]} · {look.gloss}</>}
            </p>
        </motion.div>
    );
};

/**
 * Tela entre um ato e outro (e na tecla Q): as 6 acusações do slide 11, com o carimbo das que já
 * foram julgadas. Não é slide — não conta na numeração nem no tempo. → continua, ← ou Esc volta.
 */
/**
 * A saída lê o modo no instante em que começa (via `custom` do AnimatePresence). Na troca de ato, o quadro é recortado
 * da esquerda para a direita com a mesma curva e duração da cortina, que entra por baixo: a borda da cortina empurra o
 * quadro para fora, sem deixar o slide novo aparecer no meio.
 */
const boardVariants = (reduce: boolean) => ({
    hidden: { opacity: 0, clipPath: 'inset(0% 0% 0% 0%)' },
    shown: { opacity: 1, clipPath: 'inset(0% 0% 0% 0%)', transition: { duration: DUR.enter, ease: EASE_OUT } },
    exit: (mode: BoardExit) => (mode === 'wipe' && !reduce
        ? { clipPath: 'inset(0% 0% 0% 100%)', transition: { duration: CURTAIN_WIPE_S, ease: EASE_IN_OUT } }
        : { opacity: 0, transition: { duration: DUR.exit, ease: EASE_OUT } }),
});
const VARIANTS_MOTION = boardVariants(false);
const VARIANTS_REDUCED = boardVariants(true);

export const InquiryBoard = ({ board, exitMode, onContinue, onBack }: InquiryBoardProps) => {
    const reduce = useReducedMotion() ?? false;
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.metaKey || e.ctrlKey || e.altKey) return;
            if (NEXT_KEYS.has(e.key)) { e.preventDefault(); onContinue(); }
            else if (BACK_KEYS.has(e.key)) { e.preventDefault(); onBack(); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [onContinue, onBack]);

    const judged = ACCUSATIONS.filter(a => cardState(a, board) !== 'pending').length;
    const ended = board.ended !== null ? CHAPTERS[board.ended] : null;
    const next = CHAPTERS[board.upcoming];
    const continuing = board.target !== null;

    return (
        <motion.div
            role="dialog"
            aria-label="Quadro do inquérito"
            className="absolute inset-0 z-40 bg-[#05070d]/95 backdrop-blur-xl"
            custom={exitMode}
            variants={reduce ? VARIANTS_REDUCED : VARIANTS_MOTION}
            initial="hidden"
            animate="shown"
            exit="exit"
        >
            {/* Margem lateral do próprio quadro (px-12): o palco aproveita a largura toda e o texto ganha escala. */}
            <FitStage padX={PAD_X_SELF}>
                <div className="flex flex-col gap-6 px-12 font-body text-white select-none">
                    <header className="flex items-end justify-between gap-6">
                        <div className="flex flex-col gap-1">
                            <span className="font-mono text-[15px] uppercase tracking-[0.25em] text-amber-300">Quadro do inquérito</span>
                            <h2 className="m-0 font-display text-[40px] font-bold leading-tight">
                                {ended ? <>Fim do Ato {ended.roman} · {ended.title}</> : <>Ato {next.roman} em andamento</>}
                            </h2>
                        </div>
                        <span className="shrink-0 pb-2 font-mono text-[17px] text-gray-300">
                            <span className="text-white">{judged}</span> de {ACCUSATIONS.length} acusações julgadas
                        </span>
                    </header>

                    <ActRail board={board} />

                    <div className="grid grid-cols-3 gap-3">
                        {ACCUSATIONS.map((a, i) => <AccusationCard key={a.id} a={a} board={board} order={i} />)}
                    </div>

                    <footer className="flex items-center justify-between gap-6 border-t border-white/10 pt-4">
                        <p className="m-0 flex flex-col gap-0.5">
                            <span className="text-[15px] uppercase tracking-[0.18em]" style={{ color: next.color }}>
                                {continuing ? 'A seguir' : 'Agora'} · Ato {next.roman}
                            </span>
                            <span className="text-[19px] text-gray-100"><b className="font-semibold">{next.title}.</b> {next.question}</span>
                        </p>
                        <div className="flex shrink-0 gap-2">
                            <button type="button" onClick={onBack}
                                className="rounded-full border border-white/15 px-4 py-2 text-[15px] text-gray-200 hover:bg-white/10">
                                {continuing ? '← voltar' : 'Esc · fechar'}
                            </button>
                            {continuing && (
                                <button type="button" onClick={onContinue}
                                    className="rounded-full px-4 py-2 text-[15px] font-semibold text-[#05070d]" style={{ background: next.color }}>
                                    seguir para o Ato {next.roman} →
                                </button>
                            )}
                        </div>
                    </footer>
                </div>
            </FitStage>
        </motion.div>
    );
};
