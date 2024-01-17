import React, { useCallback, useEffect, useState } from 'react';

import Aktivitet from './Aktivitet/Aktivitet';
import Målgruppe from './Målgruppe/Målgruppe';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { Stønadsperiode } from './typer/stønadsperiode';
import { Vilkårperioder } from './typer/vilkårperiode';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
import { useRerunnableEffect } from '../../../hooks/useRerunnableEffect';
import DataViewer from '../../../komponenter/DataViewer';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';

const InngangsvilkårInnhold: React.FC = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();

    const [vilkårperioder, settVilkårperioder] = useState<Ressurs<Vilkårperioder>>(
        byggTomRessurs()
    );
    const [stønadsperioder, settStønadsperioder] = useState<Ressurs<Stønadsperiode[]>>(
        byggTomRessurs()
    );

    const hentVilkårperioderCallback = useCallback(() => {
        request<Vilkårperioder, null>(`/api/sak/vilkarperioder/${behandling.id}/periode`).then(
            settVilkårperioder
        );
    }, [request, behandling.id]);

    const hentVilkårperioder = useRerunnableEffect(hentVilkårperioderCallback, [behandling.id]);

    useEffect(() => {
        request<Stønadsperiode[], null>(`/api/sak/stonadsperiode/${behandling.id}`).then(
            settStønadsperioder
        );
    }, [behandling.id, request]);

    return (
        <DataViewer response={{ stønadsperioder, vilkårperioder }}>
            {({ stønadsperioder, vilkårperioder }) => (
                <InngangsvilkårProvider
                    vilkårperioder={vilkårperioder}
                    hentVilkårperioder={hentVilkårperioder}
                >
                    <Målgruppe />
                    <Aktivitet />
                    <Stønadsperioder eksisterendeStønadsperioder={stønadsperioder} />
                </InngangsvilkårProvider>
            )}
        </DataViewer>
    );
};

export default InngangsvilkårInnhold;
