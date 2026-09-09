import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';

export interface AktivitetReiseTilSamlingTso extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetReiseTilSamlingTsoFaktaOgVurderinger;
}

export interface AktivitetReiseTilSamlingTsoFaktaOgVurderinger {
    '@type': 'AKTIVITET_REISE_TIL_SAMLING_TSO';
    lønnet: Vurdering | undefined;
}

export interface AktivitetReiseTilSamlingTsoFaktaOgSvar {
    '@type': 'AKTIVITET_REISE_TIL_SAMLING_TSO';
    svarLønnet: SvarJaNei | undefined;
}
