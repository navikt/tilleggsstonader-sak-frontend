import React, { useEffect, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Alert, Button, Tabs } from '@navikt/ds-react';
import { TextNeutralSubtle } from '@navikt/ds-tokens/darkside-js';

import { HamburgermenyBehandling } from './Fanemeny/HamburgermenyBehandling';
import { faneErLåst, FanePath, hentBehandlingfaner, isFanePath } from './faner';
import { GammelVarselVedtakIArena } from './Felles/GammelVarselVedtakIArena';
import { TidligereVedtaksperioder } from './Vilkårvurdering/TidligereVedtaksperioder';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { StegProvider } from '../../context/StegContext';
import { SettPåVentSak } from '../../komponenter/SettPåVent/SettPåVentContainer';
import { Sticky } from '../../komponenter/Visningskomponenter/Sticky';
import { Toast } from '../../typer/toast';
import { Toggle } from '../../utils/toggles';

const StickyTablistContainer = styled(Sticky)`
    top: 97px;
`;

const TabsList = styled(Tabs.List)`
    width: 100%;
`;

const HøyrejustertInnhold = styled.div`
    display: flex;
    gap: 0.5rem;
    align-items: center;
    margin-left: auto;
    margin-right: 1rem;
`;

const DisabledTab = styled(Tabs.Tab)`
    color: ${TextNeutralSubtle};

    &:hover {
        box-shadow: none;
        cursor: default;
    }
`;
const TabContentContainer = styled('div')`
    max-width: 1400px;
    padding: 1rem 2rem 2rem 2rem;
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const BehandlingTabsInnhold = () => {
    const navigate = useNavigate();
    const { settToast } = useApp();
    const {
        behandling,
        behandlingFakta,
        behandlingErRedigerbar,
        toggleKanSaksbehandle,
        kanSetteBehandlingPåVent,
    } = useBehandling();

    const path = useLocation().pathname.split('/')[3];
    const [statusPåVentRedigering, settStatusPåVentRedigering] = useState(false);

    const aktivFane = isFanePath(path) ? path : FanePath.INNGANGSVILKÅR;
    const visVedtaksperioderPåBehandling = useFlag(Toggle.VIS_VEDTAKSPERIODER_PAA_BEHANDLING);

    useEffect(() => {
        if (faneErLåst(behandling, aktivFane)) {
            navigate(`/behandling/${behandling.id}/${FanePath.INNGANGSVILKÅR}`);
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

    const behandlingFaner = hentBehandlingfaner(behandling);

    return (
        <StegProvider
            fane={aktivFane}
            behandling={behandling}
            behandlingErRedigerbar={behandlingErRedigerbar}
        >
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
                        <HøyrejustertInnhold>
                            {kanSetteBehandlingPåVent && !statusPåVentRedigering && (
                                <Button
                                    size={'small'}
                                    onClick={() => settStatusPåVentRedigering(true)}
                                    variant="secondary"
                                >
                                    Sett på vent
                                </Button>
                            )}
                            <HamburgermenyBehandling />
                        </HøyrejustertInnhold>
                    </TabsList>
                </StickyTablistContainer>
                <TabContentContainer>
                    {!toggleKanSaksbehandle && (
                        <Alert variant={'error'}>Mulighet for å saksbehandle er skrudd av</Alert>
                    )}
                    <SettPåVentSak
                        statusPåVentRedigering={statusPåVentRedigering}
                        settStatusPåVentRedigering={settStatusPåVentRedigering}
                    />
                    {visVedtaksperioderPåBehandling ? (
                        <TidligereVedtaksperioder
                            behandlingFakta={behandlingFakta}
                            forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
                            stønadstype={behandling.stønadstype}
                        />
                    ) : (
                        <GammelVarselVedtakIArena />
                    )}
                    {behandlingFaner
                        .filter((fane) => !fane.erLåst)
                        .map((tab) => (
                            <Tabs.Panel key={tab.path} value={tab.path}>
                                {tab.komponent(behandling.id)}
                            </Tabs.Panel>
                        ))}
                </TabContentContainer>
            </Tabs>
        </StegProvider>
    );
};

export default BehandlingTabsInnhold;
