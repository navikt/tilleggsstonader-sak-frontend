import { Klagebehandling, StegType } from './fagsak';

export enum BehandlingStatus {
    OPPRETTET = 'OPPRETTET',
    UTREDES = 'UTREDES',
    VENTER = 'VENTER',
    FERDIGSTILT = 'FERDIGSTILT',
}

export const behandlingStatusTilTekst: Record<BehandlingStatus, string> = {
    OPPRETTET: 'Opprettet',
    UTREDES: 'Utredes',
    VENTER: 'Venter',
    FERDIGSTILT: 'Ferdigstilt',
};

export const erBehandlingRedigerbar = (behandling: Klagebehandling): boolean =>
    [StegType.FORMKRAV, StegType.VURDERING, StegType.BREV].includes(behandling.steg);
