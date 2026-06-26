import React from 'react';

import { InnvilgeReiseTilSamling } from './InnvilgeReiseTilSamling';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { InnvilgelseReiseTilSamling } from '../../../../../typer/vedtak/vedtakReiseTilSamling';

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
        return <div>TODO</div>;
    }
};
