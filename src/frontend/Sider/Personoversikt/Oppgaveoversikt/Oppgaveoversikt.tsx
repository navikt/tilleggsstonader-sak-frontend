import React, { useCallback, useEffect, useState } from 'react';
import { Mappe, OppgaverResponse } from '../../Oppgavebenk/typer/oppgave';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import Oppgaveliste from './Oppgaveliste';
import DataViewer from '../../../komponenter/DataViewer';
import { mapperTilIdRecord } from './utils';

const Oppgaveoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [oppgaveResponse, settOppgaveResponse] =
        useState<Ressurs<OppgaverResponse>>(byggTomRessurs());
    const [mapper, settMapper] = useState<Ressurs<Mappe[]>>(byggTomRessurs());

    const hentOppgaver = useCallback(() => {
        request<OppgaverResponse, null>(
            `/api/sak/oppgave/soek/person/${fagsakPersonId}`,
            'POST'
        ).then(settOppgaveResponse);
    }, [request]);

    const hentMapper = useCallback(() => {
        request<Mappe[], null>(`/api/sak/oppgave/mapper`, 'GET').then(settMapper);
    }, [request]);

    useEffect(() => {
        hentOppgaver();
        hentMapper();
    }, []);

    return (
        <DataViewer response={{ oppgaveResponse, mapper }}>
            {({ oppgaveResponse, mapper }) => (
                <Oppgaveliste
                    oppgaver={oppgaveResponse.oppgaver}
                    mapper={mapperTilIdRecord(mapper)}
                />
            )}
        </DataViewer>
    );
};

export default Oppgaveoversikt;
