import React, { FC, useState } from 'react';

import { InnvilgeVedtak } from './InnvilgeVedtak/InnvilgeVedtak';
import { BehandlingResultat } from '../../../../typer/behandling/behandlingResultat';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';

const VedtakOgBeregningBarnetilsyn: FC = () => {
    const [resultatType, settResultatType] = useState<BehandlingResultat | undefined>();

    const utledVedtakForm = () => {
        switch (resultatType) {
            case BehandlingResultat.INNVILGET:
                return <InnvilgeVedtak settResultatType={settResultatType} />;

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
            {utledVedtakForm()}
        </>
    );
};

export default VedtakOgBeregningBarnetilsyn;
