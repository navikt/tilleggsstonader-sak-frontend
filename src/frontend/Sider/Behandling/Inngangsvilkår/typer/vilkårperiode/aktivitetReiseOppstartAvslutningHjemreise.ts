import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';

export interface AktivitetReiseOppstartAvslutningHjemreiseTso extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgVurderinger;
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgVurderinger {
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO';
    lønnet: Vurdering | undefined;
    harUtgifter: Vurdering | undefined;
    erAktivitetenObligatorisk: Vurdering | undefined;
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgSvar {
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO';
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    svarErAktivitetenObligatorisk: SvarJaNei | undefined;
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgVurderinger;
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgVurderinger {
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR';
    lønnet: Vurdering | undefined;
    harUtgifter: Vurdering | undefined;
    erAktivitetenObligatorisk: Vurdering | undefined;
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgSvar {
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR';
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    svarErAktivitetenObligatorisk: SvarJaNei | undefined;
}
