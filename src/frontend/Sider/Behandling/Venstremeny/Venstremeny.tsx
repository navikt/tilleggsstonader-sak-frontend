import React, { useEffect } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import styled from 'styled-components';

import { Box, Tabs } from '@navikt/ds-react';
import { ABorderDefault } from '@navikt/ds-tokens/dist/tokens';

import Historikk from './Historikk/Historikk';
import OppsummeringSøknad from './Oppsummering/OppsummeringSøknad';
import { Sticky } from '../../../komponenter/Visningskomponenter/Sticky';
import { Toggle } from '../../../utils/toggles';
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

const tabs = [
    {
        value: 'søknaden',
        label: 'Søknaden',
        komponent: <OppsummeringSøknad />,
    },
];

const VenstreMeny: React.FC = () => {
    const visFiltrering = useFlag(Toggle.VIS_BEHANDLINGSHISTORIKK);

    const historikkTab = {
        value: 'historikk',
        label: 'Historikk',
        komponent: <Historikk />,
    };

    useEffect(() => {
        if (visFiltrering && tabs.find((tab) => tab.value === 'historikk') === undefined) {
            tabs.push(historikkTab);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [visFiltrering]);

    return (
        <Container>
            <Totrinnskontroll />
            <Tabs defaultValue="søknaden" style={{ width: 'inherit', height: '100%' }}>
                <StickyTablistContainer>
                    <Tabs.List>
                        {tabs.map((tab) => (
                            <Tabs.Tab label={tab.label} value={tab.value} key={tab.value} />
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
