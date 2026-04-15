import { RammeForReiseMedPrivatBilSatsForDelperiode } from '../../../../typer/vedtak/vedtakDagligReise';

export interface PrivatBilOppsummertBeregning {
    reiser: OppsummertBeregningForReise[];
}

export interface OppsummertBeregningForReise {
    reiseId: string;
    reiseavstandEnVei: number;
    aktivitetsadresse: string | undefined;
    perioder: OppsummertBeregningForPeriode[];
    totaltStønadsbeløp: number;
}

export interface OppsummertBeregningForPeriode {
    fom: string;
    tom: string;
    ukenummer: number;
    antallGodkjenteReisedager: number;
    bompengerPerDag: number | undefined;
    fergekostnadPerDag: number | undefined;
    satser: RammeForReiseMedPrivatBilSatsForDelperiode[];
    totalParkeringskostnad: number;
    stønadsbeløp: number;
}

export interface FormatertSats {
    fom: string;
    tom: string;
    verdi: string;
}
