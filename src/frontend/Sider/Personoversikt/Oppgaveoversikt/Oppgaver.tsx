import React, { useEffect, useState } from 'react';

import { Detail, Heading, HelpText, HStack, VStack } from '@navikt/ds-react';

import Oppgaveliste from './Oppgaveliste';
import { mapperTilIdRecord } from './utils';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggTomRessurs, Ressurs } from '../../../typer/ressurs';
import { formaterDatoMedTidspunkt } from '../../../utils/dato';
import { oppdaterOppgaveIOppgaveResponse } from '../../Oppgavebenk/oppgaveutils';
import { Mappe, Oppgave, OppgaverResponse } from '../../Oppgavebenk/typer/oppgave';

const Oppgaver: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [oppgaveResponse, settOppgaveResponse] =
        useState<Ressurs<OppgaverResponse>>(byggTomRessurs());

    const [mapper, settMapper] = useState<Ressurs<Mappe[]>>(byggTomRessurs());

    const [oppdatertTidspunkt, settOppdatertTidspunkt] = useState<Date | undefined>();

    useEffect(() => {
        Promise.all([
            request<OppgaverResponse, null>(`/api/sak/oppgave/soek/person/${fagsakPersonId}`),
            request<Mappe[], null>(`/api/sak/oppgave/mapper`, 'GET'),
        ]).then(([oppgaverRespons, mappeRespons]) => {
            settOppgaveResponse(oppgaverRespons);
            settMapper(mappeRespons);
            settOppdatertTidspunkt(new Date());
        });
    }, [fagsakPersonId, request]);

    const oppdaterOppgaveEtterOppdatering = (oppdatertOppgave: Oppgave) => {
        settOppgaveResponse((prevState) =>
            oppdaterOppgaveIOppgaveResponse(prevState, oppdatertOppgave)
        );
    };

    return (
        <VStack gap={'2'}>
            <Heading size="small" spacing>
                Ubehandlede oppgaver på bruker
            </Heading>
            <HStack gap="2">
                <Heading size="xsmall">TS-sak og GOSYS </Heading>
                <HelpText>
                    TS-sak og Gosys bruker samme oppgavesystem, men det er bare støtte for å
                    behandle noen typer oppgaver for tilsyn barn i TS-sak.
                </HelpText>
            </HStack>
            <DataViewer response={{ oppgaveResponse, mapper }}>
                {({ oppgaveResponse, mapper }) => (
                    <>
                        <Oppgaveliste
                            oppgaver={oppgaveResponse.oppgaver}
                            mapper={mapperTilIdRecord(mapper)}
                            oppdaterOppgaveEtterOppdatering={oppdaterOppgaveEtterOppdatering}
                        />
                        <Detail>
                            Informasjon hentet: {formaterDatoMedTidspunkt(oppdatertTidspunkt)}
                        </Detail>
                    </>
                )}
            </DataViewer>
        </VStack>
    );
};

export default Oppgaver;
