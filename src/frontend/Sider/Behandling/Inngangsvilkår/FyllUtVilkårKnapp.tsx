import React, { useCallback, useState } from 'react';

import { Alert, Button } from '@navikt/ds-react';

import styles from './FyllUtVilkårKnapp.module.css';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { RessursStatus } from '../../../typer/ressurs';

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
            <Button className={styles.knapp} onClick={automatiskFyllUtVilkår}>
                Fyll ut vilkår automatisk
            </Button>
            {feilmelding && <Alert variant={'error'}>{feilmelding}</Alert>}
        </>
    );
};

export default FyllUtVilkårKnapp;
