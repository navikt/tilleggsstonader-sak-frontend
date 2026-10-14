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
    AktivitetReiseOppstartAvslutningHjemreiseTso,
    AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgSvar,
    AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgVurderinger,
    AktivitetReiseOppstartAvslutningHjemreiseTsr,
    AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgSvar,
    AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgVurderinger,
} from './aktivitetReiseOppstartAvslutningHjemreise';
import {
    AktivitetReiseTilSamlingTso,
    AktivitetReiseTilSamlingTsoFaktaOgSvar,
    AktivitetReiseTilSamlingTsoFaktaOgVurderinger,
} from './aktivitetReiseTilSamlingTso';
import {
    AktivitetReiseTilSamlingTsr,
    AktivitetReiseTilSamlingTsrFaktaOgSvar,
    AktivitetReiseTilSamlingTsrFaktaOgVurderinger,
} from './aktivitetReiseTilSamlingTsr';

export type Aktivitet =
    | AktivitetPassAvBarn
    | AktivitetLæremidler
    | AktivitetBoutgifter
    | AktivitetDagligReiseTso
    | AktivitetDagligReiseTsr
    | AktivitetReiseTilSamlingTso
    | AktivitetReiseTilSamlingTsr
    | AktivitetReiseOppstartAvslutningHjemreiseTso
    | AktivitetReiseOppstartAvslutningHjemreiseTsr;

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
    | AktivitetReiseTilSamlingTsoFaktaOgVurderinger
    | AktivitetReiseTilSamlingTsrFaktaOgVurderinger
    | AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgVurderinger
    | AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgVurderinger;

export type AktivitetFaktaOgSvar =
    | AktivitetPassAvBarnFaktaOgSvar
    | AktivitetLæremidlerFaktaOgSvar
    | AktivitetBoutgifterFaktaOgSvar
    | AktivitetDagligReiseTsoFaktaOgSvar
    | AktivitetDagligReiseTsrFaktaOgSvar
    | AktivitetReiseTilSamlingTsoFaktaOgSvar
    | AktivitetReiseTilSamlingTsrFaktaOgSvar
    | AktivitetReiseOppstartAvslutningHjemreiseTsoFaktaOgSvar
    | AktivitetReiseOppstartAvslutningHjemreiseTsrFaktaOgSvar;

export const erAktivitetPassAvBarn = (
    aktivitet: Aktivitet | undefined
): aktivitet is AktivitetPassAvBarn =>
    aktivitet?.faktaOgVurderinger['@type'] === 'AKTIVITET_BARNETILSYN';

export const erAktivitetLæremidler = (
    aktivitet: Aktivitet | undefined
): aktivitet is AktivitetLæremidler =>
    aktivitet?.faktaOgVurderinger['@type'] === 'AKTIVITET_LÆREMIDLER';

export const erAktivitetBoutgifter = (
    aktivitet: Aktivitet | undefined
): aktivitet is AktivitetBoutgifter =>
    aktivitet?.faktaOgVurderinger['@type'] === 'AKTIVITET_BOUTGIFTER';

export const erAktivitetDagligReiseTso = (
    aktivitet: Aktivitet | undefined
): aktivitet is AktivitetDagligReiseTso =>
    aktivitet?.faktaOgVurderinger['@type'] === 'AKTIVITET_DAGLIG_REISE_TSO';

export const erAktivitetDagligReiseTsr = (
    aktivitet: Aktivitet | undefined
): aktivitet is AktivitetDagligReiseTsr =>
    aktivitet?.faktaOgVurderinger['@type'] === 'AKTIVITET_DAGLIG_REISE_TSR';

export const erAktivitetReiseTilSamlingTso = (
    aktivitet: Aktivitet | undefined
): aktivitet is AktivitetReiseTilSamlingTso =>
    aktivitet?.faktaOgVurderinger['@type'] === 'AKTIVITET_REISE_TIL_SAMLING_TSO';

export const erAktivitetReiseTilSamlingTsr = (
    aktivitet: Aktivitet | undefined
): aktivitet is AktivitetReiseTilSamlingTsr =>
    aktivitet?.faktaOgVurderinger['@type'] === 'AKTIVITET_REISE_TIL_SAMLING_TSR';

export const erAktivitetReiseOppstartAvslutningHjemreiseTso = (
    aktivitet: Aktivitet | undefined
): aktivitet is AktivitetReiseOppstartAvslutningHjemreiseTso =>
    aktivitet?.faktaOgVurderinger['@type'] === 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSO';

export const erAktivitetReiseOppstartAvslutningHjemreiseTsr = (
    aktivitet: Aktivitet | undefined
): aktivitet is AktivitetReiseOppstartAvslutningHjemreiseTsr =>
    aktivitet?.faktaOgVurderinger['@type'] === 'AKTIVITET_REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR';
