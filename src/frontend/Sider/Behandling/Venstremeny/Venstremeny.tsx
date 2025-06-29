import React from 'react';

import styled from 'styled-components';

import { Box, Tabs } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import Historikk from './Historikk/Historikk';
import OppsummeringSøknad from './Oppsummering/OppsummeringSøknad';
import { Sticky } from '../../../komponenter/Visningskomponenter/Sticky';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';
import { BehandlingOppsummering } from './BehandlingOppsummering/BehandlingOppsummering';

const Container = styled.div`
    border-right: 1px solid ${ABorderDefault};
    width: 24rem;
    position: sticky;
    height: calc(100vh - 97px);
    top: 97px;
    overflow-y: scroll;
    overflow-x: hidden;
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
            <Totrinnskontroll />
            <BehandlingOppsummering />
            <Tabs defaultValue="søknaden">
                <Sticky>
                    <Tabs.List>
                        {tabs.map((tab) => (
                            <Tab label={tab.label} value={tab.value} key={tab.value} />
                        ))}
                    </Tabs.List>
                </Sticky>
                {tabs.map((tab) => (
                    <Tabs.Panel value={tab.value} key={tab.value}>
                        <Box padding="4">{tab.komponent}</Box>
                    </Tabs.Panel>
                ))}
            </Tabs>
        </Container>
    );
};

export default VenstreMeny;
