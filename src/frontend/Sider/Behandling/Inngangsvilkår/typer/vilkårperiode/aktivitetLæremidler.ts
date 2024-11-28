import { AktivitetType } from './aktivitet';
import { SvarJaNei, VilkårPeriode, Vurdering } from './vilkårperiode';

export interface AktivitetLæremidler extends VilkårPeriode {
    id: string;
    type: AktivitetType.TILTAK | AktivitetType.UTDANNING | AktivitetType.INGEN_AKTIVITET;
    kildeId?: string;
    faktaOgVurderinger: AktivitetLæremidlerFaktaOgVurderinger;
}

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
