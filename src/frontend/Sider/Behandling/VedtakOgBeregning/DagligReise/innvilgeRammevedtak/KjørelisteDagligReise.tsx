import React, { FC, useEffect, useState } from 'react';

import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import DataViewer from '../../../../../komponenter/DataViewer';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { byggHenterRessurs, byggTomRessurs } from '../../../../../typer/ressurs';
import { BeregningsresultatPrivatBil } from '../../../../../typer/vedtak/vedtakDagligReise';
import { FanePath } from '../../../faner';
import { RammevedtakPrivatBil } from '../innvilgeVedtak/RammevedtakPrivatBil';
import styles from '../VedtakOgBeregningDagligReise.module.css';

export const KjørelisteDagligReise: FC = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatPrivatBil>());

    const hentberegningsresultat = () => {
        settBeregningsresultat(byggHenterRessurs());
        request<BeregningsresultatPrivatBil, BeregningsresultatPrivatBil>(
            `/api/sak/vedtak/daglig-reise/${behandling.id}/rammevedtak`,
            'GET'
        ).then((result) => settBeregningsresultat(result));
    };

    useEffect(() => {
        hentberegningsresultat();
    });

    return (
        <>
            <DataViewer type={'beregningsresultat'} response={{ beregningsresultat }}>
                {({ beregningsresultat }) => (
                    <div className={styles.container}>
                        <Panel tittel="Rammevedtak">
                            <RammevedtakPrivatBil beregningsresultat={beregningsresultat} />
                        </Panel>
                    </div>
                )}
            </DataViewer>
            <StegKnapp
                nesteFane={FanePath.BREV}
                steg={Steg.KJØRELISTE}
                validerUlagedeKomponenter={false}
            >
                Gå videre
            </StegKnapp>
        </>
    );
};
