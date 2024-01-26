import React from 'react';

import { VilkårPanelMedResultat } from '../../../../komponenter/EkspanderbartPanel/VilkårPanel';
import { Vilkårsregler } from '../../../../typer/regel';
import { Inngangsvilkårtype, Vilkårsvurdering } from '../../vilkår';
import { VilkårpanelInnhold } from '../../Vilkårspanel/VilkårpanelInnhold';
import VisEllerEndreVurdering from '../../Vilkårvurdering/VisEllerEndreVurdering';
import { lovverkslenkerPassBarn, rundskrivPassBarn } from '../lenker';

interface Props {
    vilkårsregler: Vilkårsregler<Inngangsvilkårtype.PASS_BARN>;
    vilkårsvurdering: Vilkårsvurdering;
}

const PassBarn: React.FC<Props> = ({ vilkårsregler, vilkårsvurdering }) => {
    const vilkårsett = vilkårsvurdering.vilkårsett.filter(
        (v) => v.vilkårType === Inngangsvilkårtype.PASS_BARN
    );

    if (vilkårsett.length === 0) {
        return <div>Mangler vurderinger for pass av barn</div>;
    }

    const finnBarnIGrunnlag = (barnId: string) =>
        vilkårsvurdering.grunnlag.barn.find((barn) => barn.barnId === barnId);

    return vilkårsett.map((vilkår) => {
        if (!vilkår.barnId) {
            return <div>Vilkår er ikke knyttet til et barn</div>;
        }

        const grunnlagBarn = finnBarnIGrunnlag(vilkår.barnId);

        if (!grunnlagBarn) {
            return <div>Fant ikke grunnlag for barn</div>;
        }

        return (
            <VilkårPanelMedResultat
                tittel={grunnlagBarn.registergrunnlag.navn}
                resultat={vilkår.resultat}
                key={grunnlagBarn.barnId}
                paragrafLenker={lovverkslenkerPassBarn}
                rundskrivLenke={rundskrivPassBarn}
            >
                <VilkårpanelInnhold>
                    {{
                        høyre: (
                            <VisEllerEndreVurdering vilkår={vilkår} regler={vilkårsregler.regler} />
                        ),
                    }}
                </VilkårpanelInnhold>
            </VilkårPanelMedResultat>
        );
    });
};

export default PassBarn;
