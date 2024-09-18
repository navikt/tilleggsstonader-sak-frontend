import React, { useCallback, useEffect, useState } from 'react';

import { Button, Detail, Heading, HelpText, HStack, VStack } from '@navikt/ds-react';

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

    const hentOppgaverOgMapper = useCallback(async () => {
        settOppgaveResponse(
            await request<OppgaverResponse, null>(`/api/sak/oppgave/soek/person/${fagsakPersonId}`)
        );
        settMapper(await request<Mappe[], null>(`/api/sak/oppgave/mapper`, 'GET'));

        settOppdatertTidspunkt(new Date());
    }, [fagsakPersonId, request]);

    useEffect(() => {
        void hentOppgaverOgMapper();
    }, [hentOppgaverOgMapper]);

    const oppdaterOppgaveEtterOppdatering = (oppdatertOppgave: Oppgave) => {
        settOppgaveResponse((prevState) =>
            oppdaterOppgaveIOppgaveResponse(prevState, oppdatertOppgave)
        );
    };

    return (
        <VStack gap={'2'}>
            <Heading size="small" spacing>
                Ubehandlede oppgaver på bruker{' '}
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
                        <HStack gap="2" align="baseline">
                            <Detail>
                                Informasjon hentet: {formaterDatoMedTidspunkt(oppdatertTidspunkt)}
                            </Detail>
                            <Button
                                onClick={hentOppgaverOgMapper}
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

export default Oppgaver;
