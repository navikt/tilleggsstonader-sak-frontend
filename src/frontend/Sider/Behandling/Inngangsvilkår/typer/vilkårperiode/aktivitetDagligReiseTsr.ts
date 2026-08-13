import { Aktivitet } from './aktivitet';
import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';
import { Kodeverk } from '../../../../../typer/kodeverk';

export interface AktivitetDagligReiseTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    tiltaksvariant?: Kodeverk;
    faktaOgVurderinger: AktivitetDagligReiseTsrFaktaOgVurderinger;
}

export const erAktivitetDagligReiseTsr = (
    aktivitet: Aktivitet
): aktivitet is AktivitetDagligReiseTsr =>
    aktivitet.faktaOgVurderinger['@type'] === 'AKTIVITET_DAGLIG_REISE_TSR';

export interface AktivitetDagligReiseTsrFaktaOgVurderinger {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSR';
    harUtgifter: Vurdering | undefined;
    aktivitetsdager: number | undefined;
}

export interface AktivitetDagligReiseTsrFaktaOgSvar {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSR';
    svarHarUtgifter: SvarJaNei | undefined;
    aktivitetsdager: number | undefined;
}
