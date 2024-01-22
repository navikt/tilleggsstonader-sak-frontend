import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { MålgruppeType } from '../typer/målgruppe';

export type MålgrupperMedMedlemskapsvurdering =
    | MålgruppeType.NEDSATT_ARBEIDSEVNE
    | MålgruppeType.OMSTILLINGSSTØNAD;

export const svarJaMappingMedlemskap: Record<MålgrupperMedMedlemskapsvurdering, string> = {
    NEDSATT_ARBEIDSEVNE: 'Ja',
    OMSTILLINGSSTØNAD: 'Ja (vurdert etter første ledd)',
};

export const svarNeiMappingMedlemskap: Record<MålgrupperMedMedlemskapsvurdering, string> = {
    NEDSATT_ARBEIDSEVNE: 'Nei',
    OMSTILLINGSSTØNAD: 'Nei (vurdert etter andre ledd)',
};

export const nyMålgruppe: EndreMålgruppeForm = {
    type: '',
    fom: '',
    tom: '',
    delvilkår: { '@type': 'MÅLGRUPPE' },
};
