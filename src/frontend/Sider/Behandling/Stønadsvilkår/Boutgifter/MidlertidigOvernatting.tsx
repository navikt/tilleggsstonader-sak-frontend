import React from 'react';

import { useVilkår } from '../../../../context/VilkårContext';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { Regler } from '../../../../typer/regel';
import { StønadsvilkårType } from '../../vilkår';
import { NyttVilkår } from '../../Vilkårvurdering/NyttVilkår';
import { lagTomtDelvilkårsett, tomVurdering } from '../../Vilkårvurdering/utils';
import { VisEllerEndreVilkår } from '../../Vilkårvurdering/VisEllerEndreVilkår';

interface Props {
    vilkårsregler: Regler;
}

const MidlertidigOvernatting: React.FC<Props> = ({ vilkårsregler }) => {
    const { vilkårsvurdering } = useVilkår();
    const vilkårsett = vilkårsvurdering.vilkårsett.filter(
        (v) => v.vilkårType === StønadsvilkårType.MIDLERTIDIG_OVERNATTING
    );

    return (
        <VilkårPanel
            tittel={'Midlertidig overnatting'}
            paragraflenker={[]}
            rundskrivlenke={[]}
            forskriftlenker={[]}
        >
            {vilkårsett.map((vilkår) => (
                <VisEllerEndreVilkår key={vilkår.id} regler={vilkårsregler} vilkår={vilkår} />
            ))}
            <NyttVilkår
                vilkårtype={StønadsvilkårType.MIDLERTIDIG_OVERNATTING}
                vilkårsregler={vilkårsregler}
                lagTomtDelvilkårsett={() =>
                    lagTomtDelvilkårsett(vilkårsregler, (regelId) => tomVurdering(regelId))
                }
            />
        </VilkårPanel>
    );
};

export default MidlertidigOvernatting;
