import React, { FC } from 'react';

import { BusIcon } from '@navikt/aksel-icons';
import { HGrid, Tag } from '@navikt/ds-react';

import { LesevisningFaktaOffentligTransport } from './LesevisningFaktaOffentligTransport';
import { VertikalSkillelinje } from '../../../../../../komponenter/VertikalSkillelinje';
import { RedigerVilkårProps } from '../../../DagligReise/Lesevisning/Felles/LesevisningFooter';
import { FaktaOffentligTransport } from '../../typer/faktaReiseTilSamling';
import { VilkårReiseTilSamling } from '../../typer/vilkårReiseTilSamling';
import { LesevisningDelvilkår } from '../Felles/LesevisningDelvilkår';
import { LesevisningVilkårKort } from '../Felles/LesevisningVilkårKort';

export const LesevisningVilkårOffentligTransport: FC<{
    vilkår: VilkårReiseTilSamling;
    redigerVilkårProps: RedigerVilkårProps;
}> = ({ vilkår, redigerVilkårProps }) => {
    const fakta = vilkår.fakta as FaktaOffentligTransport;

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
