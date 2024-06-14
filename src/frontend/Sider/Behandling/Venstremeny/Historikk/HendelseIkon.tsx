import React from 'react';

import {
    ArrowRightIcon,
    ArrowUndoIcon,
    CheckmarkIcon,
    PaperplaneIcon,
    PauseIcon,
    PlayIcon,
} from '@navikt/aksel-icons';

import { Hendelse } from './typer';

const HendelseIkon: React.FC<{ hendelse: Hendelse }> = ({ hendelse }) => {
    switch (hendelse) {
        case Hendelse.OPPRETTET: // TODO: Bytt ut med "behandling påbegynt"
            return <PlayIcon />;

        case Hendelse.SATT_PÅ_VENT:
            return <PauseIcon />;

        case Hendelse.TATT_AV_VENT:
            return <PlayIcon />;

        case Hendelse.SENDT_TIL_BESLUTTER:
            return <ArrowRightIcon />;

        case Hendelse.ANGRE_SEND_TIL_BESLUTTER:
            return <ArrowUndoIcon />;

        case Hendelse.VEDTAK_GODKJENT:
            return <CheckmarkIcon />;

        case Hendelse.VEDTAK_UNDERKJENT:
            return <ArrowUndoIcon />;

        case Hendelse.VEDTAK_IVERKSATT:
            return <PaperplaneIcon />;
    }
};

export default HendelseIkon;
