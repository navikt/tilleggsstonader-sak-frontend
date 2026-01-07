import React, { FC, useEffect, useState } from 'react';

import { HGrid } from '@navikt/ds-react';

import { useVedtak } from '../../../../../hooks/useVedtak';
import DataViewer from '../../../../../komponenter/DataViewer';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { RessursStatus } from '../../../../../typer/ressurs';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    VedtakDagligReise,
    vedtakErAvslag,
    vedtakErInnvilgelse,
    vedtakErOpphør,
} from '../../../../../typer/vedtak/vedtakDagligReise';
import { FanePath } from '../../../faner';
import AvslåVedtak from '../../Felles/AvslåVedtak';
import OpphørVedtak from '../../Felles/Opphørsvedtak';
import VelgVedtakResultat from '../../Felles/VelgVedtakResultat';
import { InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling } from '../innvilgeVedtak/InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling';
import styles from '../VedtakOgBeregningDagligReise.module.css';

export const RammevedtakOgBeregningDagligReise: FC = () => {
    const { vedtak } = useVedtak<VedtakDagligReise>();
    const [typeVedtak, settTypeVedtak] = useState<TypeVedtak | undefined>();

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settTypeVedtak(vedtak.data.type);
        }
    }, [vedtak]);

    return (
        <>
            <DataViewer type={'vedtak'} response={{ vedtak }}>
                {({ vedtak }) => (
                    <div className={styles.container}>
                        <Panel tittel="Rammevedtak">
                            <HGrid gap="16" columns={{ sm: 1, md: '5em auto' }}>
                                <VelgVedtakResultat
                                    typeVedtak={typeVedtak}
                                    settTypeVedtak={settTypeVedtak}
                                />
                                {typeVedtak === TypeVedtak.AVSLAG && (
                                    <AvslåVedtak
                                        vedtak={vedtakErAvslag(vedtak) ? vedtak : undefined}
                                    />
                                )}
                                {typeVedtak === TypeVedtak.OPPHØR && (
                                    <OpphørVedtak
                                        vedtak={vedtakErOpphør(vedtak) ? vedtak : undefined}
                                    />
                                )}
                            </HGrid>
                        </Panel>

                        {typeVedtak === TypeVedtak.INNVILGELSE && (
                            <InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling
                                lagretVedtak={vedtakErInnvilgelse(vedtak) ? vedtak : undefined}
                            />
                        )}
                    </div>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.BEREGNE_RAMMEVEDTAK_PRIVAT_BIL} nesteFane={FanePath.KJORELISTE}>
                Fullfør beregning av rammevedtaket og gå videre
            </StegKnapp>
        </>
    );
};
