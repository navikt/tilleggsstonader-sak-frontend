import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { AktivitetType } from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';

export interface Oppfølging {
    id: string;
    version: number;
    behandlingId: string;
    opprettetTidspunkt: string;
    data: {
        perioderTilKontroll: PeriodeTilKontroll[];
    };
    kontrollert?: {
        tidspunkt: string;
        saksbehandler: string;
        utfall: OppfølgingUtfall;
        kommentar?: string;
    };
    behandlingsdetaljer: {
        saksnummer: number;
        fagsakPersonId: string;
        stønadstype: Stønadstype;
        vedtakstidspunkt: string;
        harNyereBehandling: boolean;
    };
}

interface PeriodeTilKontroll {
    fom: string;
    tom: string;
    målgruppe: MålgruppeType;
    aktivitet: AktivitetType;
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
    INGEN_TREFF: 'Ingen overlappende periode',
    FOM_ENDRET: 'Fom begynner ',
    TOM_ENDRET: 'Tom slutter ',
    TREFF_MEN_FEIL_TYPE: 'Overlappende periode, men feil type',
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
