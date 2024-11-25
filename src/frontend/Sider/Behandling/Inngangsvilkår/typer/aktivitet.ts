import { SvarJaNei, VilkårPeriode, Vurdering } from './vilkårperiode';
import { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';

export type Aktivitet = AktivitetBarnetilsyn | AktivitetLæremidler;

export interface AktivitetBarnetilsyn extends VilkårPeriode {
    id: string;
    type: AktivitetType;
    aktivitetsdager: number;
    delvilkår: DelvilkårAktivitetBarnetilsyn;
    kildeId?: string;
}

export type DelvilkårAktivitet = DelvilkårAktivitetBarnetilsyn | DelvilkårAktivitetLæremidler;

export interface DelvilkårAktivitetBarnetilsyn {
    '@type': 'AKTIVITET';
    lønnet?: Vurdering;
}

export interface AktivitetLæremidler extends VilkårPeriode {
    id: string;
    type: AktivitetType.TILTAK | AktivitetType.UTDANNING | AktivitetType.INGEN_AKTIVITET;
    prosent: number;
    delvilkår: DelvilkårAktivitetLæremidler;
    kildeId?: string;
}

export interface DelvilkårAktivitetLæremidler {
    '@type': 'AKTIVITET';
    harUtgifter?: Vurdering;
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

export interface FaktaOgVurderingerAktivitetBarnetilsyn {
    '@type': 'AKTIVITET_BARNETILSYN';
    aktivitetsdager: number | undefined;
    svarLønnet: SvarJaNei | undefined;
}

export interface FaktaOgVurderingerAktivitetLæremidler {
    '@type': 'AKTIVITET_LÆREMIDLER';
    prosent: number | undefined;
    svarHarUtgifter: SvarJaNei | undefined;
}
