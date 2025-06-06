import React from 'react';

import styled from 'styled-components';

import BehandlingTabsInnhold from './BehandlingTabsInnhold';
import HenleggModal from './Modal/HenleggModal';
import VenstreMeny from './Venstremeny/Venstremeny';
import { BehandlingProvider } from '../../context/BehandlingContext';
import { PersonopplysningerProvider } from '../../context/PersonopplysningerContext';
import { TotrinnskontrollProvider } from '../../context/TotrinnskontrollContext';
import { RerrunnableEffect } from '../../hooks/useRerunnableEffect';
import PersonHeader from '../../komponenter/PersonHeader/PersonHeader';
import { Behandling } from '../../typer/behandling/behandling';
import { BehandlingFakta } from '../../typer/behandling/behandlingFakta/behandlingFakta';
import { Personopplysninger } from '../../typer/personopplysninger';

const BehandlingContainer = styled.div`
    display: flex;

    > * {
        padding-bottom: 64px;
    }
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
}> = ({ behandling, hentBehandling, personopplysninger, behandlingFakta }) => {
    return (
        <BehandlingProvider
            behandling={behandling}
            hentBehandling={hentBehandling}
            behandlingFakta={behandlingFakta}
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
        </BehandlingProvider>
    );
};

export default BehandlingInnhold;
