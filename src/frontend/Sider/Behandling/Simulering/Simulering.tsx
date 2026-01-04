import React from 'react';

import styles from './Simulering.module.css';
import SimuleringResultatWrapper from './SimuleringResultatWrapper';
import { useVedtak } from '../../../hooks/useVedtak';
import DataViewer from '../../../komponenter/DataViewer';

const Simulering: React.FC = () => {
    const { vedtak } = useVedtak();

    return (
        <div className={styles.container}>
            <DataViewer type={'vedtak'} response={{ vedtak }}>
                {({ vedtak }) => <SimuleringResultatWrapper vedtak={vedtak} />}
            </DataViewer>
        </div>
    );
};
export default Simulering;
