import React, { useEffect, useState } from 'react';

import { Detail, Heading, VStack } from '@navikt/ds-react';

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

    useEffect(() => {
        request<OppgaveArena[], null>(`/api/sak/oppgave/arena/${fagsakPersonId}`).then(
            (oppgaverArenaResponse) => {
                settOppgaveResponse(oppgaverArenaResponse);
                settOppdatertTidspunkt(new Date());
            }
        );
    }, [fagsakPersonId, request]);

    return (
        <VStack gap="space-8">
            <Heading size={'xsmall'}>Arena</Heading>
            <DataViewer type={'oppgaver'} response={{ oppgaveResponse }}>
                {({ oppgaveResponse }) => (
                    <>
                        <OppgavelisteArena oppgaver={oppgaveResponse} />
                        <Detail>
                            Informasjon hentet: {formaterDatoMedTidspunkt(oppdatertTidspunkt)}
                        </Detail>
                    </>
                )}
            </DataViewer>
        </VStack>
    );
};

export default OppgaverArena;
