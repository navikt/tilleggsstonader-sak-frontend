import { VilkårPeriodeAktivitet, SvarJaNei, Vurdering } from './vilkårperiode';

export interface AktivitetBoutgifter extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetBoutgifterFaktaOgVurderinger;
}

export interface AktivitetBoutgifterFaktaOgVurderinger {
    '@type': 'AKTIVITET_BOUTGIFTER';
    aktivitetsdager: number | undefined;
    lønnet: Vurdering | undefined;
}

export interface AktivitetBoutgifterFaktaOgSvar {
    '@type': 'AKTIVITET_BOUTGIFTER';
    aktivitetsdager: number | undefined;
    svarLønnet: SvarJaNei | undefined;
}
