import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import constate from 'constate';

import { useApp } from './AppContext';
import { useBehandlingshistorikk } from '../hooks/useBehandlingshistorikk';
import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { HistorikkHendelse } from '../Sider/Behandling/Venstremeny/Historikk/typer';
import { Behandling } from '../typer/behandling/behandling';
import { BehandlingFakta } from '../typer/behandling/behandlingFakta/behandlingFakta';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { Ressurs } from '../typer/ressurs';
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
    behandlingshistorikk: Ressurs<HistorikkHendelse[]>;
    hentBehandlingshistorikk: RerrunnableEffect;
    behandlingFakta: BehandlingFakta;
    toggleKanSaksbehandle: boolean;
    kanSetteBehandlingPåVent: boolean;

    visRedigerGrunnlagFomAdmin: boolean;
    settVisRedigerGrunnlagFomAdmin: React.Dispatch<React.SetStateAction<boolean>>;

    visHenleggModal: boolean;
    settVisHenleggModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const useKanSaksbehandle = (stønadstype: Stønadstype) => {
    const kanSaksbehandleLæremidler = useFlag(Toggle.KAN_SAKSBEHANDLE_LÆREMIDLER);
    const kanSaksbehandleBoutgifter = useFlag(Toggle.KAN_SAKSBEHANDLE_BOUTGIFTER);
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
            return true;
        case Stønadstype.LÆREMIDLER:
            return kanSaksbehandleLæremidler;
        case Stønadstype.BOUTGIFTER:
            return kanSaksbehandleBoutgifter;
        default:
            return false;
    }
};

const useKanRevurdere = (stønadstype: Stønadstype) => {
    const kanRevurdereLæremidler = useFlag(Toggle.KAN_REVURDERE_LÆREMIDLER);
    const kanRevurdereBoutgifter = useFlag(Toggle.KAN_REVURDERE_BOUTGIFTER);
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
            return true;
        case Stønadstype.LÆREMIDLER:
            return kanRevurdereLæremidler;
        case Stønadstype.BOUTGIFTER:
            return kanRevurdereBoutgifter;
        default:
            return false;
    }
};

export const [BehandlingProvider, useBehandling] = constate(
    ({ behandling, hentBehandling, behandlingFakta }: Props): BehandlingContext => {
        const { erSaksbehandler } = useApp();

        const [visRedigerGrunnlagFomAdmin, settVisRedigerGrunnlagFomAdmin] =
            useState<boolean>(false);
        const [visHenleggModal, settVisHenleggModal] = useState<boolean>(false);

        const { hentBehandlingshistorikk, behandlingshistorikk } =
            useBehandlingshistorikk(behandling);

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
            behandlingshistorikk,
            hentBehandlingshistorikk,
            behandlingFakta,
            toggleKanSaksbehandle: toggleKanSaksbehandleEllerRevurdere,
            kanSetteBehandlingPåVent: behandlingErRedigerbar,
            visRedigerGrunnlagFomAdmin,
            settVisRedigerGrunnlagFomAdmin,
            visHenleggModal,
            settVisHenleggModal,
        };
    }
);
