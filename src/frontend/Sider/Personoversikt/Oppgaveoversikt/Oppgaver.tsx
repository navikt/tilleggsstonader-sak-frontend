import React, { useCallback, useEffect, useState } from 'react';

import { Detail, Heading, VStack } from '@navikt/ds-react';

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

    const hentOppgaverPåNytt = useCallback(() => {
        request<OppgaverResponse, null>(`/api/sak/oppgave/soek/person/${fagsakPersonId}`).then(
            (response) => {
                settOppgaveResponse(response);
                settOppdatertTidspunkt(new Date());
            }
        );
    }, [fagsakPersonId, request]);

    const oppdaterOppgaveEtterOppdatering = (oppdatertOppgave: Oppgave) => {
        settOppgaveResponse((prevState) =>
            oppdaterOppgaveIOppgaveResponse(prevState, oppdatertOppgave)
        );
    };

    return (
        <VStack gap={'space-8'}>
            <Heading size="small" spacing>
                Ubehandlede oppgaver på bruker
            </Heading>
            <Heading size="xsmall">TS-sak og GOSYS </Heading>
            <DataViewer type={'oppgaver'} response={{ oppgaveResponse, mapper }}>
                {({ oppgaveResponse, mapper }) => (
                    <>
                        <Oppgaveliste
                            oppgaver={oppgaveResponse.oppgaver}
                            mapper={mapperTilIdRecord(mapper)}
                            oppdaterOppgaveEtterOppdatering={oppdaterOppgaveEtterOppdatering}
                            hentOppgaver={hentOppgaverPåNytt}
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
