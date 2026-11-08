import { useCallback, useEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Pause, Play, RotateCcw } from 'lucide-react';
import { DECK } from './slides';
import { NOTES } from '../../data/notes';
import { PRESENTER_CHANNEL, type PresenterCommand, type PresenterMessage } from './presenterChannel';

const NOTES_KEY = 'aula-tamponantes:notas';

const loadNotes = (): Record<string, string> => {
    try {
        return JSON.parse(window.localStorage.getItem(NOTES_KEY) ?? '{}') as Record<string, string>;
    } catch {
        return {};
    }
};

const saveNotes = (notes: Record<string, string>) => {
    try {
        window.localStorage.setItem(NOTES_KEY, JSON.stringify(notes));
    } catch {
        // Navegador sem armazenamento (aba anônima): as notas valem só nesta sessão.
    }
};

const formatClock = (ms: number) => {
    const total = Math.floor(ms / 1000);
    const h = Math.floor(total / 3600);
    const m = Math.floor((total % 3600) / 60);
    const s = total % 60;
    const mm = String(m).padStart(2, '0');
    const ss = String(s).padStart(2, '0');
    return h > 0 ? `${h}:${mm}:${ss}` : `${mm}:${ss}`;
};

const useStopwatch = () => {
    const [elapsed, setElapsed] = useState(0);
    const [running, setRunning] = useState(true);
    const startRef = useRef(0);
    const baseRef = useRef(0);

    useEffect(() => {
        if (!running) return;
        startRef.current = performance.now();
        const id = window.setInterval(() => setElapsed(baseRef.current + performance.now() - startRef.current), 500);
        return () => {
            baseRef.current += performance.now() - startRef.current;
            window.clearInterval(id);
        };
    }, [running]);

    const reset = () => {
        baseRef.current = 0;
        startRef.current = performance.now();
        setElapsed(0);
    };
    return { elapsed, running, toggle: () => setRunning(r => !r), reset };
};

/** Minutos previstos até o início de cada slide (soma dos tempos-alvo das notas). */
const PLANNED_START: number[] = DECK.reduce<number[]>((acc, _item, i) => {
    const before = i === 0 ? 0 : acc[i - 1] + (NOTES[DECK[i - 1].slide.id]?.minutos ?? 3);
    return [...acc, before];
}, []);
const PLANNED_TOTAL = PLANNED_START.length
    ? PLANNED_START[PLANNED_START.length - 1] + (NOTES[DECK[DECK.length - 1].slide.id]?.minutos ?? 3)
    : 0;

const PaceBadge = ({ index, elapsedMs }: { index: number; elapsedMs: number }) => {
    const planned = PLANNED_START[index] ?? 0;
    const diff = Math.round(elapsedMs / 60000 - planned);
    const onTime = Math.abs(diff) <= 1;
    const label = onTime ? 'No ritmo' : diff > 0 ? `${diff} min atrasado` : `${-diff} min adiantado`;
    return (
        <span className={`text-sm font-mono px-3 py-1 rounded-full border ${onTime ? 'border-emerald-400/40 text-emerald-300' : diff > 0 ? 'border-amber-400/50 text-amber-300' : 'border-sky-400/40 text-sky-300'}`}>
            {label} · previsto {planned} de {PLANNED_TOTAL} min
        </span>
    );
};

const NoteCard = ({ slideId }: { slideId: number }) => {
    const note = NOTES[slideId];
    if (!note) return null;
    return (
        <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5 flex flex-col gap-3 text-lg leading-snug">
            <p><span className="text-[12px] uppercase tracking-[0.2em] text-brand-accent mr-2">Mensagem</span><span className="text-gray-100">{note.mensagem}</span></p>
            {note.pergunta && <p><span className="text-[12px] uppercase tracking-[0.2em] text-amber-300 mr-2">Pergunte</span><span className="text-gray-100">{note.pergunta}</span></p>}
            {note.transicao && <p><span className="text-[12px] uppercase tracking-[0.2em] text-sky-300 mr-2">Transição</span><span className="text-gray-100">{note.transicao}</span></p>}
            <p className="text-sm text-gray-400">Meta deste slide: {note.minutos} min</p>
        </div>
    );
};

const SlideCard = ({ index, label, dim }: { index: number; label: string; dim?: boolean }) => {
    const item = DECK[index];
    if (!item) {
        return (
            <div className="rounded-2xl border border-white/10 bg-white/[0.02] p-6 text-gray-500">Fim da aula</div>
        );
    }
    return (
        <div className={`rounded-2xl border p-6 ${dim ? 'border-white/10 bg-white/[0.02]' : 'border-brand-accent/50 bg-brand-deep/15'}`}>
            <p className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-2">{label} · {String(index + 1).padStart(2, '0')} · {item.section || 'Abertura'}</p>
            <p className={`font-display font-semibold leading-tight ${dim ? 'text-2xl text-gray-300' : 'text-4xl text-white'}`}>{item.label}</p>
        </div>
    );
};

/**
 * Janela do apresentador (abra com P na aula). Mostra slide atual e próximo,
 * passo dentro do slide, cronômetro, relógio e anotações por slide.
 */
export const Presenter = () => {
    const channelRef = useRef<BroadcastChannel | null>(null);
    const [index, setIndex] = useState(0);
    const [step, setStep] = useState(0);
    const [stepCount, setStepCount] = useState(1);
    const [board, setBoard] = useState<string | null>(null);
    const [connected, setConnected] = useState(false);
    const [notes, setNotes] = useState(loadNotes);
    const [now, setNow] = useState(() => new Date());
    const stopwatch = useStopwatch();

    const send = useCallback((msg: PresenterCommand) => channelRef.current?.postMessage(msg), []);

    useEffect(() => {
        const channel = new BroadcastChannel(PRESENTER_CHANNEL);
        channelRef.current = channel;
        channel.onmessage = (e: MessageEvent<PresenterMessage>) => {
            if (e.data.type !== 'state') return;
            setConnected(true);
            setIndex(e.data.index);
            setStep(e.data.step);
            setStepCount(e.data.stepCount);
            setBoard(e.data.board ?? null);
        };
        channel.postMessage({ type: 'hello' } satisfies PresenterCommand);
        return () => channel.close();
    }, []);

    useEffect(() => {
        const id = window.setInterval(() => setNow(new Date()), 1000);
        return () => window.clearInterval(id);
    }, []);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.target instanceof HTMLTextAreaElement) return;
            if (['ArrowRight', 'PageDown', ' '].includes(e.key)) { e.preventDefault(); send({ type: 'next' }); }
            if (['ArrowLeft', 'PageUp'].includes(e.key)) { e.preventDefault(); send({ type: 'prev' }); }
        };
        window.addEventListener('keydown', onKey);
        return () => window.removeEventListener('keydown', onKey);
    }, [send]);

    const slideKey = String(DECK[index]?.slide.id ?? index);
    const updateNote = (text: string) => {
        const next = { ...notes, [slideKey]: text };
        setNotes(next);
        saveNotes(next);
    };

    return (
        <div className="absolute inset-0 z-20 bg-[#05050d] text-white font-body overflow-hidden flex flex-col">
            <header className="flex items-center justify-between px-8 py-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                    <span className={`w-2.5 h-2.5 rounded-full ${connected ? 'bg-emerald-400 shadow-[0_0_10px_#34d399]' : 'bg-amber-400 animate-pulse'}`} />
                    <span className="text-sm text-gray-300">
                        {connected ? 'Conectado à janela da aula' : 'Aguardando a janela da aula… (deixe-a aberta no projetor)'}
                    </span>
                </div>
                <div className="flex items-center gap-8 font-mono tabular-nums">
                    <div className="flex items-center gap-3">
                        <span className="text-4xl">{formatClock(stopwatch.elapsed)}</span>
                        <button type="button" onClick={stopwatch.toggle} aria-label={stopwatch.running ? 'Pausar cronômetro' : 'Retomar cronômetro'}
                            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15">
                            {stopwatch.running ? <Pause size={16} /> : <Play size={16} />}
                        </button>
                        <button type="button" onClick={stopwatch.reset} aria-label="Zerar cronômetro"
                            className="w-9 h-9 rounded-full flex items-center justify-center bg-white/5 hover:bg-white/15">
                            <RotateCcw size={16} />
                        </button>
                    </div>
                    <span className="text-2xl text-gray-400">{now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
                </div>
            </header>

            <main className="flex-1 grid grid-cols-[1.4fr_1fr] gap-6 p-8 min-h-0">
                <section className="flex flex-col gap-5 min-h-0">
                    {board && (
                        <p className="m-0 rounded-2xl border border-amber-300/50 bg-amber-300/10 px-5 py-3 text-lg text-amber-100">
                            <b className="font-semibold">{board}</b> na tela do projetor · → segue para o próximo ato, ← fecha
                        </p>
                    )}
                    <SlideCard index={index} label="Agora" />
                    <PaceBadge index={index} elapsedMs={stopwatch.elapsed} />
                    <NoteCard slideId={DECK[index]?.slide.id ?? -1} />
                    {stepCount > 1 && (
                        <div className="flex items-center gap-3 text-sm text-gray-300">
                            <span>Passo {step + 1} de {stepCount}</span>
                            <div className="flex gap-1.5">
                                {Array.from({ length: stepCount }, (_, i) => (
                                    <span key={i} className={`h-2 rounded-full ${i === step ? 'w-6 bg-brand-accent' : i < step ? 'w-2 bg-brand-accent/60' : 'w-2 bg-white/20'}`} />
                                ))}
                            </div>
                        </div>
                    )}
                    <label className="flex-1 flex flex-col min-h-[7rem]">
                        <span className="text-[11px] uppercase tracking-[0.25em] text-gray-400 mb-2">Minhas anotações extras (salvas só neste navegador)</span>
                        <textarea
                            value={notes[slideKey] ?? ''}
                            onChange={e => updateNote(e.target.value)}
                            placeholder="Escreva aqui o que quer lembrar de falar neste slide…"
                            className="flex-1 min-h-0 resize-none rounded-2xl bg-white/[0.03] border border-white/10 focus:border-brand-accent/60 outline-none p-5 text-xl leading-relaxed text-gray-100 placeholder:text-gray-600"
                        />
                    </label>
                </section>

                <section className="flex flex-col gap-5">
                    <SlideCard index={index + 1} label="Próximo" dim />
                    {DECK[index + 1] && NOTES[DECK[index + 1].slide.id] && (
                        <p className="text-base text-gray-400 leading-snug">{NOTES[DECK[index + 1].slide.id].mensagem}</p>
                    )}
                    <div className="mt-auto grid grid-cols-2 gap-4">
                        <button type="button" onClick={() => send({ type: 'prev' })}
                            className="h-24 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/10 flex items-center justify-center gap-2 text-lg">
                            <ChevronLeft /> Voltar
                        </button>
                        <button type="button" onClick={() => send({ type: 'next' })}
                            className="h-24 rounded-2xl bg-brand-deep/40 hover:bg-brand-deep/60 border border-brand-accent/50 flex items-center justify-center gap-2 text-lg">
                            Avançar <ChevronRight />
                        </button>
                    </div>
                    <p className="text-xs text-gray-500">O passador e as setas funcionam nesta janela também.</p>
                </section>
            </main>
        </div>
    );
};
