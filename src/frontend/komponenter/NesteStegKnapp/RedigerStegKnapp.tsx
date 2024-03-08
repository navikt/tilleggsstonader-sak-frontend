import React, { FC, useState } from 'react';

import { Button, HStack } from '@navikt/ds-react';

import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { Steg } from '../../typer/behandling/steg';
import { RessursStatus } from '../../typer/ressurs';
import { Feilmelding } from '../Feil/Feilmelding';

export const RedigerStegKnapp: FC<{
    steg: Steg;
}> = ({ steg }) => {
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
                settFeilmelding(`Kunne redigere steg: ${res.frontendFeilmelding}`);
            }
        });
    };

    return (
        <HStack>
            <Button variant="secondary" size="small" onClick={redigerSteg}>
                Rediger steg
            </Button>
            <Feilmelding>{feilmelding}</Feilmelding>
        </HStack>
    );
};
