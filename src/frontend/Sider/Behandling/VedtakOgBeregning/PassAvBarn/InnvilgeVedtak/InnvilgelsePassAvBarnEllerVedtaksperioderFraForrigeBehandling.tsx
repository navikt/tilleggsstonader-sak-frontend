import React, { useEffect } from 'react';

import { InnvilgePassAvBarn } from './InnvilgePassAvBarn';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVedtakForrigeBehandling } from '../../../../../hooks/useVedtak';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    InnvilgelsePassAvBarn,
    VedtakPassAvBarn,
} from '../../../../../typer/vedtak/vedtakPassAvBarn';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';

export const InnvilgelsePassAvBarnEllerVedtaksperioderFraForrigeBehandling: React.FC<{
    lagretVedtak: InnvilgelsePassAvBarn | undefined;
}> = ({ lagretVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    if (lagretVedtak || !erStegRedigerbart || !behandling.forrigeIverksatteBehandlingId) {
        return (
            <InnvilgePassAvBarn
                lagretVedtak={lagretVedtak}
                vedtaksperioderForrigeBehandling={undefined}
            />
        );
    } else {
        return (
            <InnvilgePassAvBarnMedPerioderFraForrigeBehandling
                stønadstype={behandling.stønadstype}
                forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
            />
        );
    }
};

const InnvilgePassAvBarnMedPerioderFraForrigeBehandling = ({
    stønadstype,
    forrigeIverksatteBehandlingId,
}: {
    stønadstype: Stønadstype;
    forrigeIverksatteBehandlingId: string;
}) => {
    const { forrigeVedtak, hentForrigeVedtak } = useVedtakForrigeBehandling<VedtakPassAvBarn>();

    useEffect(() => {
        hentForrigeVedtak(stønadstype, forrigeIverksatteBehandlingId);
    }, [hentForrigeVedtak, forrigeIverksatteBehandlingId, stønadstype]);

    return (
        <DataViewer type={'forrige vedtak'} response={{ forrigeVedtak }}>
            {({ forrigeVedtak }) => {
                return (
                    <InnvilgePassAvBarn
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

const vedtaksperioderForrigeVedtak = (vedtak: VedtakPassAvBarn): Vedtaksperiode[] | undefined => {
    switch (vedtak.type) {
        case TypeVedtak.INNVILGELSE:
            return vedtak.vedtaksperioder;
        case TypeVedtak.OPPHØR:
            return vedtak.vedtaksperioder;
        case TypeVedtak.AVSLAG:
            return undefined;
    }
};
