/** Íon bicarbonato (HCO₃⁻) em traço fino: a marca d'água da capa. Geometria trigonal plana, ângulos de 120°. */
export const BicarbonateMark = ({ className }: { className?: string }) => {
    const C = { x: 300, y: 300 };
    const arm = 170;
    const at = (deg: number) => ({ x: C.x + arm * Math.cos((deg * Math.PI) / 180), y: C.y - arm * Math.sin((deg * Math.PI) / 180) });
    const o1 = at(90);
    const o2 = at(210);
    const o3 = at(330);
    const h = { x: o3.x + 95, y: o3.y - 40 };
    return (
        <svg viewBox="0 0 600 600" className={className} aria-hidden>
            <defs>
                <radialGradient id="bm-glow" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="#22d3ee" stopOpacity="0.5" />
                    <stop offset="100%" stopColor="#22d3ee" stopOpacity="0" />
                </radialGradient>
            </defs>
            <circle cx={C.x} cy={C.y} r={250} fill="url(#bm-glow)" opacity={0.25} />
            <g stroke="#67e8f9" strokeWidth={3} fill="none" strokeLinecap="round">
                {/* dupla com o O de cima */}
                <line x1={C.x - 9} y1={C.y} x2={o1.x - 9} y2={o1.y + 30} />
                <line x1={C.x + 9} y1={C.y} x2={o1.x + 9} y2={o1.y + 30} />
                <line x1={C.x} y1={C.y} x2={o2.x + 26} y2={o2.y - 15} />
                <line x1={C.x} y1={C.y} x2={o3.x - 26} y2={o3.y - 15} />
                <line x1={o3.x + 24} y1={o3.y - 10} x2={h.x - 18} y2={h.y + 8} />
            </g>
            <g fontFamily="'Clash Display', sans-serif" fontWeight={600} fill="#cffafe" textAnchor="middle" dominantBaseline="central">
                <text x={C.x} y={C.y} fontSize={54}>C</text>
                <text x={o1.x} y={o1.y} fontSize={54}>O</text>
                <text x={o2.x} y={o2.y} fontSize={54}>O</text>
                <text x={o3.x} y={o3.y} fontSize={54}>O</text>
                <text x={h.x} y={h.y} fontSize={46}>H</text>
                <text x={o2.x + 34} y={o2.y - 34} fontSize={40} fill="#fdba74">−</text>
            </g>
        </svg>
    );
};
