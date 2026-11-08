import { motion } from 'framer-motion';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { fractionOfMax } from './loadingModel';
import { HARRIS_VB, delayed } from './harrisMotion';
import { CREATINE, HORSE_TRIAL, PATENT_FACTS, PATENT_HUMANS } from './harrisContent';

/**
 * Quadros dos passos 1 e 2 do slide "O Homem da Creatina" (viewBox 568 × 372, 1 unidade = 1 px de projeto).
 * Passo 1: dois tanques — a creatina enche em dias, a carnosina em semanas — e "5 g = 1,1 kg de bife".
 * Passo 2: seis cavalos e os 30 dias × 3 tomadas; a patente com as datas e a seta para a NAI.
 */

/** Pessoa esquemática (centro do tronco na origem). */
export const Person = ({ x, y, color, scale = 1 }: { x: number; y: number; color: string; scale?: number }) => (
    <g transform={`translate(${x} ${y}) scale(${scale})`}>
        <circle cx={0} cy={-9} r={7} fill={color} />
        <path d="M-12 12 Q-12 0 0 0 Q12 0 12 12 Z" fill={color} />
    </g>
);

/* ——— Passo 1: creatina × carnosina ——— */

/** 4 semanas a 6,4 g/dia = 179 g → fração do teto no modelo do slide anterior. */
const CARNOSINE_4W = fractionOfMax(6.4 * 28);
const TANK = { y: 44, h: 176, w: 96 } as const;

interface TankProps {
    x: number;
    name: string;
    color: string;
    fill: number;
    /** Dias acesos no calendário de 28 (7 × 4). */
    days: number;
    caption: string;
    sub: string;
    duration: number;
    reduce: boolean;
}

const Tank = ({ x, name, color, fill, days, caption, sub, duration, reduce }: TankProps) => {
    const cx = x + TANK.w / 2;
    const inner = TANK.h - 12;
    return (
        <g>
            <SvgText x={cx} y={30} text={name} anchor="middle" size={20} color={color} weight={800} />
            <rect x={x} y={TANK.y} width={TANK.w} height={TANK.h} rx={16} fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.3)" strokeWidth={2} />
            <motion.rect x={x + 6} y={TANK.y + 6} width={TANK.w - 12} height={inner} rx={11} fill={color} fillOpacity={0.75}
                style={{ transformBox: 'fill-box', originY: 1 }}
                initial={{ scaleY: reduce ? fill : 0 }} animate={{ scaleY: fill }}
                transition={{ duration: reduce ? 0 : duration, delay: reduce ? 0 : 0.3, ease: 'easeOut' }} />
            {/* calendário: 4 semanas × 7 dias */}
            {Array.from({ length: 28 }, (_, i) => {
                const on = i < days;
                return (
                    <motion.rect key={i} x={x + 1 + (i % 7) * 13.6} y={234 + Math.floor(i / 7) * 11} width={11} height={8} rx={2}
                        fill={on ? color : 'rgba(255,255,255,0.12)'}
                        {...(on ? delayed(reduce, 0.3 + (i / Math.max(days, 1)) * duration, 0.15) : {})} />
                );
            })}
            <SvgText x={cx} y={300} text={caption} anchor="middle" size={18} color={color} weight={800} />
            <SvgText x={cx} y={320} text={sub} anchor="middle" size={16} color="#E5E7EB" weight={600} />
        </g>
    );
};

/** Colher de medida com o pó (boca à esquerda). */
const Scoop = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`}>
        <path d="M-30 0 A30 22 0 0 0 30 0 Z" fill="rgba(34,211,238,0.12)" stroke={C.base} strokeWidth={2.5} />
        <path d="M-24 0 Q-10 -18 0 -14 Q12 -20 24 0 Z" fill={C.baseSoft} />
        <path d="M30 2 L64 -10" stroke={C.base} strokeWidth={6} strokeLinecap="round" />
    </g>
);

/** Bife esquemático com o veio de gordura. */
const Steak = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`}>
        <path d="M-62 -6 C-60 -34 -10 -40 22 -32 C56 -24 68 -2 58 18 C46 40 -6 38 -36 30 C-58 24 -64 12 -62 -6 Z"
            fill="rgba(251,113,133,0.30)" stroke={C.risk} strokeWidth={2.5} />
        <path d="M-40 -8 C-20 -20 10 -4 34 -14 M-30 14 C-6 4 18 22 44 6" fill="none" stroke="#FFE4E6" strokeOpacity={0.7} strokeWidth={3} strokeLinecap="round" />
    </g>
);

export const TanksVisual = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox={`0 0 ${HARRIS_VB.w} ${HARRIS_VB.h}`} width="100%" height="100%" role="img"
        aria-label="Creatina enche o músculo em dias; carnosina em semanas">
        <line x1={14} x2={306} y1={TANK.y + 6} y2={TANK.y + 6} stroke="rgba(255,255,255,0.45)" strokeDasharray="5 5" />
        <SvgText x={310} y={TANK.y + 12} text="teto" size={16} color="#CBD5E1" weight={600} />
        <Tank x={20} name="Creatina" color={C.base} fill={1} days={5} caption="~5 dias" sub="satura" duration={1.1} reduce={reduce} />
        <Tank x={190} name="Carnosina" color={C.carno} fill={CARNOSINE_4W} days={28} caption="28 dias"
            sub={`~${Math.round(CARNOSINE_4W * 100)}% do teto`} duration={2.6} reduce={reduce} />
        {/* equivalência */}
        <line x1={356} x2={356} y1={20} y2={320} stroke="rgba(255,255,255,0.12)" />
        <motion.g {...delayed(reduce, 0.5)}>
            <SvgText x={462} y={30} text="cada tomada" anchor="middle" size={16} color="#CBD5E1" weight={600} />
            <Scoop x={430} y={86} />
            <SvgText x={518} y={78} text={`${CREATINE.doseG} g`} anchor="middle" size={24} color={C.base} weight={800} />
        </motion.g>
        <motion.g {...delayed(reduce, 1.1)}>
            <SvgText x={462} y={150} text="=" anchor="middle" size={34} color="#fff" weight={800} />
            <Steak x={462} y={200} />
            <SvgText x={462} y={262} text={`creatina de ${CREATINE.meat}`} anchor="middle" size={17} color={C.risk} weight={800} />
            <SvgText x={462} y={282} text="de bife cru" anchor="middle" size={17} color={C.risk} weight={800} />
        </motion.g>
        <motion.g {...delayed(reduce, 1.5)}>
            <SvgText x={462} y={312} text={`${CREATINE.timesPerDay} · ${CREATINE.minDays}`} anchor="middle" size={16} color={C.baseSoft} weight={700} />
        </motion.g>
        <SvgText x={14} y={350} text="Carnosina a 6,4 g/dia; teto do modelo ilustrativo do slide anterior" size={16} color="#CBD5E1" weight={500} />
        <SvgText x={14} y={369} text="(ED50 377 g, Rezende 2020)." size={16} color="#CBD5E1" weight={500} />
    </svg>
);

/* ——— Passo 2: cavalos e patente ——— */

/** Cavalo geométrico (cascos na origem, cabeça à direita). */
const Horse = ({ x, color, bob, reduce }: { x: number; color: string; bob: number; reduce: boolean }) => (
    <g transform={`translate(${x} 104)`}>
        <g>
            <g fill={color} stroke={color} strokeLinecap="round">
                <ellipse cx={0} cy={-32} rx={22} ry={10} stroke="none" />
                <path d="M12 -38 L26 -56 L34 -50 L20 -28 Z" stroke="none" />
                <ellipse cx={37} cy={-48} rx={11} ry={5.5} transform="rotate(38 37 -48)" stroke="none" />
                <path d="M27 -57 L26 -64" strokeWidth={3} />
                <path d="M-15 -26 L-17 0 M-8 -24 L-6 0 M9 -24 L7 0 M16 -26 L19 0" strokeWidth={4} fill="none" />
                <path d="M-21 -36 Q-32 -30 -30 -14" strokeWidth={4} fill="none" />
            </g>
            {!reduce && <animateTransform attributeName="transform" type="translate" values="0 0; 0 -3; 0 0" dur={`${1.4 + bob * 0.15}s`} repeatCount="indefinite" />}
        </g>
    </g>
);

const DAY_W = 17.6;

export const PatentVisual = ({ reduce }: { reduce: boolean }) => (
    <svg viewBox={`0 0 ${HARRIS_VB.w} ${HARRIS_VB.h}`} width="100%" height="100%" role="img"
        aria-label="Seis cavalos por 30 dias e a patente de 1997 a 1999, hoje da NAI">
        <SvgText x={8} y={20} text={`EQUINE VET J 1999 · ${HORSE_TRIAL.horses} PURO-SANGUES`} size={16} color={C.carnoSoft} weight={700} />
        {Array.from({ length: HORSE_TRIAL.horses }, (_, i) => (
            <motion.g key={i} {...delayed(reduce, 0.1 * i)}>
                <Horse x={52 + i * 92} color={C.carnoSoft} bob={i} reduce={reduce} />
            </motion.g>
        ))}
        {/* 30 dias × 3 tomadas */}
        {Array.from({ length: HORSE_TRIAL.days }, (_, d) => (
            <motion.g key={d} {...delayed(reduce, 0.6 + d * 0.045, 0.15)}>
                <rect x={10 + d * DAY_W} y={114} width={DAY_W - 3} height={36} rx={3} fill="rgba(167,139,250,0.14)" stroke={`${C.carno}66`} />
                {Array.from({ length: HORSE_TRIAL.perDay }, (_, k) => (
                    <circle key={k} cx={10 + d * DAY_W + (DAY_W - 3) / 2} cy={123 + k * 9} r={2.8} fill={C.carno} />
                ))}
            </motion.g>
        ))}
        <SvgText x={10} y={170} text="dia 1" size={16} color="#CBD5E1" weight={600} />
        <SvgText x={10 + HORSE_TRIAL.days * DAY_W - 3} y={170} text={`dia ${HORSE_TRIAL.days}`} anchor="end" size={16} color="#CBD5E1" weight={600} />
        <SvgText x={284} y={170} text={`${HORSE_TRIAL.perDay}×/dia`} anchor="middle" size={16} color={C.carnoSoft} weight={700} />
        <SvgText x={284} y={192} text="100 mg/kg de β-alanina + 12,5 mg/kg de histidina" anchor="middle" size={16} color="#E5E7EB" weight={600} />

        {/* patente */}
        <motion.g {...delayed(reduce, 2)}>
            <path d="M10 210 H218 L240 232 V366 H10 Z" fill="rgba(250,204,21,0.07)" stroke={C.lactate} strokeWidth={2} />
            <path d="M218 210 V232 H240" fill="none" stroke={C.lactate} strokeWidth={2} />
            <SvgText x={24} y={236} text="PATENTE" size={16} color={C.lactate} weight={700} />
            <SvgText x={24} y={262} text="US 5,965,596" size={22} color="#fff" weight={800} />
            <SvgText x={24} y={284} text="Harris e Dunnett" size={16} color="#E5E7EB" weight={600} />
        </motion.g>
        {PATENT_FACTS.slice(0, 2).map((f, i) => (
            <motion.g key={f.label} {...delayed(reduce, 2.4 + i * 0.35)}>
                <circle cx={32} cy={308 + i * 28} r={9} fill="none" stroke={C.lactate} strokeWidth={2} />
                <path d={`M27 ${308 + i * 28} l4 4 l7 -8`} fill="none" stroke={C.lactate} strokeWidth={2} strokeLinecap="round" />
                <SvgText x={48} y={314 + i * 28} text={`${f.label} ${f.value}`} size={16} color="#fff" weight={700} />
            </motion.g>
        ))}
        {/* seta para a NAI */}
        <motion.path d="M246 270 C280 262 300 256 330 254" fill="none" stroke={C.lactate} strokeWidth={3} strokeLinecap="round"
            initial={{ pathLength: reduce ? 1 : 0 }} animate={{ pathLength: 1 }} transition={{ duration: reduce ? 0 : 0.6, delay: reduce ? 0 : 3.1 }} />
        <motion.path d="M320 246 L332 254 L320 262" fill="none" stroke={C.lactate} strokeWidth={3} strokeLinecap="round" {...delayed(reduce, 3.6, 0.2)} />
        <motion.g {...delayed(reduce, 3.6)}>
            <rect x={340} y={214} width={218} height={82} rx={14} fill="rgba(250,204,21,0.12)" stroke={C.lactate} strokeWidth={2} />
            <SvgText x={449} y={254} text="NAI" anchor="middle" size={32} color={C.lactate} weight={800} />
            <SvgText x={449} y={280} text={PATENT_FACTS[2].label} anchor="middle" size={16} color="#fff" weight={600} />
        </motion.g>
        {/* estudo humano descrito na própria patente */}
        <motion.g {...delayed(reduce, 4)}>
            <path d="M240 340 C290 340 330 330 364 328" fill="none" stroke={C.co2} strokeWidth={2} strokeDasharray="4 4" />
            {Array.from({ length: PATENT_HUMANS }, (_, i) => (
                <Person key={i} x={384 + i * 26} y={328} color={C.co2} scale={0.8} />
            ))}
            <SvgText x={449} y={364} text="carnosina sem mudança aparente" anchor="middle" size={16} color="#CBD5E1" weight={600} />
        </motion.g>
    </svg>
);
