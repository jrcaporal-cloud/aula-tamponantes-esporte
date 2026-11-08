import { motion } from 'framer-motion';
import type { ReactNode } from 'react';
import { br, signed } from '../kit/format';
import { C } from '../kit/palette';
import { CARR_MIRROR, COMBAT_TRIALS, GRADE_LIST } from './forest';

/** Coluna de leitura ao lado do forest plot: um quadro por passo. */

const Box = ({ title, children }: { title: string; children: ReactNode }) => (
    <div className="h-full rounded-xl border border-white/10 bg-white/[0.03] p-4 flex flex-col gap-3">
        <span className="font-mono text-[15px] tracking-wide text-cyan-300">{title}</span>
        {children}
    </div>
);

/** Espelho de Carr 2011: alcalose × acidose, em % de potência num sprint de 1 min (LC90). */
const Mirror = () => {
    const sx = (v: number) => 130 + v * 28;
    return (
        <svg viewBox="0 0 260 176" width="100%" role="img" aria-label="Alcalose e acidose: efeito espelho">
            <line x1={sx(0)} x2={sx(0)} y1={30} y2={170} stroke="rgba(255,255,255,0.5)" strokeDasharray="4 4" />
            {CARR_MIRROR.map((m, i) => {
                const y = 58 + i * 80;
                const color = m.tone === 'base' ? C.base : C.acid;
                return (
                    <g key={m.label}>
                        <text x={m.est > 0 ? sx(0) + 4 : sx(0) - 4} y={y - 22} textAnchor={m.est > 0 ? 'start' : 'end'} fontSize={17} fill="#D1D5DB">{m.label}</text>
                        <line x1={sx(m.est - m.ci)} x2={sx(m.est + m.ci)} y1={y} y2={y} stroke={color} strokeWidth={2.5} opacity={0.6} />
                        <rect x={Math.min(sx(0), sx(m.est))} y={y - 11} width={Math.abs(sx(m.est) - sx(0))} height={22} rx={4} fill={color} />
                        <text x={m.est > 0 ? sx(0) + 4 : sx(0) - 4} y={y + 34} textAnchor={m.est > 0 ? 'start' : 'end'}
                            fontSize={21} fontWeight={700} fill={color}>{`${signed(m.est, 1)}% (±${br(m.ci, 1)})`}</text>
                    </g>
                );
            })}
        </svg>
    );
};

export const ForestSide = ({ step }: { step: number }) => (
    <motion.div key={step} className="h-full" initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.35 }}>
        {step === 0 && (
            <Box title="DE OLIVEIRA 2022 · BAYESIANA">
                <span className="font-display text-[3.4rem] leading-none font-semibold" style={{ color: C.base }}>{br(0.17, 2)}</span>
                <p className="text-[17px] leading-snug text-gray-100">efeito médio no exercício, com HCO₃⁻ +5,2 mmol/L</p>
                <p className="text-[16px] leading-snug text-gray-300">158 dos 189 artigos testaram bicarbonato; o resto, citrato e lactato.</p>
            </Box>
        )}
        {step === 1 && (
            <Box title="O ESPELHO · CARR 2011">
                <p className="text-[16px] leading-snug text-gray-100">Sprint de 1 min, potência média, LC90:</p>
                <Mirror />
                <p className="text-[16px] leading-snug text-gray-300">Igual e oposto: o pH do sangue mexe no desempenho nos dois sentidos.</p>
            </Box>
        )}
        {step === 2 && (
            <Box title="GRGIC 2020 · FORÇA × RESISTÊNCIA">
                <p className="text-[17px] leading-snug text-gray-100">Pico de força e 1RM: nada.</p>
                <p className="text-[17px] leading-snug text-gray-100">Repetições até a falha: efeito comparável ao das provas de 45 s a 8 min.</p>
                <p className="text-[16px] leading-snug text-gray-300">O tampão não aumenta a força; adia o momento em que a acidose interrompe a série.</p>
            </Box>
        )}
        {step === 3 && (
            <Box title="ENSAIOS × META-ANÁLISE">
                <ul className="grid gap-x-2 gap-y-1.5" style={{ gridTemplateColumns: '98px 1fr' }}>
                    {COMBAT_TRIALS.map(t => (
                        <li key={t.sport} className="contents text-[16px]">
                            <span className="font-semibold text-white">{t.sport}</span>
                            <span className="text-gray-300 leading-snug">{t.who} · {t.n}</span>
                        </li>
                    ))}
                </ul>
                <p className="text-[16px] leading-snug text-gray-100">Juntos (8 artigos): lactato sobe, potência e testes específicos não mudam.</p>
            </Box>
        )}
        {step === 4 && (
            <Box title="GRADE · GRGIC 2021 (GUARDA-CHUVA)">
                <div className="flex flex-col gap-1">
                    <span className="text-[16px] font-bold" style={{ color: C.ok }}>Moderada</span>
                    {GRADE_LIST.moderada.map(g => <span key={g} className="text-[16px] text-gray-100">{g}</span>)}
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-[16px] font-bold" style={{ color: C.lactate }}>Baixa</span>
                    {GRADE_LIST.baixa.map(g => <span key={g} className="text-[16px] text-gray-100">{g}</span>)}
                </div>
                <span className="text-[16px] font-bold" style={{ color: C.muted }}>Alta: nenhuma</span>
            </Box>
        )}
    </motion.div>
);
