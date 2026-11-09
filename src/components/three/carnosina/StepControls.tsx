import { C } from '../../sims/kit/palette';
import { br } from './model';
import { GPD_OPTIONS, useCarnoSim } from './store';

/* Controles que só existem em algumas etapas: dose e semanas (5), pH (6), formulação (7). */

const Seg = <T extends string | number>({ options, value, onChange, fmt, color }: {
    options: readonly T[]; value: T; onChange: (v: T) => void; fmt: (v: T) => string; color: string;
}) => (
    <div className="flex gap-1 p-1 rounded-xl bg-white/5 border border-white/10">
        {options.map(o => (
            <button key={String(o)} type="button" onClick={() => onChange(o)}
                className="flex-1 h-8 rounded-lg text-[14px] font-semibold transition-colors"
                style={o === value ? { background: `${color}33`, color: '#fff', boxShadow: `inset 0 0 0 1px ${color}` } : { color: '#D1D5DB' }}>
                {fmt(o)}
            </button>
        ))}
    </div>
);

const LoadControls = () => {
    const { gpd, weeks, setGpd, setWeeks } = useCarnoSim();
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[14px] text-gray-300">Dose diária (g/d)</span>
            <Seg options={GPD_OPTIONS} value={gpd} onChange={setGpd} fmt={v => br(v, 1)} color={C.carno} />
            <label htmlFor="carno-weeks" className="flex items-center justify-between text-[14px] text-gray-300 mt-1">
                <span>Semanas de uso</span>
                <span className="font-mono text-white">{weeks}</span>
            </label>
            <input id="carno-weeks" type="range" min={2} max={24} step={1} value={weeks} onChange={e => setWeeks(Number(e.target.value))}
                aria-label="Semanas de uso" className="w-full accent-violet-400" />
            <span className="text-[14px] text-gray-400">Dose acumulada: {br(gpd * 7 * weeks)} g · o tanque segue o modelo ilustrativo</span>
        </div>
    );
};

const PhControls = () => {
    const { ph, setPh } = useCarnoSim();
    return (
        <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-[14px] text-gray-300">
                <label htmlFor="carno-ph">pH do sarcoplasma</label>
                <button type="button" onClick={() => setPh(null)}
                    className="px-2.5 h-7 rounded-full text-[14px] border border-white/15"
                    style={ph === null ? { background: `${C.acid}26`, color: '#fff', borderColor: C.acid } : { color: '#D1D5DB' }}>
                    ciclo automático
                </button>
            </div>
            <input id="carno-ph" type="range" min={6.5} max={7.1} step={0.01} value={ph ?? 6.8} onChange={e => setPh(Number(e.target.value))}
                aria-label="pH do sarcoplasma" className="w-full accent-orange-400" />
            <div className="flex justify-between text-[14px] text-gray-400"><span>6,5 (exaustão)</span><span>7,1 (repouso)</span></div>
        </div>
    );
};

const ReleaseControls = () => {
    const { release, setRelease } = useCarnoSim();
    return (
        <div className="flex flex-col gap-2">
            <span className="text-[14px] text-gray-300">1,6 g de β-alanina</span>
            <Seg options={['pura', 'lenta'] as const} value={release} onChange={setRelease}
                fmt={v => (v === 'pura' ? 'pura (248 µM)' : 'liberação lenta (82 µM)')} color={C.risk} />
        </div>
    );
};

export const StepControls = ({ step }: { step: number }) => {
    if (step === 4) return <LoadControls />;
    if (step === 5) return <PhControls />;
    if (step === 6) return <ReleaseControls />;
    return null;
};
