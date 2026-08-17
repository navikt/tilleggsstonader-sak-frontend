import React, { useEffect } from 'react';

import { InnvilgeReiseTilSamling } from './InnvilgeReiseTilSamling';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVedtakForrigeBehandling } from '../../../../../hooks/useVedtak';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    InnvilgelseReiseTilSamling,
    VedtakReiseTilSamling,
} from '../../../../../typer/vedtak/vedtakReiseTilSamling';

export const InnvilgelseReiseTilSamlingEllerVedtaksperioderFraForrigeBehandling: React.FC<{
    lagretVedtak: InnvilgelseReiseTilSamling | undefined;
}> = ({ lagretVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    if (lagretVedtak || !erStegRedigerbart || !behandling.forrigeIverksatteBehandlingId) {
        return (
            <InnvilgeReiseTilSamling
                lagretVedtak={lagretVedtak}
                vedtaksperioderForrigeBehandling={undefined}
            />
        );
    } else {
        return (
            <InnvilgeReiseTilSamlingMedPerioderFraForrigeBehandling
                stønadstype={behandling.stønadstype}
                forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
            />
        );
    }
};

const InnvilgeReiseTilSamlingMedPerioderFraForrigeBehandling = ({
    stønadstype,
    forrigeIverksatteBehandlingId,
}: {
    stønadstype: Stønadstype;
    forrigeIverksatteBehandlingId: string;
}) => {
    const { forrigeVedtak, hentForrigeVedtak } =
        useVedtakForrigeBehandling<VedtakReiseTilSamling>();

    useEffect(() => {
        hentForrigeVedtak(stønadstype, forrigeIverksatteBehandlingId);
    }, [hentForrigeVedtak, forrigeIverksatteBehandlingId, stønadstype]);

    return (
        <DataViewer type={'forrige vedtak'} response={{ forrigeVedtak }}>
            {({ forrigeVedtak }) => (
                <InnvilgeReiseTilSamling
                    lagretVedtak={undefined}
                    vedtaksperioderForrigeBehandling={vedtaksperioderFraForrigeVedtak(
                        forrigeVedtak
                    )}
                />
            )}
        </DataViewer>
    );
};

function vedtaksperioderFraForrigeVedtak(
    vedtak: VedtakReiseTilSamling
): Vedtaksperiode[] | undefined {
    if (vedtak.type === TypeVedtak.INNVILGELSE) {
        return vedtak.vedtaksperioder;
    }
    return undefined;
}
