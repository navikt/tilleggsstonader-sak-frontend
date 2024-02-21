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
