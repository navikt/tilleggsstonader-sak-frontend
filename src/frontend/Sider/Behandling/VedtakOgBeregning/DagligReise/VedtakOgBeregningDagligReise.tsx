import React, { FC, useEffect, useState } from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import { BodyLong, HGrid } from '@navikt/ds-react';

import { InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling } from './innvilgeVedtak/InnvilgelseDagligReiseEllerVedtaksperioderFraForrigeBehandling';
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
import { Toggle } from '../../../../utils/toggles';
import { AvslåVedtak } from '../Felles/AvslåVedtak';
import { OpphørVedtak } from '../Felles/Opphørsvedtak';
import { VelgVedtakResultat } from '../Felles/VelgVedtakResultat';

export const VedtakOgBeregningDagligReise: FC = () => {
    const { vedtak } = useVedtak<VedtakDagligReise>();
    const [typeVedtak, settTypeVedtak] = useState<TypeVedtak | undefined>();

    useEffect(() => {
        if (vedtak.status === RessursStatus.SUKSESS) {
            settTypeVedtak(vedtak.data.type);
        }
    }, [vedtak]);

    const kanOpphøreDagligReiseTso = useFlag(Toggle.KAN_OPPHØRE_DAGLIG_REISE_TSO);

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
                                    />
                                )}
                                {typeVedtak === TypeVedtak.OPPHØR &&
                                    (kanOpphøreDagligReiseTso ? (
                                        <OpphørVedtak
                                            vedtak={vedtakErOpphør(vedtak) ? vedtak : undefined}
                                        />
                                    ) : (
                                        <BodyLong> Opphør for daglig reise er skrudd av.</BodyLong>
                                    ))}
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
