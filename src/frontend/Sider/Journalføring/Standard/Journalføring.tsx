import React, { useEffect, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { Navigate, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Heading, HStack } from '@navikt/ds-react';

import AvsenderPanel from './AvsenderPanel';
import Behandlinger from './Behandlinger';
import BrukerPanel from './BrukerPanel';
import Dokumenter from './Dokumenter';
import JournalpostPanel from './JournalpostPanel';
import { BekreftJournalføringModal } from './Modal';
import { validerJournalføring } from './validerJournalføring';
import { useApp } from '../../../context/AppContext';
import { useQueryParams } from '../../../hooks/felles/useQueryParams';
import { useHentJournalpost } from '../../../hooks/useHentJournalpost';
import { JournalføringState, useJournalføringState } from '../../../hooks/useJournalføringState';
import DataViewer from '../../../komponenter/DataViewer';
import { Feilmelding } from '../../../komponenter/Feil/Feilmelding';
import { JournalpostResponse } from '../../../typer/journalpost';
import { erFeilressurs, RessursStatus } from '../../../typer/ressurs';
import { Toggle } from '../../../utils/toggles';
import { JOURNALPOST_QUERY_STRING, OPPGAVEID_QUERY_STRING } from '../../Oppgavebenk/oppgaveutils';
import PdfVisning from '../Felles/PdfVisning';
import { journalføringGjelderKlage, skalViseBekreftelsesmodal } from '../Felles/utils';
import { Journalføringsårsak } from '../typer/journalføringsårsak';

export const Container = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: stretch;
    height: calc(100vh - 3.5rem);
`;

const VenstreKolonne = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
    min-width: 42.75rem;
    padding: 1rem 2rem 10rem 1rem;
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

    if (!oppgaveId || !journalpostId) {
        return <Navigate to="/" />;
    }

    return (
        <DataViewer type={'journalpost'} response={{ journalResponse }}>
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
    const { saksbehandler } = useApp();

    const {
        behandlinger,
        fullførJournalføring,
        settVisBekreftelsesModal,
        journalføringsaksjon,
        journalføringsårsak,
    } = journalpostState;

    const [feilmelding, settFeilmelding] = useState<string>();

    useEffect(() => {
        if (journalpostState.innsending.status === RessursStatus.SUKSESS) {
            navigate('/');
        }
    }, [saksbehandler, journalResponse, journalpostState, navigate]);

    const kanHaFlereAktiveBehandlingerPåSammeFagsak = useFlag(
        Toggle.KAN_HA_FLERE_BEHANDLINGER_PÅ_SAMME_FAGSAK
    );

    const senderInnJournalføring = journalpostState.innsending.status == RessursStatus.HENTER;
    const erPapirSøknad = journalføringsårsak === Journalføringsårsak.PAPIRSØKNAD;
    const innsendingsfeil = erFeilressurs(journalpostState.innsending)
        ? journalpostState.innsending.frontendFeilmelding
        : undefined;

    const validerOgJournalfør = () => {
        settFeilmelding('');
        if (behandlinger.status !== RessursStatus.SUKSESS) {
            settFeilmelding('Henting av fagsak feilet. Last inn siden på nytt.');
            return;
        }

        const valideringsfeil = validerJournalføring(
            journalResponse,
            journalpostState,
            behandlinger.data,
            kanHaFlereAktiveBehandlingerPåSammeFagsak
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
            <Container>
                <VenstreKolonne>
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
                            kanHaFlereAktiveBehandlingerPerFagsak={
                                kanHaFlereAktiveBehandlingerPåSammeFagsak
                            }
                            settFeilmelding={settFeilmelding}
                        />
                    </section>
                    <Feilmelding feil={feilmelding} />
                    <Feilmelding feil={innsendingsfeil} />
                    <HStack gap="4" justify="end">
                        <Button size={'small'} variant={'tertiary'} onClick={() => navigate('/')}>
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
                </VenstreKolonne>
                <PdfVisning journalpostState={journalpostState} />
            </Container>
            <BekreftJournalføringModal journalpostState={journalpostState} />
        </>
    );
};
