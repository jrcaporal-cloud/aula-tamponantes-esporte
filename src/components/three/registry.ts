import { lazy, type ComponentType, type LazyExoticComponent } from 'react';

/** Todo modelo 3D é um modal de tela cheia que devolve o teclado ao fechar. */
export interface Modal3DProps { onClose: () => void }

type ModalModule = { default: ComponentType<Modal3DProps> };

/** Cada arquivo de `models/` é um modelo; o nome do arquivo é o nome usado em MODEL_3D_BY_SLIDE. */
const LOADERS = import.meta.glob<ModalModule>('./models/*.tsx');

const nameOf = (path: string) => path.replace('./models/', '').replace('.tsx', '');

/** Modais preguiçosos, criados uma vez no carregamento do módulo (identidade estável entre renders). */
export const MODALS_3D: Readonly<Record<string, LazyExoticComponent<ComponentType<Modal3DProps>>>> = Object.fromEntries(
    Object.entries(LOADERS).map(([path, load]) => [nameOf(path), lazy(load)]),
);

/** Baixa todos os modelos em segundo plano, um por vez, depois dos simuladores. */
export const preloadAll3D = async (): Promise<void> => {
    for (const load of Object.values(LOADERS)) {
        try {
            await load();
        } catch {
            // Sem rede agora: o modelo tenta de novo quando for aberto.
        }
    }
};

/** Nomes dos modelos existentes (usado pelos testes da aula). */
export const MODEL_NAMES: readonly string[] = Object.keys(LOADERS).map(nameOf);
