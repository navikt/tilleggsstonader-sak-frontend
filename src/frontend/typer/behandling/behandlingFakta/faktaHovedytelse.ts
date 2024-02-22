import { JaNei } from '../../common';

export interface FaktaHovedytelse {
    søknadsgrunnlag?: SøknadsgrunnlagHovedytelse;
}

interface SøknadsgrunnlagHovedytelse {
    hovedytelse: Hovedytelse[];
    boddSammenhengende?: JaNei;
    planleggerBoINorgeNeste12mnd?: JaNei;
}

enum Hovedytelse {
    AAP = 'AAP',
    OVERGANGSSTØNAD = 'OVERGANGSSTØNAD',
    GJENLEVENDEPENSJON = 'GJENLEVENDEPENSJON',
    DAGPENGER = 'DAGPENGER',
    TILTAKSPENGER = 'TILTAKSPENGER',
    KVALIFIKASJONSPROGRAMMET = 'KVALIFIKASJONSPROGRAMMET',
    INTRODUKSJONSPROGRAMMET = 'INTRODUKSJONSPROGRAMMET',
    SYKEPENGER = 'SYKEPENGER',
    UFØRETRYGD = 'UFØRETRYGD',
    INGEN_PENGESTØTTE = 'INGEN_PENGESTØTTE',
}

export const boddSammenhengendeMapping: Record<JaNei, string> = {
    JA: 'Bodd sammenhengende i Norge siste 12 mnd',
    NEI: 'Ikke sammenhengende i Norge siste 12 mnd',
};

export const planleggerBoINorgeNeste12mndMapping: Record<JaNei, string> = {
    JA: 'Planlegger å bo i Norge neste 12 mnd',
    NEI: 'Ikke planlagt å bo i Norge neste 12 mnd',
};
