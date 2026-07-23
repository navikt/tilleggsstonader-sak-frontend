import { VilkårPeriodeAktivitet, SvarJaNei, Vurdering } from './vilkårperiode';

export interface AktivitetPassAvBarn extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetPassAvBarnFaktaOgVurderinger;
}

export interface AktivitetPassAvBarnFaktaOgVurderinger {
    '@type': 'AKTIVITET_BARNETILSYN';
    aktivitetsdager: number | undefined;
    lønnet: Vurdering | undefined;
}

export interface AktivitetPassAvBarnFaktaOgSvar {
    '@type': 'AKTIVITET_BARNETILSYN';
    aktivitetsdager: number | undefined;
    svarLønnet: SvarJaNei | undefined;
}
