import React from 'react';

import { ActionMenu } from '@navikt/ds-react';

import {
    Hamburgermeny,
    HenleggMenuItem,
    LenkerGroup,
} from '../../../../komponenter/Hamburgermeny/Hamburgermeny';
import { ModiaPersonoversiktLenke } from '../../../../komponenter/Hamburgermeny/Lenker/ModiaPersonoversiktLenke';
import { useKlageApp } from '../../context/KlageAppContext';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';
import {
    erBehandlingRedigerbar,
    Klagebehandling,
} from '../../typer/klagebehandling/klagebehandling';

export const HamburgermenyKlage = ({ behandling }: { behandling: Klagebehandling }) => {
    const { settVisHenleggModal } = useKlagebehandling();
    const { personIdent } = useKlageApp();

    return (
        <Hamburgermeny>
            <LenkerGroup>
                {personIdent && <ModiaPersonoversiktLenke ident={personIdent} />}
            </LenkerGroup>
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
