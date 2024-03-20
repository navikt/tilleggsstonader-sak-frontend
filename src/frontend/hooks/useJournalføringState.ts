import { useState } from 'react';

import { useHentFagsakPerson } from './useFagsakPerson';
import { Journalføringsårsak } from '../Sider/Journalføring/Felles/utils.';
import { behandlingstemaTilStønadstype } from '../Sider/Oppgavebenk/typer/oppgave';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { DokumentInfo, LogiskeVedleggPåDokument } from '../typer/dokument';
import { Journalpost, JournalpostResponse } from '../typer/journalpost';

interface NyAvsender {
    erBruker: boolean;
    navn?: string;
    personIdent?: string;
}

export enum Journalføringsaksjon {
    OPPRETT_BEHANDLING = 'OPPRETT_BEHANDLING',
    JOURNALFØR_PÅ_FAGSAK = 'JOURNALFØR_PÅ_FAGSAK',
}

export interface JournalføringState {
    journalpost: Journalpost;
}

export const useJournalføringState = (
    journalResponse: JournalpostResponse,
    oppgaveId: string,
    gjelderKlage?: boolean
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
        } else if (gjelderKlage) {
            return Journalføringsårsak.KLAGE;
        } else {
            return Journalføringsårsak.IKKE_VALGT;
        }
    };

    const utledFørsteDokument = (dokumenter: DokumentInfo[]) =>
        dokumenter.length > 0 ? dokumenter[0].dokumentInfoId : '';

    const { fagsakPerson, hentFagsakPerson } = useHentFagsakPerson();

    const [stønadstype, settStønadstype] = useState<Stønadstype | undefined>(
        behandlingstemaTilStønadstype(journalpost.behandlingstema)
    );
    const [valgtDokumentPanel, settValgtDokumentPanel] = useState<string>(
        utledFørsteDokument(journalpost.dokumenter)
    );
    const [nyAvsender, settNyAvsender] = useState<NyAvsender>();
    const [journalføringsaksjon, settJournalføringsaksjon] = useState<Journalføringsaksjon>(
        Journalføringsaksjon.JOURNALFØR_PÅ_FAGSAK
    );
    const [mottattDato, settMottattDato] = useState<string | undefined>(
        journalResponse.journalpost.datoMottatt
    );

    return {
        journalpost,
    };
};
