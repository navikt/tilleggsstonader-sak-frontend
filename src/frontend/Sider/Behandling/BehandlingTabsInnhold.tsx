import React, { useEffect, useRef, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

import { Alert, Button, Tabs } from '@navikt/ds-react';

import styles from './BehandlingTabsInnhold.module.css';
import { HamburgermenyBehandling } from './Fanemeny/HamburgermenyBehandling';
import {
    faneErLåst,
    FanePath,
    hentBehandlingfaner,
    isFanePath,
    stegTilFaneForBehandling,
} from './faner';
import { AndreKjørelistebehandlingerPåVentAlert } from './Felles/AndreKjørelistebehandlingerPåVentAlert';
import { KjørelisteBehandlingPåVentAlert } from './Felles/KjørelisteBehandlingPåVentAlert';
import { TidligereVedtaksperioder } from './Vilkårvurdering/TidligereVedtaksperioder';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { StegProvider } from '../../context/StegContext';
import { useNavigateUtenSjekkForUlagredeKomponenter } from '../../hooks/useNavigateUtenSjekkForUlagredeKomponenter';
import { SettPåVentSak } from '../../komponenter/SettPåVent/SettPåVentContainer';
import { Sticky } from '../../komponenter/Visningskomponenter/Sticky';
import { BehandlingType } from '../../typer/behandling/behandlingType';
import { Toast } from '../../typer/toast';

const BehandlingTabsInnhold = () => {
    const navigate = useNavigate();
    const navigateUtenSjekk = useNavigateUtenSjekkForUlagredeKomponenter();
    const { settToast } = useApp();
    const {
        behandling,
        behandlingFakta,
        behandlingErRedigerbar,
        toggleKanSaksbehandle,
        kanSetteBehandlingPåVent,
        sluttDatoForrigeVedtak,
    } = useBehandling();

    const path = useLocation().pathname.split('/')[3];
    const [statusPåVentRedigering, settStatusPåVentRedigering] = useState(false);

    const behandlingFaner = hentBehandlingfaner(behandling);
    const forventetFane = stegTilFaneForBehandling(behandling);
    const kjørelisteErUtilgjengelig =
        path === FanePath.KJØRELISTE &&
        !behandlingFaner.some((fane) => fane.path === FanePath.KJØRELISTE);
    const aktivFane = kjørelisteErUtilgjengelig
        ? forventetFane
        : isFanePath(path)
          ? path
          : forventetFane;

    const forrigeSteg = useRef(behandling.steg);
    useEffect(() => {
        const stegHarEndretSeg = behandling.steg !== forrigeSteg.current;
        forrigeSteg.current = behandling.steg;

        if (stegHarEndretSeg || faneErLåst(behandling, aktivFane)) {
            navigateUtenSjekk(`/behandling/${behandling.id}/${forventetFane}`);
        } else if (kjørelisteErUtilgjengelig) {
            navigateUtenSjekk(`/behandling/${behandling.id}/${forventetFane}`, { replace: true });
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandling.steg, behandling.kanViseKjøreliste, path]);

    const håndterFaneBytte = (nyFane: FanePath) => {
        if (!faneErLåst(behandling, nyFane)) {
            navigate(`/behandling/${behandling.id}/${nyFane}`, { replace: true });
        } else {
            settToast(Toast.DISABLED_FANE);
        }
    };

    return (
        <StegProvider
            fane={aktivFane}
            behandling={behandling}
            behandlingErRedigerbar={behandlingErRedigerbar}
            behandlingFaner={behandlingFaner}
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
                    {behandling.type === BehandlingType.REVURDERING &&
                        behandling.harÅpenKjørelistebehandling && (
                            <KjørelisteBehandlingPåVentAlert />
                        )}
                    {behandling.type === BehandlingType.KJØRELISTE && (
                        <AndreKjørelistebehandlingerPåVentAlert />
                    )}
                    <SettPåVentSak
                        statusPåVentRedigering={statusPåVentRedigering}
                        settStatusPåVentRedigering={settStatusPåVentRedigering}
                    />
                    <TidligereVedtaksperioder
                        behandlingFakta={behandlingFakta}
                        behandlingId={behandling.id}
                        stønadstype={behandling.stønadstype}
                        sluttdatoForrigeVedtak={sluttDatoForrigeVedtak.sluttdato}
                    />
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
