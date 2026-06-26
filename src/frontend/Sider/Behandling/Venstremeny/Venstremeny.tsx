import React from 'react';

import { Box, Tabs, VStack } from '@navikt/ds-react';

import { BehandlingOppsummering } from './BehandlingOppsummering/BehandlingOppsummering';
import Dokumentoversikt from './Dokumentoversikt/Dokumentoversikt';
import Historikk from './Historikk/Historikk';
import { OppsummeringSøknad } from './Oppsummering/OppsummeringSøknad';
import Tilbakekreving from './Tilbakekreving/Tilbakekreving';
import styles from './Venstremeny.module.css';
import { useBehandling } from '../../../context/BehandlingContext';
import { TilordnetSaksbehandlerVenstremeny } from '../../../komponenter/TilordnetSaksbehandler/TilordnetSaksbehandlerVenstremeny';
import { Sticky } from '../../../komponenter/Visningskomponenter/Sticky';
import Totrinnskontroll from '../Totrinnskontroll/Totrinnskontroll';

const standardTabs = [
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

const tilbakekrevingTab = {
    value: 'tilbakekreving',
    label: 'Tilbakekreving',
    komponent: <Tilbakekreving />,
};

const VenstreMeny: React.FC = () => {
    const { behandling } = useBehandling();

    const tabs = behandling.harTilbakekrevingSak
        ? [...standardTabs, tilbakekrevingTab]
        : standardTabs;

    return (
        <div className={styles.container}>
            <VStack padding="space-16" gap={'space-16'}>
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
