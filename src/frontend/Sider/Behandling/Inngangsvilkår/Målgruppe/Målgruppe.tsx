import React from 'react';

import MålgruppeInfo from './MålgruppeInfo';
import { Vilkårsregler } from '../../../../typer/regel';
import { Inngangsvilkår, Vilkårsresultat } from '../../vilkår';
import { Vilkårpanel } from '../../Vilkårspanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårspanel/VilkårpanelInnhold';
import VisEllerEndreVurdering from '../../Vilkårvurdering/VisEllerEndreVurdering';

interface Props {
    regler: Vilkårsregler<Inngangsvilkår.MÅLGRUPPE>;
}

const Målgruppe: React.FC<Props> = () => {
    // const vurdering = vurderinger.find(
    //     (v) => v.vilkårType === InngangsvilkårType.FORUTGÅENDE_MEDLEMSKAP
    // );
    // if (!vurdering) {
    //     return <div>Mangler vurdering for forutgående medlemskap</div>;
    // }

    return (
        <Vilkårpanel tittel="Målgruppe" vilkårsresultat={Vilkårsresultat.IKKE_TATT_STILLING_TIL}>
            <VilkårpanelInnhold>
                {{
                    venstre: <MålgruppeInfo />,
                    høyre: <VisEllerEndreVurdering />,
                }}
            </VilkårpanelInnhold>
        </Vilkårpanel>
    );
};

export default Målgruppe;
