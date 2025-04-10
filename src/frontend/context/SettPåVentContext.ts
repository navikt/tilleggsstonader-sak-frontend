import constate from 'constate';

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
    }) => {
        return {
            context,
            behandlingId,
            behandlingErSattPåVent,
            hentBehandling,
            hentBehandlingshistorikk,
        };
    }
);
