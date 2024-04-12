import React, { useEffect, useState } from 'react';

import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Alert, Button, Heading, HStack } from '@navikt/ds-react';

import AvsenderPanel from './AvsenderPanel';
import Behandlinger from './Behandlinger';
import BrukerPanel from './BrukerPanel';
import Dokumenter from './Dokumenter';
import JournalpostPanel from './JournalpostPanel';
import { BekreftJournalføringModal } from './Modal';
import { validerJournalføring } from './validerJournalføring';
import { useQueryParams } from '../../../hooks/felles/useQueryParams';
import { useHentJournalpost } from '../../../hooks/useHentJournalpost';
import { JournalføringState, useJournalføringState } from '../../../hooks/useJournalføringState';
import DataViewer from '../../../komponenter/DataViewer';
import { JournalpostResponse } from '../../../typer/journalpost';
import { RessursStatus } from '../../../typer/ressurs';
import { JOURNALPOST_QUERY_STRING, OPPGAVEID_QUERY_STRING } from '../../Oppgavebenk/oppgaveutils';
import PdfVisning from '../Felles/PdfVisning';
import { journalføringGjelderKlage, skalViseBekreftelsesmodal } from '../Felles/utils';
import { Journalføringsårsak } from '../typer/journalføringsårsak';

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
            {({ journalResponse }) => (
                <JournalføringSide oppgaveId={oppgaveId} journalResponse={journalResponse} />
            )}
        </DataViewer>
    );
};

interface Props {
    oppgaveId: string;
    journalResponse: JournalpostResponse;
}

const JournalføringSide: React.FC<Props> = ({ journalResponse, oppgaveId }) => {
    const journalpostState: JournalføringState = useJournalføringState(journalResponse, oppgaveId);
    const navigate = useNavigate();

    const {
        behandlinger,
        fullførJournalføring,
        settVisBekreftelsesModal,
        journalføringsaksjon,
        journalføringsårsak,
    } = journalpostState;

    const [feilmelding, settFeilmelding] = useState<string>('');

    const senderInnJournalføring = journalpostState.innsending.status == RessursStatus.HENTER;
    const erPapirSøknad = journalføringsårsak === Journalføringsårsak.PAPIRSØKNAD;

    const validerOgJournalfør = () => {
        settFeilmelding('');
        if (behandlinger.status !== RessursStatus.SUKSESS) {
            settFeilmelding('Henting av fagsak feilet. Last inn siden på nytt.');
            return;
        }
        const valideringsfeil = validerJournalføring(
            journalResponse,
            journalpostState,
            behandlinger.data
        );

        if (valideringsfeil) {
            settFeilmelding(valideringsfeil);
        } else if (
            skalViseBekreftelsesmodal(
                journalResponse,
                journalføringsaksjon,
                erPapirSøknad,
                journalføringGjelderKlage(journalføringsårsak)
            )
        ) {
            settVisBekreftelsesModal(true);
        } else {
            fullførJournalføring();
        }
    };

    return (
        <>
            <Kolonner>
                <Venstrekolonne>
                    <InnerContainer>
                        <section>
                            <Heading spacing size={'medium'} level={'1'}>
                                Journalføring
                            </Heading>
                            <JournalpostPanel
                                journalpost={journalResponse.journalpost}
                                journalpostState={journalpostState}
                            />
                        </section>
                        <section>
                            <Heading spacing size={'small'} level={'2'}>
                                Dokumenter
                            </Heading>
                            <Dokumenter journalpostState={journalpostState} />
                        </section>
                        <section>
                            <Heading spacing size={'small'} level={'2'}>
                                Bruker
                            </Heading>
                            <BrukerPanel journalpostResponse={journalResponse} />
                        </section>
                        <section>
                            <Heading spacing size={'small'} level={'2'}>
                                Avsender
                            </Heading>
                            <AvsenderPanel
                                journalpostResponse={journalResponse}
                                journalpostState={journalpostState}
                            />
                        </section>
                        <section>
                            <Heading spacing size={'small'} level={'2'}>
                                Behandling
                            </Heading>
                            <Behandlinger
                                journalpostState={journalpostState}
                                settFeilmelding={settFeilmelding}
                            />
                        </section>
                        {feilmelding && <Alert variant="error">{feilmelding}</Alert>}
                        <HStack gap="4" justify="end">
                            <Button
                                size={'small'}
                                variant={'tertiary'}
                                onClick={() => navigate('/oppgavebenk')}
                            >
                                Avbryt
                            </Button>
                            <Button
                                size={'small'}
                                variant={'primary'}
                                onClick={validerOgJournalfør}
                                loading={senderInnJournalføring}
                                disabled={senderInnJournalføring}
                            >
                                Journalfør
                            </Button>
                        </HStack>
                    </InnerContainer>
                </Venstrekolonne>
                <Høyrekolonne>
                    <PdfVisning journalpostState={journalpostState} />
                </Høyrekolonne>
            </Kolonner>
            <BekreftJournalføringModal journalpostState={journalpostState} />
        </>
    );
};
