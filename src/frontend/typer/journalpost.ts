export enum Journalstatus {
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

export const journalstatuserTilTekst: Record<Journalstatus, string> = {
    MOTTATT: 'Mottatt',
    JOURNALFOERT: 'Journalført',
    FERDIGSTILT: 'Ferdigstilt',
    EKSPEDERT: 'Ekspedert',
    UNDER_ARBEID: 'Under arbeid',
    UTGAAR: 'Utgår',
    UKJENT_BRUKER: 'Ukjent bruker',
    RESERVERT: 'Reservert',
    OPPLASTING_DOKUMENT: 'Opplasting',
    UKJENT: 'Ukjent',
    FEILREGISTRERT: 'Feilregistrert',
    AVBRUTT: 'Avbrutt',
};

export type Journalposttype = 'I' | 'U' | 'N';

export interface AvsenderMottaker {
    id?: string;
    type?: AvsenderMottakerIdType;
    navn?: string;
    land?: string;
    erLikBruker: boolean;
}

export type AvsenderMottakerIdType = 'FNR' | 'HPRNR' | 'NULL' | 'ORGNR' | 'UKJENT' | 'UTL_ORG';
