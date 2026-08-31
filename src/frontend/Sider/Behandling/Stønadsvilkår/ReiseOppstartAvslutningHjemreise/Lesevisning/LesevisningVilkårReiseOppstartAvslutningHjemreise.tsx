import React, { FC } from 'react';

import { Tag } from '@navikt/ds-react';

import { RedigerVilkårProps } from '../../DagligReise/Lesevisning/Felles/LesevisningFooter';
import { VilkårReiseOppstartAvslutningHjemreise } from '../typer/vilkårReiseOppstartAvslutningHjemreise';
import { LesevisningDelvilkår } from './Felles/LesevisningDelvilkår';
import { LesevisningVilkårKort } from './Felles/LesevisningVilkårKort';
import { LesevisningVilkårOffentligTransport } from './OffentligTransport/LesevisningVilkårOffentligTransport';
import { LesevisningVilkårPrivatBil } from './PrivatBil/LesevisningVilkårPrivatBil';

interface VilkårProps {
    vilkår: VilkårReiseOppstartAvslutningHjemreise;
    startRedigering?: () => void;
    skalViseRedigeringsknapp: boolean;
    feilmeldingRedigering?: string;
    nullstillFeilmeldingRedigering?: () => void;
}

export const LesevisningVilkårReiseOppstartAvslutningHjemreise: FC<VilkårProps> = ({
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
            typeTag={
                <Tag data-color="danger" size="small">
                    Vilkår ikke oppfylt
                </Tag>
            }
        >
            <LesevisningDelvilkår delvilkårsett={vilkår.delvilkårsett} />
        </LesevisningVilkårKort>
    );
};
