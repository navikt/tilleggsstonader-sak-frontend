import React, { useEffect } from 'react';

import { InnvilgeFlytting } from './InnvilgeFlytting';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { useVedtakForrigeBehandling } from '../../../../../hooks/useVedtak';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import { InnvilgelseFlytting, VedtakFlytting } from '../../../../../typer/vedtak/vedtakFlytting';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';

export const InnvilgelseFlyttingEllerVedtaksperioderFraForrigeBehandling: React.FC<{
    lagretVedtak: InnvilgelseFlytting | undefined;
}> = ({ lagretVedtak }) => {
    const { erStegRedigerbart } = useSteg();
    const { behandling } = useBehandling();

    if (lagretVedtak || !erStegRedigerbart || !behandling.forrigeIverksatteBehandlingId) {
        return <InnvilgeFlytting lagretVedtak={lagretVedtak} />;
    }

    return (
        <InnvilgeFlyttingMedPerioderFraForrigeBehandling
            stønadstype={behandling.stønadstype}
            forrigeIverksatteBehandlingId={behandling.forrigeIverksatteBehandlingId}
        />
    );
};

const InnvilgeFlyttingMedPerioderFraForrigeBehandling: React.FC<{
    stønadstype: Stønadstype;
    forrigeIverksatteBehandlingId: string;
}> = ({ stønadstype, forrigeIverksatteBehandlingId }) => {
    const { forrigeVedtak, hentForrigeVedtak } = useVedtakForrigeBehandling<VedtakFlytting>();

    useEffect(() => {
        hentForrigeVedtak(stønadstype, forrigeIverksatteBehandlingId);
    }, [hentForrigeVedtak, forrigeIverksatteBehandlingId, stønadstype]);

    return (
        <DataViewer type="forrige vedtak" response={{ forrigeVedtak }}>
            {({ forrigeVedtak }) => (
                <InnvilgeFlytting
                    lagretVedtak={undefined}
                    vedtaksperioderForrigeBehandling={vedtaksperioderFraForrigeVedtak(
                        forrigeVedtak
                    )}
                />
            )}
        </DataViewer>
    );
};

function vedtaksperioderFraForrigeVedtak(vedtak: VedtakFlytting): Vedtaksperiode[] | undefined {
    if (vedtak.type === TypeVedtak.INNVILGELSE) {
        return vedtak.vedtaksperioder;
    }
    return undefined;
}
