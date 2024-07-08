import { KlagebehandlingStatus } from './klagebehandlingStatus';
import { PåklagetVedtak } from '../../Steg/Formkrav/typer';
import {
    KlageinstansEventType,
    KlageinstansResultat,
    KlageinstansUtfall,
} from '../../../../typer/klage';
import { KlagebehandlingSteg } from './klagebehandlingSteg';
import { KlagebehandlingResultat } from './klagebehandlingResultat';
import { Stønadstype } from '../../../../typer/behandling/behandlingTema';

export interface Klagebehandling {
    id: string;
    fagsakId: string;
    steg: KlagebehandlingSteg;
    status: KlagebehandlingStatus;
    sistEndret: string;
    opprettet: string;
    resultat: KlagebehandlingResultat;
    vedtakDato?: string;
    stønadstype: Stønadstype;
    klageinstansResultat: KlageinstansResultat[];
    påklagetVedtak: PåklagetVedtak;
    eksternFagsystemFagsakId: string;
    klageMottatt: string;
    fagsystemRevurdering?: FagsystemRevurdering;
}

export const klagehendelseTypeTilTekst: Record<KlageinstansEventType, string> = {
    KLAGEBEHANDLING_AVSLUTTET: 'Klagebehandling avsluttet',
    ANKEBEHANDLING_OPPRETTET: 'Ankebehandling opprettet',
    ANKEBEHANDLING_AVSLUTTET: 'Ankebehandling avsluttet',
    ANKE_I_TRYGDERETTENBEHANDLING_OPPRETTET: 'Anke i trygderettenbehandling opprettet',
    BEHANDLING_FEILREGISTRERT: 'Behandling feilregistrert',
};

export const utfallTilTekst: Record<KlageinstansUtfall, string> = {
    TRUKKET: 'Trukket KA',
    RETUR: 'Retur KA',
    OPPHEVET: 'Opphevet KA',
    MEDHOLD: 'Medhold KA',
    DELVIS_MEDHOLD: 'Delvis medhold KA',
    STADFESTELSE: 'Stadfestelse KA',
    UGUNST: 'Ugunst (Ugyldig) KA',
    AVVIST: 'Avvist KA',
    INNSTILLING_STADFESTELSE: 'Innstilling om stadfestelse til trygderetten fra KA',
    INNSTILLING_AVVIST: 'Innstilling om avist til trygderetten fra KA',
};

export type FagsystemRevurdering =
    | {
          opprettetBehandling: true;
          opprettet: { eksternBehandlingId: string; opprettetTid: string };
      }
    | {
          opprettetBehandling: false;
          ikkeOpprettet: { årsak: RevurderingIkkeOpprettetÅrsak; detaljer: string };
      };

export enum RevurderingIkkeOpprettetÅrsak {
    ÅPEN_BEHANDLING = 'ÅPEN_BEHANDLING',
    INGEN_BEHANDLING = 'INGEN_BEHANDLING',
    FEIL = 'FEIL',
}

export const revurderingIkkeOpprettetÅrsak: Record<RevurderingIkkeOpprettetÅrsak, string> = {
    ÅPEN_BEHANDLING: 'Åpen behandling',
    INGEN_BEHANDLING: 'Ingen behandling',
    FEIL: 'Uventet feil',
};

export const erBehandlingRedigerbar = (behandling: Klagebehandling): boolean =>
    [
        KlagebehandlingSteg.FORMKRAV,
        KlagebehandlingSteg.VURDERING,
        KlagebehandlingSteg.BREV,
    ].includes(behandling.steg);
