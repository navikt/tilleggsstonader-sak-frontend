import React, { useEffect, useState } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Heading } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useQueryParams } from '../../../hooks/felles/useQueryParams';
import { useHentJournalpost } from '../../../hooks/useHentJournalpost';
import { JournalføringState, useJournalføringState } from '../../../hooks/useJournalføringState';
import DataViewer from '../../../komponenter/DataViewer';
import { JournalpostResponse } from '../../../typer/journalpost';
import {
    GJELDER_KLAGE_QUERY_STRING,
    JOURNALPOST_QUERY_STRING,
    OPPGAVEID_QUERY_STRING,
} from '../../Oppgavebenk/oppgaveutils';
import PdfVisning from '../Felles/PdfVisning';

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

const InnerContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.25rem;
`;

const Tittel = styled(Heading)`
    margin-bottom: 0.5rem;
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

    console.log('rendrer journalføring');

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
    const { saksbehandler, erSaksbehandler, settToast } = useApp();
    const navigate = useNavigate();
    const journalpostState: JournalføringState = useJournalføringState(
        journalResponse,
        oppgaveId,
        gjelderKlage
    );

    const { journalpost } = journalpostState;

    const [feilmelding, settFeilmelding] = useState<string>('');

    return (
        <Kolonner>
            <Venstrekolonne>
                <InnerContainer>
                    <section>
                        <Tittel size={'medium'} level={'1'}>
                            Journalføring
                        </Tittel>
                    </section>
                </InnerContainer>
            </Venstrekolonne>
            <Høyrekolonne>
                <PdfVisning journalpost={journalpost} />
            </Høyrekolonne>
        </Kolonner>
    );
};
