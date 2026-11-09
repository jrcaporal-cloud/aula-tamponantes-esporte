import { motion, useReducedMotion } from 'framer-motion';
import type { Chapter } from '../sims/ato1/content';
import { FitStage, PAD_X_SELF } from './FitStage';
import { DUR, EASE_IN_OUT, EASE_OUT } from '../../lib/motion';

/**
 * Tempo que a cortina fica fechada (cobrindo a tela) antes de abrir para o novo ato.
 * A pergunta termina de entrar em ~0,55 s; sobram ~1,8 s para a turma ler. Avançar de novo fecha antes.
 */
export const CURTAIN_HOLD_MS = 2400;

/** Duração da varredura (entrada e saída). O quadro do inquérito sai com a mesma, para as bordas andarem juntas. */
export const CURTAIN_WIPE_S = 0.5;

/**
 * Troca de ato: uma cortina na cor do ato varre a tela da esquerda para a direita, mostra o número e o
 * nome do ato por um instante e sai pelo outro lado, revelando o primeiro slide. Não bloqueia a navegação.
 * Com movimento reduzido, vira um esmaecimento simples.
 */
export const ActCurtain = ({ chapter }: { chapter: Chapter }) => {
    const reduce = useReducedMotion();
    const wipe = reduce
        ? { initial: { opacity: 0 }, animate: { opacity: 1 }, exit: { opacity: 0 } }
        : {
            initial: { clipPath: 'inset(0% 100% 0% 0%)' },
            animate: { clipPath: 'inset(0% 0% 0% 0%)' },
            exit: { clipPath: 'inset(0% 0% 0% 100%)' },
        };
    return (
        <motion.div
            aria-hidden
            className="pointer-events-none absolute inset-0 z-30"
            style={{ background: `radial-gradient(ellipse at 30% 50%, ${chapter.color}2e, #05070d 62%)`, backgroundColor: '#05070d' }}
            {...wipe}
            transition={{ duration: reduce ? 0.25 : CURTAIN_WIPE_S, ease: EASE_IN_OUT }}
        >
            {/* fio na cor do ato, na borda que avança: a camada inteira desliza (só transform), o brilho é estático */}
            {!reduce && (
                <motion.div className="absolute inset-0" initial={{ x: '0%', opacity: 1 }} animate={{ x: '100%', opacity: 0 }} transition={{ duration: CURTAIN_WIPE_S, ease: EASE_IN_OUT }}>
                    <span className="absolute inset-y-0 left-0 w-[3px]" style={{ background: chapter.color, boxShadow: `0 0 28px 4px ${chapter.color}` }} />
                </motion.div>
            )}
            <FitStage padX={PAD_X_SELF}>
                <div className="flex flex-col gap-3 px-16 font-body text-white select-none">
                    <motion.span className="font-mono text-[20px] uppercase tracking-[0.35em]" style={{ color: chapter.color }}
                        initial={reduce ? false : { opacity: 0, x: -24 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1, duration: 0.3, ease: EASE_OUT }}>
                        Ato {chapter.roman}
                    </motion.span>
                    <motion.h2 className="m-0 font-display text-[76px] font-bold leading-[1.02] tracking-tight"
                        initial={reduce ? false : { opacity: 0, x: -36 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.15, duration: 0.35, ease: EASE_OUT }}>
                        {chapter.title}
                    </motion.h2>
                    <motion.span className="h-[3px] w-[120px] rounded-full" style={{ background: chapter.color, transformOrigin: 'left' }}
                        initial={reduce ? false : { scaleX: 0 }} animate={{ scaleX: 1 }} transition={{ delay: 0.2, duration: DUR.enter, ease: EASE_OUT }} />
                    <motion.p className="m-0 max-w-[900px] text-[26px] leading-snug text-gray-200"
                        initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.25, duration: DUR.enter, ease: EASE_OUT }}>
                        {chapter.question}
                    </motion.p>
                </div>
            </FitStage>
        </motion.div>
    );
};
