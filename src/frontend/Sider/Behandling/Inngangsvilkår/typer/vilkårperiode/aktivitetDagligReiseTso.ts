import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';

export interface AktivitetDagligReiseTso extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetDagligReiseTsoFaktaOgVurderinger;
}

export interface AktivitetDagligReiseTsoFaktaOgVurderinger {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSO';
    lønnet: Vurdering | undefined;
}

export interface AktivitetDagligReiseTsoFaktaOgSvar {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSO';
    svarLønnet: SvarJaNei | undefined;
}
