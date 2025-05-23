import React, { useCallback, useState } from 'react';

import { styled } from 'styled-components';

import { Alert, Button } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { RessursStatus } from '../../../typer/ressurs';

const Knapp = styled(Button)`
    width: max-content;
`;

const FyllUtVilkårKnapp: React.FC = () => {
    const { request } = useApp();
    const { hentBehandling, behandling } = useBehandling();

    const [feilmelding, settFeilmelding] = useState<string>('');

    const automatiskFyllUtVilkår = useCallback(() => {
        request<string, null>(`/api/sak/test/${behandling.id}/oppfyll-vilkar`, 'POST').then(
            (res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settFeilmelding('');
                    hentBehandling.rerun();
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            }
        );
    }, [behandling, hentBehandling, request]);

    return (
        <>
            <Knapp onClick={automatiskFyllUtVilkår}>Fyll ut vilkår automatisk</Knapp>
            {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
        </>
    );
};

export default FyllUtVilkårKnapp;
