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
    const { vilkårperioder, stønadsperioder } = useInngangsvilkår();

    return (
        <DataViewer response={{ vilkårperioder, stønadsperioder }}>
            {({ vilkårperioder, stønadsperioder }) => (
                <>
                    <Målgruppe målgrupper={vilkårperioder.målgrupper} regler={regler} />
                    <Aktivitet aktiviteter={vilkårperioder.aktiviteter} regler={regler} />
                    <Stønadsperioder
                        vilkårperioder={vilkårperioder}
                        stønadsperioder={stønadsperioder}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default InngangsvilkårInnhold;
