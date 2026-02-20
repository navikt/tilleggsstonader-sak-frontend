import React, { FC } from 'react';

import {
    CheckmarkCircleFillIcon,
    ExclamationmarkTriangleFillIcon,
    TrashIcon,
    XMarkOctagonFillIcon,
} from '@navikt/aksel-icons';
import {
    BgDangerStrong,
    BgDefault,
    BgNeutralStrongPressed,
    BgSuccessStrong,
    BgWarningModeratePressed,
} from '@navikt/ds-tokens/js';

import { VilkårPeriodeResultat } from '../../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../../Sider/Behandling/vilkår';

export const FargetVilkårsresultatIkon: FC<{
    vilkårsresultat: Vilkårsresultat | VilkårPeriodeResultat;
}> = ({ vilkårsresultat }) => {
    switch (vilkårsresultat) {
        case 'OPPFYLT':
        case 'AUTOMATISK_OPPFYLT':
            return <CheckmarkCircleFillIcon color={BgSuccessStrong} fontSize="1.5rem" />;

        case 'IKKE_OPPFYLT':
            return <XMarkOctagonFillIcon color={BgDangerStrong} fontSize="1.5rem" />;
        case 'IKKE_VURDERT':
        case 'IKKE_TATT_STILLING_TIL':
            return (
                <ExclamationmarkTriangleFillIcon
                    color={BgWarningModeratePressed}
                    fontSize="1.5rem"
                />
            );

        case 'SLETTET':
            return <TrashIcon color={BgNeutralStrongPressed} fontSize="1.5rem" />;

        default:
            return null;
    }
};

export const HvittVilkårsresultatIkon: FC<{
    vilkårsresultat: Vilkårsresultat | VilkårPeriodeResultat;
}> = ({ vilkårsresultat }) => {
    switch (vilkårsresultat) {
        case 'OPPFYLT':
        case 'AUTOMATISK_OPPFYLT':
            return <CheckmarkCircleFillIcon color={BgDefault} fontSize="1.5rem" />;

        case 'IKKE_OPPFYLT':
            return <XMarkOctagonFillIcon color={BgDefault} fontSize="1.5rem" />;
        case 'IKKE_VURDERT':
        case 'IKKE_TATT_STILLING_TIL':
            return <ExclamationmarkTriangleFillIcon color={BgDefault} fontSize="1.5rem" />;

        case 'SLETTET':
            return <TrashIcon color={BgDefault} fontSize="1.5rem" />;

        default:
            return null;
    }
};
