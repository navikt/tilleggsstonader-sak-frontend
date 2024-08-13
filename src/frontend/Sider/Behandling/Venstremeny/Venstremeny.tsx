import React from 'react';

import styled from 'styled-components';

import { Box, Tabs } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import Historikk from './Historikk/Historikk';
import OppsummeringSøknad from './Oppsummering/OppsummeringSøknad';
import { Sticky } from '../../../komponenter/Visningskomponenter/Sticky';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';

const Container = styled.div`
    border-right: 1px solid ${ABorderDefault};
    width: 20rem;
    min-height: calc(100vh - 97px);
`;

const StickyTablistContainer = styled(Sticky)`
    top: 97px;
    border-right: 1px solid ${ABorderDefault};
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
            <Tabs defaultValue="søknaden" style={{ width: 'inherit', height: '100%' }}>
                <StickyTablistContainer>
                    <Tabs.List>
                        {tabs.map((tab) => (
                            <Tab label={tab.label} value={tab.value} key={tab.value} />
                        ))}
                    </Tabs.List>
                </StickyTablistContainer>
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
