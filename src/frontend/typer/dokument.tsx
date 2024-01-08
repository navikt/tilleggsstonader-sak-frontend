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

enum Journalstatus {
    MOTTATT = 'MOTTATT',
    JOURNALFOERT = 'JOURNALFOERT',
    FERDIGSTILT = 'FERDIGSTILT',
    EKSPEDERT = 'EKSPEDERT',
    UNDER_ARBEID = 'UNDER_ARBEID',
    FEILREGISTRERT = 'FEILREGISTRERT',
    UTGAAR = 'UTGAAR',
    AVBRUTT = 'AVBRUTT',
    UKJENT_BRUKER = 'UKJENT_BRUKER',
    RESERVERT = 'RESERVERT',
    OPPLASTING_DOKUMENT = 'OPPLASTING_DOKUMENT',
    UKJENT = 'UKJENT',
}

type Journalposttype = 'I' | 'U' | 'N';

interface LogiskVedlegg {
    tittel: string;
}

interface AvsenderMottaker {
    id?: string;
    type?: AvsenderMottakerIdType;
    navn?: string;
    land?: string;
    erLikBruker: boolean;
}

type AvsenderMottakerIdType = 'FNR' | 'HPRNR' | 'NULL' | 'ORGNR' | 'UKJENT' | 'UTL_ORG';

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
