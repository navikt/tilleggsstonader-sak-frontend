import React, { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Tabs } from '@navikt/ds-react';

import { FanePath, behandlingFaner } from './faner';
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
    const navigate = useNavigate();

    const path = useLocation().pathname.split('/')[3];

    const [aktivFane, settAktivFane] = useState<string>(path || 'inngangsvilkar'); //path !== '' ? path : 'inngangsvilkar');

    const håndterFaneBytte = (nyFane: FanePath) => {
        settAktivFane(nyFane);
        navigate(`/behandling/${behandling.id}/${nyFane}`, { replace: true });
    };

    return (
        <BehandlingProvider behandling={behandling} hentBehandling={hentBehandling}>
            <PersonopplysningerProvider personopplysninger={personopplysninger}>
                <PersonHeader />
                <BehandlingContainer>
                    <VilkårProvider behandling={behandling}>
                        <VenstreMeny />
                        <InnholdWrapper>
                            <Tabs
                                value={aktivFane}
                                onChange={(e) => håndterFaneBytte(e as FanePath)}
                            >
                                <Tabs.List>
                                    {behandlingFaner.map((tab) => (
                                        <Tabs.Tab
                                            key={tab.path}
                                            value={tab.path}
                                            label={tab.navn}
                                            icon={tab.ikon}
                                        />
                                    ))}
                                </Tabs.List>
                                {behandlingFaner.map((tab) => (
                                    <Tabs.Panel key={tab.path} value={tab.path}>
                                        {tab.komponent(behandling.id)}
                                    </Tabs.Panel>
                                ))}
                            </Tabs>
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
