import React, { useEffect } from 'react';

import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import Dokumenter from './Dokumenter';
import { useQueryParams } from '../../../hooks/felles/useQueryParams';
import { useHentJournalpost } from '../../../hooks/useHentJournalpost';
import { JournalføringState, useJournalføringState } from '../../../hooks/useJournalføringState';
import DataViewer from '../../../komponenter/DataViewer';
import { JournalpostResponse } from '../../../typer/journalpost';
import { JOURNALPOST_QUERY_STRING, OPPGAVEID_QUERY_STRING } from '../../Oppgavebenk/oppgaveutils';
import PdfVisning from '../Felles/PdfVisning';

export const Kolonner = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
`;

export const Venstrekolonne = styled.div`
    padding: 1rem 2rem 1rem 2rem;
    height: inherit;
    overflow: auto;
    @media (min-width: 1225px) {
        height: calc(100vh - 3.5rem);
        max-width: 750px;
    }
`;
export const Høyrekolonne = styled.div`
    display: flex;
    flex: 1 1 auto;
    min-width: 450px;
    height: calc(100vh - 3.5rem);
`;

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
    min-width: 42.75rem;
`;

export const Journalføring: React.FC = () => {
    const query: URLSearchParams = useQueryParams();
    const oppgaveId = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostId = query.get(JOURNALPOST_QUERY_STRING);

    const { hentJournalPost, journalResponse } = useHentJournalpost();

    useEffect(() => {
        document.title = 'Journalpost';
        hentJournalPost(journalpostId);
    }, [hentJournalPost, journalpostId]);

    // TODO: Kan vurdere å vise en infostripe med feilmelding her
    if (!oppgaveId || !journalpostId) {
        return <Navigate to="/oppgavebenk" />;
    }

    return (
        <DataViewer response={{ journalResponse }}>
            {({ journalResponse }) => {
                return (
                    <JournalføringSide oppgaveId={oppgaveId} journalResponse={journalResponse} />
                );
            }}
        </DataViewer>
    );
};

interface Props {
    oppgaveId: string;
    journalResponse: JournalpostResponse;
}

const JournalføringSide: React.FC<Props> = ({ journalResponse }) => {
    const journalpostState: JournalføringState = useJournalføringState(journalResponse);

    return (
        <Kolonner>
            <Venstrekolonne>
                <InnerContainer>
                    <section>
                        <Heading spacing size={'medium'} level={'1'}>
                            Journalføring
                        </Heading>
                    </section>
                    <section>
                        <Heading spacing size={'small'} level={'2'}>
                            Dokumenter
                        </Heading>
                        <Dokumenter journalpostState={journalpostState} />
                    </section>
                </InnerContainer>
            </Venstrekolonne>
            <Høyrekolonne>
                <PdfVisning journalpostState={journalpostState} />
            </Høyrekolonne>
        </Kolonner>
    );
};
