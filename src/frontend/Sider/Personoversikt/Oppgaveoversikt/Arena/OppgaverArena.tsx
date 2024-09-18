import React, { useCallback, useEffect, useState } from 'react';

import { Button, Detail, Heading, VStack, HStack } from '@navikt/ds-react';

import OppgavelisteArena from './OppgavelisteArena';
import { OppgaveArena } from './typer';
import { useApp } from '../../../../context/AppContext';
import DataViewer from '../../../../komponenter/DataViewer';
import { Ressurs, byggTomRessurs } from '../../../../typer/ressurs';
import { formaterDatoMedTidspunkt } from '../../../../utils/dato';

const OppgaverArena: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [oppgaveResponse, settOppgaveResponse] =
        useState<Ressurs<OppgaveArena[]>>(byggTomRessurs());

    const [oppdatertTidspunkt, settOppdatertTidspunkt] = useState<Date | undefined>();

    const hentOppgaver = useCallback(async () => {
        settOppgaveResponse(
            await request<OppgaveArena[], null>(`/api/sak/oppgave/arena/${fagsakPersonId}`)
        );
        settOppdatertTidspunkt(new Date());
    }, [request, fagsakPersonId]);

    useEffect(() => {
        void hentOppgaver();
    }, [hentOppgaver]);

    return (
        <VStack gap={'2'}>
            <Heading size={'xsmall'}>Arena</Heading>
            <DataViewer response={{ oppgaveResponse }}>
                {({ oppgaveResponse }) => (
                    <>
                        <OppgavelisteArena oppgaver={oppgaveResponse} />
                        <HStack gap="2" align="baseline">
                            <Detail>
                                Informasjon hentet: {formaterDatoMedTidspunkt(oppdatertTidspunkt)}
                            </Detail>
                            <Button
                                onClick={() => hentOppgaver()}
                                size="xsmall"
                                variant="tertiary"
                                style={{ maxWidth: 'fit-content' }}
                            >
                                Hent på nytt
                            </Button>
                        </HStack>
                    </>
                )}
            </DataViewer>
        </VStack>
    );
};

export default OppgaverArena;
