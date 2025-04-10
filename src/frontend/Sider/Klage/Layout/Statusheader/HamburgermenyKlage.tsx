import React from 'react';

import { ActionMenu } from '@navikt/ds-react';

import {
    Hamburgermeny,
    HenleggMenuItem,
    LenkerGroup,
    SettBehandlingPåVentItem,
} from '../../../../komponenter/Hamburgermeny/Hamburgermeny';
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

    return (
        <Hamburgermeny>
            {personIdent && <LenkerGroup ident={personIdent} />}
            {erBehandlingRedigerbar(behandling) && (
                <ActionMenu.Group label={'Behandling'}>
                    {behandlingErRedigerbar && !statusPåVentRedigering && (
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
