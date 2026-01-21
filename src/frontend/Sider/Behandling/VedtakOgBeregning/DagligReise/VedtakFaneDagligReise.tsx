import React, { FC, useEffect, useState } from 'react';

import { HGrid } from '@navikt/ds-react';

import styles from './VedtakOgBeregningDagligReise.module.css';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { RessursStatus } from '../../../../typer/ressurs';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import {
    VedtakDagligReise,
    vedtakErAvslag,
    vedtakErInnvilgelse,
    vedtakErOpphør,
} from '../../../../typer/vedtak/vedtakDagligReise';
import { AvslåVedtak } from '../Felles/AvslåVedtak';
import { OpphørVedtak } from '../Felles/Opphørsvedtak';
import { VelgVedtakResultat } from '../Felles/VelgVedtakResultat';
import { InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling } from './InnvilgeVedtakV2/InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling';
import { Steg } from '../../../../typer/behandling/steg';
import { FanePath } from '../../faner';

export const VedtakFaneDagligReise: FC = () => {
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
                        <Panel tittel="Vedtak">
                            <HGrid gap="16" columns={{ sm: 1, md: '5em auto' }}>
                                <VelgVedtakResultat
                                    typeVedtak={typeVedtak}
                                    settTypeVedtak={settTypeVedtak}
                                />
                                {typeVedtak === TypeVedtak.AVSLAG && (
                                    <AvslåVedtak
                                        vedtak={vedtakErAvslag(vedtak) ? vedtak : undefined}
                                        steg={Steg.VEDTAK}
                                        nesteFane={FanePath.BREV}
                                    />
                                )}
                                {typeVedtak === TypeVedtak.OPPHØR && (
                                    <OpphørVedtak
                                        vedtak={vedtakErOpphør(vedtak) ? vedtak : undefined}
                                        steg={Steg.VEDTAK}
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
        </>
    );
};
