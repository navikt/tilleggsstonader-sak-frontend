import React, { FC, useEffect, useState } from 'react';

import { Alert, HGrid } from '@navikt/ds-react';

import { InnvilgeFlytting } from './innvilgeVedtak/InnvilgeFlytting';
import styles from './VedtakOgBeregningFlytting.module.css';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { BehandlingType } from '../../../../typer/behandling/behandlingType';
import { RessursStatus } from '../../../../typer/ressurs';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import {
    VedtakFlytting,
    vedtakErAvslag,
    vedtakErInnvilgelse,
} from '../../../../typer/vedtak/vedtakFlytting';
import { AvslåVedtak } from '../Felles/AvslåVedtak';
import { VelgVedtakResultat } from '../Felles/VelgVedtakResultat';

export const VedtakOgBeregningFlytting: FC = () => {
    const { behandling } = useBehandling();
    const { vedtak } = useVedtak<VedtakFlytting>();
    const [typeVedtak, settTypeVedtak] = useState<TypeVedtak | undefined>();

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settTypeVedtak(vedtak.data.type);
        }
    }, [vedtak]);

    const erRevurdering = behandling.type === BehandlingType.REVURDERING;

    return (
        <DataViewer type={'vedtak'} response={{ vedtak }}>
            {({ vedtak }) => (
                <div className={styles.container}>
                    <Panel tittel="Vedtak">
                        <HGrid gap="space-64" columns={{ sm: 1, md: '5em auto' }}>
                            <VelgVedtakResultat
                                typeVedtak={typeVedtak}
                                settTypeVedtak={settTypeVedtak}
                            />
                            {typeVedtak === TypeVedtak.AVSLAG && (
                                <AvslåVedtak vedtak={vedtakErAvslag(vedtak) ? vedtak : undefined} />
                            )}
                            {typeVedtak === TypeVedtak.OPPHØR && (
                                <Alert variant="info">
                                    Opphør for flytting er ikke tilgjengelig ennå.
                                </Alert>
                            )}
                        </HGrid>
                    </Panel>

                    {typeVedtak === TypeVedtak.INNVILGELSE &&
                        (erRevurdering ? (
                            <Alert variant="info">
                                Revurdering av flyttevedtak er ikke tilgjengelig ennå.
                            </Alert>
                        ) : (
                            <InnvilgeFlytting
                                lagretVedtak={vedtakErInnvilgelse(vedtak) ? vedtak : undefined}
                            />
                        ))}
                </div>
            )}
        </DataViewer>
    );
};
