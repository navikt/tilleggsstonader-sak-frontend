import { Dispatch, SetStateAction, useState } from 'react';

import { Journalføringsårsak } from '../Sider/Journalføring/typer/journalføringsårsak';
import { behandlingstemaTilStønadstype } from '../Sider/Oppgavebenk/typer/oppgave';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { DokumentInfo, DokumentTitler, LogiskeVedleggPåDokument } from '../typer/dokument';
import { Journalpost, JournalpostResponse, utledDatoMottatt } from '../typer/journalpost';

export enum Journalføringsaksjon {
    OPPRETT_BEHANDLING = 'OPPRETT_BEHANDLING',
    JOURNALFØR_PÅ_FAGSAK = 'JOURNALFØR_PÅ_FAGSAK',
}
interface NyAvsender {
    erBruker: boolean;
    navn?: string;
    personIdent?: string;
}

export interface JournalføringState {
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
}

export const useJournalføringState = (journalResponse: JournalpostResponse): JournalføringState => {
    const { harStrukturertSøknad, journalpost } = journalResponse;

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

    const utledFørsteDokument = (dokumenter: DokumentInfo[]) =>
        dokumenter.length > 0 ? dokumenter[0].dokumentInfoId : '';

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
        behandlingstemaTilStønadstype(journalpost.behandlingstema)
    );
    const [journalføringsaksjon, settJournalføringsaksjon] = useState<Journalføringsaksjon>(
        Journalføringsaksjon.JOURNALFØR_PÅ_FAGSAK
    );
    const [mottattDato, settMottattDato] = useState<string | undefined>(
        utledDatoMottatt(journalResponse.journalpost.relevanteDatoer)
    );

    return {
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
    };
};
