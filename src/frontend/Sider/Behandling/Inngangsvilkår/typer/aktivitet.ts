import { VilkårPeriode, Vurdering } from './vilkårperiode';
import { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';

export type Aktivitet = AktivitetBarnetilsyn | AktivitetLæremidler;
export type AktivitetNyttFormat = AktivitetBarnetilsynNyttFormat | AktivitetLæremidlerNyttFormat;

export interface AktivitetBarnetilsyn extends VilkårPeriode {
    id: string;
    type: AktivitetType;
    aktivitetsdager: number;
    delvilkår: DelvilkårAktivitetBarnetilsyn;
    kildeId?: string;
}
export interface AktivitetBarnetilsynNyttFormat extends VilkårPeriode {
    id: string;
    type: AktivitetType;
    faktaOgVurderinger: FaktaOgVurderingerBarnetilsyn;
    kildeId?: string;
}

export type DelvilkårAktivitet = DelvilkårAktivitetBarnetilsyn | DelvilkårAktivitetLæremidler;

export interface DelvilkårAktivitetBarnetilsyn {
    lønnet?: Vurdering;
}

export type FaktaAktivitet = FaktaBarnetilsyn | FaktaLæremidler;

export type FaktaOgDelvilkår = FaktaOgVurderingerBarnetilsyn | FaktaOgVurderingerLæremidler;

export interface FaktaBarnetilsyn {
    aktivitetsdager?: number;
}

export interface FaktaOgVurderingerBarnetilsyn {
    '@type': 'AKTIVITET'; // TODO: Flytt til useLagre-hook (som ikke fins enda)
    fakta: FaktaBarnetilsyn;
    vurderinger: DelvilkårAktivitetBarnetilsyn;
}

export interface AktivitetLæremidler extends VilkårPeriode {
    id: string;
    type: AktivitetType.TILTAK | AktivitetType.UTDANNING | AktivitetType.INGEN_AKTIVITET;
    prosent: number;
    delvilkår: DelvilkårAktivitetLæremidler;
    kildeId?: string;
}
export interface AktivitetLæremidlerNyttFormat extends VilkårPeriode {
    id: string;
    type: AktivitetType.TILTAK | AktivitetType.UTDANNING | AktivitetType.INGEN_AKTIVITET;
    faktaOgVurderinger: FaktaOgVurderingerLæremidler;
    kildeId?: string;
}

export interface DelvilkårAktivitetLæremidler {
    harUtgifter?: Vurdering;
}

export interface FaktaOgVurderingerLæremidler {
    '@type': 'AKTIVITET'; // TODO: Flytt til useLagre-hook (som ikke fins enda)
    fakta: FaktaLæremidler;
    vurderinger: DelvilkårAktivitetLæremidler;
}

export interface FaktaLæremidler {
    prosent?: number;
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

export const mapTilAktivitetBarnetilsynNy = (
    aktivitet?: AktivitetBarnetilsyn
): AktivitetBarnetilsynNyttFormat | undefined => {
    if (!aktivitet) {
        return undefined;
    }
    return {
        ...aktivitet,
        faktaOgVurderinger: {
            '@type': 'AKTIVITET',
            fakta: {
                aktivitetsdager: aktivitet.aktivitetsdager,
            },
            vurderinger: aktivitet.delvilkår,
        },
    };
};

export const mapTilAktivitetLæremidlerNy = (
    aktivitet?: AktivitetLæremidler
): AktivitetLæremidlerNyttFormat | undefined => {
    if (!aktivitet) {
        return undefined;
    }

    return {
        ...aktivitet,
        faktaOgVurderinger: {
            '@type': 'AKTIVITET',
            fakta: {
                prosent: aktivitet.prosent,
            },
            vurderinger: aktivitet.delvilkår,
        },
    };
};

// Function to map AktivitetLæremidlerNy to AktivitetLæremidler
export const mapAktivitetLæremidlerNyToLæremidler = (
    aktivitetNy?: AktivitetLæremidlerNyttFormat
): AktivitetLæremidler | undefined => {
    if (!aktivitetNy) {
        return undefined;
    }

    return {
        ...aktivitetNy,
        prosent: aktivitetNy.faktaOgVurderinger.fakta.prosent || 0,
        delvilkår: aktivitetNy.faktaOgVurderinger.vurderinger,
    };
};

// Function to map AktivitetBarnetilsynNy to AktivitetBarnetilsyn
export const mapAktivitetBarnetilsynNyToBarnetilsyn = (
    aktivitetNy?: AktivitetBarnetilsynNyttFormat
): AktivitetBarnetilsyn | undefined => {
    if (!aktivitetNy) {
        return undefined;
    }
    return {
        ...aktivitetNy,
        aktivitetsdager: aktivitetNy.faktaOgVurderinger.fakta.aktivitetsdager || 0,
        delvilkår: aktivitetNy.faktaOgVurderinger.vurderinger,
    };
};
