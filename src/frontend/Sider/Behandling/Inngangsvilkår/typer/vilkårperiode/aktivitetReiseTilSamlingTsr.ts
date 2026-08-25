import { Aktivitet } from './aktivitet';
import { SvarJaNei, VilkårPeriodeAktivitet, Vurdering } from './vilkårperiode';
import { Kodeverk } from '../../../../../typer/kodeverk';

export interface AktivitetReiseTilSamlingTsr extends VilkårPeriodeAktivitet {
    kildeId?: string;
    tiltaksvariant?: Kodeverk;
    faktaOgVurderinger: AktivitetReiseTilSamlingTsrFaktaOgVurderinger;
}

export const erAktivitetReiseTilSamlingTsr = (
    aktivitet: Aktivitet
): aktivitet is AktivitetReiseTilSamlingTsr =>
    aktivitet.faktaOgVurderinger['@type'] === 'AKTIVITET_REISE_TIL_SAMLING_TSR';

export interface AktivitetReiseTilSamlingTsrFaktaOgVurderinger {
    '@type': 'AKTIVITET_REISE_TIL_SAMLING_TSR';
    lønnet: Vurdering | undefined;
    harUtgifter: Vurdering | undefined;
    erAktivitetenObligatorisk: Vurdering | undefined;
    aktivitetsdager: number | undefined;
}

export interface AktivitetReiseTilSamlingTsrFaktaOgSvar {
    '@type': 'AKTIVITET_REISE_TIL_SAMLING_TSR';
    svarLønnet: SvarJaNei | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
    svarErAktivitetenObligatorisk: SvarJaNei | undefined;
    aktivitetsdager: number | undefined;
}
