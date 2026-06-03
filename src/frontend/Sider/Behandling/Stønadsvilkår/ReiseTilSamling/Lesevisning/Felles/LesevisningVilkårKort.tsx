import React, { FC, ReactNode } from 'react';

import { BodyShort, HStack, Label } from '@navikt/ds-react';

import { LesevisningFooter, RedigerVilkårProps } from './LesevisningFooter';
import { ResultatOgStatusKort } from '../../../../../../komponenter/ResultatOgStatusKort/ResultatOgStatusKort';
import { Skillelinje } from '../../../../../../komponenter/Skillelinje';
import { formaterNullablePeriode } from '../../../../../../utils/dato';
import { VilkårReiseTilSamling } from '../../typer/vilkårReiseTilSamling';

export const LesevisningVilkårKort: FC<{
    vilkår: VilkårReiseTilSamling;
    ekstraHeader?: ReactNode;
    redigerVilkårProps: RedigerVilkårProps;
    typeTag: ReactNode;
    children: ReactNode;
}> = ({ vilkår, ekstraHeader, children, redigerVilkårProps, typeTag }) => (
    <ResultatOgStatusKort
        periode={vilkår}
        footer={<LesevisningFooter {...redigerVilkårProps} typeTag={typeTag} />}
    >
        <div>
            <HStack gap="space-32" paddingBlock="space-0 space-16">
                <div>
                    <BodyShort size="small">Periode</BodyShort>
                    <Label size="small">{formaterNullablePeriode(vilkår.fom, vilkår.tom)}</Label>
                </div>
                <div>
                    <BodyShort size="small">Adresse aktivitet</BodyShort>
                    <Label size="small">{vilkår.adresse || '-'}</Label>
                </div>
                {ekstraHeader}
            </HStack>
            <Skillelinje utenMargin />
            {children}
        </div>
    </ResultatOgStatusKort>
);
