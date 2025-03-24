import React from 'react';

import { HouseHeartIcon } from '@navikt/aksel-icons';

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

const FasteUtgifterEnBolig: React.FC<Props> = ({ vilkårsregler }) => {
    const { vilkårsvurdering } = useVilkår();
    const vilkårsett = vilkårsvurdering.vilkårsett.filter(
        (v) => v.vilkårType === StønadsvilkårType.FASTE_UTGIFTER_EN_BOLIG
    );

    return (
        <VilkårPanel
            tittel={'Faste utgifter en bolig'}
            ikon={<HouseHeartIcon />}
            paragraflenker={[]}
            rundskrivlenke={[]}
            forskriftlenker={[]}
        >
            {vilkårsett.map((vilkår) => (
                <VisEllerEndreVilkår key={vilkår.id} regler={vilkårsregler} vilkår={vilkår} />
            ))}
            <NyttVilkår
                vilkårtype={StønadsvilkårType.FASTE_UTGIFTER_EN_BOLIG}
                vilkårsregler={vilkårsregler}
                lagTomtDelvilkårsett={() =>
                    lagTomtDelvilkårsett(vilkårsregler, (regelId) => tomVurdering(regelId))
                }
            />
        </VilkårPanel>
    );
};

export default FasteUtgifterEnBolig;
