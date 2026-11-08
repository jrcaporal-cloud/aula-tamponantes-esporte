import { C } from '../../sims/kit/palette';
import { HudBox } from './hudParts';

/*
 * Etapa 2: meia-vida no plasma humano dos três dipeptídeos de histidina (de Jager 2023), em barras
 * na mesma escala — a da carnosina quase some ao lado da balenina.
 */

const ROWS = [
    { name: 'carnosina', min: 1.2, color: C.carno },
    { name: 'anserina', min: 2.14, color: C.carnoSoft },
    { name: 'balenina', min: 34.9, color: '#CBD5E1' },
] as const;
const MAX = 36;

export const BloodHud = () => (
    <HudBox title="Meia-vida no plasma" width={340}>
        <div className="flex flex-col gap-2 mt-1">
            {ROWS.map(r => (
                <div key={r.name} className="flex items-center gap-3">
                    <span className="w-[86px] text-[14px] text-gray-300">{r.name}</span>
                    <div className="flex-1 h-3 rounded-full bg-white/5 overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${(r.min / MAX) * 100}%`, minWidth: 6, background: r.color }} />
                    </div>
                    <span className="w-[72px] text-right font-mono text-[14px] text-gray-100">{r.min.toLocaleString('pt-BR')} min</span>
                </div>
            ))}
        </div>
        <p className="text-[14px] text-gray-400 mt-2">de Jager 2023 (n = 6). Animação da CN1: tempo ilustrativo.</p>
    </HudBox>
);
