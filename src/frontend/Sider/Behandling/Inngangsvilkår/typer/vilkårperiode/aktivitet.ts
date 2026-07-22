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
    AktivitetPassAvBarn,
    AktivitetPassAvBarnFaktaOgSvar,
    AktivitetPassAvBarnFaktaOgVurderinger,
} from './aktivitetPassAvBarn';
import {
    AktivitetReiseTilSamlingTso,
    AktivitetReiseTilSamlingTsoFaktaOgSvar,
    AktivitetReiseTilSamlingTsoFaktaOgVurderinger,
} from './aktivitetReiseTilSamlingTso';

export type Aktivitet =
    | AktivitetPassAvBarn
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
    | AktivitetPassAvBarnFaktaOgVurderinger
    | AktivitetLæremidlerFaktaOgVurderinger
    | AktivitetBoutgifterFaktaOgVurderinger
    | AktivitetDagligReiseTsoFaktaOgVurderinger
    | AktivitetDagligReiseTsrFaktaOgVurderinger
    | AktivitetReiseTilSamlingTsoFaktaOgVurderinger;

export type AktivitetFaktaOgSvar =
    | AktivitetPassAvBarnFaktaOgSvar
    | AktivitetLæremidlerFaktaOgSvar
    | AktivitetBoutgifterFaktaOgSvar
    | AktivitetDagligReiseTsoFaktaOgSvar
    | AktivitetDagligReiseTsrFaktaOgSvar
    | AktivitetReiseTilSamlingTsoFaktaOgSvar;
