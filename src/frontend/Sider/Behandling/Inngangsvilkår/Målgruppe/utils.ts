import { MålgruppeType } from '../typer/målgruppe';

export const målgruppeTyperMedImplisittMedlemskap = [
    MålgruppeType.AAP,
    MålgruppeType.OVERGANGSSTØNAD,
    MålgruppeType.UFØRETRYGD,
];

export type MålgrupperMedMedlemskapsvurdering =
    | MålgruppeType.NEDSATT_ARBEIDSEVNE
    | MålgruppeType.OMSTILLINGSSTØNAD;

export const svarJaMapping: Record<MålgrupperMedMedlemskapsvurdering, string> = {
    NEDSATT_ARBEIDSEVNE: 'Ja',
    OMSTILLINGSSTØNAD: 'Ja (vurdert etter første ledd)',
};

export const svarNeiMapping: Record<MålgrupperMedMedlemskapsvurdering, string> = {
    NEDSATT_ARBEIDSEVNE: 'Ja',
    OMSTILLINGSSTØNAD: 'Nei (vurdert etter andre ledd)',
};
