import { motion, useReducedMotion } from 'framer-motion';
import { DUR, EASE_OUT, stagger } from '../../../lib/motion';
import { CAST_COLOR, type CastId } from '../ato1/content';
import { BODY_FONT, C } from '../kit/palette';
import { CASES } from './cases';
import { SIGNAL } from './shared';
import { Light, Source } from './ui';
import { EFFORT_ROWS, WHO_CLOSING, type EffortRow } from './whoTakes';

/** Peças do slide 102: o quadro por tipo de esforço, os personagens nas linhas e o painel das decisões. */

const COLS = '1fr 84px 84px 232px';

const NAME_BY_ID: Readonly<Record<string, string>> = Object.fromEntries(CASES.map(c => [c.id, c.name]));
const CASE_BY_ID = new Map(CASES.map(c => [c.id, c]));

/** Etiqueta do personagem; no último passo leva a luz da decisão final (slide 94). */
const CastTag = ({ id, decided }: { id: CastId; decided: boolean }) => {
    const verdict = CASE_BY_ID.get(id);
    return (
        <span className="flex items-center gap-1.5 rounded-lg border px-2 py-1 text-[15px] font-semibold leading-tight"
            style={{ borderColor: `${CAST_COLOR[id]}99`, color: CAST_COLOR[id], background: `${CAST_COLOR[id]}14` }}>
            {decided && verdict && <Light signal={verdict.signal} size={13} />}
            {NAME_BY_ID[id]}
        </span>
    );
};

const Row = ({ row, step, i }: { row: EffortRow; step: number; i: number }) => {
    const reduce = useReducedMotion() ?? false;
    const showCast = step >= 1;
    const dim = showCast && row.cast.length === 0;
    return (
        <motion.div className="grid items-center gap-3 rounded-xl border px-3 py-1"
            style={{
                gridTemplateColumns: COLS,
                borderColor: showCast && !dim ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.02)',
            }}
            initial={reduce ? false : { opacity: 0, x: -6 }} animate={{ opacity: dim ? 0.45 : 1, x: 0 }}
            transition={{ delay: step === 0 ? stagger(i, 0.05, 0.06) : 0, duration: DUR.enter, ease: EASE_OUT }}>
            <span className="flex min-w-0 flex-col">
                <span className="text-[16px] font-semibold leading-tight text-white">{row.name}</span>
                <span className="text-[15px] leading-tight text-gray-400">{row.examples}</span>
            </span>
            <span className="flex justify-center"><Light signal={row.bic} size={20} /></span>
            <span className="flex justify-center"><Light signal={row.ba} size={20} /></span>
            {showCast && row.cast.length > 0 ? (
                <span className="flex flex-wrap gap-1.5">{row.cast.map(id => <CastTag key={id} id={id} decided={step >= 2} />)}</span>
            ) : (
                <span className="text-[15px] leading-tight text-gray-300">{row.note}</span>
            )}
        </motion.div>
    );
};

export const EffortBoard = ({ step }: { step: number }) => (
    <div className="flex h-full flex-col gap-1.5">
        <div className="grid gap-3 px-3 font-mono text-[15px] text-gray-300" style={{ gridTemplateColumns: COLS }}>
            <span>tipo de esforço</span>
            <span className="text-center text-[14px]" style={{ color: C.base }}>bicarbonato</span>
            <span className="text-center text-[14px]" style={{ color: C.carno }}>β-alanina</span>
            <span>{step >= 1 ? 'quem cai aqui' : 'por quê'}</span>
        </div>
        <div className="flex flex-1 flex-col justify-between gap-1">
            {EFFORT_ROWS.map((r, i) => <Row key={r.id} row={r} step={step} i={i} />)}
        </div>
    </div>
);

/** Último passo: a decisão de cada personagem, com a luz final do slide 94. */
export const VerdictList = () => (
    <div className="flex h-full flex-col gap-2">
        <h3 className="m-0 font-body text-[24px] font-semibold leading-tight text-white" style={BODY_FONT}>O paciente decide quem fica</h3>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {CASES.map((c, i) => (
                <motion.li key={c.id} className="flex flex-col rounded-xl border px-3 py-1.5"
                    style={{ borderColor: `${SIGNAL[c.signal].color}66` }}
                    initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: stagger(i, 0.1), duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="flex items-center gap-2 text-[16px] font-semibold" style={{ color: CAST_COLOR[c.id as CastId] }}>
                        <Light signal={c.signal} size={14} />{c.name}
                    </span>
                    <span className="text-[15px] leading-snug text-gray-100">{c.headline}</span>
                </motion.li>
            ))}
        </ul>
        <p className="m-0 mt-auto text-[17px] font-semibold leading-snug text-white">{WHO_CLOSING}</p>
        <Source>Personagens fictícios (dossiê 06, Parte 5); decisões do slide 94.</Source>
    </div>
);
