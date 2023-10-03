import React, { FC, useState } from 'react';

import { BehandlingResultat } from '../../../../typer/behandling/behandlingResultat';
import SelectVedtaksresultat from '../Felles/SelectVedtaksresultat';

const VedtakOgBeregningBarnetilsyn: FC = () => {
    const [resultatType, settResultatType] = useState<BehandlingResultat | undefined>();

    return (
        <>
            <SelectVedtaksresultat
                resultatType={resultatType}
                settResultatType={settResultatType}
            />
        </>
    );
};

export default VedtakOgBeregningBarnetilsyn;
