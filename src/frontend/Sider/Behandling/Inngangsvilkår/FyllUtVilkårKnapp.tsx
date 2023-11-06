import React, { useCallback, useState } from 'react';

import { Alert, Button } from '@navikt/ds-react';

import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { RessursStatus } from '../../../typer/ressurs';

const FyllUtVilkårKnapp: React.FC = () => {
    const { request } = useApp();
    const { hentBehandling, behandling } = useBehandling();
    const { hentVilkårsvurdering } = useVilkår();

    const [feilmelding, settFeilmelding] = useState<string>('');

    const automatiskFyllUtVilkår = useCallback(() => {
        request<string, null>(`/api/sak/test/${behandling.id}/utfyll-vilkar`, 'POST').then(
            (res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    hentVilkårsvurdering();
                    hentBehandling.rerun();
                } else {
                    settFeilmelding(res.frontendFeilmelding);
                }
            }
        );
    }, [behandling, hentBehandling, hentVilkårsvurdering, request]);

    return (
        <>
            <Button onClick={automatiskFyllUtVilkår}>Fyll ut vilkår automatisk</Button>
            {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
        </>
    );
};

export default FyllUtVilkårKnapp;
