import React from 'react';

import styles from './Simulering.module.css';
import { Simuleringsresultat } from './Simuleringsresultat';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';

export const Simulering: React.FC = () => {
    const { vedtak } = useVedtak();

    return (
        <div className={styles.container}>
            <DataViewer type={'vedtak'} response={{ vedtak }}>
                {({ vedtak }) => <Simuleringsresultat vedtak={vedtak} />}
            </DataViewer>
        </div>
    );
};
