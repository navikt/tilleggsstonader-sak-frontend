import React, { FC, useState } from 'react';

import { PlusIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { RegistrerKjørelisteForm } from './RegistrerKjørelisteForm';
import { useRegistrerKjøreliste } from '../../../../../context/RegistrerKjørelisteContext/RegistrerKjørelisteContext';

export const RegistrerKjøreliste: FC = () => {
    const { kjørelisterLagretIBehandling } = useRegistrerKjøreliste();

    const [visSkjema, settVisSkjema] = useState<boolean>(kjørelisterLagretIBehandling.length === 0);

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
