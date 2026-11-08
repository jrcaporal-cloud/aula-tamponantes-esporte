import { motion, useReducedMotion } from 'framer-motion';
import { Hand } from 'lucide-react';
import { useSlideSteps } from '../../store/useSlideSteps';
import { ACCUSATIONS, VERDICT_LOOK, type Accusation } from './ato1/content';
import { RECAP } from './ato7/recap';
import { SIM_H } from './ato7/shared';
import { Source } from './ato7/ui';

/**
 * Slide 97 — O Veredito das Acusações. Volta às 6 acusações do slide 11 (mesma fonte de dados).
 * Passo 0: as acusações, sem veredito ("lembra do seu voto?"). Passos 1–6: cada carta recebe o veredito e a linha que a aula acrescentou.
 */

const RecapCard = ({ a, open, current }: { a: Accusation; open: boolean; current: boolean }) => {
    const reduce = useReducedMotion();
    const look = VERDICT_LOOK[a.verdict];
    const recap = RECAP[a.id];
    return (
        <motion.div className="flex min-h-0 flex-col gap-2 overflow-hidden rounded-2xl border px-4 py-3"
            style={{
                borderColor: open ? `${look.color}${current ? 'ee' : '88'}` : 'rgba(255,255,255,0.12)',
                background: open ? `linear-gradient(165deg, ${look.color}1c, rgba(4,10,20,0.85) 55%)` : 'rgba(4,10,20,0.7)',
                boxShadow: current ? `0 0 26px -8px ${look.color}` : 'none',
            }}
            initial={false} animate={{ scale: current && !reduce ? 1.02 : 1 }} transition={{ duration: 0.3 }}>
            <div className="flex items-center justify-between gap-2 pr-1">
                <span className="font-mono text-[15px] text-gray-300">{String(a.id).padStart(2, '0')} · {a.suspect}</span>
                {open && (
                    <motion.span className="rounded-md border px-2 py-0.5 font-display text-[17px] font-semibold uppercase tracking-wide"
                        style={{ borderColor: look.color, color: look.color }}
                        initial={reduce ? false : { opacity: 0, scale: 1.2, rotate: -6 }} animate={{ opacity: 1, scale: 1, rotate: -3 }}
                        transition={{ type: 'spring', stiffness: 260, damping: 16 }}>
                        {look.label}
                    </motion.span>
                )}
            </div>
            <p className="m-0 font-display text-[20px] font-semibold leading-tight text-white">“{a.claim}”</p>
            {open ? (
                <motion.div className="mt-auto flex flex-col gap-1" initial={reduce ? false : { opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}>
                    <p className="m-0 text-[17px] leading-snug text-gray-100">{recap.line}</p>
                    <Source>{recap.where}</Source>
                </motion.div>
            ) : (
                <p className="m-0 mt-auto text-[16px] text-gray-400">Qual foi o seu voto no início da aula?</p>
            )}
        </motion.div>
    );
};

const VerdictRecapSim = () => {
    const { step } = useSlideSteps(ACCUSATIONS.length + 1);

    return (
        <div className="not-prose flex w-full flex-col gap-3 font-body text-white select-none" style={{ height: SIM_H }}>
            <motion.p key={step === 0 ? 'ask' : 'go'} className="m-0 flex h-[30px] items-center gap-2 text-[18px] text-gray-100"
                initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                {step === 0
                    ? <><Hand size={20} className="text-amber-300" aria-hidden /> As mesmas seis acusações do começo. Alguém mudou de voto?</>
                    : <>Veredito {step} de {ACCUSATIONS.length} · o quadro julga a acusação, não a molécula</>}
            </motion.p>
            <div className="grid min-h-0 flex-1 grid-cols-3 grid-rows-2 gap-3">
                {ACCUSATIONS.map((a, i) => (
                    <RecapCard key={a.id} a={a} open={i < step} current={i === step - 1} />
                ))}
            </div>
        </div>
    );
};

export default VerdictRecapSim;
