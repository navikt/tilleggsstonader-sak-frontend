import React, { FC } from 'react';

import { CarIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, Label, Tag } from '@navikt/ds-react';

import { LesevisningFaktaDrosje } from './LesevisningFaktaDrosje';
import { VertikalSkillelinje } from '../../../../../../komponenter/VertikalSkillelinje';
import { LesevisningDelvilkår } from '../../../Felles/Lesevisning/LesevisningDelvilkår';
import { formatAktivitetInfo } from '../../felles/aktivitetInfo';
import { erFaktaDrosje, FaktaDrosje } from '../../typer/faktaReiseTilSamling';
import { VilkårReiseTilSamling } from '../../typer/vilkårReiseTilSamling';
import { RedigerVilkårProps } from '../Felles/LesevisningFooter';
import { LesevisningVilkårKort } from '../Felles/LesevisningVilkårKort';

export const LesevisningVilkårDrosje: FC<{
    vilkår: VilkårReiseTilSamling;
    redigerVilkårProps: RedigerVilkårProps;
}> = ({ vilkår, redigerVilkårProps }) => {
    if (!erFaktaDrosje(vilkår.fakta)) {
        return null;
    }
    const fakta = vilkår.fakta;
    return (
        <LesevisningVilkårKort
            vilkår={vilkår}
            redigerVilkårProps={redigerVilkårProps}
            ekstraHeader={<EkstraHeader fakta={fakta} />}
            typeTag={
                <Tag size="small" icon={<CarIcon />}>
                    Drosje
                </Tag>
            }
        >
            <HGrid gap={{ md: 'space-16', lg: 'space-32' }} columns="minmax(auto, 283px) 1px auto">
                <LesevisningFaktaDrosje fakta={vilkår.fakta} />
                <VertikalSkillelinje />
                <LesevisningDelvilkår
                    delvilkårsett={vilkår.delvilkårsett}
                    skalViseSkillelinje={false}
                />
            </HGrid>
        </LesevisningVilkårKort>
    );
};

const EkstraHeader: FC<{ fakta: FaktaDrosje }> = ({ fakta }) => {
    if (!fakta.aktivitet) return null;

    return (
        <div>
            <BodyShort size="small">Aktivitet:</BodyShort>
            <Label size="small">{formatAktivitetInfo(fakta.aktivitet)}</Label>
        </div>
    );
};
