import React from 'react';

import { BodyShort, Button, HStack } from '@navikt/ds-react';

export function LagreknappMedStatus(props: { vilkårId: string; erLagret: boolean }) {
    return (
        <>
            <HStack align={'center'} gap="6" style={{ marginTop: '1rem' }}>
                <Button size={'small'} style={{ maxWidth: 'fit-content' }}>
                    Lagre
                </Button>
                {props.erLagret && <BodyShort>Endringene er lagret!</BodyShort>}
            </HStack>
        </>
    );
}
