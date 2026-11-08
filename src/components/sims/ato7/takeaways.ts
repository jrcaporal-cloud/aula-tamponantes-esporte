import { C } from '../kit/palette';

/** Slide 96 — O que Levar para Segunda-feira. Cinco mensagens, cada uma com o número que a sustenta. */

export interface Takeaway {
    title: string;
    text: string;
    figure: string;
    figureLabel: string;
    color: string;
    source: string;
    /** O número sobe de zero quando a mensagem abre (só onde contar faz sentido: ES e porcentagens). */
    countUp?: boolean;
}

export const TAKEAWAYS: readonly Takeaway[] = [
    {
        title: 'O prêmio é pequeno e tem endereço',
        text: 'Esforços intensos de 30 s a ~12 min. Não força máxima, não sprint de 10 s.',
        figure: 'ES 0,17', figureLabel: 'bicarbonato, 189 artigos', color: C.base, countUp: true,
        source: 'de Oliveira 2022; Saunders 2017 (β-alanina, ES 0,18)',
    },
    {
        title: 'Bicarbonato é de horas; β-alanina, de semanas',
        text: 'Um vai horas antes da prova; a outra enche a carnosina em semanas. Trocar a lógica é erro de prescrição.',
        figure: '≥ 4 sem', figureLabel: 'carga mínima de β-alanina', color: C.carno,
        source: 'AIS 2025; Harris 2006; Hill 2007',
    },
    {
        title: 'A dose é a mesma; o paciente, não',
        text: 'Diurético, rim, idade e compulsão mudam a cor do semáforo antes de qualquer meta-análise.',
        figure: '20 g/d', figureLabel: 'virou pH 7,61 num rim doente', color: C.risk,
        source: 'Diaconu 2022; BiCARB 2020; Han 2022',
    },
    {
        title: 'Intestino e relógio antes do pódio',
        text: 'O horário do pico é individual e o GI pode anular o ganho. Teste no treino, nunca na final.',
        figure: '1 de 23', figureLabel: 'no pico aos 60 min', color: C.lactate,
        source: 'Boegman 2020; Kahle 2013 (diarreia em 10 de 11); Saunders 2014',
    },
    {
        title: 'Regra e produto também são evidência',
        text: 'IN 28, Código Mundial e o pote contaminado entram na decisão; a justificativa vai ao prontuário.',
        figure: '14,8–38%', figureLabel: 'suplementos contaminados', color: C.acid, countUp: true,
        source: 'IN 28; WADA 2026; Geyer 2004; Duiven 2021; CFN 656',
    },
];
