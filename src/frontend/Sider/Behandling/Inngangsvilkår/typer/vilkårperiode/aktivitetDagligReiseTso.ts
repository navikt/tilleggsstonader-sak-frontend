import { Aktivitet } from './aktivitet';
import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';

export interface AktivitetDagligReiseTso extends VilkårPeriodeAktivitet {
    kildeId?: string;
    faktaOgVurderinger: AktivitetDagligReiseTsoFaktaOgVurderinger;
}

export const erAktivitetDagligReiseTso = (
    aktivitet: Aktivitet
): aktivitet is AktivitetDagligReiseTso =>
    aktivitet.faktaOgVurderinger['@type'] === 'AKTIVITET_DAGLIG_REISE_TSO';

export interface AktivitetDagligReiseTsoFaktaOgVurderinger {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSO';
    lønnet: Vurdering | undefined;
    harUtgifter: Vurdering | undefined;
    aktivitetsdager: number | undefined;
}

export interface AktivitetDagligReiseTsoFaktaOgSvar {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSO';
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    aktivitetsdager: number | undefined;
}
