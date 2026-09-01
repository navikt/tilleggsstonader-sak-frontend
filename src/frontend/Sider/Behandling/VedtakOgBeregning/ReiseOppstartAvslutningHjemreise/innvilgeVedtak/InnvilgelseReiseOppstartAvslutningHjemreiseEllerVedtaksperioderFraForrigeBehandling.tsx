import React, { useEffect } from 'react';

import { InnvilgeReiseOppstartAvslutningHjemreise } from './InnvilgeReiseOppstartAvslutningHjemreise';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVedtakForrigeBehandling } from '../../../../../hooks/useVedtak';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    InnvilgelseReiseOppstartAvslutningHjemreise,
    VedtakReiseOppstartAvslutningHjemreise,
} from '../../../../../typer/vedtak/vedtakReiseOppstartAvslutningHjemreise';

export const InnvilgelseReiseOppstartAvslutningHjemreiseEllerVedtaksperioderFraForrigeBehandling: React.FC<{
    lagretVedtak: InnvilgelseReiseOppstartAvslutningHjemreise | undefined;
}> = ({ lagretVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    if (lagretVedtak || !erStegRedigerbart || !behandling.forrigeIverksatteBehandlingId) {
        return (
            <InnvilgeReiseOppstartAvslutningHjemreise
                lagretVedtak={lagretVedtak}
                vedtaksperioderForrigeBehandling={undefined}
            />
        );
    } else {
        return (
            <InnvilgeReiseOppstartAvslutningHjemreiseMedPerioderFraForrigeBehandling
                stønadstype={behandling.stønadstype}
                forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
            />
        );
    }
};

const InnvilgeReiseOppstartAvslutningHjemreiseMedPerioderFraForrigeBehandling = ({
    stønadstype,
    forrigeIverksatteBehandlingId,
}: {
    stønadstype: Stønadstype;
    forrigeIverksatteBehandlingId: string;
}) => {
    const { forrigeVedtak, hentForrigeVedtak } =
        useVedtakForrigeBehandling<VedtakReiseOppstartAvslutningHjemreise>();

    useEffect(() => {
        hentForrigeVedtak(stønadstype, forrigeIverksatteBehandlingId);
    }, [hentForrigeVedtak, forrigeIverksatteBehandlingId, stønadstype]);

    return (
        <DataViewer type={'forrige vedtak'} response={{ forrigeVedtak }}>
            {({ forrigeVedtak }) => (
                <InnvilgeReiseOppstartAvslutningHjemreise
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
    vedtak: VedtakReiseOppstartAvslutningHjemreise
): Vedtaksperiode[] | undefined {
    if (vedtak.type === TypeVedtak.INNVILGELSE) {
        return vedtak.vedtaksperioder;
    }
    return undefined;
}
