import { lazy, Suspense, type ComponentType, type LazyExoticComponent } from 'react';
import { CollapsibleHtml } from './CollapsibleHtml';

/** Simuladores (src/components/sims) entram sozinhos: [[COMP:NomeDoArquivo]], carregados sob demanda. */
const SIM_LOADERS = import.meta.glob<{ default: ComponentType }>('../sims/*.tsx');
const lazySims = new Map<string, LazyExoticComponent<ComponentType>>();

const resolveComponent = (name: string): ComponentType | null => {
    const loader = SIM_LOADERS[`../sims/${name}.tsx`];
    if (!loader) return null;
    if (!lazySims.has(name)) {
        // Se o pedaço não baixar, esquece o resultado ruim: o "Tentar de novo" refaz o pedido.
        lazySims.set(name, lazy(() => loader().catch(error => {
            lazySims.delete(name);
            throw error;
        })));
    }
    return lazySims.get(name) ?? null;
};

/**
 * Baixa todos os simuladores em segundo plano (um por vez, sem disputar a rede com o slide atual).
 * Depois disso a aula inteira roda mesmo que a conexão caia — o cache offline guarda os arquivos.
 */
export const preloadAllSims = async (): Promise<void> => {
    for (const loader of Object.values(SIM_LOADERS)) {
        try {
            await loader();
        } catch {
            // Sem rede agora: o slide tenta de novo quando for aberto.
        }
        await new Promise(resolve => window.setTimeout(resolve, 120));
    }
};

const COMP_TOKEN = /\[\[COMP:(\w+)\]\]/;
const EMPTY_DIV = /<div[^>]*>\s*<\/div>/g;

interface RenderOptions {
    /** Recolhe o HTML que vem depois do componente interativo. */
    collapseAfter?: boolean;
}

export const renderSlideContent = (content: string, { collapseAfter = false }: RenderOptions = {}) => {
    const match = content.match(COMP_TOKEN);
    if (!match) return <div dangerouslySetInnerHTML={{ __html: content }} />;

    const Comp = resolveComponent(match[1]);
    const [before, after] = content.split(match[0]).map(part => part.replace(EMPTY_DIV, '').trim());
    return (
        <>
            {before && <div dangerouslySetInnerHTML={{ __html: before }} />}
            {Comp && <Suspense fallback={<div className="h-[480px]" />}><Comp /></Suspense>}
            {after && (collapseAfter && Comp ? <CollapsibleHtml html={after} /> : <div dangerouslySetInnerHTML={{ __html: after }} />)}
        </>
    );
};
