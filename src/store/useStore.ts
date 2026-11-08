import { create } from 'zustand';

type StoreState = {
    currentSlide: number;
    /** Um modal (ex.: visualizador 3D) capturou o teclado — a navegação de slides pausa. */
    modalOpen: boolean;
    setSlide: (slide: number) => void;
    setModalOpen: (open: boolean) => void;
};

export const useStore = create<StoreState>((set) => ({
    currentSlide: 0,
    modalOpen: false,
    setSlide: (slide) => set({ currentSlide: slide }),
    setModalOpen: (modalOpen) => set({ modalOpen }),
}));
