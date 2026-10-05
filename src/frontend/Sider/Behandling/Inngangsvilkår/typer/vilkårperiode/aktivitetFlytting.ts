import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';

export interface AktivitetFlyttingTso extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetFlyttingTsoFaktaOgVurderinger;
}

export interface AktivitetFlyttingTsoFaktaOgVurderinger {
    '@type': 'AKTIVITET_FLYTTING_TSO';
    lønnet: Vurdering | undefined;
    harUtgifter: Vurdering | undefined;
    erAktivitetenObligatorisk: Vurdering | undefined;
}

export interface AktivitetFlyttingTsoFaktaOgSvar {
    '@type': 'AKTIVITET_FLYTTING_TSO';
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    svarErAktivitetenObligatorisk: SvarJaNei | undefined;
}

export interface AktivitetFlyttingTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetFlyttingTsrFaktaOgVurderinger;
}

export interface AktivitetFlyttingTsrFaktaOgVurderinger {
    '@type': 'AKTIVITET_FLYTTING_TSR';
    lønnet: Vurdering | undefined;
    harUtgifter: Vurdering | undefined;
    erAktivitetenObligatorisk: Vurdering | undefined;
}

export interface AktivitetFlyttingTsrFaktaOgSvar {
    '@type': 'AKTIVITET_FLYTTING_TSR';
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    svarErAktivitetenObligatorisk: SvarJaNei | undefined;
}
