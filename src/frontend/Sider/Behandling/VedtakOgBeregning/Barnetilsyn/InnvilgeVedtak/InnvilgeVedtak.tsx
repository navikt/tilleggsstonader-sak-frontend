import React, { FC } from 'react';

import { InnvilgeBarnetilsyn } from './InnvilgeBarnetilsyn';
import { useVilkår } from '../../../../../context/VilkårContext';
import DataViewer from '../../../../../komponenter/DataViewer';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';

interface Props {
    settResultatType: (val: BehandlingResultat | undefined) => void;
}

export const InnvilgeVedtak: FC<Props> = ({ settResultatType }) => {
    const { vilkårsvurdering } = useVilkår();

    return (
        // TODO: Revurderes fra og med
        <DataViewer response={{ vilkårsvurdering }}>
            {({ vilkårsvurdering }) => (
                <InnvilgeBarnetilsyn
                    settResultatType={settResultatType}
                    låsFraDatoFørsteRad={false}
                    barnIBehandling={vilkårsvurdering.grunnlag.barn}
                />
            )}
        </DataViewer>
    );
};
