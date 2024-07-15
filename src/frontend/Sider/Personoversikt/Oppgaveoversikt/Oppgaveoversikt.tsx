import React, { useEffect, useState } from 'react';

import Oppgaveliste from './Oppgaveliste';
import { mapperTilIdRecord } from './utils';
import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';
import { Mappe, Oppgave, OppgaverResponse } from '../../Oppgavebenk/typer/oppgave';
import { oppdaterOppgaveIOppgaveResponse } from '../../Oppgavebenk/oppgaveutils';

const Oppgaveoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [oppgaveResponse, settOppgaveResponse] =
        useState<Ressurs<OppgaverResponse>>(byggTomRessurs());
    const [mapper, settMapper] = useState<Ressurs<Mappe[]>>(byggTomRessurs());

    useEffect(() => {
        const hentOppgaver = () =>
            request<OppgaverResponse, null>(`/api/sak/oppgave/soek/person/${fagsakPersonId}`).then(
                settOppgaveResponse
            );

        const hentMapper = () =>
            request<Mappe[], null>(`/api/sak/oppgave/mapper`, 'GET').then(settMapper);

        hentOppgaver();
        hentMapper();
    }, [fagsakPersonId, request]);

    const oppdaterOppgaveEtterOppdatering = (oppdatertOppgave: Oppgave) => {
        settOppgaveResponse((prevState) =>
            oppdaterOppgaveIOppgaveResponse(prevState, oppdatertOppgave)
        );
    };

    return (
        <DataViewer response={{ oppgaveResponse, mapper }}>
            {({ oppgaveResponse, mapper }) => (
                <Oppgaveliste
                    oppgaver={oppgaveResponse.oppgaver}
                    mapper={mapperTilIdRecord(mapper)}
                    oppdaterOppgaveEtterOppdatering={oppdaterOppgaveEtterOppdatering}
                />
            )}
        </DataViewer>
    );
};

export default Oppgaveoversikt;
