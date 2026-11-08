import type { ReactNode } from 'react';
import { br } from '../kit/format';
import { C } from '../kit/palette';
import { SvgText } from '../kit/ui';
import { STEWART_SHARES } from './protonSources.content';
import { Appear, Arrow, Ion, Move, Pop, Pulse, Tilt, Vanish } from './protonSources.svg';

/**
 * Cenas químicas esquemáticas do slide 24, uma por testemunha. Área 740 × 300 (sem escala:
 * texto SVG em tamanho de projeto). O H⁺ é sempre a bolha laranja.
 */

export const SCENE_W = 740;
export const SCENE_H = 300;

const MUTED = '#CBD5E1';
const P_COLOR = '#94A3B8';

const Frame = ({ label, children }: { label: string; children: ReactNode }) => (
    <svg viewBox={`0 0 ${SCENE_W} ${SCENE_H}`} width="100%" height={SCENE_H} role="img" aria-label={label}>
        {children}
    </svg>
);

/** Fosfato: bolinha "P". */
const Phosphate = () => <Ion label="P" color={P_COLOR} r={19} size={16} />;

/** Mitocôndria pequena (elipse com cristas). */
const Mito = ({ x, y }: { x: number; y: number }) => (
    <g transform={`translate(${x} ${y})`}>
        <ellipse rx={30} ry={17} fill={`${C.base}22`} stroke={C.base} strokeWidth={2.5} />
        <path d="M-22,0 q5,-11 10,0 t10,0 t10,0 t10,0" fill="none" stroke={C.base} strokeWidth={2} />
    </g>
);

/** 1ª testemunha (Robergs 2004): o ATP solta o H⁺; a LDH consome um H⁺. */
export const AtpScene = ({ reduce }: { reduce: boolean }) => (
    <Frame label="ATP vira ADP, Pi e H⁺; a LDH consome um H⁺ ao formar lactato">
        <SvgText x={20} y={22} text="hidrólise do ATP" size={16} color={MUTED} weight={600} />
        <SvgText x={402} y={22} text="LDH: piruvato → lactato" size={16} color={MUTED} weight={600} />
        <line x1={382} x2={382} y1={10} y2={290} stroke="rgba(255,255,255,0.12)" />

        {/* ATP: adenosina + três fosfatos; o terceiro se solta e o H⁺ aparece */}
        <rect x={20} y={62} width={96} height={52} rx={12} fill="rgba(148,163,184,0.16)" stroke={P_COLOR} strokeWidth={2} />
        <SvgText x={68} y={94} text="adenosina" size={16} anchor="middle" color="#E5E7EB" />
        <line x1={116} x2={188} y1={88} y2={88} stroke={P_COLOR} strokeWidth={3} />
        <Vanish reduce={reduce} begin={0.25} dur={0.2}>
            <line x1={188} x2={234} y1={88} y2={88} stroke={P_COLOR} strokeWidth={3} />
        </Vanish>
        <g transform="translate(142 88)"><Phosphate /></g>
        <g transform="translate(188 88)"><Phosphate /></g>
        <Move reduce={reduce} begin={0.28} from="0 0" to="62 60">
            <g transform="translate(234 88)"><Phosphate /></g>
        </Move>
        <Vanish reduce={reduce} begin={0.22} dur={0.3}>
            <SvgText x={150} y={140} text="ATP" size={20} anchor="middle" color="#fff" weight={700} />
        </Vanish>
        <Appear reduce={reduce} begin={0.55}>
            <SvgText x={120} y={140} text="ADP" size={20} anchor="middle" color="#fff" weight={700} />
            <SvgText x={296} y={186} text="Pi" size={20} anchor="middle" color="#fff" weight={700} />
        </Appear>
        <Pop reduce={reduce} begin={0.5} x={318} y={66}>
            <Pulse reduce={reduce} r={32} color={C.acid} />
            <Ion label="H⁺" color={C.acid} r={24} size={18} solid />
        </Pop>
        <Appear reduce={reduce} begin={0.66}>
            <SvgText x={20} y={196} text="cada ATP quebrado libera 1 H⁺" size={17} color={C.acidSoft} weight={700} />
        </Appear>

        {/* De onde vem o ATP decide o destino do H⁺ */}
        <Appear reduce={reduce} begin={0.88}>
            <Mito x={52} y={236} />
            <SvgText x={96} y={242} text="ATP da mitocôndria → H⁺ reciclado" size={16} color={C.baseSoft} />
        </Appear>
        <Appear reduce={reduce} begin={1.1}>
            {[0, 1, 2].map(i => <circle key={i} cx={30 + i * 16} cy={278 - (i % 2) * 4} r={7} fill={C.acid} />)}
            <SvgText x={96} y={284} text="acima do steady state → H⁺ sobra" size={16} color={C.acidSoft} />
        </Appear>

        {/* LDH: piruvato + NADH + H⁺ → lactato + NAD⁺ */}
        <g transform="translate(440 92)">
            <polygon points="0,-28 24,-14 24,14 0,28 -24,14 -24,-14" fill="rgba(148,163,184,0.16)" stroke={P_COLOR} strokeWidth={2} />
        </g>
        <SvgText x={440} y={140} text="piruvato" size={16} anchor="middle" color="#E5E7EB" />
        <SvgText x={440} y={178} text="+ NADH" size={16} anchor="middle" color="#E5E7EB" />
        <Arrow x1={472} y1={92} x2={530} y2={92} />
        <rect x={538} y={62} width={82} height={60} rx={16} fill="rgba(255,255,255,0.06)" stroke="#E5E7EB" strokeWidth={2} />
        <SvgText x={579} y={98} text="LDH" size={18} anchor="middle" color="#fff" weight={700} />
        <Arrow x1={626} y1={92} x2={670} y2={92} />
        {/* o H⁺ entra na enzima e é consumido */}
        <Move reduce={reduce} begin={0.33} dur={1.0} from="0 0" to="85 52">
            <Vanish reduce={reduce} begin={0.83} dur={0.35}>
                <g transform="translate(494 40)"><Ion label="H⁺" color={C.acid} r={20} size={16} solid /></g>
            </Vanish>
        </Move>
        <Appear reduce={reduce} begin={0.94}>
            <SvgText x={579} y={150} text="−1 H⁺" size={20} anchor="middle" color={C.base} weight={700} />
            <g transform="translate(704 92)"><Ion label="lac⁻" color={C.lactate} r={24} size={16} /></g>
            <SvgText x={704} y={140} text="lactato" size={16} anchor="middle" color={C.lactate} />
            <SvgText x={704} y={178} text="+ NAD⁺" size={16} anchor="middle" color="#E5E7EB" />
        </Appear>
        <Appear reduce={reduce} begin={1.21}>
            <SvgText x={402} y={232} text="a LDH consome 1 H⁺ ao formar lactato" size={17} color={C.baseSoft} weight={700} />
            <SvgText x={402} y={266} text="→ o lactato retardaria a acidose" size={18} color="#fff" weight={700} />
        </Appear>
    </Frame>
);

/** Fração dissociada de um ácido fraco (Henderson-Hasselbalch). */
const dissociated = (pH: number, pKa: number) => 1 / (1 + 10 ** (pKa - pH));
const PKA = 3.86;

/** 2ª testemunha (Böning 2005/2008): a soma dá ácido lático; no pH da célula, tudo dissociado. */
export const LacticScene = ({ reduce }: { reduce: boolean }) => {
    const x0 = 452;
    const x1 = 720;
    const yTop = 70;
    const yBot = 196;
    const sx = (pH: number) => x0 + ((pH - 2) / (8 - 2)) * (x1 - x0);
    const sy = (f: number) => yBot - f * (yBot - yTop);
    const curve = Array.from({ length: 61 }, (_, i) => 2 + i * 0.1)
        .map((p, i) => `${i ? 'L' : 'M'}${sx(p).toFixed(1)},${sy(dissociated(p, PKA)).toFixed(1)}`).join(' ');
    return (
        <Frame label="Glicólise mais ATP glicolítico somam ácido lático, que se dissocia em lactato e H⁺">
            <SvgText x={20} y={22} text="a conta somada" size={16} color={MUTED} weight={600} />
            <SvgText x={x0 - 30} y={22} text="ácido lático no pH da célula" size={16} color={MUTED} weight={600} />
            <line x1={410} x2={410} y1={10} y2={290} stroke="rgba(255,255,255,0.12)" />

            <rect x={20} y={40} width={150} height={44} rx={12} fill="rgba(148,163,184,0.14)" stroke={P_COLOR} strokeWidth={2} />
            <SvgText x={95} y={68} text="glicólise" size={17} anchor="middle" color="#fff" />
            <SvgText x={192} y={70} text="+" size={22} anchor="middle" color={MUTED} />
            <rect x={214} y={40} width={176} height={44} rx={12} fill="rgba(148,163,184,0.14)" stroke={P_COLOR} strokeWidth={2} />
            <SvgText x={302} y={68} text="ATP glicolítico" size={17} anchor="middle" color="#fff" />
            <Arrow x1={95} y1={88} x2={170} y2={116} />
            <Arrow x1={302} y1={88} x2={232} y2={116} />
            <Appear reduce={reduce} begin={0.17}>
                <rect x={110} y={120} width={182} height={44} rx={22} fill="rgba(250,204,21,0.12)" stroke={C.lactate} strokeWidth={2} />
                <SvgText x={201} y={148} text="= ácido lático" size={18} anchor="middle" color="#fff" weight={700} />
            </Appear>
            <Move reduce={reduce} begin={0.5} from="70 -14" to="0 0">
                <Appear reduce={reduce} begin={0.44} dur={0.3}>
                    <g transform="translate(130 210)"><Ion label="lac⁻" color={C.lactate} r={25} size={16} /></g>
                </Appear>
            </Move>
            <Move reduce={reduce} begin={0.5} from="-70 -14" to="0 0">
                <Appear reduce={reduce} begin={0.44} dur={0.3}>
                    <g transform="translate(272 210)">
                        <Pulse reduce={reduce} r={33} color={C.acid} />
                        <Ion label="H⁺" color={C.acid} r={25} size={18} solid />
                    </g>
                </Appear>
            </Move>
            <Appear reduce={reduce} begin={0.83}>
                <SvgText x={201} y={218} text="1 : 1" size={24} anchor="middle" color="#fff" weight={700} />
                <SvgText x={201} y={272} text="1 H⁺ para cada lactato" size={18} anchor="middle" color={C.acidSoft} weight={700} />
            </Appear>

            {/* curva de dissociação: pKa 3,86 contra o pH da célula */}
            <line x1={x0} x2={x1} y1={yBot} y2={yBot} stroke="rgba(255,255,255,0.35)" />
            <line x1={x0} x2={x1} y1={yTop} y2={yTop} stroke="rgba(255,255,255,0.12)" strokeDasharray="4 5" />
            <SvgText x={x0 - 8} y={yTop + 6} text="100%" size={16} anchor="end" color={MUTED} weight={500} />
            <SvgText x={x0 - 8} y={yBot + 6} text="0" size={16} anchor="end" color={MUTED} weight={500} />
            {[2, 4, 6, 8].map(t => (
                <SvgText key={t} x={sx(t)} y={yBot + 24} text={`${t}`} size={16} anchor="middle" color={MUTED} weight={500} />
            ))}
            <SvgText x={(x0 + x1) / 2} y={yBot + 48} text="pH" size={16} anchor="middle" color={MUTED} />
            <rect x={sx(6.6)} y={yTop - 6} width={sx(7.1) - sx(6.6)} height={yBot - yTop + 6} fill={`${C.base}2a`} stroke={`${C.base}88`} />
            <SvgText x={sx(6.85)} y={yTop - 14} text="pH da célula" size={16} anchor="middle" color={C.baseSoft} />
            <line x1={sx(PKA)} x2={sx(PKA)} y1={yTop - 6} y2={yBot} stroke={C.lactate} strokeWidth={2} strokeDasharray="6 5" />
            <SvgText x={sx(PKA)} y={yTop - 14} text={`pKa ${br(PKA, 2)}`} size={16} anchor="middle" color={C.lactate} />
            <path d={curve} fill="none" stroke={C.acid} strokeWidth={3.5} pathLength={1} strokeDasharray="1" strokeDashoffset={reduce ? 0 : 1}>
                {!reduce && <animate attributeName="stroke-dashoffset" from="1" to="0" begin="0.2s" dur="1.0s" fill="freeze" />}
            </path>
            <SvgText x={sx(4.6)} y={yTop + 66} text="% dissociado" size={16} color={C.acidSoft} />
            <Appear reduce={reduce} begin={0.99}>
                <SvgText x={x0 - 30} y={284} text="no pH da célula: > 99,9% dissociado" size={17} color="#fff" weight={700} />
            </Appear>
        </Frame>
    );
};

const SHARE_COLOR: Record<(typeof STEWART_SHARES)[number]['id'], string> = {
    sid: C.acid, atot: C.lactate, pco2: C.co2, ka: '#64748B',
};
const SHARE_SHORT: Record<(typeof STEWART_SHARES)[number]['id'], string> = {
    sid: 'queda da SID', atot: 'ácidos fracos (Pi, creatina)', pco2: 'PCO₂', ka: 'Kₐ aparente',
};

/** Molécula de água (O grande, dois H pequenos), desenhada em torno de 0,0. */
const Water = ({ dim = false }: { dim?: boolean }) => (
    <g opacity={dim ? 0.5 : 1}>
        <circle r={13} fill="rgba(148,163,184,0.25)" stroke={P_COLOR} strokeWidth={2} />
        <circle cx={-13} cy={11} r={7} fill="rgba(229,231,235,0.3)" stroke="#E5E7EB" strokeWidth={1.5} />
        <circle cx={13} cy={11} r={7} fill="rgba(229,231,235,0.3)" stroke="#E5E7EB" strokeWidth={1.5} />
    </g>
);

const K_COLOR = '#E5E7EB';

/** 3ª testemunha (Stewart; Lindinger 1995): entra ânion forte, sai cátion forte, a água obedece. */
export const StewartScene = ({ reduce }: { reduce: boolean }) => {
    const bx0 = 10;
    const bw = 720;
    const segs = STEWART_SHARES.map((s, i) => {
        const before = STEWART_SHARES.slice(0, i).reduce((sum, p) => sum + p.pct, 0);
        return { ...s, x: bx0 + (before / 100) * bw, w: (s.pct / 100) * bw };
    });
    const pivotX = 600;
    const beamY = 84;
    return (
        <Frame label="Lactato entra, potássio sai e a água se dissocia; a queda da SID explica 62% da subida do H⁺">
            {/* membrana da célula */}
            <rect x={112} y={14} width={318} height={170} rx={30} fill="rgba(34,211,238,0.04)" stroke={P_COLOR} strokeWidth={3} />
            <rect x={120} y={22} width={302} height={154} rx={24} fill="none" stroke={P_COLOR} strokeWidth={1.5} strokeDasharray="5 6" />
            <SvgText x={20} y={30} text="fora" size={16} color={MUTED} />
            <SvgText x={414} y={44} text="célula" size={16} anchor="end" color={MUTED} />
            {[[250, 60], [380, 140], [200, 150]].map(([x, y]) => <g key={`${x}`} transform={`translate(${x} ${y})`}><Water dim /></g>)}

            {/* lactato⁻ entra */}
            <Move reduce={reduce} begin={0.17} from="0 0" to="122 0">
                <g transform="translate(52 72)"><Ion label="lac⁻" color={C.lactate} r={24} size={16} /></g>
            </Move>
            <Arrow x1={88} y1={104} x2={150} y2={104} color={C.lactate} />
            {/* K⁺ sai */}
            <Move reduce={reduce} begin={0.33} from="0 0" to="-122 0">
                <g transform="translate(174 140)"><Ion label="K⁺" color={K_COLOR} r={22} size={17} /></g>
            </Move>
            <Arrow x1={150} y1={172} x2={88} y2={172} color={K_COLOR} />
            {/* a água se dissocia */}
            <Vanish reduce={reduce} begin={0.94} dur={0.3}>
                <g transform="translate(318 98)"><Water /></g>
            </Vanish>
            <Appear reduce={reduce} begin={0.99}>
                <g transform="translate(300 112)"><Ion label="OH⁻" color={P_COLOR} r={20} size={15} /></g>
            </Appear>
            <Move reduce={reduce} begin={0.99} from="318 98" to="350 62">
                <Appear reduce={reduce} begin={0.99} dur={0.2}>
                    <Pulse reduce={reduce} r={30} color={C.acid} />
                    <Ion label="H⁺" color={C.acid} r={22} size={18} solid />
                </Appear>
            </Move>
            <Appear reduce={reduce} begin={1.16}>
                <SvgText x={20} y={212} text="entra lactato⁻ · sai K⁺ · a água se dissocia → H⁺" size={17} color="#fff" weight={700} />
            </Appear>

            {/* balança da SID */}
            <SvgText x={pivotX} y={22} text="SID = cátions − ânions fortes" size={16} anchor="middle" color={MUTED} />
            <polygon points={`${pivotX},${beamY} ${pivotX - 16},${beamY + 70} ${pivotX + 16},${beamY + 70}`} fill="rgba(148,163,184,0.25)" stroke={P_COLOR} strokeWidth={2} />
            <Tilt reduce={reduce} begin={0.5} deg={9} cx={pivotX} cy={beamY}>
                <line x1={pivotX - 110} x2={pivotX + 110} y1={beamY} y2={beamY} stroke="#E5E7EB" strokeWidth={4} strokeLinecap="round" />
            </Tilt>
            <circle cx={pivotX} cy={beamY} r={6} fill="#E5E7EB" />
            {/* prato dos cátions sobe (perdeu K⁺); prato dos ânions desce (ganhou lactato⁻) */}
            <Move reduce={reduce} begin={0.5} dur={0.9} from="0 0" to="0 -17">
                <g transform={`translate(${pivotX - 110} ${beamY})`}>
                    <line x1={0} x2={0} y1={0} y2={34} stroke={P_COLOR} strokeWidth={1.5} />
                    <path d="M-34,34 h68 a34,16 0 0 1 -68,0 Z" fill="rgba(229,231,235,0.12)" stroke={K_COLOR} strokeWidth={2} />
                    <g transform="translate(-12 28)"><circle r={9} fill={`${K_COLOR}55`} stroke={K_COLOR} strokeWidth={1.5} /></g>
                    <SvgText x={0} y={82} text="cátions" size={16} anchor="middle" color={K_COLOR} />
                </g>
            </Move>
            <Move reduce={reduce} begin={0.5} dur={0.9} from="0 0" to="0 17">
                <g transform={`translate(${pivotX + 110} ${beamY})`}>
                    <line x1={0} x2={0} y1={0} y2={34} stroke={P_COLOR} strokeWidth={1.5} />
                    <path d="M-34,34 h68 a34,16 0 0 1 -68,0 Z" fill="rgba(250,204,21,0.12)" stroke={C.lactate} strokeWidth={2} />
                    {[-14, 4, 20].map(dx => <circle key={dx} cx={dx} cy={26} r={9} fill={`${C.lactate}55`} stroke={C.lactate} strokeWidth={1.5} />)}
                    <SvgText x={0} y={82} text="ânions" size={16} anchor="middle" color={C.lactate} />
                </g>
            </Move>
            <Appear reduce={reduce} begin={0.88}>
                <SvgText x={pivotX} y={212} text="SID cai → [H⁺] sobe" size={17} anchor="middle" color={C.acidSoft} weight={700} />
            </Appear>

            {/* de onde vem a subida do [H⁺] (Lindinger 1995) */}
            {segs.map((s, i) => (
                <g key={s.id}>
                    <rect x={s.x} y={228} width={reduce ? s.w : 0} height={34} fill={SHARE_COLOR[s.id]} rx={i === 0 || i === segs.length - 1 ? 6 : 0}>
                        {!reduce && <animate attributeName="width" from="0" to={`${s.w}`} begin={`${1.3 + i * 0.1}s`} dur="0.5s" fill="freeze" />}
                    </rect>
                </g>
            ))}
            <Appear reduce={reduce} begin={1.43}>
                <text x={segs[0].x + 14} y={251} fontSize={18} fontWeight={700} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>
                    {`${segs[0].pct}% · ${SHARE_SHORT.sid} (K⁺ sai, lactato⁻ entra)`}
                </text>
                {segs.slice(1).map(s => (
                    <text key={s.id} x={s.x + s.w / 2} y={251} textAnchor="middle" fontSize={17} fontWeight={700} fill="#04080F" style={{ fontFamily: 'var(--font-body)' }}>
                        {`${s.pct}%`}
                    </text>
                ))}
                {segs.slice(1).map((s, i) => {
                    const lx = [bx0, 300, 420][i];
                    return (
                        <g key={s.id}>
                            <rect x={lx} y={276} width={12} height={12} rx={2} fill={SHARE_COLOR[s.id]} />
                            <SvgText x={lx + 18} y={288} text={`${s.pct}% ${SHARE_SHORT[s.id]}`} size={16} color="#E5E7EB" weight={500} />
                        </g>
                    );
                })}
            </Appear>
        </Frame>
    );
};
