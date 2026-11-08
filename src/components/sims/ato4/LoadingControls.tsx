import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { br } from '../kit/format';
import { BRAZIL_CAP_G } from './loadingModel';

/** Controles do simulador de carga: dose diária e semanas de uso. */

const DOSE_MIN = 1;
const DOSE_MAX = 6.4;
const WEEKS_MIN = 1;
const WEEKS_MAX = 24;

const DOSE_MARKS = [
    { value: BRAZIL_CAP_G, label: '2,0' },
    { value: 3.2, label: '3,2' },
    { value: 4.8, label: '4,8' },
    { value: 6.4, label: '6,4' },
];

interface SliderProps {
    label: string;
    value: string;
    min: number;
    max: number;
    step: number;
    current: number;
    onChange: (v: number) => void;
    marks?: readonly { value: number; label: string }[];
}

const Slider = ({ label, value, min, max, step, current, onChange, marks = [] }: SliderProps) => (
    <label className="flex flex-col gap-1 min-w-0">
        <span className="flex items-baseline justify-between text-[15px] text-gray-200">
            {label}
            <span className="font-mono text-[16px] font-semibold" style={{ color: C.carnoSoft }}>{value}</span>
        </span>
        <input type="range" min={min} max={max} step={step} value={current} onChange={e => onChange(Number(e.target.value))}
            className="w-full cursor-pointer" style={{ accentColor: C.carno }} />
        <span className="relative h-[18px]">
            {marks.map(m => (
                <span key={m.value} className="absolute -translate-x-1/2 font-mono text-[16px] text-gray-300 whitespace-nowrap"
                    style={{ left: `${((m.value - min) / (max - min)) * 100}%` }}>
                    {m.label}
                </span>
            ))}
        </span>
    </label>
);

interface LoadingControlsProps {
    dose: number;
    weeks: number;
    onDose: (v: number) => void;
    onWeeks: (v: number) => void;
}

export const LoadingControls = ({ dose, weeks, onDose, onWeeks }: LoadingControlsProps) => (
    <div className="grid grid-cols-2 gap-8 px-2">
        <Slider label="Dose diária (IN 28: até 2,0)" value={`${br(dose, 1)} g/dia`} min={DOSE_MIN} max={DOSE_MAX} step={0.2}
            current={dose} onChange={onDose} marks={DOSE_MARKS} />
        <Slider label="Semanas de uso" value={`${weeks} sem`} min={WEEKS_MIN} max={WEEKS_MAX} step={1}
            current={weeks} onChange={onWeeks} marks={[{ value: 4, label: '4' }, { value: 10, label: '10' }, { value: 24, label: '24' }]} />
    </div>
);

/** Quadro dos 100 g: só ~3 viram carnosina (Stegen 2013). */
export const YieldCard = ({ reduce }: { reduce: boolean }) => (
    <motion.div className="absolute left-[78px] top-[44px] rounded-xl border border-white/15 p-3 flex gap-3 items-center"
        style={{ background: 'rgba(4,10,20,0.92)' }}
        initial={reduce ? false : { opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <div className="grid grid-cols-10 gap-[3px]" aria-hidden>
            {Array.from({ length: 100 }, (_, i) => (
                <span key={i} className="w-[9px] h-[9px] rounded-full"
                    style={{ background: i >= 97 ? C.carno : 'rgba(148,163,184,0.35)' }} />
            ))}
        </div>
        <div className="flex flex-col gap-1 max-w-[190px]">
            <span className="font-display text-[1.5rem] leading-none font-semibold" style={{ color: C.carno }}>~3 de 100</span>
            <span className="text-[16px] leading-snug text-gray-200">179 g engolidos → ~5 g viram carnosina (cálculo)</span>
        </div>
    </motion.div>
);
