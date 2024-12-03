import { useFlag } from '@unleash/proxy-client-react';
import constate from 'constate';

import { useApp } from './AppContext';
import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { Behandling } from '../typer/behandling/behandling';
import { BehandlingFakta } from '../typer/behandling/behandlingFakta/behandlingFakta';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { Toggle } from '../utils/toggles';

interface Props {
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
    behandlingFakta: BehandlingFakta;
}

/**
 * @param behandlingErRedigerbar er redigerbar dersom behandling er i riktig state, og toggles for å behandle er enabled
 * @param toggleKanSaksbehandle viser alert hvis funksjonalitet for saksbehandling er skrudd av.
 * @param kanSetteBehandlingPåVent skal kunne sette en behandling på vent selv om toggle er skrudd av, men behandlingen må være i riktig state for å kunne settes på vent
 *
 */
interface BehandlingContext {
    behandling: Behandling;
    behandlingErRedigerbar: boolean;
    hentBehandling: RerrunnableEffect;
    behandlingFakta: BehandlingFakta;
    toggleKanSaksbehandle: boolean;
    kanSetteBehandlingPåVent: boolean;
}

const useKanSaksbehandle = (stønadstype: Stønadstype) => {
    const kanSaksbehandleLæremidler = useFlag(Toggle.KAN_SAKSBEHANDLE_LÆREMIDLER);
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
            return true;
        case Stønadstype.LÆREMIDLER:
            return kanSaksbehandleLæremidler;
        default:
            return false;
    }
};

const useKanRevurdere = (stønadstype: Stønadstype) => {
    const kanRevurdereLæremidler = useFlag(Toggle.KAN_REVURDERE_LÆREMIDLER);
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
            return true;
        case Stønadstype.LÆREMIDLER:
            return kanRevurdereLæremidler;
        default:
            return false;
    }
};

export const [BehandlingProvider, useBehandling] = constate(
    ({ behandling, hentBehandling, behandlingFakta }: Props): BehandlingContext => {
        const { erSaksbehandler } = useApp();

        const kanSaksbehandle = useKanSaksbehandle(behandling.stønadstype);
        const kanRevurdere = useKanRevurdere(behandling.stønadstype);

        const behandlingErRedigerbar = erBehandlingRedigerbar(behandling.status) && erSaksbehandler;

        const toggleKanSaksbehandleEllerRevurdere = behandling.forrigeBehandlingId
            ? kanRevurdere
            : kanSaksbehandle;

        return {
            behandling,
            behandlingErRedigerbar: behandlingErRedigerbar && toggleKanSaksbehandleEllerRevurdere,
            hentBehandling,
            behandlingFakta,
            toggleKanSaksbehandle: toggleKanSaksbehandleEllerRevurdere,
            kanSetteBehandlingPåVent: behandlingErRedigerbar,
        };
    }
);
