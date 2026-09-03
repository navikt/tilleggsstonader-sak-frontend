import React, { FC } from 'react';

import { Tag } from '@navikt/ds-react';

import { RedigerVilkårProps } from '../../DagligReise/Lesevisning/Felles/LesevisningFooter';
import { VilkårReiseTilSamling } from '../typer/vilkårReiseTilSamling';
import { LesevisningDelvilkår } from './Felles/LesevisningDelvilkår';
import { LesevisningVilkårKort } from './Felles/LesevisningVilkårKort';
import { LesevisningVilkårOffentligTransport } from './OffentligTransport/LesevisningVilkårOffentligTransport';
import { LesevisningVilkårPrivatBil } from './PrivatBil/LesevisningVilkårPrivatBil';
import { Vilkårsresultat } from '../../../vilkår';

interface VilkårProps {
    vilkår: VilkårReiseTilSamling;
    startRedigering?: () => void;
    skalViseRedigeringsknapp: boolean;
    feilmeldingRedigering?: string;
    nullstillFeilmeldingRedigering?: () => void;
}

export const LesevisningVilkårReiseTilSamling: FC<VilkårProps> = ({
    vilkår,
    startRedigering,
    skalViseRedigeringsknapp,
    feilmeldingRedigering,
    nullstillFeilmeldingRedigering,
}) => {
    const redigerVilkårProps: RedigerVilkårProps = {
        startRedigering,
        skalViseRedigeringsknapp,
        feilmeldingRedigering,
        nullstillFeilmeldingRedigering,
    };

    if (vilkår.fakta.type === 'OFFENTLIG_TRANSPORT') {
        return (
            <LesevisningVilkårOffentligTransport
                vilkår={vilkår}
                redigerVilkårProps={redigerVilkårProps}
            />
        );
    }

    if (vilkår.fakta.type === 'PRIVAT_BIL') {
        return (
            <LesevisningVilkårPrivatBil vilkår={vilkår} redigerVilkårProps={redigerVilkårProps} />
        );
    }

    return (
        <LesevisningVilkårKort
            vilkår={vilkår}
            redigerVilkårProps={redigerVilkårProps}
            typeTag={<TypeTagForResultat resultat={vilkår.resultat} />}
        >
            <LesevisningDelvilkår delvilkårsett={vilkår.delvilkårsett} />
        </LesevisningVilkårKort>
    );
};

const TypeTagForResultat: FC<{ resultat: Vilkårsresultat }> = ({ resultat }) => {
    if (resultat === Vilkårsresultat.IKKE_TATT_STILLING_TIL) {
        return (
            <Tag data-color="warning" size="small">
                Ikke ferdig utfylt
            </Tag>
        );
    }

    return (
        <Tag data-color="danger" size="small">
            Vilkår ikke oppfylt
        </Tag>
    );
};
