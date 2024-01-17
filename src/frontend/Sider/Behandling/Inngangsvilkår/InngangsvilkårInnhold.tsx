import React, { useEffect, useState } from 'react';

import Aktivitet from './Aktivitet/Aktivitet';
import Målgruppe from './Målgruppe/Målgruppe';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { Stønadsperiode } from './typer/stønadsperiode';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../context/InngangsvilkårContext';
import DataViewer from '../../../komponenter/DataViewer';
import { ReglerForVilkår } from '../../../typer/regel';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';

const InngangsvilkårInnhold: React.FC<{
    regler: ReglerForVilkår;
}> = ({ regler }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { vilkårperioder } = useInngangsvilkår();

    const [stønadsperioder, settStønadsperioder] = useState<Ressurs<Stønadsperiode[]>>(
        byggTomRessurs()
    );

    useEffect(() => {
        request<Stønadsperiode[], null>(`/api/sak/stonadsperiode/${behandling.id}`).then(
            settStønadsperioder
        );
    }, [behandling.id, request]);

    return (
        <DataViewer response={{ vilkårperioder, stønadsperioder }}>
            {({ vilkårperioder, stønadsperioder }) => (
                <>
                    <Målgruppe målgrupper={vilkårperioder.målgrupper} />
                    <Aktivitet aktiviteter={vilkårperioder.aktiviteter} regler={regler} />
                    <Stønadsperioder
                        vilkårperioder={vilkårperioder}
                        eksisterendeStønadsperioder={stønadsperioder}
                    />
                </>
            )}
        </DataViewer>
    );
};

export default InngangsvilkårInnhold;
