/** Nome de um modelo 3D = nome do arquivo em `three/models/` (sem extensão). */
export type Model3D = string;

/** Slides que ganham um visualizador 3D (por id do JSON) e qual modelo cada um abre. */
export const MODEL_3D_BY_SLIDE: ReadonlyMap<number, Model3D> = new Map<number, Model3D>([
    [26, 'fibra-acida'],
    [29, 'fibra-acida'],
    [42, 'jornada-bicarbonato'],
    [46, 'jornada-bicarbonato'],
    [61, 'carnosina'],
    [62, 'carnosina'],
    [64, 'carnosina'],
]);
