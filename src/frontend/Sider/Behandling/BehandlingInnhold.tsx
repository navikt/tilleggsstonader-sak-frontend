import React, { useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Tabs } from '@navikt/ds-react';
import { ABorderDefault, ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

import { FanePath, hentBehandlingfaner } from './faner';
import Høyremeny from './Høyremeny/Høyremeny';
import SettPåVentContainer from './SettPåVent/SettPåVentContainer';
import VenstreMeny from './Venstremeny/Venstremeny';
import { useApp } from '../../context/AppContext';
import { BehandlingProvider, useBehandling } from '../../context/BehandlingContext';
import { PersonopplysningerProvider } from '../../context/PersonopplysningerContext';
import { VilkårProvider } from '../../context/VilkårContext';
import { RerrunnableEffect } from '../../hooks/useRerunnableEffect';
import PersonHeader from '../../komponenter/PersonHeader/PersonHeader';
import { Behandling } from '../../typer/behandling/behandling';
import { Personopplysninger } from '../../typer/personopplysninger';
import { Toast } from '../../typer/toast';

const BehandlingContainer = styled.div`
    display: flex;
`;

const InnholdWrapper = styled.div`
    flex-grow: 1;

    max-width: calc(100% - 20rem);
`;

const TabsList = styled(Tabs.List)`
    width: 100%;
`;

const Tabsknapp = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
`;

const HøyreMenyWrapper = styled.div`
    border-left: 2px solid ${ABorderDefault};
    background-color: white;

    width: 20rem;
    min-width: 20rem;

    // Når skjermen blir for liten  så blir høyremenyn liggendes ovenfor venstredelen
    z-index: 10;
`;

const DisabledTab = styled(Tabs.Tab)`
    color: ${ATextSubtle};
    &:hover {
        box-shadow: none;
        cursor: default;
    }
`;

const BehandlingTabsMedPanel = () => {
    const navigate = useNavigate();
    const { settToast } = useApp();
    const {
        behandling,
        behandlingErRedigerbar,
        settStatusPåVentRedigering,
        statusPåVentRedigering,
    } = useBehandling();

    const path = useLocation().pathname.split('/')[3];

    const [aktivFane, settAktivFane] = useState<string>(path || FanePath.INNGANGSVILKÅR);

    const håndterFaneBytte = (nyFane: FanePath) => {
        if (!faneErLåst(nyFane)) {
            settAktivFane(nyFane);
            navigate(`/behandling/${behandling.id}/${nyFane}`, { replace: true });
        } else {
            settToast(Toast.DISABLED_FANE);
        }
    };

    const faneErLåst = (fanePath: FanePath) => {
        return fanePath === FanePath.SIMULERING;
    };

    const behandlingFaner = hentBehandlingfaner(behandling.stønadstype);
    return (
        <Tabs value={aktivFane} onChange={(e) => håndterFaneBytte(e as FanePath)}>
            <TabsList>
                {behandlingFaner.map((tab) =>
                    faneErLåst(tab.path) ? (
                        <DisabledTab
                            key={tab.path}
                            value={tab.path}
                            label={tab.navn}
                            icon={tab.ikon}
                        />
                    ) : (
                        <Tabs.Tab
                            key={tab.path}
                            value={tab.path}
                            label={tab.navn}
                            icon={tab.ikon}
                        />
                    )
                )}
                {behandlingErRedigerbar && !statusPåVentRedigering && (
                    <Tabsknapp>
                        <Button size={'small'} onClick={() => settStatusPåVentRedigering(true)}>
                            Sett på vent
                        </Button>
                    </Tabsknapp>
                )}
            </TabsList>

            <SettPåVentContainer />

            {behandlingFaner.map((tab) => (
                <Tabs.Panel key={tab.path} value={tab.path}>
                    {tab.komponent(behandling.id)}
                </Tabs.Panel>
            ))}
        </Tabs>
    );
};

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
                            <BehandlingTabsMedPanel />
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
