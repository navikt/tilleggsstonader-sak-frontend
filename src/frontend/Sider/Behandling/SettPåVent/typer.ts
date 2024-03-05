export interface SettPåVent {
    årsaker: ÅrsakSettPåVent[];
    frist?: string;
    kommentar?: string;
    oppgaveVersjon?: number;
}

export interface StatusSettPåVent {
    årsaker: ÅrsakSettPåVent[];
    frist?: string;
    oppgaveVersjon: number;
    oppgaveBeskrivelse?: string;
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
