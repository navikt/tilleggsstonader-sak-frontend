import { VedtakBoutgifter } from './vedtakBoutgifter';
import { VedtakDagligReise } from './vedtakDagligReise';
import { VedtakLæremidler } from './vedtakLæremidler';
import { VedtakBarnetilsyn } from './vedtakTilsynBarn';
import { Stønadstype } from '../behandling/behandlingTema';

export type VedtakResponse =
    | VedtakBarnetilsyn
    | VedtakLæremidler
    | VedtakBoutgifter
    | VedtakDagligReise;

export enum TypeVedtak {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
    OPPHØR = 'OPPHØR',
}

export const typeVedtakTilTekst: Record<TypeVedtak, string> = {
    INNVILGELSE: 'Innvilgelse',
    AVSLAG: 'Avslag',
    OPPHØR: 'Opphør',
};

export enum ÅrsakAvslag {
    INGEN_AKTIVITET = 'INGEN_AKTIVITET',
    IKKE_I_MÅLGRUPPE = 'IKKE_I_MÅLGRUPPE',
    INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE = 'INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE',
    MANGELFULL_DOKUMENTASJON = 'MANGELFULL_DOKUMENTASJON',
    HAR_IKKE_UTGIFTER = 'HAR_IKKE_UTGIFTER',
    RETT_TIL_UTSTYRSSTIPEND = 'RETT_TIL_UTSTYRSSTIPEND',
    HAR_IKKE_MERUTGIFTER = 'HAR_IKKE_MERUTGIFTER',
    RETT_TIL_BOSTØTTE = 'RETT_TIL_BOSTØTTE',
    REISEAVSTAND_UNDER_6_KM = 'REISEAVSTAND_UNDER_6_KM',
    LØNN_I_TILTAK = 'LØNN_I_TILTAK',
    ANNET = 'ANNET',
}
export const årsakAvslagTilTekst: Record<ÅrsakAvslag, string> = {
    INGEN_AKTIVITET: 'Ingen relevant aktivitet',
    IKKE_I_MÅLGRUPPE: 'Ingen målgruppe',
    INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE: 'Ingen overlapp aktivitet/målgruppe',
    MANGELFULL_DOKUMENTASJON: 'Mangelfull dokumentasjon',
    HAR_IKKE_UTGIFTER: 'Har ikke utgifter',
    RETT_TIL_UTSTYRSSTIPEND: 'Rett til utstyrsstipend',
    HAR_IKKE_MERUTGIFTER: 'Har ikke nødvendige merutgifter',
    RETT_TIL_BOSTØTTE: 'Rett til/mottar bostøtte',
    REISEAVSTAND_UNDER_6_KM: 'Reiseavstand er under 6 km',
    LØNN_I_TILTAK: 'Lønn i tiltak',
    ANNET: 'Annet',
};

export enum ÅrsakOpphør {
    ENDRING_AKTIVITET = 'ENDRING_AKTIVITET',
    ENDRING_MÅLGRUPPE = 'ENDRING_MÅLGRUPPE',
    ENDRING_UTGIFTER = 'ENDRING_UTGIFTER',
    ANNET = 'ANNET',
}

export const årsakOpphørTilTekst: Record<ÅrsakOpphør, string> = {
    ENDRING_AKTIVITET: 'Avbrudd/stans av aktivitet',
    ENDRING_MÅLGRUPPE: 'Opphør/ikke lenger i målgruppe',
    ENDRING_UTGIFTER: 'Ikke lenger utgifter til pass av barn',
    ANNET: 'Annet',
};

/**
 * Map av stønadstype og hvilke årsaker som skal vises for gitt stønad
 * Alle årsaker må definieres om det skal med for gitt stønad
 */
const årsaker: Record<Stønadstype, Record<ÅrsakAvslag, boolean>> = {
    [Stønadstype.BARNETILSYN]: {
        INGEN_AKTIVITET: true,
        IKKE_I_MÅLGRUPPE: true,
        INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE: true,
        MANGELFULL_DOKUMENTASJON: true,
        HAR_IKKE_UTGIFTER: false,
        RETT_TIL_UTSTYRSSTIPEND: false,
        HAR_IKKE_MERUTGIFTER: false,
        RETT_TIL_BOSTØTTE: false,
        REISEAVSTAND_UNDER_6_KM: false,
        LØNN_I_TILTAK: true,
        ANNET: true,
    },
    [Stønadstype.LÆREMIDLER]: {
        INGEN_AKTIVITET: true,
        IKKE_I_MÅLGRUPPE: true,
        INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE: true,
        MANGELFULL_DOKUMENTASJON: false,
        HAR_IKKE_UTGIFTER: true,
        RETT_TIL_UTSTYRSSTIPEND: true,
        HAR_IKKE_MERUTGIFTER: false,
        RETT_TIL_BOSTØTTE: false,
        REISEAVSTAND_UNDER_6_KM: false,
        LØNN_I_TILTAK: false,
        ANNET: true,
    },
    [Stønadstype.BOUTGIFTER]: {
        INGEN_AKTIVITET: true,
        IKKE_I_MÅLGRUPPE: true,
        INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE: true,
        MANGELFULL_DOKUMENTASJON: true,
        HAR_IKKE_UTGIFTER: false,
        RETT_TIL_UTSTYRSSTIPEND: false,
        HAR_IKKE_MERUTGIFTER: true,
        RETT_TIL_BOSTØTTE: true,
        REISEAVSTAND_UNDER_6_KM: false,
        LØNN_I_TILTAK: true,
        ANNET: true,
    },
    [Stønadstype.DAGLIG_REISE_TSO]: {
        INGEN_AKTIVITET: true,
        IKKE_I_MÅLGRUPPE: true,
        INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE: true,
        MANGELFULL_DOKUMENTASJON: true,
        HAR_IKKE_UTGIFTER: false,
        RETT_TIL_UTSTYRSSTIPEND: false,
        HAR_IKKE_MERUTGIFTER: false,
        RETT_TIL_BOSTØTTE: false,
        REISEAVSTAND_UNDER_6_KM: true,
        LØNN_I_TILTAK: true,
        ANNET: true,
    },
    [Stønadstype.DAGLIG_REISE_TSR]: {
        INGEN_AKTIVITET: true,
        IKKE_I_MÅLGRUPPE: true,
        INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE: true,
        MANGELFULL_DOKUMENTASJON: true,
        HAR_IKKE_UTGIFTER: false,
        RETT_TIL_UTSTYRSSTIPEND: false,
        HAR_IKKE_MERUTGIFTER: false,
        RETT_TIL_BOSTØTTE: false,
        REISEAVSTAND_UNDER_6_KM: true,
        LØNN_I_TILTAK: false,
        ANNET: true,
    },
};

export const årsakerForStønad: Record<Stønadstype, ÅrsakAvslag[]> = Object.entries(årsaker).reduce(
    (prev, [stønadstype, årsaker]) => {
        prev[stønadstype as Stønadstype] = Object.entries(årsaker)
            .filter(([, skalMed]) => skalMed)
            .map(([årsak]) => årsak) as ÅrsakAvslag[];
        return prev;
    },
    {} as Record<Stønadstype, ÅrsakAvslag[]>
);
