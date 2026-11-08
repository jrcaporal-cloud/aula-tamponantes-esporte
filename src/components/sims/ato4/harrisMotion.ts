/** Medidas e entrada animada comuns aos quadros do slide "O Homem da Creatina". */

/** viewBox dos quadros: 1 unidade = 1 px de projeto (painel esquerdo de 600 px menos o respiro). */
export const HARRIS_VB = { w: 568, h: 372 } as const;

/** Fade de entrada com atraso (zerado com movimento reduzido). */
export const delayed = (reduce: boolean, delay: number, duration = 0.35) => ({
    initial: reduce ? false as const : { opacity: 0 },
    animate: { opacity: 1 },
    transition: { duration: reduce ? 0 : duration, delay: reduce ? 0 : delay },
});
