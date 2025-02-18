import { Stønadstype } from '../../../typer/behandling/behandlingTema';

export interface Oppfølging {
    id: string;
    version: number;
    behandlingId: string;
    opprettetTidspunkt: string;
    data: {
        stønadstype: Stønadstype;
        vedtakstidspunkt: string;
        perioderTilKontroll: PeriodeTilKontroll[];
    };
    kontrollert?: {
        tidspunkt: string;
        saksbehandler: string;
        utfall: OppfølgingUtfall;
        kommentar?: string;
    };
    harNyereBehandling: boolean;
}

interface PeriodeTilKontroll {
    fom: string;
    tom: string;
    målgruppe: string;
    aktivitet: string;
    endringAktivitet: Kontroll[];
    endringMålgruppe: Kontroll[];
}

interface Kontroll {
    årsak: ÅrsakKontroll;
    fom?: string;
    tom?: string;
}

enum ÅrsakKontroll {
    INGEN_TREFF = 'INGEN_TREFF',
    FOM_ENDRET = 'FOM_ENDRET',
    TOM_ENDRET = 'TOM_ENDRET',
    TREFF_MEN_FEIL_TYPE = 'TREFF_MEN_FEIL_TYPE',
}

export const årsakKontrollTilTekst: Record<ÅrsakKontroll, string> = {
    INGEN_TREFF: 'Ingen treff',
    FOM_ENDRET: 'Fom endret',
    TOM_ENDRET: 'Tom endret',
    TREFF_MEN_FEIL_TYPE: 'Treff, men feil type',
};

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
