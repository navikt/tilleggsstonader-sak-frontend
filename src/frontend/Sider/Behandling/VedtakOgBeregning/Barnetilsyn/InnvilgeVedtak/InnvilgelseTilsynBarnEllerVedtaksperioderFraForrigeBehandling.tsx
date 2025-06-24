import React, { useEffect } from 'react';

import { InnvilgeBarnetilsyn } from './InnvilgeBarnetilsyn';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVedtakForrigeBehandling } from '../../../../../hooks/useVedtak';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    InnvilgelseBarnetilsyn,
    VedtakBarnetilsyn,
} from '../../../../../typer/vedtak/vedtakTilsynBarn';

export const InnvilgelseTilsynBarnEllerVedtaksperioderFraForrigeBehandling: React.FC<{
    lagretVedtak: InnvilgelseBarnetilsyn | undefined;
}> = ({ lagretVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    if (lagretVedtak || !erStegRedigerbart || !behandling.forrigeIverksatteBehandlingId) {
        return (
            <InnvilgeBarnetilsyn
                lagretVedtak={lagretVedtak}
                vedtaksperioderForrigeBehandling={undefined}
            />
        );
    } else {
        return (
            <InnvilgeTilsynBarnMedPerioderFraForrigeBehandling
                stønadstype={behandling.stønadstype}
                forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
            />
        );
    }
};

const InnvilgeTilsynBarnMedPerioderFraForrigeBehandling = ({
    stønadstype,
    forrigeIverksatteBehandlingId,
}: {
    stønadstype: Stønadstype;
    forrigeIverksatteBehandlingId: string;
}) => {
    const { forrigeVedtak, hentForrigeVedtak } = useVedtakForrigeBehandling<VedtakBarnetilsyn>();

    useEffect(() => {
        hentForrigeVedtak(stønadstype, forrigeIverksatteBehandlingId);
    }, [hentForrigeVedtak, forrigeIverksatteBehandlingId, stønadstype]);

    return (
        <DataViewer type={'forrige vedtak'} response={{ forrigeVedtak }}>
            {({ forrigeVedtak }) => {
                return (
                    <InnvilgeBarnetilsyn
                        lagretVedtak={undefined}
                        vedtaksperioderForrigeBehandling={vedtaksperioderForrigeVedtak(
                            forrigeVedtak
                        )}
                    />
                );
            }}
        </DataViewer>
    );
};

const vedtaksperioderForrigeVedtak = (vedtak: VedtakBarnetilsyn): Vedtaksperiode[] | undefined => {
    switch (vedtak.type) {
        case TypeVedtak.INNVILGELSE:
            return vedtak.vedtaksperioder;
        case TypeVedtak.OPPHØR:
            return vedtak.vedtaksperioder;
        case TypeVedtak.AVSLAG:
            return undefined;
    }
};
