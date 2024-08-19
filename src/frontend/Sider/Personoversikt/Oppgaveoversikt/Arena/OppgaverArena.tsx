import React, { useCallback, useEffect, useState } from 'react';

import { Button, Heading, VStack } from '@navikt/ds-react';

import OppgavelisteArena from './OppgavelisteArena';
import { OppgaveArena } from './typer';
import { useApp } from '../../../../context/AppContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { Ressurs, byggTomRessurs } from '../../../../typer/ressurs';

const OppgaverArena: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [oppgaveResponse, settOppgaveResponse] =
        useState<Ressurs<OppgaveArena[]>>(byggTomRessurs());

    const hentOppgaver = useCallback(() => {
        request<OppgaveArena[], null>(`/api/sak/oppgave/arena/${fagsakPersonId}`).then(
            settOppgaveResponse
        );
    }, [request, fagsakPersonId]);

    useEffect(() => {
        hentOppgaver();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <VStack gap={'2'}>
            <Heading size={'xsmall'}>Arena</Heading>
            <DataViewer response={{ oppgaveResponse }}>
                {({ oppgaveResponse }) => (
                    <>
                        <OppgavelisteArena oppgaver={oppgaveResponse} />
                        <Button
                            onClick={() => hentOppgaver()}
                            size="small"
                            variant="secondary"
                            style={{ maxWidth: 'fit-content' }}
                        >
                            Hent oppgaver på nytt
                        </Button>
                    </>
                )}
            </DataViewer>
        </VStack>
    );
};

export default OppgaverArena;
