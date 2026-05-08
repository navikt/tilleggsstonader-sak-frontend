import React, { FC } from 'react';

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
    if (vilkår.fakta.type === 'OFFENTLIG_TRANSPORT') {
        return (
            <LesevisningVilkårOffentligTransport
                vilkår={vilkår}
                skalViseRedigeringsknapp={skalViseRedigeringsknapp}
                startRedigering={startRedigering}
                startKopiering={startKopiering}
                feilmeldingRedigering={feilmeldingRedigering}
                nullstillFeilmeldingRedigering={nullstillFeilmeldingRedigering}
            />
        );
    }

    return (
        <LesevisningVilkårPrivatBil
            vilkår={vilkår}
            skalViseRedigeringsknapp={skalViseRedigeringsknapp}
            startRedigering={startRedigering}
            startKopiering={startKopiering}
            feilmeldingRedigering={feilmeldingRedigering}
            nullstillFeilmeldingRedigering={nullstillFeilmeldingRedigering}
        />
    );
};
