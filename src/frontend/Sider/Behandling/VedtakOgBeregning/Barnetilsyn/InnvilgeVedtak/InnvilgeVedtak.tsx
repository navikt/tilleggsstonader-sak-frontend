import React, { FC } from 'react';

import { InnvilgeBarnetilsyn } from './InnvilgeBarnetilsyn';
import { useVilkår } from '../../../../../context/VilkårContext';
import DataViewer from '../../../../../komponenter/DataViewer';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';
import { InnvilgeVedtakForBarnetilsyn } from '../../../../../typer/vedtak';

interface Props {
    settResultatType: (val: BehandlingResultat | undefined) => void;
    lagretVedtak?: InnvilgeVedtakForBarnetilsyn;
}

export const InnvilgeVedtak: FC<Props> = ({ settResultatType, lagretVedtak }) => {
    const { vilkårsvurdering } = useVilkår();

    return (
        // TODO: Revurderes fra og med
        <DataViewer response={{ vilkårsvurdering }}>
            {({ vilkårsvurdering }) => (
                <InnvilgeBarnetilsyn
                    settResultatType={settResultatType}
                    låsFraDatoFørsteRad={false}
                    barnIBehandling={vilkårsvurdering.grunnlag.barn}
                    lagretVedtak={lagretVedtak}
                />
            )}
        </DataViewer>
    );
};
