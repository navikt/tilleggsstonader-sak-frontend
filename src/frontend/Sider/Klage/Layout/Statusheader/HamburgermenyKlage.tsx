import React from 'react';

import { ExternalLinkIcon } from '@navikt/aksel-icons';
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
            {personIdent && (
                <LenkerGroup ident={personIdent}>
                    {behandling.påklagetVedtak.eksternFagsystemBehandlingId && (
                        <ActionMenu.Item
                            as="a"
                            href={`/ekstern/behandling/${behandling.påklagetVedtak.eksternFagsystemBehandlingId}`}
                            target="_blank"
                            icon={<ExternalLinkIcon />}
                        >
                            Gå til behandling
                        </ActionMenu.Item>
                    )}
                    <ActionMenu.Item
                        as="a"
                        href={`/ekstern/person/${behandling.eksternFagsystemFagsakId}`}
                        target="_blank"
                        icon={<ExternalLinkIcon />}
                    >
                        Gå til saksoversikt
                    </ActionMenu.Item>
                </LenkerGroup>
            )}
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
