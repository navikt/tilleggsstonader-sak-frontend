import { JaNei } from '../../common';

export interface FaktaHovedytelse {
    søknadsgrunnlag?: SøknadsgrunnlagHovedytelse;
}

interface SøknadsgrunnlagHovedytelse {
    hovedytelse: Hovedytelse[];
    arbeidOgOpphold?: FaktaArbeidOgOpphold;
    harNedsattArbeidsevne?: JaNei;
}

/**
 * Denne burde ha liknende verdier som Ytelse i søknad
 */
enum Hovedytelse {
    AAP = 'AAP',
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    GJENLEVENDEPENSJON = 'GJENLEVENDEPENSJON',
    UFØRETRYGD = 'UFØRETRYGD',
    TILTAKSPENGER = 'TILTAKSPENGER',
    DAGPENGER = 'DAGPENGER',
    SYKEPENGER = 'SYKEPENGER',
    KVALIFISERINGSSTØNAD = 'KVALIFISERINGSSTØNAD',
    INGEN_PENGESTØTTE = 'INGEN_PENGESTØTTE',
    INGEN_PASSENDE_ALTERNATIVER = 'INGEN_PASSENDE_ALTERNATIVER',
}

export interface FaktaArbeidOgOpphold {
    jobberIAnnetLand?: JaNei;
    jobbAnnetLand?: string;
    harPengestøtteAnnetLand?: TypePengestøtte[];
    pengestøtteAnnetLand?: string;
    harOppholdUtenforNorgeSiste12mnd?: JaNei;
    oppholdUtenforNorgeSiste12mnd: FaktaOppholdUtenforNorge[];
    harOppholdUtenforNorgeNeste12mnd?: JaNei;
    oppholdUtenforNorgeNeste12mnd: FaktaOppholdUtenforNorge[];
}

enum TypePengestøtte {
    SYKEPENGER = 'SYKEPENGER',
    PENSJON = 'PENSJON',
    ANNEN_PENGESTØTTE = 'ANNEN_PENGESTØTTE',
    MOTTAR_IKKE = 'MOTTAR_IKKE',
}

export interface FaktaOppholdUtenforNorge {
    land: string;
    årsak: ÅrsakOppholdUtenforNorge[];
    fom: string;
    tom: string;
}

enum ÅrsakOppholdUtenforNorge {
    JOBB = 'JOBB',
    STUDIER = 'STUDIER',
    MEDISINSK_BEHANDLING = 'MEDISINSK_BEHANDLING',
    FERIE = 'FERIE',
    FAMILIE_BESØK = 'FAMILIE_BESØK',
    ANNET = 'ANNET',
}

export const hovedytelseTilTekst: Record<Hovedytelse, string> = {
    AAP: 'Arbeidsavklaringspenger (AAP)',
    OVERGANGSSTØNAD: 'Enslig forsørger',
    GJENLEVENDEPENSJON: 'Gjenlevendepensjon / etterlattepensjon / omstillingsstønad',
    UFØRETRYGD: 'Uføretrygd',
    TILTAKSPENGER: 'Tiltakspenger',
    DAGPENGER: 'Dagpenger',
    SYKEPENGER: 'Sykepenger',
    KVALIFISERINGSSTØNAD: 'Kvalifiseringsstønad',
    INGEN_PENGESTØTTE: 'Mottar ingen pengestøtte, men har nedsatt arbeidsevne',
    INGEN_PASSENDE_ALTERNATIVER: 'Ingen av alternativene passer for meg',
};

export const typePengestøtteTilTekst: Record<TypePengestøtte, string> = {
    ANNEN_PENGESTØTTE: 'Annen pengestøtte',
    MOTTAR_IKKE: 'Mottar ikke',
    PENSJON: 'Pensjon',
    SYKEPENGER: 'Sykepenger',
};

export const årsakOppholdUtenforNorgeTilTekst: Record<ÅrsakOppholdUtenforNorge, string> = {
    ANNET: 'Annet',
    FAMILIE_BESØK: 'Familiebesøk',
    FERIE: 'Ferie',
    JOBB: 'Jobb',
    MEDISINSK_BEHANDLING: 'Medisinsk behandling',
    STUDIER: 'Studier',
};
