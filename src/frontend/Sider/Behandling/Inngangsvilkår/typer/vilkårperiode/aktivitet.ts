import {
    AktivitetBarnetilsyn,
    AktivitetBarnetilsynFaktaOgSvar,
    AktivitetBarnetilsynFaktaOgVurderinger,
} from './aktivitetBarnetilsyn';
import {
    AktivitetBoutgifter,
    AktivitetBoutgifterFaktaOgSvar,
    AktivitetBoutgifterFaktaOgVurderinger,
} from './aktivitetBoutgifter';
import {
    AktivitetDagligReiseTso,
    AktivitetDagligReiseTsoFaktaOgSvar,
    AktivitetDagligReiseTsoFaktaOgVurderinger,
} from './aktivitetDagligReiseTso';
import {
    AktivitetDagligReiseTsr,
    AktivitetDagligReiseTsrFaktaOgSvar,
    AktivitetDagligReiseTsrFaktaOgVurderinger,
} from './aktivitetDagligReiseTsr';
import {
    AktivitetLæremidler,
    AktivitetLæremidlerFaktaOgSvar,
    AktivitetLæremidlerFaktaOgVurderinger,
} from './aktivitetLæremidler';

export type Aktivitet =
    | AktivitetBarnetilsyn
    | AktivitetLæremidler
    | AktivitetBoutgifter
    | AktivitetDagligReiseTso
    | AktivitetDagligReiseTsr;

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
    INGEN_AKTIVITET: 'Ingen relevant aktivitet',
};

export type AktivitetFaktaOgVurderinger =
    | AktivitetBarnetilsynFaktaOgVurderinger
    | AktivitetLæremidlerFaktaOgVurderinger
    | AktivitetBoutgifterFaktaOgVurderinger
    | AktivitetDagligReiseTsoFaktaOgVurderinger
    | AktivitetDagligReiseTsrFaktaOgVurderinger;

export type AktivitetFaktaOgSvar =
    | AktivitetBarnetilsynFaktaOgSvar
    | AktivitetLæremidlerFaktaOgSvar
    | AktivitetBoutgifterFaktaOgSvar
    | AktivitetDagligReiseTsoFaktaOgSvar
    | AktivitetDagligReiseTsrFaktaOgSvar;
