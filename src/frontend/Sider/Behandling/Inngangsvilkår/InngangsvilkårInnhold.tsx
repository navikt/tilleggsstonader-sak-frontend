import React, { useEffect, useState } from 'react';

import Aktivitet from './Aktivitet/Aktivitet';
import Målgruppe from './Målgruppe/Målgruppe';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { Stønadsperiode } from './typer/stønadsperiode';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import DataViewer from '../../../komponenter/DataViewer';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';

const InngangsvilkårInnhold: React.FC = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [stønadsperioder, settStønadsperioder] = useState<Ressurs<Stønadsperiode[]>>(
        byggTomRessurs()
    );

    useEffect(() => {
        request<Stønadsperiode[], null>(`/api/sak/stonadsperiode/${behandling.id}`).then(
            settStønadsperioder
        );
    }, [behandling.id, request]);

    return (
        <DataViewer response={{ stønadsperioder }}>
            {({ stønadsperioder }) => (
                <>
                    <Målgruppe />
                    <Aktivitet />
                    <Stønadsperioder eksisterendeStønadsperioder={stønadsperioder} />
                </>
            )}
        </DataViewer>
    );
};

export default InngangsvilkårInnhold;
