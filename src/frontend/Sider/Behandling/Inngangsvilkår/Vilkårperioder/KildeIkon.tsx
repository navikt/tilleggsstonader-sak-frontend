import React, { FC } from 'react';

import { DatabaseIcon, PersonIcon } from '@navikt/aksel-icons';
import { HStack } from '@navikt/ds-react';

import { KildeVilkårsperiode } from '../typer/vilkårperiode';

const utledIkon = (kilde: KildeVilkårsperiode) => {
    switch (kilde) {
        case KildeVilkårsperiode.MANUELL:
            return <PersonIcon />;

        case KildeVilkårsperiode.SYSTEM:
            return <DatabaseIcon />;
        default:
            return null;
    }
};

export const KildeIkon: FC<{
    kilde: KildeVilkårsperiode;
    className?: string;
}> = ({ kilde }) => {
    return (
        <HStack justify="center" align="center">
            {utledIkon(kilde)}
        </HStack>
    );
};
