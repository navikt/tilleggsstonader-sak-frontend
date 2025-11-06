import {
    BgDangerStrong,
    BgDefault,
    BgInfoStrong,
    BgNeutralStrong,
    BgSuccessStrong,
    BgWarningModeratePressed,
} from '@navikt/ds-tokens/darkside-js';

import { VilkårPeriodeResultat } from '../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode/vilkårperiode';
import { Vilkårsresultat } from '../../Sider/Behandling/vilkår';

export const utledFargeTilResultat = (
    resultat: VilkårPeriodeResultat | Vilkårsresultat | undefined,
    redigeres: boolean
): string => {
    if (redigeres || resultat === undefined) {
        return BgInfoStrong;
    }

    switch (resultat) {
        case 'OPPFYLT':
        case 'AUTOMATISK_OPPFYLT':
            return BgSuccessStrong;

        case 'IKKE_OPPFYLT':
            return BgDangerStrong;

        case 'IKKE_VURDERT':
        case 'IKKE_TATT_STILLING_TIL':
            return BgWarningModeratePressed;

        case 'SLETTET':
            return BgNeutralStrong;
    }

    return BgDefault;
};
