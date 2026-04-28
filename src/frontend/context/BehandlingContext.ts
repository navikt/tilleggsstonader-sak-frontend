import React, { useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import constate from 'constate';

import { useApp } from './AppContext';
import { useBehandlingshistorikk } from '../hooks/useBehandlingshistorikk';
import { RerrunnableEffect } from '../hooks/useRerunnableEffect';
import { HistorikkHendelse } from '../Sider/Behandling/Venstremeny/Historikk/typer';
import { Behandling, SluttdatoForForrigeVedtak } from '../typer/behandling/behandling';
import { BehandlingFakta } from '../typer/behandling/behandlingFakta/behandlingFakta';
import { erBehandlingRedigerbar } from '../typer/behandling/behandlingStatus';
import { Stønadstype } from '../typer/behandling/behandlingTema';
import { Ressurs } from '../typer/ressurs';
import { Toggle } from '../utils/toggles';

interface Props {
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
    behandlingFakta: BehandlingFakta;
    sluttDatoForrigeVedtak: SluttdatoForForrigeVedtak;
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
    visNullstillModal: boolean;
    settVisNullstillModal: React.Dispatch<React.SetStateAction<boolean>>;
    sluttDatoForrigeVedtak: SluttdatoForForrigeVedtak;
}

const useKanSaksbehandle = (stønadstype: Stønadstype) => {
    const kanSaksbehandleBarnetilsyn = useFlag(Toggle.KAN_SAKSBEHANDLE_BARNETILSYN);
    const kanSaksbehandleLæremidler = useFlag(Toggle.KAN_SAKSBEHANDLE_LÆREMIDLER);
    const kanSaksbehandleBoutgifter = useFlag(Toggle.KAN_SAKSBEHANDLE_BOUTGIFTER);
    const kanSaksbehandleDagligReiseTso = useFlag(Toggle.KAN_SAKSBEHANDLE_DAGLIG_REISE_TSO);
    const kanSaksbehandleDagligReiseTsr = useFlag(Toggle.KAN_SAKSBEHANDLE_DAGLIG_REISE_TSR);
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
            return kanSaksbehandleBarnetilsyn;
        case Stønadstype.LÆREMIDLER:
            return kanSaksbehandleLæremidler;
        case Stønadstype.BOUTGIFTER:
            return kanSaksbehandleBoutgifter;
        case Stønadstype.DAGLIG_REISE_TSO:
            return kanSaksbehandleDagligReiseTso;
        case Stønadstype.DAGLIG_REISE_TSR:
            return kanSaksbehandleDagligReiseTsr;
        case Stønadstype.REISE_TIL_SAMLING_TSO:
            return true; // TODO: Lag feature toggle @Adnan
        default:
            return false;
    }
};

export const [BehandlingProvider, useBehandling] = constate(
    ({
        behandling,
        hentBehandling,
        behandlingFakta,
        sluttDatoForrigeVedtak,
    }: Props): BehandlingContext => {
        const { erSaksbehandler, saksbehandler } = useApp();

        const [visRedigerGrunnlagFomAdmin, settVisRedigerGrunnlagFomAdmin] =
            useState<boolean>(false);
        const [visHenleggModal, settVisHenleggModal] = useState<boolean>(false);
        const [visNullstillModal, settVisNullstillModal] = useState<boolean>(false);

        const { hentBehandlingshistorikk, behandlingshistorikk } =
            useBehandlingshistorikk(behandling);

        const toggleKanSaksbehandle = useKanSaksbehandle(behandling.stønadstype);

        const behandlingErRedigerbar = erBehandlingRedigerbar(behandling.status) && erSaksbehandler;

        const tilordnetSaksbehandler = behandling.tilordnetSaksbehandler;
        const saksbehandlerErTilordnetOppgave =
            tilordnetSaksbehandler.navIdent === saksbehandler.navIdent;

        return {
            behandling,
            behandlingErRedigerbar:
                behandlingErRedigerbar && toggleKanSaksbehandle && saksbehandlerErTilordnetOppgave,
            hentBehandling,
            behandlingshistorikk,
            hentBehandlingshistorikk,
            behandlingFakta,
            toggleKanSaksbehandle: toggleKanSaksbehandle,
            kanSetteBehandlingPåVent: behandlingErRedigerbar,
            visRedigerGrunnlagFomAdmin,
            settVisRedigerGrunnlagFomAdmin,
            visHenleggModal,
            settVisHenleggModal,
            visNullstillModal,
            settVisNullstillModal,
            sluttDatoForrigeVedtak,
        };
    }
);
