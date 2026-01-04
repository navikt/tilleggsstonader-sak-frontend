import React from 'react';

import { Box, Tabs, VStack } from '@navikt/ds-react';

import { BehandlingOppsummering } from './BehandlingOppsummering/BehandlingOppsummering';
import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import Historikk from './Historikk/Historikk';
import OppsummeringSøknad from './Oppsummering/OppsummeringSøknad';
import styles from './Venstremeny.module.css';
import { TilordnetSaksbehandlerVenstremeny } from '../../../komponenter/TilordnetSaksbehandler/TilordnetSaksbehandlerVenstremeny';
import { Sticky } from '../../../komponenter/Visningskomponenter/Sticky';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';

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
        <div className={styles.container}>
            <VStack padding="4" gap={'4'}>
                <TilordnetSaksbehandlerVenstremeny />
                <Totrinnskontroll />
                <BehandlingOppsummering />
            </VStack>
            <Tabs defaultValue="søknaden" fill className={styles.hviteTabs}>
                <Sticky>
                    <Tabs.List>
                        {tabs.map((tab) => (
                            <Tabs.Tab
                                className={styles.tab}
                                label={tab.label}
                                value={tab.value}
                                key={tab.value}
                            />
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
            </Tabs>
        </div>
    );
};

export default VenstreMeny;
