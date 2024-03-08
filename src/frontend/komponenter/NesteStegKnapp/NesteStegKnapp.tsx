import React, { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, HStack } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { FanePath } from '../../Sider/Behandling/faner';
import { Steg } from '../../typer/behandling/steg';
import { RessursStatus } from '../../typer/ressurs';
import { Feilmelding } from '../Feil/Feilmelding';

export const NesteStegKnapp: FC<{
    nesteFane: FanePath;
    children: React.ReactNode;
}> = ({ nesteFane, children }) => {
    const navigate = useNavigate();
    const { request } = useApp();

    const { behandling, hentBehandling } = useBehandling();
    const [feilmelding, settFeilmelding] = useState<string>();

    const gåtTilNesteSteg = () => {
        settFeilmelding('');
        if (behandling.steg === Steg.INNGANGSVILKÅR) {
            request<string, null>(
                `/api/sak/steg/behandling/${behandling.id}/inngangsvilkaar`,
                'POST'
            ).then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentBehandling.rerun();
                    navigate(`/behandling/${behandling.id}/${nesteFane}`);
                } else {
                    settFeilmelding(`Kunne ikke gå til neste steg:${res.frontendFeilmelding}`);
                }
            });
        }
        navigate(`/behandling/${behandling.id}/${nesteFane}`);
    };

    return (
        <HStack>
            <Button variant="primary" size="small" onClick={gåtTilNesteSteg}>
                {children}
            </Button>
            <Feilmelding>{feilmelding}</Feilmelding>
        </HStack>
    );
};
