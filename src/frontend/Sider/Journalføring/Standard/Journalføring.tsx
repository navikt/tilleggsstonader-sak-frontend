import React, { useEffect } from 'react';

import { Navigate } from 'react-router-dom';
import styled from 'styled-components';

import { useQueryParams } from '../../../hooks/felles/useQueryParams';
import { useHentJournalpost } from '../../../hooks/useHentJournalpost';
import DataViewer from '../../../komponenter/DataViewer';
import { JournalpostResponse } from '../../../typer/journalpost';
import {
    GJELDER_KLAGE_QUERY_STRING,
    JOURNALPOST_QUERY_STRING,
    OPPGAVEID_QUERY_STRING,
} from '../../Oppgavebenk/oppgaveutils';

export const SideLayout = styled.div``;

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
        height: calc(100vh - 4rem);
        max-width: 750px;
    }
`;
export const Høyrekolonne = styled.div`
    display: flex;
    flex: 1 1 auto;
    min-width: 450px;
    height: calc(100vh - 4rem);
`;

export const FlexKnapper = styled.div`
    margin: 1rem;
    display: flex;
    justify-content: space-between;
`;

export const Journalføring: React.FC = () => {
    const query: URLSearchParams = useQueryParams();
    const oppgaveId = query.get(OPPGAVEID_QUERY_STRING);
    const journalpostId = query.get(JOURNALPOST_QUERY_STRING);
    const gjelderKlage = query.get(GJELDER_KLAGE_QUERY_STRING) === 'true';

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
                    <JournalføringSide
                        oppgaveId={oppgaveId}
                        gjelderKlage={gjelderKlage}
                        journalResponse={journalResponse}
                    />
                );
            }}
        </DataViewer>
    );
};

interface Props {
    oppgaveId: string;
    gjelderKlage: boolean;
    journalResponse: JournalpostResponse;
}

const JournalføringSide: React.FC<Props> = ({ oppgaveId, gjelderKlage, journalResponse }) => {
    return (
        <div>
            <h1>Journalføring</h1>
            <p>{oppgaveId}</p>
            <p>{gjelderKlage}</p>
            <p>{journalResponse.navn}</p>
        </div>
    );
};
