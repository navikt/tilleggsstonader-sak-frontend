import React from 'react';

import Aktivitet from './Aktivitet/Aktivitet';
import Målgruppe from './Målgruppe/Målgruppe';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { useInngangsvilkår } from '../../../context/InngangsvilkårContext';
import DataViewer from '../../../komponenter/DataViewer';
import { ReglerForVilkår } from '../../../typer/regel';

const InngangsvilkårInnhold: React.FC<{
    regler: ReglerForVilkår;
}> = ({ regler }) => {
    const { vilkårperioder } = useInngangsvilkår();

    return (
        <DataViewer response={{ vilkårperioder }}>
            {({ vilkårperioder }) => (
                <>
                    <Målgruppe målgrupper={vilkårperioder.målgrupper} regler={regler} />
                    <Aktivitet aktiviteter={vilkårperioder.aktiviteter} regler={regler} />
                    <Stønadsperioder vilkårperioder={vilkårperioder} />
                </>
            )}
        </DataViewer>
    );
};

export default InngangsvilkårInnhold;
