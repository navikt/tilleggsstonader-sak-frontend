import React, { useState } from 'react';

import { Button } from '@navikt/ds-react';

import styles from './Simulering.module.css';
import { Simuleringsresultat } from './Simuleringsresultat';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingResultat } from '../../../typer/behandling/behandlingResultat';
import { BehandlingStatus } from '../../../typer/behandling/behandlingStatus';

export const Simulering: React.FC = () => {
    const { vedtak } = useVedtak();
    const { behandling, hentBehandling } = useBehandling();

    const [laster, settLaster] = useState(false);

    const gåTilNesteSteg = () => {
        settLaster(true);
        hentBehandling.rerun();
    };

    return (
        <div className={styles.container}>
            <DataViewer type={'vedtak'} response={{ vedtak }}>
                {({ vedtak }) => <Simuleringsresultat vedtak={vedtak} settLaster={settLaster} />}
            </DataViewer>
            {behandling.resultat === BehandlingResultat.IKKE_SATT &&
                behandling.status !== BehandlingStatus.FATTER_VEDTAK && (
                    <Button
                        variant="primary"
                        size="small"
                        disabled={laster}
                        loading={laster}
                        onClick={() => {
                            gåTilNesteSteg();
                        }}
                    >
                        Neste
                    </Button>
                )}
        </div>
    );
};
