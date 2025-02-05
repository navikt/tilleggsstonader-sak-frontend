import React, { useEffect } from 'react';

import { InnvilgeLæremidler, Vedtaksperiode } from './InnvilgeLæremidler';
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

export const InnvilgelseLæremidlerEllerVedtaksperioderFraForrigeBehandling: React.FC<{
    lagretVedtak: InnvilgelseLæremidler | undefined;
}> = ({ lagretVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    if (lagretVedtak || !erStegRedigerbart || !behandling.forrigeBehandlingId) {
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
                forrigeBehandlingId={behandling.forrigeBehandlingId}
            />
        );
    }
};

const InnvilgeLæremidlerMedPerioderFraForrigeBehandling = ({
    stønadstype,
    forrigeBehandlingId,
}: {
    stønadstype: Stønadstype;
    forrigeBehandlingId: string;
}) => {
    const { forrigeVedtak, hentForrigeVedtak } = useVedtakForrigeBehandling<VedtakLæremidler>();

    useEffect(() => {
        hentForrigeVedtak(stønadstype, forrigeBehandlingId);
    }, [hentForrigeVedtak, forrigeBehandlingId, stønadstype]);

    return (
        <DataViewer response={{ forrigeVedtak }}>
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
            return undefined; // TODO legg till når opphør inneholder vedtaksperioder?
        case TypeVedtak.AVSLAG:
            return undefined;
    }
};
