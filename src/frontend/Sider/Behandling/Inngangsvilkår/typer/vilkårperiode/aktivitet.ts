import {
    AktivitetBarnetilsyn,
    AktivitetBarnetilsynFaktaOgSvar,
    AktivitetBarnetilsynFaktaOgVurderinger,
} from './aktivitetBarnetilsyn';
import { SvarJaNei, VilkårPeriode, Vurdering } from './vilkårperiode';
import { SelectOption } from '../../../../../komponenter/Skjema/SelectMedOptions';

export type Aktivitet = AktivitetBarnetilsyn | AktivitetLæremidler;

export interface AktivitetLæremidler extends VilkårPeriode {
    id: string;
    type: AktivitetType.TILTAK | AktivitetType.UTDANNING | AktivitetType.INGEN_AKTIVITET;
    kildeId?: string;
    faktaOgVurderinger: AktivitetLæremidlerFaktaOgVurderinger;
}

export enum AktivitetType {
    TILTAK = 'TILTAK',
    UTDANNING = 'UTDANNING',
    REELL_ARBEIDSSØKER = 'REELL_ARBEIDSSØKER',
    INGEN_AKTIVITET = 'INGEN_AKTIVITET',
}

export const AktivitetTypeTilTekst: Record<AktivitetType, string> = {
    TILTAK: 'Tiltak',
    UTDANNING: 'Utdanning',
    REELL_ARBEIDSSØKER: 'Reell arbeidssøker',
    INGEN_AKTIVITET: 'Ingen aktivitet',
};

export const aktivitetTypeTilTekst = (type: AktivitetType | '') => {
    if (type === '') return type;

    return AktivitetTypeTilTekst[type];
};

export const aktivitetTypeOptions: SelectOption[] = Object.entries(AktivitetTypeTilTekst).map(
    ([value, label]) => ({
        value: value,
        label: label,
    })
);

export const aktivitetTypeOptionsForStønadsperiode = aktivitetTypeOptions.filter(
    (option) => option.value !== AktivitetType.INGEN_AKTIVITET
);

export type AktivitetFaktaOgVurderinger =
    | AktivitetBarnetilsynFaktaOgVurderinger
    | AktivitetLæremidlerFaktaOgVurderinger;

export interface AktivitetLæremidlerFaktaOgVurderinger {
    '@type': 'AKTIVITET_LÆREMIDLER';
    prosent: number | undefined;
    harUtgifter: Vurdering | undefined;
}

export type AktivitetFaktaOgSvar = AktivitetBarnetilsynFaktaOgSvar | AktivitetLæremidlerFaktaOgSvar;

export interface AktivitetLæremidlerFaktaOgSvar {
    '@type': 'AKTIVITET_LÆREMIDLER';
    prosent: number | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
}
