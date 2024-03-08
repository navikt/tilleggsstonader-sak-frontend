export interface FaktaDokumentasjon {
    journalpostId: string;
    dokumentasjon: Dokumentasjon[];
}

export interface Dokumentasjon {
    type: string;
    harSendtInn: boolean;
    dokumenter: Dokument[];
    identBarn?: string;
}

export interface Dokument {
    dokumentInfoId: string;
}
