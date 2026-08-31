import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';

export interface AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTso extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsoFaktaOgVurderinger;
}

export interface AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsoFaktaOgVurderinger {
    '@type': 'AKTIVITET_STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO';
    lønnet: Vurdering | undefined;
    harUtgifter: Vurdering | undefined;
    erAktivitetenObligatorisk: Vurdering | undefined;
}

export interface AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsoFaktaOgSvar {
    '@type': 'AKTIVITET_STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO';
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    svarErAktivitetenObligatorisk: SvarJaNei | undefined;
}

export interface AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsrFaktaOgVurderinger;
}

export interface AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsrFaktaOgVurderinger {
    '@type': 'AKTIVITET_STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR';
    lønnet: Vurdering | undefined;
    harUtgifter: Vurdering | undefined;
    erAktivitetenObligatorisk: Vurdering | undefined;
}

export interface AktivitetStøtteTilReiseOppstartAvslutningHjemreiseTsrFaktaOgSvar {
    '@type': 'AKTIVITET_STØTTE_TIL_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR';
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    svarErAktivitetenObligatorisk: SvarJaNei | undefined;
}
