import { VilkårPeriodeAktivitet } from './vilkårperiode';
import { Kodeverk } from '../../../../../typer/kodeverk';

export interface AktivitetReiseTilSamlingTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    tiltaksvariant?: Kodeverk;
    faktaOgVurderinger: AktivitetReiseTilSamlingTsrFaktaOgVurderinger;
}

export interface AktivitetReiseTilSamlingTsrFaktaOgVurderinger {
    '@type': 'AKTIVITET_REISE_TIL_SAMLING_TSR';
}

export interface AktivitetReiseTilSamlingTsrFaktaOgSvar {
    '@type': 'AKTIVITET_REISE_TIL_SAMLING_TSR';
}
