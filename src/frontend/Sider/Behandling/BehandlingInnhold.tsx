import React from 'react';

import styles from './BehandlingInnhold.module.css';
import BehandlingTabsInnhold from './BehandlingTabsInnhold';
import HenleggModal from './Modal/HenleggModal';
import NullstillModal from './Modal/NullstillModal';
import VenstreMeny from './Venstremeny/Venstremeny';
import { BehandlingProvider } from '../../context/BehandlingContext';
import { PersonopplysningerProvider } from '../../context/PersonopplysningerContext';
import { TotrinnskontrollProvider } from '../../context/TotrinnskontrollContext';
import { RerrunnableEffect } from '../../hooks/useRerunnableEffect';
import PersonHeader from '../../komponenter/PersonHeader/PersonHeader';
import { Behandling, SluttdatoForForrigeVedtak } from '../../typer/behandling/behandling';
import { BehandlingFakta } from '../../typer/behandling/behandlingFakta/behandlingFakta';
import { Personopplysninger } from '../../typer/personopplysninger';

const BehandlingInnhold: React.FC<{
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
    personopplysninger: Personopplysninger;
    behandlingFakta: BehandlingFakta;
    sluttDatoForrigeVedtak: SluttdatoForForrigeVedtak;
}> = ({
    behandling,
    hentBehandling,
    personopplysninger,
    behandlingFakta,
    sluttDatoForrigeVedtak,
}) => {
    return (
        <BehandlingProvider
            behandling={behandling}
            hentBehandling={hentBehandling}
            behandlingFakta={behandlingFakta}
            sluttDatoForrigeVedtak={sluttDatoForrigeVedtak}
        >
            <PersonopplysningerProvider personopplysninger={personopplysninger}>
                <PersonHeader fagsakPersonId={behandling.fagsakPersonId} />
                <TotrinnskontrollProvider>
                    <div className={styles.behandlingContainer}>
                        <VenstreMeny />
                        <div className={styles.innholdWrapper}>
                            <BehandlingTabsInnhold />
                        </div>
                    </div>
                </TotrinnskontrollProvider>
            </PersonopplysningerProvider>
            <HenleggModal />
            <NullstillModal />
        </BehandlingProvider>
    );
};

export default BehandlingInnhold;
