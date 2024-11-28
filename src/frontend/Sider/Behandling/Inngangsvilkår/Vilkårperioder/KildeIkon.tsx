import React, { FC } from 'react';

import { DatabaseIcon, PersonIcon } from '@navikt/aksel-icons';

import { KildeVilkårsperiode } from '../typer/vilkårperiode/vilkårperiode';

export const KildeIkon: FC<{
    kilde: KildeVilkårsperiode;
    className?: string;
}> = ({ kilde }) => {
    switch (kilde) {
        case KildeVilkårsperiode.MANUELL:
            return <PersonIcon />;

        case KildeVilkårsperiode.SYSTEM:
            return <DatabaseIcon />;
        default:
            return null;
    }
};
