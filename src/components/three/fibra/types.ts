import type { Sim, SimCtrl } from './sim';

/** Refs lidas por quadro (a simulação e os controles nunca passam pelo estado do React). */
export type SimRef = { readonly current: Sim };
export type CtrlRef = { readonly current: SimCtrl };
