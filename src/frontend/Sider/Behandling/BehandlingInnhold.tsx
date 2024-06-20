import React from 'react';

import styled from 'styled-components';

import BehandlingTabsInnhold from './BehandlingTabsInnhold';
import VenstreMeny from './Venstremeny/Venstremeny';
import { BehandlingProvider } from '../../context/BehandlingContext';
import { PersonopplysningerProvider } from '../../context/PersonopplysningerContext';
import { VilkårProvider } from '../../context/VilkårContext';
import { RerrunnableEffect } from '../../hooks/useRerunnableEffect';
import PersonHeader from '../../komponenter/PersonHeader/PersonHeader';
import { KlageBehandling } from '../../typer/behandling/klageBehandling';
import { BehandlingFakta } from '../../typer/behandling/behandlingFakta/behandlingFakta';
import { Personopplysninger } from '../../typer/personopplysninger';

const BehandlingContainer = styled.div`
    display: flex;
`;

const InnholdWrapper = styled.div`
    flex-grow: 1;

    max-width: calc(100% - 20rem);
`;

const BehandlingInnhold: React.FC<{
    behandling: KlageBehandling;
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
