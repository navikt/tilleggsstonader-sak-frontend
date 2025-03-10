import { VilkårPeriodeAktivitet, SvarJaNei, Vurdering } from './vilkårperiode';

export interface AktivitetBoutgifter extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetBoutgifterFaktaOgVurderinger;
}

export interface AktivitetBoutgifterFaktaOgVurderinger {
    '@type': 'AKTIVITET_BOUTGIFTER';
    lønnet: Vurdering | undefined;
}

export interface AktivitetBoutgifterFaktaOgSvar {
    '@type': 'AKTIVITET_BOUTGIFTER';
    svarLønnet: SvarJaNei | undefined;
}
