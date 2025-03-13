import React, { useEffect } from 'react';

import { InnvilgeBoutgifter } from './InnvilgeBoutgifter';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVedtakForrigeBehandling } from '../../../../../hooks/useVedtak';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    InnvilgelseBoutgifter,
    VedtakBoutgifter,
    VedtaksperiodeBoutgifter,
} from '../../../../../typer/vedtak/vedtakBoutgifter';

export const InnvilgelseBoutgifterEllerVedtaksperioderFraForrigeBehandling: React.FC<{
    lagretVedtak: InnvilgelseBoutgifter | undefined;
}> = ({ lagretVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    if (lagretVedtak || !erStegRedigerbart || !behandling.forrigeBehandlingId) {
        return (
            <InnvilgeBoutgifter
                lagretVedtak={lagretVedtak}
                vedtaksperioderForrigeBehandling={undefined}
            />
        );
    } else {
        return (
            <InnvilgeBoutgifterMedPerioderFraForrigeBehandling
                stønadstype={behandling.stønadstype}
                forrigeBehandlingId={behandling.forrigeBehandlingId}
            />
        );
    }
};

const InnvilgeBoutgifterMedPerioderFraForrigeBehandling = ({
    stønadstype,
    forrigeBehandlingId,
}: {
    stønadstype: Stønadstype;
    forrigeBehandlingId: string;
}) => {
    const { forrigeVedtak, hentForrigeVedtak } = useVedtakForrigeBehandling<VedtakBoutgifter>();

    useEffect(() => {
        hentForrigeVedtak(stønadstype, forrigeBehandlingId);
    }, [hentForrigeVedtak, forrigeBehandlingId, stønadstype]);

    return (
        <DataViewer response={{ forrigeVedtak }}>
            {({ forrigeVedtak }) => {
                return (
                    <InnvilgeBoutgifter
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

const vedtaksperioderForrigeVedtak = (
    vedtak: VedtakBoutgifter
): VedtaksperiodeBoutgifter[] | undefined => {
    switch (vedtak.type) {
        case TypeVedtak.INNVILGELSE:
            return vedtak.vedtaksperioder;
        case TypeVedtak.OPPHØR:
            return vedtak.vedtaksperioder;
        case TypeVedtak.AVSLAG:
            return undefined;
    }
};
