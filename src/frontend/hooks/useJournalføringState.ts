import { Dispatch, SetStateAction, useEffect, useState } from 'react';

import { useHentBehandlinger } from './useHentBehandlinger';
import { useApp } from '../context/AppContext';
import { journalpostTilStønadstype } from '../Sider/Journalføring/Felles/utils';
import { Journalføringsårsak } from '../Sider/Journalføring/typer/journalføringsårsak';
import { BehandlingForJournalføring } from '../typer/behandling/behandling';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { DokumentTitler, LogiskeVedleggPåDokument } from '../typer/dokument';
import { DokumentInfoJournalpost, Journalpost, JournalpostResponse } from '../typer/journalpost';
import { byggHenterRessurs, byggTomRessurs, Ressurs, RessursStatus } from '../typer/ressurs';

interface NyAvsender {
    erBruker: boolean;
    navn?: string;
    personIdent?: string;
}

export enum Journalføringsaksjon {
    OPPRETT_BEHANDLING = 'OPPRETT_BEHANDLING',
    JOURNALFØR_PÅ_FAGSAK = 'JOURNALFØR_PÅ_FAGSAK',
}

export interface JournalføringRequest {
    oppgaveId: string;
    nyAvsender: NyAvsender | undefined;
    dokumentTitler: DokumentTitler | undefined;
    logiskeVedlegg: LogiskeVedleggPåDokument | undefined;
    journalførendeEnhet: string;
    årsak: Journalføringsårsak;
    aksjon: Journalføringsaksjon;
    mottattDato: string | undefined;
    stønadstype: Stønadstype | undefined;
}

export interface JournalføringState {
    behandlinger: Ressurs<BehandlingForJournalføring[]>;
    dokumentTitler?: DokumentTitler;
    settDokumentTitler: Dispatch<SetStateAction<DokumentTitler | undefined>>;
    journalpost: Journalpost;
    logiskeVedleggPåDokument?: LogiskeVedleggPåDokument;
    settLogiskeVedleggPåDokument: Dispatch<SetStateAction<LogiskeVedleggPåDokument>>;
    valgtDokumentPanel: string;
    settValgtDokumentPanel: Dispatch<SetStateAction<string>>;
    nyAvsender: NyAvsender | undefined;
    settNyAvsender: Dispatch<SetStateAction<NyAvsender | undefined>>;
    journalføringsårsak: Journalføringsårsak;
    settJournalføringsårsak: Dispatch<SetStateAction<Journalføringsårsak>>;
    stønadstype: Stønadstype | undefined;
    settStønadstype: Dispatch<SetStateAction<Stønadstype | undefined>>;
    journalføringsaksjon: Journalføringsaksjon;
    settJournalføringsaksjon: Dispatch<SetStateAction<Journalføringsaksjon>>;
    mottattDato: string | undefined;
    settMottattDato: Dispatch<SetStateAction<string | undefined>>;
    innsending: Ressurs<string>;
    fullførJournalføring: () => void;
    visBekreftelsesModal: boolean;
    settVisBekreftelsesModal: Dispatch<SetStateAction<boolean>>;
}

export const useJournalføringState = (
    journalResponse: JournalpostResponse,
    oppgaveId: string
): JournalføringState => {
    const { harStrukturertSøknad, journalpost, personIdent } = journalResponse;

    const initielleLogiskeVedlegg = journalResponse.journalpost.dokumenter.reduce(
        (acc, { dokumentInfoId, logiskeVedlegg }) => ({
            ...acc,
            [dokumentInfoId]: logiskeVedlegg,
        }),
        {} as LogiskeVedleggPåDokument
    );

    const utledJournalføringsårsak = () => {
        if (harStrukturertSøknad) {
            return Journalføringsårsak.DIGITAL_SØKNAD;
        } else if (journalpost.tittel && journalpost.tittel.includes('Ettersending')) {
            return Journalføringsårsak.ETTERSENDING;
        } else {
            return Journalføringsårsak.IKKE_VALGT;
        }
    };

    const utledFørsteDokument = (dokumenter: DokumentInfoJournalpost[]) =>
        dokumenter.length > 0 ? dokumenter[0].dokumentInfoId : '';

    const { request } = useApp();

    const { behandlinger, hentBehandlinger } = useHentBehandlinger();

    const [dokumentTitler, settDokumentTitler] = useState<DokumentTitler>();
    const [logiskeVedleggPåDokument, settLogiskeVedleggPåDokument] =
        useState<LogiskeVedleggPåDokument>(initielleLogiskeVedlegg);
    const [valgtDokumentPanel, settValgtDokumentPanel] = useState<string>(
        utledFørsteDokument(journalpost.dokumenter)
    );
    const [nyAvsender, settNyAvsender] = useState<NyAvsender>();
    const [journalføringsårsak, settJournalføringsårsak] = useState<Journalføringsårsak>(
        utledJournalføringsårsak()
    );
    const [stønadstype, settStønadstype] = useState<Stønadstype | undefined>(
        journalpostTilStønadstype(journalpost)
    );
    const [journalføringsaksjon, settJournalføringsaksjon] = useState<Journalføringsaksjon>(
        Journalføringsaksjon.JOURNALFØR_PÅ_FAGSAK
    );
    const [mottattDato, settMottattDato] = useState<string | undefined>(
        journalResponse.journalpost.datoMottatt
    );
    const [innsending, settInnsending] = useState<Ressurs<string>>(byggTomRessurs());
    const [visBekreftelsesModal, settVisBekreftelsesModal] = useState<boolean>(false);

    useEffect(() => {
        if (stønadstype) {
            hentBehandlinger(personIdent, stønadstype);
        }
    }, [personIdent, stønadstype, hentBehandlinger]);

    const fullførJournalføring = () => {
        if (innsending.status === RessursStatus.HENTER) {
            return;
        }

        if (behandlinger.status !== RessursStatus.SUKSESS) {
            return;
        }

        const journalføringRequest: JournalføringRequest = {
            dokumentTitler: dokumentTitler,
            logiskeVedlegg: logiskeVedleggPåDokument,
            stønadstype: stønadstype,
            oppgaveId: oppgaveId,
            journalførendeEnhet: '9999', // TODO: Utled journalførende enhet fra saksbehandler
            årsak: journalføringsårsak,
            aksjon: journalføringsaksjon,
            mottattDato: mottattDato,
            nyAvsender: nyAvsender,
        };
        settInnsending(byggHenterRessurs());

        request<string, JournalføringRequest>(
            `/api/sak/journalpost/${journalpost.journalpostId}/fullfor`,
            'POST',
            journalføringRequest
        ).then(settInnsending);
    };

    return {
        behandlinger,
        dokumentTitler,
        settDokumentTitler,
        journalpost,
        logiskeVedleggPåDokument,
        settLogiskeVedleggPåDokument,
        valgtDokumentPanel,
        settValgtDokumentPanel,
        nyAvsender,
        settNyAvsender,
        journalføringsårsak,
        settJournalføringsårsak,
        stønadstype,
        settStønadstype,
        journalføringsaksjon,
        settJournalføringsaksjon,
        mottattDato,
        settMottattDato,
        innsending,
        fullførJournalføring,
        visBekreftelsesModal,
        settVisBekreftelsesModal,
    };
};
