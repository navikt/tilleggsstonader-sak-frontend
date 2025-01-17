import React from 'react';

import { ActionMenu } from '@navikt/ds-react';

import {
    Hamburgermeny,
    HenleggMenuItem,
} from '../../../../komponenter/Hamburgermeny/Hamburgermeny';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import {
    erBehandlingRedigerbar,
    Klagebehandling,
} from '../../typer/klagebehandling/klagebehandling';

export const HamburgermenyKlage = ({ behandling }: { behandling: Klagebehandling }) => {
    const { settVisHenleggModal } = useKlagebehandling();

    return (
        <Hamburgermeny>
            {erBehandlingRedigerbar(behandling) && (
                <ActionMenu.Group label={'Behandling'}>
                    <HenleggMenuItem
                        onSelect={() => settVisHenleggModal((prevState) => !prevState)}
                    />
                </ActionMenu.Group>
            )}
        </Hamburgermeny>
    );
};
