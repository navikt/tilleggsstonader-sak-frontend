import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';

export interface AktivitetReiseOppstartAvslutningHjemreiseTso extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgVurderinger;
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgVurderinger {
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO';
    lønnet: Vurdering | undefined;
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgSvar {
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO';
    svarLønnet: SvarJaNei | undefined;
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgVurderinger;
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgVurderinger {
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR';
}

export interface AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgSvar {
    '@type': 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR';
}
