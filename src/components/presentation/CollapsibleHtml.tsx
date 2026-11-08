import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { useDetailsToggle } from '../../lib/detailsEvent';
import { useDetailsStore } from '../../lib/detailsStore';

/** Texto que vem depois de um simulador, recolhido; abre pela tecla D ou pelo botão do rodapé. */
export const CollapsibleHtml = ({ html }: { html: string }) => {
    const [open, setOpen] = useState(false);
    useDetailsToggle(() => setOpen(o => !o));

    useEffect(() => {
        const { addAvailable } = useDetailsStore.getState();
        addAvailable(1);
        return () => addAvailable(-1);
    }, []);
    useEffect(() => {
        useDetailsStore.getState().setOpen(open);
    }, [open]);

    return (
        <div className="mt-6 flex flex-col items-center not-prose">
            <AnimatePresence initial={false}>
                {open && (
                    <motion.div
                        key="text"
                        initial={{ opacity: 0, y: -8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, transition: { duration: 0.15 } }}
                        className="w-full prose prose-invert max-w-none mt-4"
                        dangerouslySetInnerHTML={{ __html: html }}
                    />
                )}
            </AnimatePresence>
        </div>
    );
};
