import React, { useEffect } from 'react';

import { InnvilgeBarnetilsynV2 } from './InnvilgeBarnetilsynV2';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVedtakForrigeBehandling } from '../../../../../hooks/useVedtak';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    InnvilgelseBarnetilsyn,
    VedtakBarnetilsyn,
    VedtaksperiodeTilsynBarn,
    vedtaksperiodeTilVedtakperiodeTilsynBarn,
} from '../../../../../typer/vedtak/vedtakTilsynBarn';

export const InnvilgelseTilsynBarnEllerVedtaksperioderFraForrigeBehandling: React.FC<{
    lagretVedtak: InnvilgelseBarnetilsyn | undefined;
}> = ({ lagretVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    if (lagretVedtak || !erStegRedigerbart || !behandling.forrigeBehandlingId) {
        return (
            <InnvilgeBarnetilsynV2
                lagretVedtak={lagretVedtak}
                vedtaksperioderForrigeBehandling={undefined}
            />
        );
    } else {
        return (
            <InnvilgeTilsynBarnMedPerioderFraForrigeBehandling
                stønadstype={behandling.stønadstype}
                forrigeBehandlingId={behandling.forrigeBehandlingId}
            />
        );
    }
};

const InnvilgeTilsynBarnMedPerioderFraForrigeBehandling = ({
    stønadstype,
    forrigeBehandlingId,
}: {
    stønadstype: Stønadstype;
    forrigeBehandlingId: string;
}) => {
    const { forrigeVedtak, hentForrigeVedtak } = useVedtakForrigeBehandling<VedtakBarnetilsyn>();

    useEffect(() => {
        hentForrigeVedtak(stønadstype, forrigeBehandlingId);
    }, [hentForrigeVedtak, forrigeBehandlingId, stønadstype]);

    return (
        <DataViewer response={{ forrigeVedtak }}>
            {({ forrigeVedtak }) => {
                return (
                    <InnvilgeBarnetilsynV2
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
    vedtak: VedtakBarnetilsyn
): VedtaksperiodeTilsynBarn[] | undefined => {
    switch (vedtak.type) {
        case TypeVedtak.INNVILGELSE:
            return vedtaksperiodeTilVedtakperiodeTilsynBarn(
                vedtak.beregningsresultat.vedtaksperioder
            );
        case TypeVedtak.OPPHØR:
            return undefined; // TODO legg till når opphør inneholder vedtaksperioder?
        case TypeVedtak.AVSLAG:
            return undefined;
    }
};
