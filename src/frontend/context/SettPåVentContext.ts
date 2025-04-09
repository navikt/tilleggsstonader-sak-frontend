import constate from 'constate';

import { RerrunnableEffect } from '../hooks/useRerunnableEffect';

export const [SettPåVentProvider, useSettPåVent] = constate(
    ({
        context,
        behandlingId,
        behandlingErSattPåVent,
        hentBehandling,
        hentBehandlingshistorikk,
    }: {
        context: 'sak';
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
