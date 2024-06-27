import React, { useState } from 'react';

import { useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Heading, List, TextField } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import DataViewer from '../../../komponenter/DataViewer';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../../../typer/ressurs';
import { byggFeiletRessurs } from '../../Klage/App/typer/ressurs';

const Container = styled.div`
    width: 40rem;
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
`;

interface JournalpostStatus {
    ident: string;
    barnIdenterFraSøknad: string[];
    fagsakId?: string;
}

const OpprettBehandlingFraJournalpost: React.FC = () => {
    const { request } = useApp();
    const navigate = useNavigate();
    const [journalpostId, settJournalpostId] = useState<string>('');

    const [journalpostStatus, settJournalpostStatus] =
        useState<Ressurs<JournalpostStatus>>(byggTomRessurs());

    const [opprettBehandlingResponse, settOpprettBehandlingResponse] =
        useState<Ressurs<JournalpostStatus>>(byggTomRessurs());

    const hentJournalpostStatus = () => {
        if (!journalpostId.trim()) {
            settJournalpostStatus(byggFeiletRessurs('Mangler journalpostId'));
            return;
        }
        settJournalpostStatus(byggHenterRessurs());
        request<JournalpostStatus, null>(`/api/sak/behandling/journalpost/${journalpostId}`).then(
            settJournalpostStatus
        );
    };

    const opprettBehandling = () => {
        if (!journalpostId.trim()) {
            settOpprettBehandlingResponse(byggFeiletRessurs('Mangler journalpostId'));
            return;
        }

        request<JournalpostStatus, string>(
            `/api/sak/behandling/journalpost/${journalpostId}`,
            'POST',
            undefined
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                navigate(`/behandling/${res.data}`);
            } else {
                settOpprettBehandlingResponse(res);
            }
        });
    };

    return (
        <Container>
            <Heading size={'medium'}>Opprett behandling fra søknad fra tidligere løsning</Heading>
            <TextField
                label={'JournalpostId'}
                description={'Søk etter journalpostId'}
                onChange={(e) => {
                    settJournalpostId(e.target.value);
                }}
            />
            <Button
                variant={'primary'}
                size={'small'}
                disabled={!journalpostId.trim()}
                onClick={hentJournalpostStatus}
            >
                Hent info om journalpost
            </Button>

            <DataViewer response={{ journalpostStatus }}>
                {({ journalpostStatus }) => (
                    <>
                        <Heading size={'small'}>Informasjon fra søknad</Heading>
                        <List title={'Barn i søknad'}>
                            {journalpostStatus.barnIdenterFraSøknad.map((ident, indeks) => (
                                <List.Item key={indeks}>{ident}</List.Item>
                            ))}
                        </List>
                        <Button variant={'secondary'} size={'small'} onClick={opprettBehandling}>
                            Opprett behandling fra søknad
                        </Button>
                    </>
                )}
            </DataViewer>
            <DataViewer response={{ opprettBehandlingResponse }}>{() => <>Ok</>}</DataViewer>
        </Container>
    );
};

export default OpprettBehandlingFraJournalpost;
