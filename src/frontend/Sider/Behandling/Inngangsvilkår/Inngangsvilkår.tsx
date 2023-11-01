import React, { useEffect } from 'react';

import Aktivitet from './Aktivitet/Aktivitet';
import Målgruppe from './Målgruppe/Målgruppe';
import PassBarn from './PassBarn/PassBarn';
import { useVilkår } from '../../../context/VilkårContext';
import { useRegler } from '../../../hooks/useRegler';
import DataViewer from '../../../komponenter/DataViewer';

const Inngangsvilkår = () => {
    const { regler, hentRegler } = useRegler();
    const { vilkårsvurdering } = useVilkår();

    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    return (
        <DataViewer response={{ regler, vilkårsvurdering }}>
            {({ regler, vilkårsvurdering }) => (
                <>
                    <Målgruppe
                        vilkårsregler={regler.vilkårsregler.MÅLGRUPPE}
                        vilkårsvurdering={vilkårsvurdering}
                    />
                    <Aktivitet
                        vilkårsregler={regler.vilkårsregler.AKTIVITET}
                        vilkårsvurdering={vilkårsvurdering}
                    />
                    <PassBarn
                        vilkårsregler={regler.vilkårsregler.PASSBARN}
                        vilkårsvurdering={vilkårsvurdering}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default Inngangsvilkår;
