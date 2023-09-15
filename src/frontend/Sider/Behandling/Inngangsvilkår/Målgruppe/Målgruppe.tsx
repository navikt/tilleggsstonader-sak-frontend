import React from 'react';

import MålgruppeInfo from './MålgruppeInfo';
import { Vilkårsresultat } from '../../vilkår';
import { Vilkårpanel } from '../../Vilkårspanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårspanel/VilkårpanelInnhold';

const Målgruppe: React.FC = () => {
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
                    høyre: (
                        // <VisEllerEndreVurdering
                        //     ikkeVurderVilkår={ikkeVurderVilkår}
                        //     vurdering={vurdering}
                        //     feilmelding={feilmeldinger[vurdering.id]}
                        //     lagreVurdering={lagreVurdering}
                        //     nullstillVurdering={nullstillVurdering}
                        // />
                        <p>Test</p>
                    ),
                }}
            </VilkårpanelInnhold>
        </Vilkårpanel>
    );
};

export default Målgruppe;
