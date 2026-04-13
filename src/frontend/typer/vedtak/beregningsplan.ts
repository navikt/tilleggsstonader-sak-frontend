export enum BeregningsplanOmfang {
    ALLE_PERIODER = 'ALLE_PERIODER',
    FRA_DATO = 'FRA_DATO',
    GJENBRUK_FORRIGE_RESULTAT = 'GJENBRUK_FORRIGE_RESULTAT',
}

type BeregningsplanAllePerioder = {
    omfang: BeregningsplanOmfang.ALLE_PERIODER;
};

type BeregningsplanFraDato = {
    omfang: BeregningsplanOmfang.FRA_DATO;
    fraDato: string;
};

type BeregningsplanGjenbrukForrigeResultat = {
    omfang: BeregningsplanOmfang.GJENBRUK_FORRIGE_RESULTAT;
};

export type Beregningsplan =
    | BeregningsplanAllePerioder
    | BeregningsplanFraDato
    | BeregningsplanGjenbrukForrigeResultat;
