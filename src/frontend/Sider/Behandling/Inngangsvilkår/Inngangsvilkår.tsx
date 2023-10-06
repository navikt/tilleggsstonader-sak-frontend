import React, { useEffect } from 'react';

import Aktivitet from './Aktivitet/Aktivitet';
import Målgruppe from './Målgruppe/Målgruppe';
import { useRegler } from '../../../hooks/useRegler';
import DataViewer from '../../../komponenter/DataViewer';

const Inngangsvilkår = () => {
    const { regler, hentRegler } = useRegler();

    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    return (
        <DataViewer response={{ regler }}>
            {({ regler }) => (
                <>
                    <Målgruppe regler={regler.vilkårsregler.MÅLGRUPPE} />
                    <Aktivitet regler={regler.vilkårsregler.AKTIVITET} />
                </>
            )}
        </DataViewer>
    );
};

export default Inngangsvilkår;
