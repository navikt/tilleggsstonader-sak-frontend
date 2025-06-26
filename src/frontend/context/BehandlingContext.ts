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
        default:
            return false;
    }
};

const useKanRevurdere = (stønadstype: Stønadstype) => {
    const kanRevurdereLæremidler = useFlag(Toggle.KAN_REVURDERE_LÆREMIDLER);
    const kanRevurdereBoutgifter = useFlag(Toggle.KAN_REVURDERE_BOUTGIFTER);
    const kanRevurdereDagligReiseTso = useFlag(Toggle.KAN_REVURDERE_DAGLIG_REISE_TSO);
    const kanRevurdereDagligReiseTsr = useFlag(Toggle.KAN_REVURDERE_DAGLIG_REISE_TSR);
    switch (stønadstype) {
        case Stønadstype.BARNETILSYN:
            return true;
        case Stønadstype.LÆREMIDLER:
            return kanRevurdereLæremidler;
        case Stønadstype.BOUTGIFTER:
            return kanRevurdereBoutgifter;
        case Stønadstype.DAGLIG_REISE_TSO:
            return kanRevurdereDagligReiseTso;
        case Stønadstype.DAGLIG_REISE_TSR:
            return kanRevurdereDagligReiseTsr;
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

        const toggleKanSaksbehandleEllerRevurdere = behandling.forrigeIverksatteBehandlingId
            ? kanSaksbehandle && kanRevurdere
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
