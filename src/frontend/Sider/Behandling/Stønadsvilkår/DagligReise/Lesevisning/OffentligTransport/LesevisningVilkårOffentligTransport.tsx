import React, { FC } from 'react';

import { BusIcon } from '@navikt/aksel-icons';
import { HGrid, Tag } from '@navikt/ds-react';

import { LesevisningFaktaOffentligTransport } from './LesevisningFaktaOffentligTransport';
import { VertikalSkillelinje } from '../../../../../../komponenter/VertikalSkillelinje';
import { erFaktaOffentligTransport } from '../../typer/faktaDagligReise';
import { VilkårDagligReise } from '../../typer/vilkårDagligReise';
import { LesevisningDelvilkår } from '../Felles/LesevisningDelvilkår';
import { RedigerVilkårProps } from '../Felles/LesevisningFooter';
import { LesevisningVilkårKort } from '../Felles/LesevisningVilkårKort';

export const LesevisningVilkårOffentligTransport: FC<{
    vilkår: VilkårDagligReise;
    redigerVilkårProps: RedigerVilkårProps;
}> = ({ vilkår, redigerVilkårProps }) => {
    if (!erFaktaOffentligTransport(vilkår.fakta)) {
        return null;
    }
    const fakta = vilkår.fakta;

    return (
        <LesevisningVilkårKort
            vilkår={vilkår}
            redigerVilkårProps={redigerVilkårProps}
            typeTag={
                <Tag size="small" icon={<BusIcon />}>
                    Offentlig transport
                </Tag>
            }
        >
            <HGrid gap={{ md: 'space-16', lg: 'space-32' }} columns="minmax(auto, 234px) 1px auto">
                <LesevisningFaktaOffentligTransport fakta={fakta} />
                <VertikalSkillelinje />
                <LesevisningDelvilkår delvilkårsett={vilkår.delvilkårsett} />
            </HGrid>
        </LesevisningVilkårKort>
    );
};
