import React from 'react';

import styles from './Historikk.module.css';
import HistorikkElement from './HistorikkElement';
import { useBehandling } from '../../../../context/BehandlingContext';
import DataViewer from '../../../../komponenter/DataViewer';

const Historikk: React.FC = () => {
    const { behandlingshistorikk } = useBehandling();

    return (
        <DataViewer type={'behandlingshistorikk'} response={{ behandlingshistorikk }}>
            {({ behandlingshistorikk }) => (
                <ul className={styles.container}>
                    {behandlingshistorikk.map((historikkElement, index) => {
                        const erSisteElementIListe = index === behandlingshistorikk.length - 1;

                        return (
                            <HistorikkElement
                                erSisteElementIListe={erSisteElementIListe}
                                historikkHendelse={historikkElement}
                                key={index}
                            />
                        );
                    })}
                </ul>
            )}
        </DataViewer>
    );
};

export default Historikk;
