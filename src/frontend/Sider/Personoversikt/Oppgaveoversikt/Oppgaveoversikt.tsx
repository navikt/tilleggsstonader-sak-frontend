import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { VStack } from '@navikt/ds-react';

import OppgaverArena from './Arena/OppgaverArena';
import Oppgaver from './Oppgaver';
import { Toggle } from '../../../utils/toggles';

const Oppgaveoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const skalHenteArenaOppgaver = useFlag(Toggle.ARENA_OPPGAVER);

    return (
        <VStack gap={'8'}>
            <Oppgaver fagsakPersonId={fagsakPersonId} />
            {skalHenteArenaOppgaver && <OppgaverArena fagsakPersonId={fagsakPersonId} />}
        </VStack>
    );
};

export default Oppgaveoversikt;
