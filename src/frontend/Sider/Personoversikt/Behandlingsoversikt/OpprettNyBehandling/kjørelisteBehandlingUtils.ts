import { BehandlingDetaljer } from '../../../../typer/behandling/behandlingoversikt';
import { BehandlingStatus } from '../../../../typer/behandling/behandlingStatus';
import { BehandlingType } from '../../../../typer/behandling/behandlingType';

/**
 * Sjekker om en behandling er en ferdigstilt kjørelistebehandling som kan brukes som grunnlag for en korrigering
 */
export const erFerdigstiltKjørelisteBehandling = (behandling: BehandlingDetaljer): boolean => {
    return (
        behandling.type === BehandlingType.KJØRELISTE &&
        behandling.status === BehandlingStatus.FERDIGSTILT
    );
};

/**
 * Finner første ferdigstilt kjørelistebehandling i listen som kan brukes som grunnlag for korrigering
 */
export const finnFerdigstiltKjørelisteBehandling = (
    behandlinger: BehandlingDetaljer[]
): BehandlingDetaljer | undefined => {
    return behandlinger.find(erFerdigstiltKjørelisteBehandling);
};

/**
 * Sjekker om man kan opprette en korrigeringsbehandling basert på eksisterende kjørelistebehandling
 */
export const kanOppretteManuellKjørelistebehandling = (
    behandlinger: BehandlingDetaljer[]
): boolean => {
    return !!finnFerdigstiltKjørelisteBehandling(behandlinger);
};
