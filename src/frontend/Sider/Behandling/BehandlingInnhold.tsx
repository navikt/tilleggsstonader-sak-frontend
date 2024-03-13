import React from 'react';

import styled from 'styled-components';

import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import BehandlingTabsInnhold from './BehandlingTabsInnhold';
import Høyremeny from './Høyremeny/Høyremeny';
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

const HøyreMenyWrapper = styled.div`
    border-left: 2px solid ${ABorderDefault};
    background-color: white;

    width: 20rem;
    min-width: 20rem;

    // Når skjermen blir for liten  så blir høyremenyn liggendes ovenfor venstredelen
    z-index: 10;
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
                    <HøyreMenyWrapper>
                        <Høyremeny />
                    </HøyreMenyWrapper>
                </BehandlingContainer>
            </PersonopplysningerProvider>
        </BehandlingProvider>
    );
};

export default BehandlingInnhold;
