import React, { useEffect } from 'react';

import { InnvilgeLæremidler } from './InnvilgeLæremidler';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVedtakForrigeBehandling } from '../../../../../hooks/useVedtak';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    InnvilgelseLæremidler,
    VedtakLæremidler,
} from '../../../../../typer/vedtak/vedtakLæremidler';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';

export const InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling: React.FC<{
    lagretVedtak: InnvilgelseLæremidler | undefined;
}> = ({ lagretVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    if (lagretVedtak || !erStegRedigerbart || !behandling.forrigeIverksatteBehandlingId) {
        return (
            <InnvilgeLæremidler
                lagretVedtak={lagretVedtak}
                vedtaksperioderForrigeBehandling={undefined}
            />
        );
    } else {
        return (
            <InnvilgeLæremidlerMedPerioderFraForrigeBehandling
                stønadstype={behandling.stønadstype}
                forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
            />
        );
    }
};

const InnvilgeLæremidlerMedPerioderFraForrigeBehandling = ({
    stønadstype,
    forrigeIverksatteBehandlingId,
}: {
    stønadstype: Stønadstype;
    forrigeIverksatteBehandlingId: string;
}) => {
    const { forrigeVedtak, hentForrigeVedtak } = useVedtakForrigeBehandling<VedtakLæremidler>();

    useEffect(() => {
        hentForrigeVedtak(stønadstype, forrigeIverksatteBehandlingId);
    }, [hentForrigeVedtak, forrigeIverksatteBehandlingId, stønadstype]);

    return (
        <DataViewer type={'forrige vedtak'} response={{ forrigeVedtak }}>
            {({ forrigeVedtak }) => {
                return (
                    <InnvilgeLæremidler
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

const vedtaksperioderForrigeVedtak = (vedtak: VedtakLæremidler): Vedtaksperiode[] | undefined => {
    switch (vedtak.type) {
        case TypeVedtak.INNVILGELSE:
            return vedtak.vedtaksperioder;
        case TypeVedtak.OPPHØR:
            return vedtak.vedtaksperioder;
        case TypeVedtak.AVSLAG:
            return undefined;
    }
};
