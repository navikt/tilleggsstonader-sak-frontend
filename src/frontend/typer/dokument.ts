import { AvsenderMottaker, Journalposttype, Journalstatus } from './journalpost';

export interface DokumentInfo {
    dokumentinfoId: string;
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

interface LogiskVedlegg {
    tittel: string;
}

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
