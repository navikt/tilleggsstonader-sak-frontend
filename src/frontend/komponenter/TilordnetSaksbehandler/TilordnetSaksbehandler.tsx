import React from 'react';

import { PersonHeadsetIcon } from '@navikt/aksel-icons';
import { Alert, BodyShort, HStack } from '@navikt/ds-react';
import { BgNeutralSoft } from '@navikt/ds-tokens/darkside-js';

import { StatusBar, utledStatusbarFarge } from './StatusBar';
import styles from './TilordnetSaksbehandler.module.css';
import { utledVisningsnavn } from './tilordnetSaksbehandlerUtils';
import { useBehandling } from '../../context/BehandlingContext';

export const TilordnetSaksbehandler: React.FC = () => {
    const { behandling } = useBehandling();

    if (!behandling.tilordnetSaksbehandler) {
        return (
            <Alert
                variant={'info'}
                size={'small'}
                inline={true}
                style={{ backgroundColor: BgNeutralSoft }}
            >
                Klarte ikke å hente ansvarlig saksbehandler
            </Alert>
        );
    }

    return (
        <>
            <HStack gap={'2'} align={'center'}>
                <PersonHeadsetIcon className={styles.personIkon} />
                <div>
                    <BodyShort weight={'semibold'} size={'small'}>
                        Ansvarlig saksbehandler:
                    </BodyShort>
                    <BodyShort size={'small'}>
                        {utledVisningsnavn(behandling.tilordnetSaksbehandler)}
                    </BodyShort>
                </div>
            </HStack>
            <StatusBar
                color={utledStatusbarFarge(
                    behandling.tilordnetSaksbehandler.tilordnetSaksbehandlerPåOppgave
                )}
            />
        </>
    );
};
