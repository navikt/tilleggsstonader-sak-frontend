import React from 'react';

import AktivitetInfo from './AktivitetInfo';
import { Vilkårsregler } from '../../../../typer/regel';
import { Inngangsvilkårtype, Vilkårsvurdering } from '../../vilkår';
import { Vilkårpanel } from '../../Vilkårspanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårspanel/VilkårpanelInnhold';
import VisEllerEndreVurdering from '../../Vilkårvurdering/VisEllerEndreVurdering';

interface Props {
    vilkårsregler: Vilkårsregler<Inngangsvilkårtype.AKTIVITET>;
    vilkårsvurdering: Vilkårsvurdering;
}

const AktivitetGammel: React.FC<Props> = ({ vilkårsregler, vilkårsvurdering }) => {
    const vilkår = vilkårsvurdering.vilkårsett.find(
        (v) => v.vilkårType === Inngangsvilkårtype.AKTIVITET
    );
    if (!vilkår) {
        return <div>Mangler vurdering for forutgående medlemskap</div>;
    }
    return (
        <Vilkårpanel tittel="Aktivitet" vilkårsresultat={vilkår.resultat}>
            <VilkårpanelInnhold>
                {{
                    venstre: <AktivitetInfo />,
                    høyre: <VisEllerEndreVurdering vilkår={vilkår} regler={vilkårsregler.regler} />,
                }}
            </VilkårpanelInnhold>
        </Vilkårpanel>
    );
};

export default AktivitetGammel;
