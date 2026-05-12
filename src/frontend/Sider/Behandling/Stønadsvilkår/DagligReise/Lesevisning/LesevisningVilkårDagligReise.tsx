import React, { FC } from 'react';

import { Tag } from '@navikt/ds-react';

import { LesevisningDelvilkår } from './Felles/LesevisningDelvilkår';
import { RedigerVilkårProps } from './Felles/LesevisningFooter';
import { LesevisningVilkårKort } from './Felles/LesevisningVilkårKort';
import { LesevisningVilkårOffentligTransport } from './OffentligTransport/LesevisningVilkårOffentligTransport';
import { LesevisningVilkårPrivatBil } from './PrivatBil/LesevisningVilkårPrivatBil';
import { VilkårDagligReise } from '../typer/vilkårDagligReise';

interface VilkårProps {
    vilkår: VilkårDagligReise;
    skalViseRedigeringsknapp: boolean;
    startRedigering?: () => void;
    startKopiering?: () => void;
    feilmeldingRedigering?: string;
    nullstillFeilmeldingRedigering?: () => void;
}

export const LesevisningVilkårDagligReise: FC<VilkårProps> = ({
    vilkår,
    startRedigering,
    skalViseRedigeringsknapp,
    startKopiering,
    feilmeldingRedigering,
    nullstillFeilmeldingRedigering,
}) => {
    const redigerVilkårProps: RedigerVilkårProps = {
        skalViseRedigeringsknapp,
        startRedigering,
        startKopiering,
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
