import { Stønadstype } from '../../../typer/behandling/behandlingTema';

export interface Oppfølging {
    id: string;
    version: number;
    behandlingId: string;
    opprettetTidspunkt: string;
    data: {
        stønadstype: Stønadstype;
        vedtakstidspunkt: string;
    };
    kontrollert?: {
        tidspunkt: string;
        saksbehandler: string;
        utfall: OppfølgingUtfall;
        kommentar?: string;
    };
    harNyereBehandling: boolean;
}

export enum OppfølgingUtfall {
    OK = 'OK',
    IKKE_OK = 'IKKE_OK',
}

export const oppfølgingUtfallTilTekst: Record<OppfølgingUtfall, string> = {
    OK: 'Ok',
    IKKE_OK: 'Ikke ok',
};

export interface OppfølgingKontrollRequest {
    id: string;
    version: number;
    utfall: OppfølgingUtfall;
    kommentar: string | undefined;
}
