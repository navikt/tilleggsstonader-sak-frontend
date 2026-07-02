import React, { useEffect, useState } from 'react';

import { HGrid } from '@navikt/ds-react';

import { useVedtak } from '../../../../hooks/useVedtak';
import DataViewer from '../../../../komponenter/DataViewer';
import Panel from '../../../../komponenter/Panel/Panel';
import { RessursStatus } from '../../../../typer/ressurs';
import { TypeVedtak } from '../../../../typer/vedtak/vedtak';
import {
    vedtakErInnvilgelse,
    VedtakReiseTilSamling,
} from '../../../../typer/vedtak/vedtakReiseTilSamling';
import { VelgVedtakResultat } from '../Felles/VelgVedtakResultat';
import { InnvilgelseReiseTilSamlingEllerVedtaksperioderFraForrigeBehandling } from './innvilgeVedtak/InnvilgelseReiseTilSamlingEllerVedtaksperioderFraForrigeBehandling';

export const VedtakOgBeregningReiseTilSamling: React.FC = () => {
    const { vedtak } = useVedtak<VedtakReiseTilSamling>();
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
                    <div>
                        <Panel tittel="Vedtak">
                            <HGrid gap="space-64" columns={{ sm: 1, md: '5em auto' }}>
                                <VelgVedtakResultat
                                    typeVedtak={typeVedtak}
                                    settTypeVedtak={settTypeVedtak}
                                />
                            </HGrid>
                        </Panel>

                        {typeVedtak === TypeVedtak.INNVILGELSE && (
                            <InnvilgelseReiseTilSamlingEllerVedtaksperioderFraForrigeBehandling
                                lagretVedtak={vedtakErInnvilgelse(vedtak) ? vedtak : undefined}
                            />
                        )}
                    </div>
                )}
            </DataViewer>
        </>
    );
};
