import React, { useEffect, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { useLocation, useNavigate } from 'react-router-dom';

import { Alert, Button, Tabs } from '@navikt/ds-react';

import styles from './BehandlingTabsInnhold.module.css';
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
                <Sticky className={styles.stickyTablistContainer}>
                    <Tabs.List className={styles.tabsList}>
                        {behandlingFaner.map((tab) =>
                            tab.erLåst ? (
                                <Tabs.Tab
                                    key={tab.path}
                                    value={tab.path}
                                    label={tab.navn}
                                    icon={tab.ikon}
                                    className={styles.disabledTab}
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
                        <div className={styles.høyrejustertInnhold}>
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
                        </div>
                    </Tabs.List>
                </Sticky>
                <div className={styles.tabContentContainer}>
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
                </div>
            </Tabs>
        </StegProvider>
    );
};

export default BehandlingTabsInnhold;
