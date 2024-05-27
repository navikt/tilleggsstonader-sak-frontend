type EksternlenkeKey = 'efSakUrl' | 'baSakUrl' | 'ksSakUrl' | 'aInntekt' | 'gosys' | 'modia';
export type Eksternlenker = {
    [key in EksternlenkeKey]: string;
};
