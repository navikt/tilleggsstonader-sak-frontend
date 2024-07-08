import { KlagebehandlingStatus } from './klagebehandlingStatus';
import { PåklagetVedtak } from '../../Steg/Formkrav/typer';
import { KlageinstansEventType, KlageinstansResultat } from '../../../../typer/klage';
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
