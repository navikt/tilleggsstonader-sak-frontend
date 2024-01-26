import React from 'react';

import styled from 'styled-components';

import { Box, Tabs } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import Oppsummering from './Oppsummering/Oppsummering';
import { Sticky } from '../../../komponenter/Visningskomponenter/Sticky';

const Container = styled(Sticky)`
    top: 97px;
    border-right: 1px solid ${ABorderDefault};
    height: calc(100vh - 97px);
    min-width: 18rem;
`;

const tabs = [
    {
        value: 'oppsummering',
        label: 'Oppsummert',
        komponent: <Oppsummering />,
    },
];

const VenstreMeny: React.FC = () => {
    return (
        <Container>
            <Tabs defaultValue="oppsummering">
                <Tabs.List>
                    {tabs.map((tab) => (
                        <Tabs.Tab label={tab.label} value={tab.value} key={tab.value} />
                    ))}
                </Tabs.List>
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
