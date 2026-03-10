import React from 'react';

import styles from './BehandlingInnhold.module.css';
import BehandlingTabsInnhold from './BehandlingTabsInnhold';
import HenleggModal from './Modal/HenleggModal';
import NullstillModal from './Modal/NullstillModal';
import { BehandlingProvider } from '../../context/BehandlingContext';
import { PersonopplysningerProvider } from '../../context/PersonopplysningerContext';
import { RerrunnableEffect } from '../../hooks/useRerunnableEffect';
import PersonHeader from '../../komponenter/PersonHeader/PersonHeader';
import { Behandling, SluttdatoForForrigeVedtak } from '../../typer/behandling/behandling';
import { BehandlingFakta } from '../../typer/behandling/behandlingFakta/behandlingFakta';
import { Personopplysninger } from '../../typer/personopplysninger';

export const KjørelisteBehandlingInnhold: React.FC<{
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
                <div className={styles.kjørelistebehandlingContainer}>
                    <BehandlingTabsInnhold />
                </div>
            </PersonopplysningerProvider>
            <HenleggModal />
            <NullstillModal />
        </BehandlingProvider>
    );
};
