import { VilkårPeriodeAktivitet } from './vilkårperiode';

export interface AktivitetDagligReiseTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetDagligReiseTsrFaktaOgVurderinger;
}

export interface AktivitetDagligReiseTsrFaktaOgVurderinger {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSR';
}

export interface AktivitetDagligReiseTsrFaktaOgSvar {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSR';
}
