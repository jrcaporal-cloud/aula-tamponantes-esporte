import { motion } from 'framer-motion';
import { DUR, EASE_OUT } from '../../../lib/motion';
import { C } from '../kit/palette';
import { ANCHOR, PROFILES, type Profile, type Verdict } from './safety';
import { SIGNAL } from './shared';
import { Chip, Light, Source } from './ui';

/** Peças do slide 92: lista de perfis com as luzes, ficha do perfil e o caso-âncora. */

export const ProfileList = ({ step, onSelect }: { step: number; onSelect: (i: number) => void }) => (
    <div className="flex h-full flex-col gap-2">
        <div className="flex items-center justify-end gap-3 pr-3 font-mono text-[15px] text-gray-300">
            <span className="w-[92px] text-center" style={{ color: C.base }}>bicarbonato</span>
            <span className="w-[86px] text-center" style={{ color: C.carno }}>β-alanina</span>
        </div>
        {PROFILES.map((p, i) => {
            const lit = step >= i + 1;
            const active = step === i + 1;
            return (
                <button key={p.id} type="button" onClick={() => onSelect(i + 1)}
                    className="flex min-h-[46px] cursor-pointer items-center gap-3 rounded-xl border px-3 py-1.5 text-left transition-colors"
                    style={{ borderColor: active ? 'rgba(34,211,238,0.7)' : 'rgba(255,255,255,0.08)', background: active ? 'rgba(14,116,144,0.28)' : 'rgba(255,255,255,0.02)' }}>
                    <span className="min-w-0 flex-1 text-[17px] font-semibold leading-tight text-white">{p.name}</span>
                    <span className="flex w-[92px] justify-center"><Light signal={p.bic.signal} on={lit} /></span>
                    <span className="flex w-[86px] justify-center"><Light signal={p.ba.signal} on={lit} /></span>
                </button>
            );
        })}
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-1 pt-1 text-[15px] text-gray-300">
            {(['verde', 'amarelo', 'vermelho'] as const).map(s => (
                <span key={s} className="flex items-center gap-1.5"><Light signal={s} size={14} /> {SIGNAL[s].label}</span>
            ))}
        </div>
    </div>
);

const VerdictBlock = ({ title, color, v, delay }: { title: string; color: string; v: Verdict; delay: number }) => {
    const look = SIGNAL[v.signal];
    return (
        <motion.div className="flex flex-1 flex-col gap-2 rounded-xl border px-4 py-3"
            style={{ borderColor: `${look.color}88`, background: `linear-gradient(160deg, ${look.color}18, rgba(4,10,20,0) 65%)` }}
            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay, ease: EASE_OUT }}>
            <div className="flex items-center gap-3">
                <Light signal={v.signal} size={22} />
                <span className="font-body text-[21px] font-semibold" style={{ color }}>{title}</span>
                <span className="ml-auto font-mono text-[15px] uppercase" style={{ color: look.color }}>{look.label}</span>
            </div>
            <p className="m-0 text-[18px] leading-snug text-gray-100">{v.text}</p>
            <div className="mt-auto flex items-center gap-2">
                <Chip color={C.co2}>{v.level}</Chip>
                <Source>{v.source}</Source>
            </div>
        </motion.div>
    );
};

export const ProfileDetail = ({ profile }: { profile: Profile }) => (
    <div className="flex h-full flex-col gap-3">
        <div>
            <p className="m-0 font-body text-[26px] font-semibold leading-tight text-white">{profile.name}</p>
            <p className="m-0 text-[16px] text-gray-300">{profile.sub} · bicarbonato 0,2–0,3 g/kg · β-alanina 3,2–6,4 g/d</p>
        </div>
        <VerdictBlock title="Bicarbonato" color={C.base} v={profile.bic} delay={0.1} />
        <VerdictBlock title="β-alanina" color={C.carno} v={profile.ba} delay={0.25} />
    </div>
);

export const AnchorCase = () => (
    <div className="flex h-full flex-col gap-3">
        <p className="m-0 font-mono text-[15px] uppercase tracking-wider" style={{ color: C.risk }}>Antes do semáforo: um caso real</p>
        <p className="m-0 font-body text-[26px] font-semibold leading-tight text-white">
            20 g por dia: quase a dose de um atleta de 70 kg (21 g)
        </p>
        <p className="m-0 text-[17px] leading-snug text-gray-200">{ANCHOR.who}. {ANCHOR.what}.</p>
        <div className="grid grid-cols-4 gap-2">
            {ANCHOR.labs.map((l, i) => (
                <motion.div key={l.label} className="flex flex-col items-center rounded-xl border px-2 py-3"
                    style={{ borderColor: `${C.risk}77`, background: `${C.risk}12` }}
                    initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 + i * 0.15, duration: DUR.enter, ease: EASE_OUT }}>
                    <span className="text-[15px] text-gray-300">{l.label}</span>
                    <span className="font-display text-[34px] font-semibold leading-none" style={{ color: C.risk }}>{l.value}</span>
                    <span className="text-[15px] text-gray-400">{l.ref}</span>
                </motion.div>
            ))}
        </div>
        <p className="m-0 text-[19px] font-semibold leading-snug text-white">
            A dose não mudou. Mudou quem tomou, por quanto tempo e com que rim.
        </p>
        <div className="mt-auto"><Source>{ANCHOR.source}</Source></div>
    </div>
);
