export interface Oppfølging {
    id: string;
    version: number;
    behandlingId: string;
    utfall?: OppfølgingUtfall;
}

export enum OppfølgingUtfall {
    OK = 'OK',
    IKKE_OK = 'IKKE_OK',
}

export interface OppfølgingKontrollRequest {
    id: string;
    version: number;
    utfall: OppfølgingUtfall;
    kommentar: string | undefined;
}
