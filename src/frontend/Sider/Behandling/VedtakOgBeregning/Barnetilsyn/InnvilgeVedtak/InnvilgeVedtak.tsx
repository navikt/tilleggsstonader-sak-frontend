import React, { FC } from 'react';

import { InnvilgeBarnetilsyn } from './InnvilgeBarnetilsyn';
import { useVilkår } from '../../../../../context/VilkårContext';
import DataViewer from '../../../../../komponenter/DataViewer';
import { InnvilgelseBarnetilsyn } from '../../../../../typer/vedtak';
import { barnSomOppfyllerAlleVilkår } from '../utils';

interface Props {
    lagretVedtak?: InnvilgelseBarnetilsyn;
}

export const InnvilgeVedtak: FC<Props> = ({ lagretVedtak }) => {
    const { vilkårsvurdering } = useVilkår();

    return (
        // TODO: Revurderes fra og med
        <DataViewer response={{ vilkårsvurdering }}>
            {({ vilkårsvurdering }) => (
                <InnvilgeBarnetilsyn
                    barnMedOppfylteVilkår={barnSomOppfyllerAlleVilkår(vilkårsvurdering)}
                    lagretVedtak={lagretVedtak}
                />
            )}
        </DataViewer>
    );
};
