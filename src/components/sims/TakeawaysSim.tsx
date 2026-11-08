import { motion, useReducedMotion } from 'framer-motion';
import { useSlideSteps } from '../../store/useSlideSteps';
import { TAKEAWAYS } from './ato7/takeaways';
import { SIM_H } from './ato7/shared';

/** Slide 96 — O que Levar para Segunda-feira. Cinco mensagens reveladas uma a uma; a atual fica em destaque com o seu número. */
const TakeawaysSim = () => {
    const { step } = useSlideSteps(TAKEAWAYS.length);
    const reduce = useReducedMotion();

    return (
        <ol className="not-prose m-0 flex w-full list-none flex-col gap-2.5 p-0 font-body text-white select-none" style={{ height: SIM_H }}>
            {TAKEAWAYS.map((t, i) => {
                const shown = i <= step;
                const active = i === step;
                return (
                    <motion.li key={t.title} className="flex min-h-0 items-center gap-5 rounded-2xl border px-5"
                        style={{
                            flex: active ? 1.35 : 1,
                            borderColor: active ? `${t.color}cc` : 'rgba(255,255,255,0.1)',
                            background: active ? `linear-gradient(100deg, ${t.color}26, rgba(4,10,20,0.8) 55%)` : 'rgba(4,10,20,0.6)',
                        }}
                        initial={false} animate={{ opacity: shown ? (active ? 1 : 0.72) : 0, x: shown ? 0 : -20 }}
                        transition={{ duration: reduce ? 0 : 0.4 }}>
                        <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full font-display text-[22px] font-semibold"
                            style={{ background: active ? t.color : 'rgba(255,255,255,0.1)', color: active ? '#04080F' : '#F3F4F6' }}>
                            {i + 1}
                        </span>
                        <div className="min-w-0 flex-1">
                            <p className="m-0 font-display text-[23px] font-semibold leading-tight text-white">{t.title}</p>
                            <p className="m-0 text-[17px] leading-snug text-gray-200">{t.text}</p>
                            {active && <p className="m-0 mt-0.5 text-[15px] leading-tight text-gray-400">{t.source}</p>}
                        </div>
                        <div className="w-[230px] shrink-0 text-right">
                            <p className="m-0 font-display text-[28px] font-semibold leading-none" style={{ color: t.color }}>{t.figure}</p>
                            <p className="m-0 mt-1 text-[15px] leading-tight text-gray-300">{t.figureLabel}</p>
                        </div>
                    </motion.li>
                );
            })}
        </ol>
    );
};

export default TakeawaysSim;
