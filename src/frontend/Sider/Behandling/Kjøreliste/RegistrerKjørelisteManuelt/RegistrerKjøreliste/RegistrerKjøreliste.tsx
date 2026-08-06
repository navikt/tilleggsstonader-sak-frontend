import React, { FC, useState } from 'react';

import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { RegistrerKjørelisteForm } from './RegistrerKjørelisteForm';
import { useRegistrerKjøreliste } from '../../../../../context/RegistrerKjørelisteContext/RegistrerKjørelisteContext';
import { useSteg } from '../../../../../context/StegContext';

export const RegistrerKjøreliste: FC = () => {
    const { erStegRedigerbart } = useSteg();
    const { kjørelisterLagretIBehandling } = useRegistrerKjøreliste();

    const [visSkjema, settVisSkjema] = useState<boolean>(kjørelisterLagretIBehandling.length === 0);

    if (!erStegRedigerbart) {
        return null;
    }

    if (visSkjema) {
        return <RegistrerKjørelisteForm lukkSkjema={() => settVisSkjema(false)} />;
    }

    return (
        <Button
            size="small"
            icon={<PlusIcon />}
            variant="secondary"
            onClick={() => settVisSkjema(true)}
            style={{ maxWidth: 'fit-content' }}
        >
            Registrer ny kjøreliste
        </Button>
    );
};
