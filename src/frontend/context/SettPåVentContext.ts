import { useEffect } from 'react';

import constate from 'constate';

import { usePrevious } from '../hooks/usePrevious';
import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { SettPåVentContext } from '../komponenter/SettPåVent/typer';

export const [SettPåVentProvider, useSettPåVent] = constate(
    ({
        context,
        behandlingId,
        behandlingErSattPåVent,
        hentBehandling,
        hentBehandlingshistorikk,
    }: {
        context: SettPåVentContext;
        behandlingId: string;
        behandlingErSattPåVent: boolean;
        hentBehandling: RerrunnableEffect;
        hentBehandlingshistorikk: RerrunnableEffect;
        hentHistorikkPåNyttNårSattPåVent?: boolean;
    }) => {
        const prevBehandlingErSattPåVent = usePrevious(behandlingErSattPåVent);
        /**
         * Klage:
         * Hack for å trigge henting av behandlingshistorikk på nytt når man setter på/av vent
         * I vanlig saksbehandling finnes en vanlig trigger for henting av behandlingshistorikk på nytt når status endrer seg
         */
        useEffect(() => {
            if (
                context === 'klage' &&
                (prevBehandlingErSattPåVent === true || prevBehandlingErSattPåVent === false) &&
                prevBehandlingErSattPåVent !== behandlingErSattPåVent
            ) {
                hentBehandlingshistorikk.rerun();
            }
        }, [context, hentBehandlingshistorikk, behandlingErSattPåVent, prevBehandlingErSattPåVent]);
        return {
            context,
            behandlingId,
            behandlingErSattPåVent,
            hentBehandling,
            hentBehandlingshistorikk,
        };
    }
);
