import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { AktivitetType } from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../../Behandling/Inngangsvilkår/typer/vilkårperiode/målgruppe';

export interface Oppfølging {
    id: string;
    version: number;
    behandlingId: string;
    opprettetTidspunkt: string;
    perioderTilKontroll: PeriodeTilKontroll[];
    kontrollert?: {
        tidspunkt: string;
        saksbehandler: string;
        utfall: OppfølgingUtfall;
        kommentar?: string;
    };
    behandlingsdetaljer: {
        saksnummer: number;
        fagsakPersonId: string;
        fagsakPersonIdent: string;
        fagsakPersonNavn: string;
        stønadstype: Stønadstype;
        vedtakstidspunkt: string;
        harNyereBehandling: boolean;
    };
}

interface PeriodeTilKontroll {
    fom: string;
    tom: string;
    type: MålgruppeType | AktivitetType;
    endringer: Kontroll[];
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
    FINNER_IKKE_REGISTERAKTIVITET = 'FINNER_IKKE_REGISTERAKTIVITET',
}

export const årsakKontrollTilTekst: Record<ÅrsakKontroll, string> = {
    INGEN_TREFF: 'Finner ikke periode i register',
    FOM_ENDRET: 'Fom. starter senere',
    TOM_ENDRET: 'Tom. slutter tidligere',
    TREFF_MEN_FEIL_TYPE: 'Overlappende periode, men feil type',
    FINNER_IKKE_REGISTERAKTIVITET: 'Finner ikke registeraktivitet',
};

export enum OppfølgingUtfall {
    HÅNDTERT = 'HÅNDTERT',
    IGNORERES = 'IGNORERES',
    UTSETTES = 'UTSETTES',
    UNDER_ARBEID = 'UNDER_ARBEID',
}

export const oppfølgingUtfallTilTekst: Record<OppfølgingUtfall, string> = {
    HÅNDTERT: 'Håndtert',
    IGNORERES: 'Ignoreres',
    UTSETTES: 'Utsettes',
    UNDER_ARBEID: 'Under arbeid',
};

export interface OppfølgingKontrollRequest {
    id: string;
    version: number;
    utfall: OppfølgingUtfall;
    kommentar: string | undefined;
}
