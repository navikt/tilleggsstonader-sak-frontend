import { VilkårPeriodeAktivitet } from './vilkårperiode';
import { Kodeverk } from '../../../../../typer/kodeverk';

export interface AktivitetDagligReiseTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    typeAktivitet?: Kodeverk;
    faktaOgVurderinger: AktivitetDagligReiseTsrFaktaOgVurderinger;
}

export interface AktivitetDagligReiseTsrFaktaOgVurderinger {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSR';
}

export interface AktivitetDagligReiseTsrFaktaOgSvar {
    '@type': 'AKTIVITET_DAGLIG_REISE_TSR';
}
