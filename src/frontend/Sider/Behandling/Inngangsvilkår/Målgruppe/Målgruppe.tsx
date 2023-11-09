import React from 'react';

import MålgruppeInfo from './MålgruppeInfo';
import { Vilkårsregler } from '../../../../typer/regel';
import { Inngangsvilkårtype, Vilkårsvurdering } from '../../vilkår';
import { Vilkårpanel } from '../../Vilkårspanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårspanel/VilkårpanelInnhold';
import VisEllerEndreVurdering from '../../Vilkårvurdering/VisEllerEndreVurdering';

interface Props {
    vilkårsregler: Vilkårsregler<Inngangsvilkårtype.MÅLGRUPPE>;
    vilkårsvurdering: Vilkårsvurdering;
}

const Målgruppe: React.FC<Props> = ({ vilkårsregler, vilkårsvurdering }) => {
    const vilkår = vilkårsvurdering.vilkårsett.find(
        (v) => v.vilkårType === Inngangsvilkårtype.MÅLGRUPPE
    );
    if (!vilkår) {
        return <div>Mangler vurdering for forutgående medlemskap</div>;
    }

    return (
        <Vilkårpanel tittel="Målgruppe" vilkårsresultat={vilkår.resultat}>
            <VilkårpanelInnhold>
                {{
                    venstre: <MålgruppeInfo />,
                    høyre: <VisEllerEndreVurdering vilkår={vilkår} regler={vilkårsregler.regler} />,
                }}
            </VilkårpanelInnhold>
        </Vilkårpanel>
    );
};

export default Målgruppe;
