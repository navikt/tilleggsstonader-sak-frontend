import React, { FC } from 'react';

import { v4 as uuidv4 } from 'uuid';

import { InnvilgeBarnetilsyn } from './InnvilgeBarnetilsyn';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';

interface Props {
    settResultatType: (val: BehandlingResultat | undefined) => void;
}

export const InnvilgeVedtak: FC<Props> = ({ settResultatType }) => {
    const barnIBehandling = [
        { barnId: uuidv4(), registergrunnlag: { navn: 'Ronja Røverdatter' } },
        { barnId: uuidv4(), registergrunnlag: { navn: 'Espen Askeladden' } },
    ];

    return (
        <>
            {/* TODO: Revurderes fra og med */}
            <InnvilgeBarnetilsyn
                settResultatType={settResultatType}
                låsFraDatoFørsteRad={false}
                barnIBehandling={barnIBehandling}
            />
        </>
    );
};
