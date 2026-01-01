import * as React from 'react';
import { FC, useEffect } from 'react';

import { useParams } from 'react-router-dom';

import styles from './BehandlingContainer.module.css';
import BehandlingRoutes from './BehandlingRoutes';
import Fanemeny from './Fanemeny/Fanemeny';
import { Høyremeny } from './Høyremeny/Høyremeny';
import { Statusheader } from './Statusheader/Statusheader';
import { useRerunnableEffect } from '../../../hooks/useRerunnableEffect';
import DataViewer from '../../../komponenter/DataViewer';
import ScrollToTop from '../../../komponenter/ScrollToTop/ScrollToTop';
import { SettPåVentKlage } from '../../../komponenter/SettPåVent/SettPåVentContainer';
import { KlagebehandlingProvider, useKlagebehandling } from '../context/KlagebehandlingContext';
import { useHentKlagebehandling } from '../hooks/useHentKlagebehandling';
import { useHentPersonopplysninger } from '../hooks/useHentPersonopplysninger';
import { useSetPersonIdent } from '../hooks/useSetPersonIdent';
import { useSetValgtFagsakId } from '../hooks/useSetValgtFagsakId';
import { HenleggModal } from '../Komponenter/HenleggModal/HenleggModal';

const BehandlingContainer: FC = () => {
    const behandlingId = useParams<{ behandlingId: string }>().behandlingId as string;

    useEffect(() => {
        document.title = 'Klagebehandling';
    }, []);

    const { hentBehandlingCallback, behandling } = useHentKlagebehandling(behandlingId);
    const hentBehandling = useRerunnableEffect(hentBehandlingCallback, [behandlingId]);

    const { hentPersonopplysninger, personopplysninger } = useHentPersonopplysninger(behandlingId);

    // eslint-disable-next-line
    useEffect(() => hentPersonopplysninger(behandlingId), [behandlingId]);
    return (
        <DataViewer type={'behandlingsinformasjon'} response={{ behandling, personopplysninger }}>
            {({ behandling, personopplysninger }) => (
                <KlagebehandlingProvider
                    behandling={behandling}
                    hentBehandling={hentBehandling}
                    personopplysninger={personopplysninger}
                >
                    <BehandlingContent />
                </KlagebehandlingProvider>
            )}
        </DataViewer>
    );
};

const BehandlingContent = () => {
    const { behandling, personopplysninger } = useKlagebehandling();
    useSetValgtFagsakId(behandling.fagsakId);
    useSetPersonIdent(personopplysninger.personIdent);
    const { åpenHøyremeny } = useKlagebehandling();

    return (
        <>
            <ScrollToTop />
            <Statusheader personopplysninger={personopplysninger} behandling={behandling} />
            <div className={styles.container}>
                <div className={`${styles.content} ${åpenHøyremeny ? styles.contentOpen : ''}`}>
                    <Fanemeny behandling={behandling} />
                    <SettPåVentKlage />
                    <BehandlingRoutes behandling={behandling} />
                    <HenleggModal behandling={behandling} />
                </div>
                <div className={`${styles.menu} ${åpenHøyremeny ? styles.menuOpen : ''}`}>
                    <Høyremeny åpenHøyremeny={åpenHøyremeny} behandling={behandling} />
                </div>
            </div>
        </>
    );
};

export default BehandlingContainer;
