/** Passos do slide 62 "Encher o Tanque Leva Semanas". Cada passo traz um cenário pronto para o gráfico. */

export interface LoadingStep {
    tab: string;
    kicker: string;
    title: string;
    text: string;
    takeaway: string;
    dose: number;
    weeks: number;
    /** Curva de comparação (g/dia), mesma duração. */
    compare: number | null;
    washout: boolean;
    /** Mostra o quadro "de cada 100 g, ~3 g viram carnosina". */
    showYield: boolean;
}

export const LOADING_STEPS: readonly LoadingStep[] = [
    {
        tab: '4 semanas',
        kicker: 'Harris 2006',
        title: 'Quatro semanas enchem só um terço do tanque',
        text: 'Com 3,2 e 6,4 g/dia por 4 semanas, a carnosina do vasto lateral subiu 42% e 64%. Parece muito. Mas o que manda é a dose acumulada: 179 g ainda ficam longe do teto do modelo.',
        takeaway: 'Diferente da creatina, a carnosina não satura em dias.',
        dose: 6.4, weeks: 4, compare: 3.2, washout: false, showYield: false,
    },
    {
        tab: '10 semanas',
        kicker: 'Hill 2007 · Rezende 2020',
        title: 'A curva sobe devagar e não satura',
        text: 'Hill 2007: +58,8% em 4 semanas e +80,1% em 10. No modelo de Rezende, metade do teto (ED50) só chega com 377 g acumulados, ou ~59 dias a 6,4 g/dia. E 99,3% das pessoas respondem em carnosina.',
        takeaway: '"Não respondedor" de carnosina praticamente não existe; o que varia é o desempenho.',
        dose: 6.4, weeks: 10, compare: null, washout: false, showYield: false,
    },
    {
        tab: 'Só 3% fica',
        kicker: 'Stegen 2013',
        title: 'De cada 100 g engolidos, ~3 g viram carnosina',
        text: 'Quase tudo é retido no corpo, mas o resto é provavelmente oxidado. Junto com a refeição, a carga no sóleo foi maior: +64% contra +41% tomando entre as refeições.',
        takeaway: 'Tomar com a comida é o ajuste mais barato do protocolo.',
        dose: 6.4, weeks: 4, compare: null, washout: false, showYield: true,
    },
    {
        tab: 'Teto brasileiro',
        kicker: 'IN 28 · Anvisa',
        title: 'No Brasil, o rótulo para em 2 g/dia',
        text: 'A IN 28 limita a β-alanina a 2 g/dia, em tomadas de até 300 mg a cada 2 h. Para somar os 179 g da mediana de Hobson são ~90 dias; a 6,4 g/dia, 28. Nenhum ensaio testou esse esquema de tomadas.',
        takeaway: 'A regra brasileira não muda a fisiologia: muda o relógio.',
        dose: 2, weeks: 13, compare: 6.4, washout: false, showYield: false,
    },
    {
        tab: 'Parar',
        kicker: 'Stellingwerff 2012 · Baguet 2009',
        title: 'Ao parar, o tanque esvazia devagar',
        text: 'A carnosina cai ~2% por semana e volta à linha de base em 6 a 15 semanas, mais tarde em quem subiu mais. Não há carnosinase dentro da fibra para acelerar a saída.',
        takeaway: 'Consequência: estudo cruzado com β-alanina exige meses de intervalo.',
        dose: 6.4, weeks: 10, compare: null, washout: true, showYield: false,
    },
];
