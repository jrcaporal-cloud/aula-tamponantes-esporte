import { BODY_FONT, C } from '../kit/palette';
import type { CardField, PrescriptionCard } from './prescription';
import { CardVisualView } from './PrescriptionVisuals';
import { Chip, FadeSwap, Source } from './ui';

/**
 * Peças dos slides 100 e 101: o cartão que se preenche linha a linha (esquerda)
 * e a explicação da linha atual, com régua/números, selo e fonte (direita).
 */

interface CardSheetProps {
    card: PrescriptionCard;
    step: number;
    onSelect: (i: number) => void;
}

/** O cartão: linhas já passadas ficam escritas; a atual acende; as próximas mostram só o rótulo. */
export const CardSheet = ({ card, step, onSelect }: CardSheetProps) => (
    <div className="flex h-full flex-col">
        <div className="flex flex-col gap-0.5 border-b pb-2" style={{ borderColor: `${card.color}55` }}>
            <span className="font-body text-[24px] font-semibold leading-tight" style={{ ...BODY_FONT, color: card.color }}>{card.compound}</span>
            <span className="font-mono text-[15px] text-gray-300">{card.tagline}</span>
        </div>
        <ol className="m-0 flex flex-1 list-none flex-col justify-between gap-1 p-0 pt-2">
            {card.fields.map((f, i) => {
                const written = i <= step;
                const active = i === step;
                return (
                    <li key={f.tab}>
                        <button type="button" onClick={() => onSelect(i)}
                            className="flex w-full cursor-pointer items-start gap-3 rounded-xl border px-3 py-1 text-left transition-colors"
                            style={{
                                borderColor: active ? `${card.color}aa` : 'rgba(255,255,255,0.06)',
                                background: active ? `${card.color}1f` : 'rgba(255,255,255,0.02)',
                            }}>
                            <span className="mt-[2px] font-mono text-[15px]" style={{ color: written ? card.color : C.muted }}>{i + 1}</span>
                            <span className="flex min-w-0 flex-col">
                                <span className="text-[15px] font-semibold leading-tight text-gray-300">{f.field}</span>
                                <span className="text-[16px] font-semibold leading-snug whitespace-nowrap transition-opacity duration-300"
                                    style={{ color: '#fff', opacity: written ? 1 : 0 }} aria-hidden={!written}>
                                    {f.value}
                                </span>
                            </span>
                        </button>
                    </li>
                );
            })}
        </ol>
    </div>
);

/** A linha atual por dentro: o que os consensos dizem, o número, o selo e a fonte. */
export const FieldDetail = ({ field, color, id }: { field: CardField; color: string; id: string | number }) => (
    <FadeSwap id={id} className="flex h-full flex-col gap-2.5">
        <h3 className="m-0 font-body text-[24px] font-semibold leading-tight text-white text-balance" style={BODY_FONT}>{field.title}</h3>
        <p className="m-0 text-[17px] leading-snug text-gray-100 text-pretty">{field.text}</p>
        <div className="shrink-0"><CardVisualView visual={field.visual} /></div>
        <ul className="m-0 flex list-none flex-col gap-1.5 p-0">
            {field.points.map(p => (
                <li key={p} className="flex gap-2 text-[16px] leading-snug text-gray-200">
                    <span className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: color }} />{p}
                </li>
            ))}
        </ul>
        <div className="mt-auto flex items-center gap-2.5">
            <Chip color={field.sealColor}>{field.seal}</Chip>
            <Source>{field.source}</Source>
        </div>
    </FadeSwap>
);
