import { useFlag } from '@unleash/proxy-client-react';
import constate from 'constate';

import { useApp } from './AppContext';
import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { Behandling } from '../typer/behandling/behandling';
import { BehandlingFakta } from '../typer/behandling/behandlingFakta/behandlingFakta';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';
import { datoErIPeriodeInklusivSlutt, erFør } from '../utils/dato';
import { Toggle } from '../utils/toggles';

interface Props {
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
    behandlingFakta: BehandlingFakta;
}

export const [BehandlingProvider, useBehandling] = constate(
    ({ behandling, hentBehandling, behandlingFakta }: Props) => {
        const { erSaksbehandler } = useApp();

        const kanSaksbehandle = useFlag(Toggle.KAN_SAKSBEHANDLE);

        const kanBehandleRevurdering = !behandling.forrigeBehandlingId || kanSaksbehandle;
        const behandlingErRedigerbar =
            kanBehandleRevurdering && erBehandlingRedigerbar(behandling.status) && erSaksbehandler;

        const kanKunEndreTomForPeriode = (periodeFom?: string, periodeTom?: string) => {
            if (!behandling.revurderFra || !periodeTom || !periodeFom) {
                return false;
            }
            return datoErIPeriodeInklusivSlutt(behandling.revurderFra, periodeFom, periodeTom);
        };

        const periodenErLåstForEndring = (periodeTom: string) => {
            if (!behandling.revurderFra) {
                return false;
            }
            return erFør(periodeTom, behandling.revurderFra);
        };

        return {
            behandling,
            behandlingErRedigerbar,
            hentBehandling,
            behandlingFakta,
            kanBehandleRevurdering,
            kanKunEndreTomForPeriode,
            periodenErLåstForEndring,
        };
    }
);
