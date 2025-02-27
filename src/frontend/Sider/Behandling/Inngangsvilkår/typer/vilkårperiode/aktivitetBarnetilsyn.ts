import { VilkårPeriodeAktivitet, SvarJaNei, Vurdering } from './vilkårperiode';

export interface AktivitetBarnetilsyn extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetBarnetilsynFaktaOgVurderinger;
}

export interface AktivitetBarnetilsynFaktaOgVurderinger {
    '@type': 'AKTIVITET_BARNETILSYN';
    aktivitetsdager: number | undefined;
    lønnet: Vurdering | undefined;
}

export interface AktivitetBarnetilsynFaktaOgSvar {
    '@type': 'AKTIVITET_BARNETILSYN';
    aktivitetsdager: number | undefined;
    svarLønnet: SvarJaNei | undefined;
}
