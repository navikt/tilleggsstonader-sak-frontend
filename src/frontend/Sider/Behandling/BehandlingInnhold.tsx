import React from 'react';

import styled from 'styled-components';

import { BgNeutralSoft } from '@navikt/ds-tokens/darkside-js';

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

const BehandlingContainer = styled.div`
    display: flex;
    background: ${BgNeutralSoft};
`;

const InnholdWrapper = styled.div`
    flex-grow: 1;

    max-width: calc(100% - 20rem);
`;

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
                    <BehandlingContainer>
                        <VenstreMeny />
                        <InnholdWrapper>
                            <BehandlingTabsInnhold />
                        </InnholdWrapper>
                    </BehandlingContainer>
                </TotrinnskontrollProvider>
            </PersonopplysningerProvider>
            <HenleggModal />
            <NullstillModal />
        </BehandlingProvider>
    );
};

export default BehandlingInnhold;
