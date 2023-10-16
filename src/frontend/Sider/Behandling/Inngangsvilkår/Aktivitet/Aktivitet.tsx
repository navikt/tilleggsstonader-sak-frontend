import React from 'react';

import AktivitetInfo from './AktivitetInfo';
import { Vilkårsregler } from '../../../../typer/regel';
import { Inngangsvilkår, Vilkår, Vilkårsresultat } from '../../vilkår';
import { Vilkårpanel } from '../../Vilkårspanel/Vilkårpanel';
import { VilkårpanelInnhold } from '../../Vilkårspanel/VilkårpanelInnhold';
import VisEllerEndreVurdering from '../../Vilkårvurdering/VisEllerEndreVurdering';

interface Props {
    feilmelding?: string;
    vilkårsregler: Vilkårsregler<Inngangsvilkår.AKTIVITET>;
    vilkår: Vilkår;
}

const Aktivitet: React.FC<Props> = ({ feilmelding, vilkårsregler, vilkår }) => {
    // const vurdering = vurderinger.find(
    //     (v) => v.vilkårType === InngangsvilkårType.FORUTGÅENDE_MEDLEMSKAP
    // );
    // if (!vurdering) {
    //     return <div>Mangler vurdering for forutgående medlemskap</div>;
    // }
    return (
        <Vilkårpanel tittel="Aktivitet" vilkårsresultat={Vilkårsresultat.IKKE_TATT_STILLING_TIL}>
            <VilkårpanelInnhold>
                {{
                    venstre: <AktivitetInfo />,
                    høyre: (
                        <VisEllerEndreVurdering
                            vilkår={vilkår}
                            feilmelding={feilmelding}
                            regler={vilkårsregler.regler}
                        />
                    ),
                }}
            </VilkårpanelInnhold>
        </Vilkårpanel>
    );
};

export default Aktivitet;
