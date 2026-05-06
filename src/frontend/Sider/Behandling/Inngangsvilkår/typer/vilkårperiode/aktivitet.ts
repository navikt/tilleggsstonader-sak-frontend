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
import {
    AktivitetReiseTilSamlingTso,
    AktivitetReiseTilSamlingTsoFaktaOgSvar,
    AktivitetReiseTilSamlingTsoFaktaOgVurderinger,
} from './aktivitetReiseTilSamlingTso';

export type Aktivitet =
    | AktivitetBarnetilsyn
    | AktivitetLæremidler
    | AktivitetBoutgifter
    | AktivitetDagligReiseTso
    | AktivitetDagligReiseTsr
    | AktivitetReiseTilSamlingTso;

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
    | AktivitetDagligReiseTsrFaktaOgVurderinger
    | AktivitetReiseTilSamlingTsoFaktaOgVurderinger;

export type AktivitetFaktaOgSvar =
    | AktivitetBarnetilsynFaktaOgSvar
    | AktivitetLæremidlerFaktaOgSvar
    | AktivitetBoutgifterFaktaOgSvar
    | AktivitetDagligReiseTsoFaktaOgSvar
    | AktivitetDagligReiseTsrFaktaOgSvar
    | AktivitetReiseTilSamlingTsoFaktaOgSvar;
