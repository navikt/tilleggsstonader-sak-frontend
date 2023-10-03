import React, { FC, useState } from 'react';

import { BehandlingResultat } from '../../../../typer/behandling/behandlingResultat';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';

const VedtakOgBeregningBarnetilsyn: FC = () => {
    const [resultatType, settResultatType] = useState<BehandlingResultat | undefined>();

    const test = () => {
        switch (resultatType) {
            case BehandlingResultat.INNVILGET:
                return <p>Innvilge</p>;

            case undefined:
                break;

            default:
                return <p>Ikke implementert</p>;
        }
    };

    return (
        <>
            <SelectVedtaksresultat
                resultatType={resultatType}
                settResultatType={settResultatType}
            />
            {test()}
        </>
    );
};

export default VedtakOgBeregningBarnetilsyn;
