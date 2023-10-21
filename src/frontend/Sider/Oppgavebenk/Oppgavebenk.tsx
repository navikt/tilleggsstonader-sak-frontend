import React, { useCallback, useEffect, useState } from 'react';

import styled from 'styled-components';

import { Oppgavefiltrering } from './filter/Oppgavefiltrering';
import Oppgavetabell from './Oppgavetabell';
import { OpprettDummyBehandling } from './OpprettDummyBehandling';
import { Mappe, tomMappeListe } from './typer/mappe';
import { OppgaveRequest, OppgaverResponse } from './typer/oppgave';
import { useApp } from '../../context/AppContext';
import DataViewer from '../../komponenter/DataViewer';
import { AlertInfo } from '../../komponenter/Visningskomponenter/Alerts';
import { byggTomRessurs, Ressurs, RessursStatus } from '../../typer/ressurs';
import { erProd } from '../../utils/miljø';

const InfoVisning = styled(AlertInfo)`
    margin-top: 2rem;
    max-width: 60rem;

    .navds-alert__wrapper {
        max-width: 60rem;
    }
`;

const Oppgavebenk: React.FC = () => {
    const { erSaksbehandler, request } = useApp();
    const [oppgaveRessurs, settOppgaveRessurs] = useState<Ressurs<OppgaverResponse>>(
        byggTomRessurs()
    );
    const [mapper, settMapper] = useState<Mappe[]>(tomMappeListe);

    useEffect(() => {
        document.title = 'Oppgavebenk';
    }, []);

    useEffect(() => {
        request<Mappe[], null>(`/api/sak/oppgave/mapper`).then((ressurs) => {
            ressurs.status === RessursStatus.SUKSESS && settMapper(ressurs.data);
        });
    }, [request]);

    const hentOppgaver = useCallback(
        (data: OppgaveRequest) => {
            request<OppgaverResponse, OppgaveRequest>(`/api/sak/oppgave/soek`, 'POST', data).then(
                settOppgaveRessurs
            );
        },
        [request]
    );

    if (!erSaksbehandler) {
        return (
            <InfoVisning>
                Oppgavebenken er ikke tilgjengelig for veiledere. Benytt fødselsnummer i søkefelt
                for å finne informasjon om en person
            </InfoVisning>
        );
    }

    return (
        <div>
            {!erProd() && <OpprettDummyBehandling />}
            <div>
                OppgaveBenk
                <Oppgavefiltrering hentOppgaver={hentOppgaver} mapper={[]} feilmelding={''} />
                <DataViewer response={{ oppgaver: oppgaveRessurs }}>
                    {({ oppgaver }) => (
                        <Oppgavetabell oppgaver={oppgaver.oppgaver} mapper={mapper} />
                    )}
                </DataViewer>
            </div>
        </div>
    );
};

export default Oppgavebenk;
