import { AktivitetType } from './aktivitet';
import { SvarJaNei, VilkårPeriode, Vurdering } from './vilkårperiode';

export interface AktivitetLæremidler extends VilkårPeriode {
    id: string;
    type: AktivitetTypeLæremidler;
    kildeId?: string;
    faktaOgVurderinger: AktivitetLæremidlerFaktaOgVurderinger;
}

export type AktivitetTypeLæremidler =
    | AktivitetType.TILTAK
    | AktivitetType.UTDANNING
    | AktivitetType.INGEN_AKTIVITET;

export interface AktivitetLæremidlerFaktaOgVurderinger {
    '@type': 'AKTIVITET_LÆREMIDLER';
    prosent: number | undefined;
    harUtgifter: Vurdering | undefined;
}

export interface AktivitetLæremidlerFaktaOgSvar {
    '@type': 'AKTIVITET_LÆREMIDLER';
    prosent: number | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
}
