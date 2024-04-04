import React from 'react';

import { Button } from '@navikt/ds-react';

export function Lagreknapp() {
    return (
        <>
            <Button size={'small'} style={{ maxWidth: 'fit-content' }}>
                Lagre
            </Button>
        </>
    );
}
