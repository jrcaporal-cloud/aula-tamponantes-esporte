import { motion, useReducedMotion } from 'framer-motion';
import { C } from '../kit/palette';
import { COLS, PLACEBO_TRIALS, ROWS, WITNESSES, type Group, type Witness } from './evidenceContent';

/** Mapa do slide 71: fichas posicionadas por força da evidência (x) × efeito no desempenho (y). Clicar abre o porquê. */

export const MAP_W = 692;
export const MAP_H = 372;
const Y_LABEL_W = 100;
const X_LABEL_H = 48;
const COL_W = [92, 184, 170, 146] as const;
const PLOT_H = MAP_H - X_LABEL_H;
const ROW_H = PLOT_H / ROWS.length;
const CHIP_H = 32;
const CHIP_GAP = 5;

const colX = (col: number) => Y_LABEL_W + COL_W.slice(0, col).reduce((a, b) => a + b, 0);

/** Posição de cada ficha: empilhada no centro da célula, na ordem da lista. */
const POSITIONS: Record<string, { left: number; top: number }> = (() => {
    const out: Record<string, { left: number; top: number }> = {};
    const cells = new Map<string, Witness[]>();
    WITNESSES.forEach(w => cells.set(`${w.col}-${w.row}`, [...(cells.get(`${w.col}-${w.row}`) ?? []), w]));
    cells.forEach(list => list.forEach((w, slot) => {
        const stack = list.length * CHIP_H + (list.length - 1) * CHIP_GAP;
        out[w.id] = { left: colX(w.col) + 8, top: w.row * ROW_H + (ROW_H - stack) / 2 + slot * (CHIP_H + CHIP_GAP) };
    }));
    return out;
})();

/** Onde o carbonato de cálcio vai parar na virada: no cabeçalho do quadro do placebo. */
const OVERLAY = { left: 150, top: 46, width: 470, height: 270 };
const CACO3_REVEAL_POS = { left: OVERLAY.left + 20, top: OVERLAY.top + 18 };

interface EvidenceMapProps {
    groups: readonly Group[];
    selected: string;
    revealed: boolean;
    onSelect: (id: string) => void;
}

const Grid = () => (
    <>
        {ROWS.map((label, r) => (
            <div key={label} className="absolute flex items-center text-[16px] leading-tight text-gray-300 pr-2"
                style={{ left: 0, top: r * ROW_H, width: Y_LABEL_W, height: ROW_H }}>{label}</div>
        ))}
        {COLS.map((label, c) => (
            <div key={label} className="absolute text-center text-[16px] leading-tight text-gray-300 px-1"
                style={{ left: colX(c), top: PLOT_H + 6, width: COL_W[c] }}>{label}</div>
        ))}
        {COLS.map((label, c) => (
            <div key={`v-${label}`} className="absolute border-l border-white/10" style={{ left: colX(c), top: 0, height: PLOT_H }} />
        ))}
        {ROWS.map((label, r) => (
            <div key={`h-${label}`} className="absolute border-t border-white/10" style={{ left: Y_LABEL_W, top: (r + 1) * ROW_H, width: MAP_W - Y_LABEL_W }} />
        ))}
    </>
);

const PlaceboBoard = () => (
    <motion.div className="absolute rounded-xl border-2 p-5 pt-16 flex flex-col gap-3"
        style={{ ...OVERLAY, zIndex: 2, background: 'rgba(4,10,20,0.97)', borderColor: `${C.co2}aa` }}
        initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
        <span className="absolute right-5 top-5 rotate-[-6deg] rounded-md border-2 px-3 py-1 font-display text-[1.25rem] font-semibold tracking-wide"
            style={{ color: C.risk, borderColor: C.risk }}>PLACEBO</span>
        <p className="text-[1.08rem] leading-snug text-white">O “comprimido falso” destes ensaios de tamponantes:</p>
        <ul className="grid grid-cols-2 gap-x-4 gap-y-1.5">
            {PLACEBO_TRIALS.map(t => <li key={t} className="text-[16px] text-gray-200">· {t}</li>)}
        </ul>
        <p className="text-[16px] leading-snug" style={{ color: C.lactate }}>Por que o antiácido de farmácia não serve de tampão para o atleta?</p>
    </motion.div>
);

export const EvidenceMap = ({ groups, selected, revealed, onSelect }: EvidenceMapProps) => {
    const reduce = useReducedMotion();
    return (
        <div className="relative" style={{ width: MAP_W, height: MAP_H }}>
            <Grid />
            {revealed && <PlaceboBoard />}
            {WITNESSES.filter(w => groups.includes(w.group)).map(w => {
                const isCaco3 = w.id === 'caco3';
                const pos = isCaco3 && revealed ? CACO3_REVEAL_POS : POSITIONS[w.id];
                const active = w.id === selected;
                const dim = revealed && !isCaco3;
                return (
                    <motion.button key={w.id} type="button" onClick={() => onSelect(w.id)}
                        className="absolute flex items-center gap-2 whitespace-nowrap rounded-lg border px-2.5 text-[16px] font-semibold cursor-pointer"
                        style={{
                            height: CHIP_H,
                            background: active ? `${w.color}2e` : w.group === 'fortes' ? `${w.color}14` : 'rgba(255,255,255,0.05)',
                            borderColor: active ? w.color : `${w.color}55`,
                            color: '#fff',
                            boxShadow: active ? `0 0 18px -6px ${w.color}` : 'none',
                            zIndex: isCaco3 ? 3 : 1,
                        }}
                        initial={reduce ? false : { opacity: 0, scale: 0.9 }}
                        animate={{ opacity: dim ? 0.3 : 1, scale: 1, left: pos.left, top: pos.top }}
                        transition={{ duration: reduce ? 0 : 0.6, ease: 'easeInOut' }}
                        aria-pressed={active}>
                        <span className="h-2.5 w-2.5 rounded-full" style={{ background: w.color }} />
                        {w.label}
                    </motion.button>
                );
            })}
        </div>
    );
};
