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

const LøpendeUtgifterToBoliger: React.FC<Props> = ({ vilkårsregler }) => {
    const { vilkårsvurdering } = useVilkår();
    const vilkårsett = vilkårsvurdering.vilkårsett.filter(
        (v) => v.vilkårType === StønadsvilkårType.LØPENDE_UTGIFTER_TO_BOLIGER
    );

    return (
        <VilkårPanel tittel={'Løpende utgifter to boliger'} ikon={<HouseHeartIcon />}>
            {vilkårsett.map((vilkår) => (
                <VisEllerEndreVilkår key={vilkår.id} regler={vilkårsregler} vilkår={vilkår} />
            ))}
            <NyttVilkår
                vilkårtype={StønadsvilkårType.LØPENDE_UTGIFTER_TO_BOLIGER}
                vilkårsregler={vilkårsregler}
                lagTomtDelvilkårsett={() =>
                    lagTomtDelvilkårsett(vilkårsregler, (regelId) => tomVurdering(regelId))
                }
            />
        </VilkårPanel>
    );
};

export default LøpendeUtgifterToBoliger;
