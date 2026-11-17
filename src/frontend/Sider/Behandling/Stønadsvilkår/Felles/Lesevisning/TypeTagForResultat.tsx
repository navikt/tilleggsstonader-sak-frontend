import React, { CSSProperties, FC } from 'react';

import { Tag } from '@navikt/ds-react';

import { Vilkårsresultat } from '../../../vilkår';

export const TypeTagForResultat: FC<{
    resultat: Vilkårsresultat | undefined;
    style?: CSSProperties;
}> = ({ resultat, style }) => {
    if (resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL) {
        return (
            <Tag data-color="warning" size="small" style={style}>
                Ikke ferdig utfylt
            </Tag>
        );
    }

    if (resultat === Vilkårsresultat.IKKE_OPPFYLT) {
        return (
            <Tag data-color="danger" size="small" style={style}>
                Vilkår ikke oppfylt
            </Tag>
        );
    }
};
