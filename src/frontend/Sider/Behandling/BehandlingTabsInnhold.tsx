import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Tabs } from '@navikt/ds-react';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

import { FanePath, hentBehandlingfaner, isFanePath } from './faner';
import SettPåVentContainer from './SettPåVent/SettPåVentContainer';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { StegProvider } from '../../context/StegContext';
import { Sticky } from '../../komponenter/Visningskomponenter/Sticky';
import { Toast } from '../../typer/toast';

const StickyTablistContainer = styled(Sticky)`
    top: 97px;
`;

const TabsList = styled(Tabs.List)`
    width: 100%;
`;

const Tabsknapp = styled.div`
    display: flex;
    align-items: center;
    margin-left: auto;
`;

const DisabledTab = styled(Tabs.Tab)`
    color: ${ATextSubtle};
    &:hover {
        box-shadow: none;
        cursor: default;
    }
`;

const BehandlingTabsInnhold = () => {
    const navigate = useNavigate();
    const { settToast } = useApp();
    const { behandling, behandlingErRedigerbar } = useBehandling();

    const path = useLocation().pathname.split('/')[3];

    const [aktivFane, settAktivFane] = useState<FanePath>(
        isFanePath(path) ? path : FanePath.INNGANGSVILKÅR
    );
    const [statusPåVentRedigering, settStatusPåVentRedigering] = useState(false);

    useEffect(() => {
        settAktivFane(isFanePath(path) ? path : FanePath.INNGANGSVILKÅR);
    }, [path]);

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
        <StegProvider fane={aktivFane} behandling={behandling}>
            <Tabs value={aktivFane} onChange={(e) => håndterFaneBytte(e as FanePath)}>
                <StickyTablistContainer>
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
                                <Button
                                    size={'small'}
                                    onClick={() => settStatusPåVentRedigering(true)}
                                >
                                    Sett på vent
                                </Button>
                            </Tabsknapp>
                        )}
                    </TabsList>
                </StickyTablistContainer>

                <SettPåVentContainer
                    statusPåVentRedigering={statusPåVentRedigering}
                    settStatusPåVentRedigering={settStatusPåVentRedigering}
                />

                {behandlingFaner.map((tab) => (
                    <Tabs.Panel key={tab.path} value={tab.path}>
                        {tab.komponent(behandling.id)}
                    </Tabs.Panel>
                ))}
            </Tabs>
        </StegProvider>
    );
};

export default BehandlingTabsInnhold;
