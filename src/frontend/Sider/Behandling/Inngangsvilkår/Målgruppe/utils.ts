import { MålgruppeType } from '../typer/målgruppe';

export const målgruppeTyperMedImplisittMedlemskap = [
    MålgruppeType.AAP,
    MålgruppeType.OVERGANGSSTØNAD,
    MålgruppeType.UFØRETRYGD,
];

export type MålgrupperMedMedlemskapsvurdering =
    | MålgruppeType.NEDSATT_ARBEIDSEVNE
    | MålgruppeType.OMSTILLINGSSTØNAD;

export const svarJaMappingMedlemskap: Record<MålgrupperMedMedlemskapsvurdering, string> = {
    NEDSATT_ARBEIDSEVNE: 'Ja',
    OMSTILLINGSSTØNAD: 'Ja (vurdert etter første ledd)',
};

export const svarNeiMappingMedlemskap: Record<MålgrupperMedMedlemskapsvurdering, string> = {
    NEDSATT_ARBEIDSEVNE: 'Ja',
    OMSTILLINGSSTØNAD: 'Nei (vurdert etter andre ledd)',
};
