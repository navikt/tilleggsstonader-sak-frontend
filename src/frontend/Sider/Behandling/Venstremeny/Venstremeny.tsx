import React from 'react';

import styled from 'styled-components';

import { Box, Tabs, VStack } from '@navikt/ds-react';
import { BgDefault, BorderNeutral } from '@navikt/ds-tokens/darkside-js';

import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import Historikk from './Historikk/Historikk';
import OppsummeringSøknad from './Oppsummering/OppsummeringSøknad';
import { Sticky } from '../../../komponenter/Visningskomponenter/Sticky';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';
import { BehandlingOppsummering } from './BehandlingOppsummering/BehandlingOppsummering';
import { TilordnetSaksbehandlerVenstremeny } from '../../../komponenter/TilordnetSaksbehandler/TilordnetSaksbehandlerVenstremeny';

const Container = styled.div`
    border-right: 1px solid ${BorderNeutral};
    width: 24rem;
    position: sticky;
    height: calc(100vh - 97px);
    top: 97px;
    overflow-y: scroll;
    overflow-x: hidden;

    display: flex;
    flex-direction: column;
`;

const HviteTabs = styled(Tabs)`
    flex: 1;
    background-color: ${BgDefault};
`;

const Tab = styled(Tabs.Tab)`
    padding-left: 0.75rem;
    padding-right: 0.75rem;
`;

const tabs = [
    {
        value: 'søknaden',
        label: 'Søknad',
        komponent: <OppsummeringSøknad />,
    },
    {
        value: 'historikk',
        label: 'Historikk',
        komponent: <Historikk />,
    },
    {
        value: 'dokumenter',
        label: 'Dokumenter',
        komponent: <Dokumentoversikt />,
    },
];

const VenstreMeny: React.FC = () => {
    return (
        <Container>
            <VStack padding="4" gap={'4'}>
                <TilordnetSaksbehandlerVenstremeny />
                <Totrinnskontroll />
                <BehandlingOppsummering />
            </VStack>
            <HviteTabs defaultValue="søknaden" fill>
                <Sticky>
                    <Tabs.List>
                        {tabs.map((tab) => (
                            <Tab label={tab.label} value={tab.value} key={tab.value} />
                        ))}
                    </Tabs.List>
                </Sticky>
                {tabs.map((tab) => (
                    <Tabs.Panel value={tab.value} key={tab.value}>
                        <Box.New paddingInline="4" paddingBlock="4 16">
                            {tab.komponent}
                        </Box.New>
                    </Tabs.Panel>
                ))}
            </HviteTabs>
        </Container>
    );
};

export default VenstreMeny;
