import { useEffect } from 'react';
import { create } from 'zustand';

/**
 * Passos dentro de um slide (estilo "fragmentos"): o passador avança o passo
 * antes de trocar de slide. Um componente declara quantos passos tem com
 * `useSlideSteps(n)` e lê o passo atual — o Deck cuida do teclado/passador.
 */
interface SlideStepState {
    step: number;
    count: number;
    /** Ao voltar para um slide, ele abre já no último passo (como no PowerPoint). */
    enterAtEnd: boolean;
    /** Dono atual: o slide que sai (ainda animando) não pode zerar os passos do que entrou. */
    owner: number;
    /** Passo vindo da URL, aplicado quando o slide declarar seus passos. */
    pendingStep: number | null;
    clearPendingStep: () => void;
    register: (count: number) => number;
    unregister: (owner: number) => void;
    setStep: (step: number) => void;
    prepareEntry: (atEnd: boolean) => void;
}

let nextOwner = 1;

/** Passo pedido na URL (#/27/3 = terceiro passo do slide 27): vale só para o slide da primeira carga. */
const stepFromHash = (): number | null => {
    if (typeof window === 'undefined') return null;
    const match = window.location.hash.match(/^#\/\d+\/(\d+)$/);
    const n = match ? parseInt(match[1], 10) : NaN;
    return Number.isFinite(n) && n > 1 ? n - 1 : null;
};

export const useSlideStepStore = create<SlideStepState>((set, get) => ({
    step: 0,
    count: 1,
    enterAtEnd: false,
    owner: 0,
    pendingStep: stepFromHash(),
    clearPendingStep: () => set({ pendingStep: null }),
    register: (count) => {
        const owner = nextOwner++;
        // O passo da URL só é liberado depois do ciclo atual: no modo estrito do React o slide monta,
        // desmonta e monta de novo de imediato, e a segunda montagem também precisa enxergá-lo.
        if (get().pendingStep != null) window.setTimeout(() => get().clearPendingStep(), 0);
        set(state => ({
            count,
            owner,
            step: state.pendingStep != null
                ? Math.min(state.pendingStep, count - 1)
                : state.enterAtEnd ? count - 1 : 0,
        }));
        return owner;
    },
    unregister: (owner) => {
        if (get().owner === owner) set({ count: 1, step: 0, owner: 0 });
    },
    setStep: (step) => set(state => ({ step: Math.min(Math.max(step, 0), state.count - 1) })),
    prepareEntry: (atEnd) => set({ enterAtEnd: atEnd, step: 0, count: 1, owner: 0, pendingStep: null }),
}));

export interface SlideSteps {
    step: number;
    count: number;
    setStep: (step: number) => void;
}

/** Declara `count` passos para o slide atual e devolve o passo corrente (0…count-1). */
export const useSlideSteps = (count: number): SlideSteps => {
    const step = useSlideStepStore(s => s.step);
    const setStep = useSlideStepStore(s => s.setStep);
    const register = useSlideStepStore(s => s.register);
    const unregister = useSlideStepStore(s => s.unregister);

    useEffect(() => {
        const owner = register(count);
        return () => unregister(owner);
    }, [count, register, unregister]);

    return { step: Math.min(step, count - 1), count, setStep };
};
