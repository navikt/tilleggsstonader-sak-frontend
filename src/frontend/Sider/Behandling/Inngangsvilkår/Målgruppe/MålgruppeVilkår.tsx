import React from 'react';

import { EndreMålgruppeForm } from './EndreMålgruppeRad';
import { målgruppeErNedsattArbeidsevne, målgrupperHvorMedlemskapMåVurderes } from './utils';
import JaNeiVurdering from '../../Vilkårvurdering/JaNeiVurdering';
import { DelvilkårMålgruppe } from '../typer/målgruppe';
import { Vurdering } from '../typer/vilkårperiode';

// TODO: Rename til MålgruppeDelvilkår
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
                    label="Medlemskap i folketrygden?"
                    vurdering={målgruppeForm.delvilkår.medlemskap}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('medlemskap', vurdering)
                    }
                />
            )}
            {målgruppeErNedsattArbeidsevne(målgruppeForm.type) && (
                <JaNeiVurdering
                    label="Dekkes utgiftene av annet regelverk?"
                    vurdering={målgruppeForm.delvilkår.dekketAvAnnetRegelverk}
                    oppdaterVurdering={(vurdering: Vurdering) =>
                        oppdaterDelvilkår('dekketAvAnnetRegelverk', vurdering)
                    }
                />
            )}
        </>
    );
};

export default MålgruppeVilkår;
