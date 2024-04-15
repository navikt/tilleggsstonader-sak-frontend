import React from 'react';

import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { målgruppeErNedsattArbeidsevne, målgrupperHvorMedlemskapMåVurderes } from './utils';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårMålgruppe } from '../typer/målgruppe';
import { BegrunnelseObligatorisk, Vurdering } from '../typer/vilkårperiode';

const MålgruppeVilkår: React.FC<{
    målgruppeForm: EndreMålgruppeForm;
    oppdaterDelvilkår: (key: keyof DelvilkårMålgruppe, vurdering: Vurdering) => void;
    feilmelding?: string;
}> = ({ målgruppeForm, oppdaterDelvilkår }) => {
    if (målgruppeForm.type === '') {
        return null;
    }

    return (
        <>
            {målgrupperHvorMedlemskapMåVurderes.includes(målgruppeForm.type) && (
                <JaNeiVurdering
                    label="medlemskap"
                    vurdering={målgruppeForm.delvilkår.medlemskap}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('medlemskap', vurdering)
                    }
                    begrunnelsePåkrevd={BegrunnelseObligatorisk.OBLIGATORISK_HVIS_SVAR_NEI}
                />
            )}
            {målgruppeErNedsattArbeidsevne(målgruppeForm.type) && (
                <JaNeiVurdering
                    label="Dekkes utgiftene av annet regelverk?"
                    vurdering={målgruppeForm.delvilkår.dekketAvAnnetRegelverk}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('dekketAvAnnetRegelverk', vurdering)
                    }
                    begrunnelsePåkrevd={BegrunnelseObligatorisk.OBLIGATORISK_HVIS_SVAR_JA}
                />
            )}
        </>
    );
};

export default MålgruppeVilkår;
