import React, { useCallback, useEffect, useState } from 'react';
import { OppgaverResponse } from '../../Oppgavebenk/typer/oppgave';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';
import { useApp } from '../../../context/AppContext';
import Oppgaveliste from './Oppgaveliste';
import DataViewer from '../../../komponenter/DataViewer';

const Oppgaveoversikt: React.FC<{ fagsakPersonId: string }> = ({ fagsakPersonId }) => {
    const { request } = useApp();

    const [oppgaveResponse, settOppgaveResponse] =
        useState<Ressurs<OppgaverResponse>>(byggTomRessurs());

    const hentOppgaver = useCallback(() => {
        request<OppgaverResponse, null>(
            `/api/sak/oppgave/soek/person/${fagsakPersonId}`,
            'POST'
        ).then(settOppgaveResponse);
    }, [request]);

    useEffect(() => {
        hentOppgaver();
    }, []);

    return (
        <DataViewer response={{ oppgaveResponse }}>
            {({ oppgaveResponse }) => <Oppgaveliste oppgaver={oppgaveResponse.oppgaver} />}
        </DataViewer>
    );
};

export default Oppgaveoversikt;
