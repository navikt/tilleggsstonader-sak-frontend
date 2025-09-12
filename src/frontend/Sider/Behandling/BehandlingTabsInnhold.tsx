import React, { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Accordion, Alert, BodyShort, Button, Tabs } from '@navikt/ds-react';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

import { DetaljerteVedtaksperioderBehandling } from './DetaljerteVedtaksperioderBehandling';
import { HamburgermenyBehandling } from './Fanemeny/HamburgermenyBehandling';
import { faneErLåst, FanePath, hentBehandlingfaner, isFanePath } from './faner';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { StegProvider } from '../../context/StegContext';
import { SettPåVentSak } from '../../komponenter/SettPåVent/SettPåVentContainer';
import { Sticky } from '../../komponenter/Visningskomponenter/Sticky';
import { Toast } from '../../typer/toast';

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
    color: ${ATextSubtle};

    &:hover {
        box-shadow: none;
        cursor: default;
    }
`;

const BehandlingContent = styled(Tabs.Panel)`
    max-width: 1400px;
`;

const BehandlingTabsInnhold = () => {
    const navigate = useNavigate();
    const { settToast } = useApp();
    const { behandling, behandlingErRedigerbar, toggleKanSaksbehandle, kanSetteBehandlingPåVent } =
        useBehandling();

    const path = useLocation().pathname.split('/')[3];
    const [statusPåVentRedigering, settStatusPåVentRedigering] = useState(false);

    const aktivFane = isFanePath(path) ? path : FanePath.INNGANGSVILKÅR;

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

                {!toggleKanSaksbehandle && (
                    <Alert variant={'error'}>Mulighet for å saksbehandle er skrudd av</Alert>
                )}
                <SettPåVentSak
                    statusPåVentRedigering={statusPåVentRedigering}
                    settStatusPåVentRedigering={settStatusPåVentRedigering}
                />
                <Accordion style={{ backgroundColor: '#FDFFE6' }}>
                    <Accordion.Item defaultOpen>
                        <Accordion.Header
                            style={{
                                padding: '0.5rem',
                                border: 'none',
                                boxShadow: 'none',
                                fontSize: 'medium',
                            }}
                        >
                            <BodyShort size={'small'} weight={'semibold'}>
                                Vedtaksperioder
                            </BodyShort>
                        </Accordion.Header>
                        <Accordion.Content style={{ padding: '0px', paddingBottom: '1.5rem' }}>
                            <DetaljerteVedtaksperioderBehandling
                                fagsakPersonId={behandling.fagsakPersonId}
                            />
                        </Accordion.Content>
                    </Accordion.Item>
                </Accordion>
                {behandlingFaner
                    .filter((fane) => !fane.erLåst)
                    .map((tab) => (
                        <BehandlingContent key={tab.path} value={tab.path}>
                            {tab.komponent(behandling.id)}
                        </BehandlingContent>
                    ))}
            </Tabs>
        </StegProvider>
    );
};

export default BehandlingTabsInnhold;
