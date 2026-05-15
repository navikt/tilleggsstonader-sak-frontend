import { BehandlingDetaljer } from '../../../../typer/behandling/behandlingoversikt';
import { BehandlingStatus } from '../../../../typer/behandling/behandlingStatus';
import { BehandlingType } from '../../../../typer/behandling/behandlingType';

export const erFerdigstiltKjørelisteBehandling = (behandling: BehandlingDetaljer): boolean => {
    return (
        behandling.type === BehandlingType.KJØRELISTE &&
        behandling.status === BehandlingStatus.FERDIGSTILT
    );
};

export const finnFerdigstiltKjørelisteBehandling = (
    behandlinger: BehandlingDetaljer[]
): BehandlingDetaljer | undefined => {
    return behandlinger.find(erFerdigstiltKjørelisteBehandling);
};

export const kanOppretteManuellKjørelistebehandling = (
    behandlinger: BehandlingDetaljer[]
): boolean => {
    const ferdigstiltBehandling = finnFerdigstiltKjørelisteBehandling(behandlinger);

    if (ferdigstiltBehandling === undefined) {
        return false;
    }

    return erFerdigstiltKjørelisteBehandling(ferdigstiltBehandling);
};
