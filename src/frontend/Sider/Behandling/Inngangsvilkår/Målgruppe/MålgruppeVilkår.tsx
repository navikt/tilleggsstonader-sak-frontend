import React from 'react';

import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårMålgruppe, MålgruppeType } from '../typer/målgruppe';
import { BegrunnelseObligatorisk, Vurdering } from '../typer/vilkårperiode';

const MålgruppeVilkår: React.FC<{
    målgruppeForm: EndreMålgruppeForm;
    oppdaterDelvilkår: (key: keyof DelvilkårMålgruppe, vurdering: Vurdering) => void;
    feilmelding?: string;
}> = ({ målgruppeForm, oppdaterDelvilkår }) => {
    switch (målgruppeForm.type) {
        case '':
        case MålgruppeType.AAP:
        case MålgruppeType.OVERGANGSSTØNAD:
            return null;

        case MålgruppeType.OMSTILLINGSSTØNAD:
        case MålgruppeType.UFØRETRYGD:
            return (
                <JaNeiVurdering
                    label="medlemskap"
                    vurdering={målgruppeForm.delvilkår.medlemskap}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('medlemskap', vurdering)
                    }
                    svarJa="Ja (vurdert etter første ledd)"
                    svarNei="Nei (vurdert etter andre ledd)"
                    begrunnelsePåkrevd={BegrunnelseObligatorisk.OBLIGATORISK_HVIS_SVAR_NEI}
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
                    begrunnelsePåkrevd={BegrunnelseObligatorisk.OBLIGATORISK_HVIS_SVAR_NEI}
                />
            );
        default:
            return <Feilmelding>Mangler mapping av {målgruppeForm.type}</Feilmelding>;
    }
};

export default MålgruppeVilkår;
