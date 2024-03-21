import React, { FC, useState } from 'react';

import { useNavigate } from 'react-router-dom';

import { Button, VStack } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { FanePath } from '../../Sider/Behandling/faner';
import { Steg } from '../../typer/behandling/steg';
import { RessursStatus } from '../../typer/ressurs';
import { Feilmelding } from '../Feil/Feilmelding';

export const NesteStegKnapp: FC<{
    nesteFane: FanePath;
    steg: Steg;
    children: React.ReactNode;
}> = ({ nesteFane, children, steg }) => {
    const navigate = useNavigate();
    const { request } = useApp();

    const { behandling, hentBehandling } = useBehandling();
    const [feilmelding, settFeilmelding] = useState<string>();

    const redigerSteg = () => {
        settFeilmelding('');
        request<string, { steg: Steg }>(`/api/sak/steg/behandling/${behandling.id}/reset`, 'POST', {
            steg: steg,
        }).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
            } else {
                settFeilmelding(`Kunne ikke redigere steg: ${res.frontendFeilmelding}`);
            }
        });
    };

    const gåtTilNesteSteg = () => {
        settFeilmelding('');
        request<string, { steg: Steg }>(
            `/api/sak/steg/behandling/${behandling.id}/ferdigstill`,
            'POST',
            {
                steg: behandling.steg,
            }
        ).then((res) => {
            if (res.status === RessursStatus.SUKSESS) {
                hentBehandling.rerun();
                navigate(`/behandling/${behandling.id}/${nesteFane}`);
            } else {
                settFeilmelding(`Kunne ikke gå til neste steg: ${res.frontendFeilmelding}`);
            }
        });
    };

    return (
        <VStack align={'start'}>
            {behandling.steg === steg ? (
                <Button variant="primary" size="small" onClick={gåtTilNesteSteg}>
                    {children}
                </Button>
            ) : (
                <Button variant="secondary" size="small" onClick={redigerSteg}>
                    Rediger steg
                </Button>
            )}
            <Feilmelding>{feilmelding}</Feilmelding>
        </VStack>
    );
};
