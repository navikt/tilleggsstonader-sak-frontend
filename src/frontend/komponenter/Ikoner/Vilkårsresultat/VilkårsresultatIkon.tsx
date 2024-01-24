import React, { FC } from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Tag } from '@navikt/ds-react';

import IkkeOppfylt from './IkkeOppfylt';
import IkkeVurdert from './IkkeVurdert';
import Info from './Info';
import Oppfylt from './Oppfylt';
import { VilkårPeriodeResultat } from '../../../Sider/Behandling/Inngangsvilkår/typer/vilkårperiode';
import { Vilkårsresultat } from '../../../Sider/Behandling/vilkår';

export const VilkårsresultatIkon: FC<{
    vilkårsresultat: Vilkårsresultat | VilkårPeriodeResultat;
    className?: string;
    height?: number;
    width?: number;
}> = ({ vilkårsresultat, className, height = 23, width = 21 }) => {
    switch (vilkårsresultat) {
        case Vilkårsresultat.IKKE_TATT_STILLING_TIL:
        case VilkårPeriodeResultat.IKKE_VURDERT:
            return <IkkeVurdert className={className} height={height} width={width} />;

        case VilkårPeriodeResultat.OPPFYLT:
        case Vilkårsresultat.OPPFYLT:
        case Vilkårsresultat.AUTOMATISK_OPPFYLT:
            return <Oppfylt className={className} height={height} width={width} />;

        case VilkårPeriodeResultat.IKKE_OPPFYLT:
        case Vilkårsresultat.IKKE_OPPFYLT:
            return <IkkeOppfylt className={className} height={height} width={width} />;

        case Vilkårsresultat.SKAL_IKKE_VURDERES:
            return <Info className={className} height={height} width={width} />;
        case VilkårPeriodeResultat.SLETTET:
            return (
                <Tag variant={'neutral'} icon={<TrashIcon />}>
                    Slettet
                </Tag>
            );

        default:
            return null;
    }
};
