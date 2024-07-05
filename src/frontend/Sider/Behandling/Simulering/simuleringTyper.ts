export interface SimuleringResponse {
    perioder: OppsummeringForPeriode[];
    oppsummering: SimuleringOppsummering;
}

export interface SimuleringOppsummering {
    fom: string;
    tom: string;
    etterbetaling: number;
    feilutbetaling: number;
    nesteUtbetaling: null;
}

export interface OppsummeringForPeriode {
    fom: string;
    tom: string;
    tidligereUtbetalt: number;
    nyUtbetaling: number;
    totalEtterbetaling: number;
    totalFeilutbetaling: number;
}
