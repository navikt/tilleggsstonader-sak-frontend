import React, { useEffect, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { useLocation, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

import { Alert, Button, Tabs } from '@navikt/ds-react';
import { ATextSubtle } from '@navikt/ds-tokens/dist/tokens';

import { HamburgermenyBehandling } from './Fanemeny/HamburgermenyBehandling';
import { faneErLåst, FanePath, hentBehandlingfaner, isFanePath } from './faner';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { StegProvider } from '../../context/StegContext';
import { SettPåVentSak } from '../../komponenter/SettPåVent/SettPåVentContainer';
import { Sticky } from '../../komponenter/Visningskomponenter/Sticky';
import { BehandlingType } from '../../typer/behandling/behandlingType';
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

    const utledEndringsdatoAutomatisk = useFlag(Toggle.SKAL_UTLEDE_ENDRINGSDATO_AUTOMATISK);
    const medRevurderFraFane = (): boolean => {
        if (utledEndringsdatoAutomatisk) return false;
        // Antar at man ser i en avsluttet behandling eller beslutter en behandling.
        else if (!behandling.revurderFra && !behandlingErRedigerbar) return false;
        else return true;
    };

    const førsteFanePath =
        behandling.type === BehandlingType.REVURDERING && medRevurderFraFane()
            ? FanePath.REVURDER_FRA
            : FanePath.INNGANGSVILKÅR;
    const aktivFane = isFanePath(path) ? path : førsteFanePath;

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

    const behandlingFaner = hentBehandlingfaner(behandling, medRevurderFraFane());

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
