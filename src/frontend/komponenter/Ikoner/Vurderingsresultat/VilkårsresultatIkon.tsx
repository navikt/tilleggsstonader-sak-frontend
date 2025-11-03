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
} from '@navikt/ds-tokens/darkside-js';

import { VilkårPeriodeResultat } from '../../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../../Sider/Behandling/vilkår';

export const VilkårsresultatIkon: FC<{
    vilkårsresultat: Vilkårsresultat | VilkårPeriodeResultat;
    hvittIkon?: boolean;
}> = ({ vilkårsresultat, hvittIkon = false }) => {
    switch (vilkårsresultat) {
        case 'OPPFYLT':
        case 'AUTOMATISK_OPPFYLT':
            return (
                <CheckmarkCircleFillIcon
                    color={hvittIkon ? BgDefault : BgSuccessStrong}
                    fontSize="1.5rem"
                />
            );

        case 'IKKE_OPPFYLT':
            return (
                <XMarkOctagonFillIcon
                    color={hvittIkon ? BgDefault : BgDangerStrong}
                    fontSize="1.5rem"
                />
            );
        case 'IKKE_VURDERT':
        case 'IKKE_TATT_STILLING_TIL':
            return (
                <ExclamationmarkTriangleFillIcon
                    color={hvittIkon ? BgDefault : BgWarningModeratePressed}
                    fontSize="1.5rem"
                />
            );

        case 'SLETTET':
            return (
                <TrashIcon
                    color={hvittIkon ? BgDefault : BgNeutralStrongPressed}
                    fontSize="1.5rem"
                />
            );

        default:
            return null;
    }
};
