import { Suspense } from 'react';
import { MODALS_3D, MODEL_NAMES } from '../three/registry';

/** Bancada de teste: `?model=nome` abre só aquele modelo 3D (fechar recarrega a bancada). */
export const ModelHarness = ({ name }: { name: string }) => {
    const Modal = MODALS_3D[name];
    if (!Modal) {
        return (
            <div className="p-10 text-white font-mono text-sm">
                Modelo “{name}” não encontrado. Disponíveis: {MODEL_NAMES.join(', ') || 'nenhum'}
            </div>
        );
    }
    return (
        <Suspense fallback={null}>
            <Modal onClose={() => window.location.reload()} />
        </Suspense>
    );
};
