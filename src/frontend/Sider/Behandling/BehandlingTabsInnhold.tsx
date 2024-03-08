import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Button, Tabs } from '@navikt/ds-react';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

import { FanePath, hentBehandlingfaner } from './faner';
import SettPåVentContainer from './SettPåVent/SettPåVentContainer';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { Toast } from '../../typer/toast';

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
    const {
        behandling,
        behandlingErRedigerbar,
        settStatusPåVentRedigering,
        statusPåVentRedigering,
    } = useBehandling();

    const path = useLocation().pathname.split('/')[3];

    const [aktivFane, settAktivFane] = useState<string>(path || FanePath.INNGANGSVILKÅR);

    useEffect(() => {
        settAktivFane(path);
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

export default BehandlingTabsInnhold;
