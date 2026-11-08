import type { ReactNode } from 'react';

/* Caixa comum dos painéis flutuantes (HUD) sobre o canvas. */

export const HudBox = ({ title, chip, children, width = 380 }: { title: string; chip?: string; children: ReactNode; width?: number }) => (
    <div className="rounded-2xl border border-white/10 bg-[rgba(6,8,20,0.82)] backdrop-blur-xl shadow-2xl px-4 pt-3 pb-3" style={{ width }}>
        <div className="flex items-center justify-between gap-3 mb-1.5">
            <span className="whitespace-nowrap text-[14px] font-mono uppercase tracking-[0.12em] text-gray-300">{title}</span>
            {chip && (
                <span className="shrink-0 px-2 py-0.5 rounded-full text-[14px] font-mono text-amber-200 bg-amber-400/10 border border-amber-300/30">{chip}</span>
            )}
        </div>
        {children}
    </div>
);
