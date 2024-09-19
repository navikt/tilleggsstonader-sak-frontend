export interface SimuleringResponse {
    perioder: OppsummeringForPeriode[] | null;
    ingenEndringIUtbetaling: boolean;
    oppsummering: SimuleringOppsummering | null;
}

export interface SimuleringOppsummering {
    fom: string;
    tom: string;
    etterbetaling: number;
    feilutbetaling: number;
}

export interface OppsummeringForPeriode {
    fom: string;
    tom: string;
    tidligereUtbetalt: number;
    nyUtbetaling: number;
    totalEtterbetaling: number;
    totalFeilutbetaling: number;
}
