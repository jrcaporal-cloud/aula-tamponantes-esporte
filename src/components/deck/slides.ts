import parsedPresentation from '../../data/parsedPresentation.json';
import type { SlideSchema } from '../presentation/TitleSlide';
import { keepsSlide, readTempo } from '../../data/modes';

/** Versão da aula pedida na URL (?tempo=120, 90 ou 60). */
export const TEMPO = readTempo(window.location.search);

export interface DeckSlide {
    slide: SlideSchema;
    /** Seção herdada do último slide que declarou uma (alguns slides vêm sem). */
    section: string;
    /** Título limpo para a visão geral (sem quebras de linha do HTML original). */
    label: string;
}

const clean = (text: string | null | undefined) => (text ?? '').replace(/\s+/g, ' ').trim();

const stripHtml = (html: string) => clean(html.replace(/<[^>]+>/g, ' ').replace(/&quot;|"/g, '"'));

const buildDeck = (raw: SlideSchema[]): DeckSlide[] => {
    let section = '';
    return raw.map(slide => {
        section = clean(slide.sectionName) || section;
        const label = clean(slide.title) || stripHtml(slide.content).slice(0, 60);
        return { slide, section, label };
    });
};

// A seção é herdada na ordem completa; só depois a versão curta esconde slides.
export const DECK: DeckSlide[] = buildDeck(parsedPresentation as unknown as SlideSchema[])
    .filter(item => keepsSlide(TEMPO, item.slide.id));

export { MODEL_3D_BY_SLIDE, type Model3D } from './models3d';

/**
 * Slides em que o fundo de íons fica animado (capa e citações). Nos demais ele
 * congela no último quadro: libera a GPU para os simuladores e gráficos do slide.
 */
export const ANIMATED_BACKGROUND_SLIDES = new Set<number>(
    DECK.flatMap((item, i) => (i === 0 || !item.slide.title.trim() ? [i] : []))
);
