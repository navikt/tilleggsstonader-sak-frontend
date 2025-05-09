export type SettPåVentContext = 'sak' | 'klage';
export type SettPåVentBehandlingStatus = 'SATT_PÅ_VENT' | 'ANNET';

export interface SettPåVent {
    årsaker: ÅrsakSettPåVent[];
    kommentar?: string;
    frist?: string;
    oppgaveVersjon?: number;
}

export type SettPåVentRequest = SettPåVent & { beholdOppgave: boolean };

export interface StatusSettPåVent {
    årsaker: ÅrsakSettPåVent[];
    datoSattPåVent: string;
    opprettetAv: string;
    endretAv?: string;
    endretTid?: string;
    kommentar?: string;
    frist?: string;
    oppgaveVersjon: number;
}

export interface SettPåVentError extends Omit<SettPåVent, 'årsaker'> {
    årsaker: string;
}

export enum ÅrsakSettPåVent {
    DOKUMENTASJON_FRA_BRUKER = 'DOKUMENTASJON_FRA_BRUKER',
    REGISTRERING_AV_TILTAK = 'REGISTRERING_AV_TILTAK',
    VURDERING_AV_NEDSATT_ARBEIDSEVNE = 'VURDERING_AV_NEDSATT_ARBEIDSEVNE',
    ADRESSE_TIL_TILTAKSARRANGØR = 'ADRESSE_TIL_TILTAKSARRANGØR',
    ANTALL_DAGER_PÅ_TILTAK = 'ANTALL_DAGER_PÅ_TILTAK',
    RETTIGHET_TIL_OVERGANGSSTØNAD = 'RETTIGHET_TIL_OVERGANGSSTØNAD',
    REGISTRERING_AV_UTDANNING = 'REGISTRERING_AV_UTDANNING',
    ANNET = 'ANNET',
}

export const årsakTilTekst: Record<ÅrsakSettPåVent, string> = {
    DOKUMENTASJON_FRA_BRUKER: 'Dokumentasjon fra bruker',
    REGISTRERING_AV_TILTAK: 'Registrering av tiltak',
    VURDERING_AV_NEDSATT_ARBEIDSEVNE: 'Vurdering av nedsatt arbeidsevne',
    ADRESSE_TIL_TILTAKSARRANGØR: 'Adresse til tiltaksarrangør',
    ANTALL_DAGER_PÅ_TILTAK: 'Antall dager på tiltak',
    RETTIGHET_TIL_OVERGANGSSTØNAD: 'Rettighet til overgangsstønad',
    REGISTRERING_AV_UTDANNING: 'Registrering av utdanning',
    ANNET: 'Annet',
};

const årsaker: Record<SettPåVentContext, Record<ÅrsakSettPåVent, boolean>> = {
    sak: {
        [ÅrsakSettPåVent.DOKUMENTASJON_FRA_BRUKER]: true,
        [ÅrsakSettPåVent.REGISTRERING_AV_TILTAK]: true,
        [ÅrsakSettPåVent.VURDERING_AV_NEDSATT_ARBEIDSEVNE]: true,
        [ÅrsakSettPåVent.ADRESSE_TIL_TILTAKSARRANGØR]: true,
        [ÅrsakSettPåVent.ANTALL_DAGER_PÅ_TILTAK]: true,
        [ÅrsakSettPåVent.RETTIGHET_TIL_OVERGANGSSTØNAD]: true,
        [ÅrsakSettPåVent.REGISTRERING_AV_UTDANNING]: true,
        [ÅrsakSettPåVent.ANNET]: true,
    },
    klage: {
        [ÅrsakSettPåVent.DOKUMENTASJON_FRA_BRUKER]: true,
        [ÅrsakSettPåVent.REGISTRERING_AV_TILTAK]: true,
        [ÅrsakSettPåVent.VURDERING_AV_NEDSATT_ARBEIDSEVNE]: true,
        [ÅrsakSettPåVent.ADRESSE_TIL_TILTAKSARRANGØR]: false,
        [ÅrsakSettPåVent.ANTALL_DAGER_PÅ_TILTAK]: false,
        [ÅrsakSettPåVent.RETTIGHET_TIL_OVERGANGSSTØNAD]: false,
        [ÅrsakSettPåVent.REGISTRERING_AV_UTDANNING]: true,
        [ÅrsakSettPåVent.ANNET]: true,
    },
};

export const årsakerForContext: Record<SettPåVentContext, ÅrsakSettPåVent[]> = Object.entries(
    årsaker
).reduce(
    (prev, [context, årsaker]) => {
        prev[context as SettPåVentContext] = Object.entries(årsaker)
            .filter(([, skalMed]) => skalMed)
            .map(([årsak]) => årsak) as ÅrsakSettPåVent[];
        return prev;
    },
    {} as Record<SettPåVentContext, ÅrsakSettPåVent[]>
);

const EN_UKE = 7;
const TRE_UKER = 21;
export const årsakTilFrist: Record<ÅrsakSettPåVent, number | undefined> = {
    DOKUMENTASJON_FRA_BRUKER: TRE_UKER,
    REGISTRERING_AV_TILTAK: EN_UKE,
    VURDERING_AV_NEDSATT_ARBEIDSEVNE: EN_UKE,
    ADRESSE_TIL_TILTAKSARRANGØR: TRE_UKER,
    ANTALL_DAGER_PÅ_TILTAK: EN_UKE,
    RETTIGHET_TIL_OVERGANGSSTØNAD: EN_UKE,
    REGISTRERING_AV_UTDANNING: EN_UKE,
    ANNET: undefined,
};

export const alleÅrsaker = Object.keys(ÅrsakSettPåVent) as ÅrsakSettPåVent[];

/**
 * Combobox bruker verdier. Denne kan brukes for å mappe tilbake verdiene til enum-verdiet
 */
export const tekstTilÅrsak: Record<string, ÅrsakSettPåVent> = Object.fromEntries(
    Object.entries(årsakTilTekst).map((e) => e.reverse())
) as Record<string, ÅrsakSettPåVent>;
