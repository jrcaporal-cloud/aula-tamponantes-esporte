import { create } from 'zustand';

/**
 * Estado do "detalhamento" (texto de apoio recolhido do slide). Os slides se registram aqui;
 * o botão fica no rodapé do deck (DeckChrome), fora do fluxo do slide, para não consumir altura.
 */
interface DetailsState {
    /** Quantos blocos recolhíveis o slide atual tem (0 = esconde o botão). */
    available: number;
    open: boolean;
    addAvailable: (delta: number) => void;
    setOpen: (open: boolean) => void;
}

export const useDetailsStore = create<DetailsState>(set => ({
    available: 0,
    open: false,
    addAvailable: delta => set(s => ({ available: Math.max(0, s.available + delta) })),
    setOpen: open => set({ open }),
}));
