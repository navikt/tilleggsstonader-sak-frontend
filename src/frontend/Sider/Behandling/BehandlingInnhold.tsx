import React from 'react';

import styled from 'styled-components';

import BehandlingTabsInnhold from './BehandlingTabsInnhold';
import VenstreMeny from './Venstremeny/Venstremeny';
import { BehandlingProvider } from '../../context/BehandlingContext';
import { PersonopplysningerProvider } from '../../context/PersonopplysningerContext';
import { VilkårProvider } from '../../context/VilkårContext';
import { RerrunnableEffect } from '../../hooks/useRerunnableEffect';
import PersonHeader from '../../komponenter/PersonHeader/PersonHeader';
import { Behandling } from '../../typer/behandling/behandling';
import { Personopplysninger } from '../../typer/personopplysninger';

const BehandlingContainer = styled.div`
    display: flex;
`;

const InnholdWrapper = styled.div`
    flex-grow: 1;

    max-width: calc(100% - 20rem);
`;

const BehandlingInnhold: React.FC<{
    behandling: Behandling;
    hentBehandling: RerrunnableEffect;
    personopplysninger: Personopplysninger;
}> = ({ behandling, hentBehandling, personopplysninger }) => {
    return (
        <BehandlingProvider behandling={behandling} hentBehandling={hentBehandling}>
            <PersonopplysningerProvider personopplysninger={personopplysninger}>
                <PersonHeader fagsakPersonId={behandling.fagsakPersonId} />
                <BehandlingContainer>
                    <VilkårProvider behandling={behandling}>
                        <VenstreMeny />
                        <InnholdWrapper>
                            <BehandlingTabsInnhold />
                        </InnholdWrapper>
                    </VilkårProvider>
                </BehandlingContainer>
            </PersonopplysningerProvider>
        </BehandlingProvider>
    );
};

export default BehandlingInnhold;
