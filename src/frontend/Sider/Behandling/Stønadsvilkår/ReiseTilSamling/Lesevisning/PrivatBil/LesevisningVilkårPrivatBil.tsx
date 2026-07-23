import React, { FC } from 'react';

import { CarIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, Label, Tag } from '@navikt/ds-react';

import { LesevisningFaktaPrivatBil } from './LesevisningFaktaPrivatBil';
import { VertikalSkillelinje } from '../../../../../../komponenter/VertikalSkillelinje';
import { FaktaPrivatBil } from '../../typer/faktaReiseTilSamling';
import { VilkårReiseTilSamling } from '../../typer/vilkårReiseTilSamling';
import { LesevisningDelvilkår } from '../Felles/LesevisningDelvilkår';
import { RedigerVilkårProps } from '../Felles/LesevisningFooter';
import { LesevisningVilkårKort } from '../Felles/LesevisningVilkårKort';

export const LesevisningVilkårPrivatBil: FC<{
    vilkår: VilkårReiseTilSamling;
    redigerVilkårProps: RedigerVilkårProps;
}> = ({ vilkår, redigerVilkårProps }) => {
    const faktaPrivatBil = vilkår.fakta as FaktaPrivatBil;

    return (
        <LesevisningVilkårKort
            vilkår={vilkår}
            redigerVilkårProps={redigerVilkårProps}
            ekstraHeader={<EkstraHeader fakta={faktaPrivatBil} />}
            typeTag={
                <Tag size="small" icon={<CarIcon />}>
                    Privat bil
                </Tag>
            }
        >
            <HGrid gap={{ md: 'space-16', lg: 'space-32' }} columns="minmax(auto, 400px) 1px auto">
                <LesevisningFaktaPrivatBil fakta={faktaPrivatBil} />
                <VertikalSkillelinje />
                <LesevisningDelvilkår delvilkårsett={vilkår.delvilkårsett} />
            </HGrid>
        </LesevisningVilkårKort>
    );
};

const EkstraHeader: FC<{ fakta: FaktaPrivatBil }> = ({ fakta }) => {
    return (
        <>
            <div>
                <BodyShort size="small">Totalt reiseavstand:</BodyShort>
                <Label size="small">{fakta.reiseavstand} km</Label>
            </div>
        </>
    );
};
