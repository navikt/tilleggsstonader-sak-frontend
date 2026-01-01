import * as React from 'react';

import { Heading } from '@navikt/ds-react';

import { AnkeVisning } from './AnkeVisning';
import { FeilregistrertVisning } from './FeilregistrertVisning';
import styles from './Resultat.module.css';
import { Tidslinje } from './Tidslinje';
import DataViewer from '../../../../komponenter/DataViewer';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';

export const Resultat: React.FC = () => {
    const { behandling, behandlingHistorikk, åpenHøyremeny } = useKlagebehandling();

    return (
        <DataViewer type={'behandlingshistorikk'} response={{ behandlingHistorikk }}>
            {({ behandlingHistorikk }) => (
                <>
                    <div className={styles.headingContainer}>
                        <Heading spacing size="large" level="5">
                            Resultat
                        </Heading>
                        <FeilregistrertVisning behandling={behandling} />
                        <AnkeVisning behandling={behandling} />
                    </div>
                    <div
                        className={
                            åpenHøyremeny
                                ? styles.tidslinjeContainerOpen
                                : styles.tidslinjeContainer
                        }
                    >
                        <Tidslinje
                            behandling={behandling}
                            behandlingHistorikk={behandlingHistorikk}
                            åpenHøyremeny={åpenHøyremeny}
                        />
                    </div>
                </>
            )}
        </DataViewer>
    );
};
