import { useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { Html } from '@react-three/drei';
import { motion } from 'framer-motion';
import * as THREE from 'three';
/** Tempo da cena lido por quadro (ref compartilhada entre os rótulos). */
export interface TimeState { t: number }
export type TimeRef = { readonly current: TimeState };

export type Follow = (T: number, clock: number, out: THREE.Vector3) => void;

export interface LabelSpec {
    id: string;
    text: string;
    sub?: string;
    color: string;
    at?: [number, number, number];
    follow?: Follow;
    /** Deslocamento da caixa em pixels (a linha-guia liga a âncora à caixa). */
    dx: number;
    dy: number;
    /** Letra maior (mínimo de 14 px no subtítulo). */
    big?: boolean;
}

interface Label3DProps { spec: LabelSpec; timeRef: TimeRef; delay: number }

/** Rótulo ancorado em 3D com linha-guia, legível no projetor. */
export const Label3D = ({ spec, timeRef, delay }: Label3DProps) => {
    const g = useRef<THREE.Group>(null);
    useFrame(({ clock }) => {
        if (spec.follow && g.current) spec.follow(timeRef.current.t, clock.elapsedTime, g.current.position);
    });
    const left = spec.dx < 0;
    const len = Math.hypot(spec.dx, spec.dy);
    const pad = 4;
    return (
        <group ref={g} position={spec.at}>
            <Html zIndexRange={[40, 10]} style={{ pointerEvents: 'none' }}>
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.45, delay }}
                    style={{ position: 'absolute', left: 0, top: 0 }}
                >
                    <svg width={1} height={1} style={{ position: 'absolute', overflow: 'visible', left: 0, top: 0 }}>
                        <motion.line
                            x1={0} y1={0} x2={spec.dx} y2={spec.dy}
                            stroke={spec.color} strokeWidth={1.6} strokeOpacity={0.9}
                            initial={{ pathLength: 0 }} animate={{ pathLength: 1 }}
                            transition={{ duration: 0.5, delay, ease: 'easeOut' }}
                        />
                        <circle cx={0} cy={0} r={4} fill={spec.color} />
                        <circle cx={0} cy={0} r={8} fill="none" stroke={spec.color} strokeOpacity={0.45} />
                    </svg>
                    <div
                        className="absolute whitespace-nowrap rounded-lg px-3 py-1.5 font-body"
                        style={{
                            left: spec.dx + (left ? -pad : pad),
                            top: spec.dy,
                            transform: `translate(${left ? '-100%' : '0'}, -50%)`,
                            background: 'rgba(4,10,20,0.88)',
                            border: `1px solid ${spec.color}66`,
                            borderLeft: left ? undefined : `3px solid ${spec.color}`,
                            borderRight: left ? `3px solid ${spec.color}` : undefined,
                            boxShadow: `0 6px 24px rgba(0,0,0,0.55), 0 0 18px ${spec.color}22`,
                            textAlign: left ? 'right' : 'left',
                            minWidth: len > 0 ? undefined : 0,
                        }}
                    >
                        <div className={`${spec.big ? 'text-[17px]' : 'text-[15px]'} font-semibold text-white leading-tight`}>{spec.text}</div>
                        {spec.sub && <div className={`${spec.big ? 'text-[14px]' : 'text-[13px]'} text-gray-300 leading-snug mt-0.5`}>{spec.sub}</div>}
                    </div>
                </motion.div>
            </Html>
        </group>
    );
};
