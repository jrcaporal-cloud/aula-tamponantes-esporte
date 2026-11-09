import { useEffect, type ComponentType } from 'react';
import { FitStage, PAD_X_SELF, SLIDE_WIDTH } from './FitStage';
import { ProseSlide } from '../presentation/ProseSlide';
import { useSlideStepStore } from '../../store/useSlideSteps';

type SimModule = { default: ComponentType };
const SIMS = import.meta.glob<SimModule>('../sims/*.tsx');

// A bancada mostra um único simulador por carregamento de página (vem da URL).
const requested = new URLSearchParams(window.location.search).get('sim') ?? '';
const params = new URLSearchParams(window.location.search);
const requestedLoader = SIMS[`../sims/${requested}.tsx`];
/** Slide de teste: o simulador entra no mesmo ProseSlide da aula, com título e subtítulo de tamanho real. */
const HARNESS_SLIDE = {
    id: -1, sectionName: '', number: '', layout: 'prose', cards: [],
    title: params.get('titulo') ?? 'Título de teste com tamanho real',
    subtitle: params.get('sub') ?? 'Subtítulo de teste, ocupando uma linha como nos slides da aula',
    content: `[[COMP:${requested}]]`,
};

/**
 * Bancada de teste: `?sim=NomeDoArquivo` renderiza só aquele simulador,
 * no mesmo palco escalado da aula, com ←/→ percorrendo os passos.
 */
export const SimHarness = ({ name }: { name: string }) => {
    const step = useSlideStepStore(s => s.step);
    const count = useSlideStepStore(s => s.count);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            const { step: current, count: total, setStep } = useSlideStepStore.getState();
            if (['ArrowRight', 'PageDown', ' '].includes(e.key) && current < total - 1) setStep(current + 1);
            if (['ArrowLeft', 'PageUp'].includes(e.key) && current > 0) setStep(current - 1);
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, []);

    if (!requestedLoader) {
        return (
            <div className="p-10 text-white font-mono text-sm">
                Simulador “{name}” não encontrado. Disponíveis: {Object.keys(SIMS).map(k => k.replace('../sims/', '').replace('.tsx', '')).join(', ')}
            </div>
        );
    }

    return (
        <div className="absolute inset-0 z-10">
            <FitStage width={SLIDE_WIDTH} padX={PAD_X_SELF}>
                <ProseSlide slide={HARNESS_SLIDE} />
            </FitStage>
            <div data-testid="sim-step" className="absolute bottom-4 right-4 font-mono text-xs text-gray-400">
                passo {step + 1}/{count}
            </div>
        </div>
    );
};
