import { AvsenderMottaker, Journalposttype, Journalstatus } from './journalpost';

export interface DokumentInfo {
    dokumentInfoId: string;
    filnavn?: string;
    tittel: string;
    journalpostId: string;
    dato: string;
    tema?: string; // Arkiv
    journalstatus: Journalstatus;
    journalposttype: Journalposttype;
    harSaksbehandlerTilgang: boolean;
    logiskeVedlegg: LogiskVedlegg[];
    avsenderMottaker?: AvsenderMottaker;
    utsendingsinfo?: Utsendingsinfo;
}

export interface LogiskVedlegg {
    logiskVedleggId: string;
    tittel: string;
}

export type DokumentTitler = Record<string, string>;
export type LogiskeVedleggPåDokument = Record<string, LogiskVedlegg[]>;

interface Utsendingsinfo {
    varselSendt: VarselSendt[];
    fysiskpostSendt?: FysiskpostSendt;
    digitalpostSendt?: DigitalpostSendt;
}

type FysiskpostSendt = {
    adressetekstKonvolutt: string;
};

type DigitalpostSendt = {
    adresse: string;
};

type VarselSendt = {
    type: 'SMS' | 'EPOST';
    varslingstidspunkt?: string;
};
