/**
 * Linguagem de cor da aula (a mesma no 2D, no 3D e no CSS):
 * ciano = base/tampão/bicarbonato, laranja = ácido/H⁺, âmbar = lactato, violeta = carnosina/β-alanina,
 * lima = sódio, ardósia = CO₂/neutro, rosa = desconforto/risco.
 */
export const C = {
    base: '#22D3EE',
    baseSoft: '#67E8F9',
    baseDeep: '#0E7490',
    acid: '#FB923C',
    acidSoft: '#FDBA74',
    acidDeep: '#C2410C',
    lactate: '#FACC15',
    carno: '#A78BFA',
    carnoSoft: '#C4B5FD',
    sodium: '#A3E635',
    co2: '#94A3B8',
    risk: '#FB7185',
    ok: '#34D399',
    text: '#F3F4F6',
    muted: '#9CA3AF',
} as const;

export const PANEL_BG = { background: 'rgba(4,10,20,0.74)' } as const;
