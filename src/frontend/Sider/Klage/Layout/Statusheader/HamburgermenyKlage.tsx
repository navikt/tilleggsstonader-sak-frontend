import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { ActionMenu } from '@navikt/ds-react';

import {
    Hamburgermeny,
    HenleggMenuItem,
    LenkerGroup,
    SettBehandlingPåVentItem,
} from '../../../../komponenter/Hamburgermeny/Hamburgermeny';
import { Toggle } from '../../../../utils/toggles';
import { useKlageApp } from '../../context/KlageAppContext';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import {
    erBehandlingRedigerbar,
    Klagebehandling,
} from '../../typer/klagebehandling/klagebehandling';

export const HamburgermenyKlage = ({ behandling }: { behandling: Klagebehandling }) => {
    const {
        settVisHenleggModal,
        behandlingErRedigerbar,
        statusPåVentRedigering,
        settStatusPåVentRedigering,
    } = useKlagebehandling();
    const { personIdent } = useKlageApp();

    const kanSetteKlagePåVent = useFlag(Toggle.KLAGE_PÅ_VENT);

    return (
        <Hamburgermeny>
            {personIdent && <LenkerGroup ident={personIdent} />}
            {erBehandlingRedigerbar(behandling) && (
                <ActionMenu.Group label={'Behandling'}>
                    {behandlingErRedigerbar && !statusPåVentRedigering && kanSetteKlagePåVent && (
                        <SettBehandlingPåVentItem
                            onSelect={() => settStatusPåVentRedigering(true)}
                        />
                    )}
                    <HenleggMenuItem
                        onSelect={() => settVisHenleggModal((prevState) => !prevState)}
                    />
                </ActionMenu.Group>
            )}
        </Hamburgermeny>
    );
};
