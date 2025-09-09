import React from 'react';

import { BriefcaseIcon } from '@navikt/aksel-icons';

import { VisEllerEndreVilkårDagligReise } from './VisEllerEndreVilkårDagligReise';
import { useVilkår } from '../../../../context/VilkårContext';
import { VilkårPanel } from '../../../../komponenter/VilkårPanel/VilkårPanel';
import { ReglerResponse } from '../../../../typer/regel';
import { StønadsvilkårType } from '../../vilkår';
import { NyttVilkår } from '../../Vilkårvurdering/NyttVilkår';
import { lagTomtDelvilkårsett, tomVurdering } from '../../Vilkårvurdering/utils';

type Props = {
    regler: ReglerResponse;
};

export const StønadsvilkårDagligReise = ({ regler }: Props) => {
    const { vilkårsvurdering } = useVilkår();
    const vilkårsett = vilkårsvurdering.vilkårsett.filter(
        (v) => v.vilkårType === StønadsvilkårType.DAGLIG_REISE_OFFENTLIG_TRANSPORT
    );
    const vilkårsregler = regler.vilkårsregler.DAGLIG_REISE_OFFENTLIG_TRANSPORT.regler;

    return (
        <VilkårPanel tittel={'Daglig Reise'} ikon={<BriefcaseIcon />}>
            {vilkårsett.map((vilkår, index) => (
                <VisEllerEndreVilkårDagligReise
                    key={vilkår.id}
                    regler={vilkårsregler}
                    vilkår={vilkår}
                    vilkårIndex={index + 1}
                />
            ))}
            <NyttVilkår
                vilkårtype={StønadsvilkårType.DAGLIG_REISE_OFFENTLIG_TRANSPORT}
                vilkårsregler={vilkårsregler}
                lagTomtDelvilkårsett={() =>
                    lagTomtDelvilkårsett(vilkårsregler, (regelId) => tomVurdering(regelId))
                }
            />
        </VilkårPanel>
    );
};
