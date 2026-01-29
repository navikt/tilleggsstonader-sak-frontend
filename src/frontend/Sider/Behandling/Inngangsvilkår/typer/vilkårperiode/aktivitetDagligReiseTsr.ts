import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';
import { Kodeverk } from '../../../../../typer/kodeverk';

export interface AktivitetDagligReiseTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    typeAktivitet?: Kodeverk;
    faktaOgVurderinger: AktivitetDagligReiseTsrFaktaOgVurderinger;
}

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
