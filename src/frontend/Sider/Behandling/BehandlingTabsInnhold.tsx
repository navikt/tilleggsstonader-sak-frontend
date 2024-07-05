import React, { useEffect, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Tabs } from '@navikt/ds-react';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

import { faneErLåst, FanePath, hentBehandlingfaner, isFanePath } from './faner';
import SettPåVentContainer from './SettPåVent/SettPåVentContainer';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { StegProvider } from '../../context/StegContext';
import { Sticky } from '../../komponenter/Visningskomponenter/Sticky';
import { Toast } from '../../typer/toast';
import { Toggle } from '../../utils/toggles';

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
    margin-right: 1rem;
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
    const [statusPåVentRedigering, settStatusPåVentRedigering] = useState(false);

    const aktivFane = isFanePath(path) ? path : FanePath.INNGANGSVILKÅR;

    useEffect(() => {
        if (faneErLåst(behandling, aktivFane)) {
            navigate(FanePath.INNGANGSVILKÅR);
        }
        // skal kun sjekke om fane er låst etter at behandling er oppdatert
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandling]);

    const håndterFaneBytte = (nyFane: FanePath) => {
        if (!faneErLåst(behandling, nyFane)) {
            navigate(`/behandling/${behandling.id}/${nyFane}`, { replace: true });
        } else {
            settToast(Toast.DISABLED_FANE);
        }
    };

    const behandlingFaner = hentBehandlingfaner(behandling, useFlag(Toggle.VIS_SIMULERING));

    return (
        <StegProvider fane={aktivFane} behandling={behandling}>
            <Tabs value={aktivFane} onChange={(e) => håndterFaneBytte(e as FanePath)}>
                <StickyTablistContainer>
                    <TabsList>
                        {behandlingFaner.map((tab) =>
                            tab.erLåst ? (
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
                                    variant="secondary"
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

                {behandlingFaner
                    .filter((fane) => !fane.erLåst)
                    .map((tab) => (
                        <Tabs.Panel key={tab.path} value={tab.path}>
                            {tab.komponent(behandling.id)}
                        </Tabs.Panel>
                    ))}
            </Tabs>
        </StegProvider>
    );
};

export default BehandlingTabsInnhold;
