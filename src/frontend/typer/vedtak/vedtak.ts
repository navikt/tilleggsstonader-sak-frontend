import { VedtakLæremidler } from './vedtakLæremidler';
import { VedtakBarnetilsyn } from './vedtakTilsynBarn';

export type VedtakResponse = VedtakBarnetilsyn | VedtakLæremidler;

export enum TypeVedtak {
    INNVILGELSE = 'INNVILGELSE',
    AVSLAG = 'AVSLAG',
    OPPHØR = 'OPPHØR',
}

export enum ÅrsakAvslag {
    INGEN_AKTIVITET = 'INGEN_AKTIVITET',
    IKKE_I_MÅLGRUPPE = 'IKKE_I_MÅLGRUPPE',
    INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE = 'INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE',
    MANGELFULL_DOKUMENTASJON = 'MANGELFULL_DOKUMENTASJON',
    ANNET = 'ANNET',
}

export const årsakAvslagTilTekst: Record<ÅrsakAvslag, string> = {
    INGEN_AKTIVITET: 'Ingen aktivitet',
    IKKE_I_MÅLGRUPPE: 'Ingen målgruppe',
    INGEN_OVERLAPP_AKTIVITET_MÅLGRUPPE: 'Ingen overlapp aktivitet/målgruppe',
    MANGELFULL_DOKUMENTASJON: 'Mangelfull dokumentasjon',
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
