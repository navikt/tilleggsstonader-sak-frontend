import React, { FC } from 'react';

import { InnvilgeBarnetilsyn } from './InnvilgeBarnetilsyn';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';

interface Props {
    settResultatType: (val: BehandlingResultat | undefined) => void;
}

export const InnvilgeVedtak: FC<Props> = ({ settResultatType }) => {
    return (
        <>
            {/* TODO: Revurderes fra og med */}
            <InnvilgeBarnetilsyn settResultatType={settResultatType} låsFraDatoFørsteRad={false} />
        </>
    );
};
