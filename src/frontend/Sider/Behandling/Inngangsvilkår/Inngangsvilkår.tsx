import React, { useEffect } from 'react';

import Aktivitet from './Aktivitet/Aktivitet';
import Målgruppe from './Målgruppe/Målgruppe';
import { useRegler } from '../../../hooks/useRegler';
import DataViewer from '../../../komponenter/DataViewer';
import { aktivitetVilkårMock, målgruppeVilkårMock } from '../../../mock/vilkår';

const Inngangsvilkår = () => {
    const { regler, hentRegler } = useRegler();

    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    return (
        <DataViewer response={{ regler }}>
            {({ regler }) => (
                <>
                    <Målgruppe
                        vilkår={målgruppeVilkårMock}
                        vilkårsregler={regler.vilkårsregler.MÅLGRUPPE}
                    />
                    <Aktivitet
                        vilkår={aktivitetVilkårMock}
                        vilkårsregler={regler.vilkårsregler.AKTIVITET}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default Inngangsvilkår;
