import React, { FC } from 'react';

import { InnvilgeBarnetilsyn } from './InnvilgeBarnetilsyn';
import { useVilkår } from '../../../../../context/VilkårContext';
import DataViewer from '../../../../../komponenter/DataViewer';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';
import { InnvilgelseBarnetilsyn } from '../../../../../typer/vedtak';
import { barnSomOppfyllerAlleVilkår } from '../utils';

interface Props {
    settResultatType: (val: BehandlingResultat | undefined) => void;
    lagretVedtak?: InnvilgelseBarnetilsyn;
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
                    barnMedOppfylteVilkår={barnSomOppfyllerAlleVilkår(vilkårsvurdering)}
                    lagretVedtak={lagretVedtak}
                />
            )}
        </DataViewer>
    );
};
