import { RammeForReiseMedPrivatBilSatsForDelperiode } from '../../../../../typer/vedtak/vedtakDagligReise';

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
    bompengerTotalt: number | undefined;
    fergekostnadTotalt: number | undefined;
    satser: RammeForReiseMedPrivatBilSatsForDelperiode[];
    parkeringskostnadTotalt: number;
    stønadsbeløp: number;
}

export interface FormatertSats {
    fom: string;
    tom: string;
    verdi: string;
}
