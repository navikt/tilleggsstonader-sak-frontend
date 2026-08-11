import React from 'react';

import { Box, Tabs } from '@navikt/ds-react';

import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import Historikk from './Historikk/Historikk';
import { OppsummeringSøknad } from './Oppsummering/OppsummeringSøknad';
import styles from './Venstremeny.module.css';
import { Sticky } from '../../../komponenter/Visningskomponenter/Sticky';

const tabs = [
    {
        value: 'søknaden',
        label: 'Søknaden',
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
                        <Box paddingInline="space-16" paddingBlock="space-16 space-64">
                            {tab.komponent}
                        </Box>
                    </Tabs.Panel>
                ))}
            </Tabs>
        </div>
    );
};

export default VenstreMeny;
