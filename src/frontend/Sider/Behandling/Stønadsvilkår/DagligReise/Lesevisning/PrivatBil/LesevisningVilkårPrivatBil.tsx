import React, { FC } from 'react';

import { CarIcon } from '@navikt/aksel-icons';
import { BodyShort, HGrid, Label, Tag } from '@navikt/ds-react';

import { LesevisningFaktaPrivatBil } from './LesevisningFaktaPrivatBil';
import { VertikalSkillelinje } from '../../../../../../komponenter/VertikalSkillelinje';
import {
    AktivitetType,
    AktivitetTypeTilTekst,
} from '../../../../Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { FaktaPrivatBil } from '../../typer/faktaDagligReise';
import { VilkårDagligReise } from '../../typer/vilkårDagligReise';
import { LesevisningDelvilkår } from '../Felles/LesevisningDelvilkår';
import { RedigerVilkårProps } from '../Felles/LesevisningFooter';
import { LesevisningVilkårKort } from '../Felles/LesevisningVilkårKort';

export const LesevisningVilkårPrivatBil: FC<{
    vilkår: VilkårDagligReise;
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
                <BodyShort size="small">Reiseavstand en vei:</BodyShort>
                <Label size="small">{fakta.reiseavstandEnVei} km</Label>
            </div>
            <div>
                <BodyShort size="small">Aktivitet:</BodyShort>
                <Label size="small">
                    {AktivitetTypeTilTekst[fakta.aktivitetType as AktivitetType] ??
                        fakta.aktivitetType}
                </Label>
            </div>
        </>
    );
};
