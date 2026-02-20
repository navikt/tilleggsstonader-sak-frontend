import React from 'react';

import { VStack } from '@navikt/ds-react';

import OppgaverArena from './Arena/OppgaverArena';
import Oppgaver from './Oppgaver';

const Oppgaveoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    return (
        <VStack gap={'space-32'}>
            <Oppgaver fagsakPersonId={fagsakPersonId} />
            <OppgaverArena fagsakPersonId={fagsakPersonId} />
        </VStack>
    );
};

export default Oppgaveoversikt;
