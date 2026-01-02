import * as React from 'react';
import { FC } from 'react';

import { Heading, Loader } from '@navikt/ds-react';

import styles from './SystemetLaster.module.css';

const SystemetLaster: FC = () => {
    return (
        <div className={styles.systemetLaster}>
            <div className={styles.wrapper}>
                <Heading size={'medium'}> Systemet laster</Heading>
                <div className={styles.spinner}>
                    <Loader size={'xlarge'} variant="interaction" transparent={true} />
                </div>
            </div>
        </div>
    );
};

export default SystemetLaster;
