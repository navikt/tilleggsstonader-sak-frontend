import React from 'react';

import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { svarJaMappingMedlemskap, svarNeiMappingMedlemskap } from './utils';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårMålgruppe, MålgruppeType } from '../typer/målgruppe';
import { Vurdering } from '../typer/vilkårperiode';

const EndreMålgruppeInnhold: React.FC<{
    målgruppeForm: EndreMålgruppeForm;
    oppdaterDelvilkår: (key: keyof DelvilkårMålgruppe, vurdering: Vurdering) => void;
    feilmelding?: string;
}> = ({ målgruppeForm, oppdaterDelvilkår }) => {
    switch (målgruppeForm.type) {
        case '':
        case MålgruppeType.AAP:
        case MålgruppeType.OVERGANGSSTØNAD:
        case MålgruppeType.UFØRETRYGD:
            return null;

        case MålgruppeType.OMSTILLINGSSTØNAD:
            return (
                <JaNeiVurdering
                    label="medlemskap"
                    vurdering={målgruppeForm.delvilkår.medlemskap}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('medlemskap', vurdering)
                    }
                    svarJa={svarJaMappingMedlemskap[MålgruppeType.OMSTILLINGSSTØNAD]}
                    svarNei={svarNeiMappingMedlemskap[MålgruppeType.OMSTILLINGSSTØNAD]}
                />
            );

        case MålgruppeType.NEDSATT_ARBEIDSEVNE:
            return (
                //TODO: Vurdering av nedsatt arbeidsevne
                <JaNeiVurdering
                    label="medlemskap"
                    vurdering={målgruppeForm.delvilkår.medlemskap}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('medlemskap', vurdering)
                    }
                />
            );
        default:
            return <Feilmelding>Mangler mapping av {målgruppeForm.type}</Feilmelding>;
    }
};

export default EndreMålgruppeInnhold;
