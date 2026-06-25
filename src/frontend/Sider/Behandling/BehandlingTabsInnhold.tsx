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
import { KjørelisteBehandlingPåVentAlert } from './Felles/KjørelisteBehandlingPåVentAlert';
import { TidligereVedtaksperioder } from './Vilkårvurdering/TidligereVedtaksperioder';
import { useApp } from '../../context/AppContext';
import { useBehandling } from '../../context/BehandlingContext';
import { StegProvider } from '../../context/StegContext';
import { useNavigateUtenSjekkForUlagredeKomponenter } from '../../hooks/useNavigateUtenSjekkForUlagredeKomponenter';
import DataViewer from '../../komponenter/DataViewer';
import { SettPåVentSak } from '../../komponenter/SettPåVent/SettPåVentContainer';
import { Sticky } from '../../komponenter/Visningskomponenter/Sticky';
import { Stønadstype } from '../../typer/behandling/behandlingTema';
import { BehandlingType } from '../../typer/behandling/behandlingType';
import { RessursStatus } from '../../typer/ressurs';
import { Toast } from '../../typer/toast';

const erDagligReise = (stønadstype: Stønadstype) =>
    stønadstype === Stønadstype.DAGLIG_REISE_TSO || stønadstype === Stønadstype.DAGLIG_REISE_TSR;

const BehandlingTabsInnhold = () => {
    const navigate = useNavigate();
    const navigateUtenSjekk = useNavigateUtenSjekkForUlagredeKomponenter();
    const { settToast, request } = useApp();
    const {
        behandling,
        behandlingFakta,
        behandlingErRedigerbar,
        toggleKanSaksbehandle,
        kanSetteBehandlingPåVent,
        sluttDatoForrigeVedtak,
        rammevedtakRessurs,
    } = useBehandling();

    const path = useLocation().pathname.split('/')[3];
    const [statusPåVentRedigering, settStatusPåVentRedigering] = useState(false);
    const [harKjørelisteBehandlingPåVent, settHarKjørelisteBehandlingPåVent] = useState(false);

    const harRammevedtak =
        rammevedtakRessurs.status === RessursStatus.SUKSESS &&
        rammevedtakRessurs.data.harRammevedtak;

    const aktivFane = isFanePath(path)
        ? path
        : stegTilFaneForBehandling(behandling, harRammevedtak);

    const forrigeSteg = useRef(behandling.steg);
    useEffect(() => {
        const stegHarEndretSeg = behandling.steg !== forrigeSteg.current;
        forrigeSteg.current = behandling.steg;

        const forventetFane = stegTilFaneForBehandling(behandling, harRammevedtak);
        // Ved stegendring: naviger alltid til nytt steg. Ved refresh/mount: kun naviger hvis fanen er låst.
        if (stegHarEndretSeg || faneErLåst(behandling, aktivFane)) {
            navigateUtenSjekk(`/behandling/${behandling.id}/${forventetFane}`);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [behandling.steg, harRammevedtak]);

    useEffect(() => {
        if (
            behandling.type === BehandlingType.REVURDERING &&
            erDagligReise(behandling.stønadstype)
        ) {
            request<boolean, null>(`/api/sak/behandling/${behandling.id}/kjoreliste-pa-vent`).then(
                (res) => {
                    if (res.status === 'SUKSESS') {
                        settHarKjørelisteBehandlingPåVent(res.data);
                    }
                }
            );
        }
    }, [behandling.id, behandling.type, behandling.stønadstype, request]);

    const håndterFaneBytte = (nyFane: FanePath) => {
        if (!faneErLåst(behandling, nyFane)) {
            navigate(`/behandling/${behandling.id}/${nyFane}`, { replace: true });
        } else {
            settToast(Toast.DISABLED_FANE);
        }
    };

    const behandlingFaner = hentBehandlingfaner(behandling, harRammevedtak);

    return (
        <DataViewer type={'harRammevedtak'} response={{ rammevedtakRessurs }}>
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
                            <Alert variant={'error'}>
                                Mulighet for å saksbehandle er skrudd av
                            </Alert>
                        )}
                        {harKjørelisteBehandlingPåVent && <KjørelisteBehandlingPåVentAlert />}
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
        </DataViewer>
    );
};

export default BehandlingTabsInnhold;
