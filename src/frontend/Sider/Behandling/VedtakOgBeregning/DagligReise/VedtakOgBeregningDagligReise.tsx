import React, { FC, useEffect, useState } from 'react';

import { InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling } from './innvilgeVedtak/InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling';
import styles from './VedtakOgBeregningDagligReise.module.css';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import { RessursStatus } from '../../../../typer/ressurs';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import { VedtakDagligReise, vedtakErInnvilgelse } from '../../../../typer/vedtak/vedtakDagligReise';

export const VedtakOgBeregningDagligReise: FC = () => {
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
