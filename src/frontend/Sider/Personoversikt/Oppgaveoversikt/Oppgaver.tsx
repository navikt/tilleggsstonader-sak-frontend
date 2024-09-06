import React, { useCallback, useEffect, useState } from 'react';

import { Button, Heading, VStack } from '@navikt/ds-react';

import Oppgaveliste from './Oppgaveliste';
import { mapperTilIdRecord } from './utils';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';
import { oppdaterOppgaveIOppgaveResponse } from '../../Oppgavebenk/oppgaveutils';
import { Mappe, Oppgave, OppgaverResponse } from '../../Oppgavebenk/typer/oppgave';

const Oppgaver: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [oppgaveResponse, settOppgaveResponse] =
        useState<Ressurs<OppgaverResponse>>(byggTomRessurs());
    const [mapper, settMapper] = useState<Ressurs<Mappe[]>>(byggTomRessurs());

    const hentOppgaverOgMapper = useCallback(() => {
        request<OppgaverResponse, null>(`/api/sak/oppgave/soek/person/${fagsakPersonId}`).then(
            settOppgaveResponse
        );

        request<Mappe[], null>(`/api/sak/oppgave/mapper`, 'GET').then(settMapper);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [request]);

    useEffect(() => {
        hentOppgaverOgMapper();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const oppdaterOppgaveEtterOppdatering = (oppdatertOppgave: Oppgave) => {
        settOppgaveResponse((prevState) =>
            oppdaterOppgaveIOppgaveResponse(prevState, oppdatertOppgave)
        );
    };

    return (
        <VStack gap={'2'}>
            <Heading size={'xsmall'}>TS-sak og GOSYS</Heading>
            <DataViewer response={{ oppgaveResponse, mapper }}>
                {({ oppgaveResponse, mapper }) => (
                    <>
                        <Oppgaveliste
                            oppgaver={oppgaveResponse.oppgaver}
                            mapper={mapperTilIdRecord(mapper)}
                            oppdaterOppgaveEtterOppdatering={oppdaterOppgaveEtterOppdatering}
                        />
                        <Button
                            onClick={() => hentOppgaverOgMapper()}
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

export default Oppgaver;
