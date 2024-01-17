import React, { useCallback, useEffect, useState } from 'react';

import { styled } from 'styled-components';

import Aktivitet from './Aktivitet/Aktivitet';
import AktivitetGammel from './AktivitetGammel/Aktivitet';
import FyllUtVilkårKnapp from './FyllUtVilkårKnapp';
import Målgruppe from './Målgruppe/Målgruppe';
import MålgruppeGammel from './MålgruppeGammel/Målgruppe';
import PassBarn from './PassBarn/PassBarn';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { Stønadsperiode } from './typer/stønadsperiode';
import { Vilkårperioder } from './typer/vilkårperiode';
import { useApp } from '../../../context/AppContext';
import { useBehandling } from '../../../context/BehandlingContext';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
import { useVilkår } from '../../../context/VilkårContext';
import { useRegler } from '../../../hooks/useRegler';
import { useRerunnableEffect } from '../../../hooks/useRerunnableEffect';
import DataViewer from '../../../komponenter/DataViewer';
import { Ressurs, byggTomRessurs } from '../../../typer/ressurs';
import { features } from '../../../utils/features';
import { erProd } from '../../../utils/miljø';

const Container = styled.div`
    display: grid;
    grid-direction: column;
    gap: 2rem;
    margin: 2rem;
`;

const Inngangsvilkår = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { regler, hentRegler } = useRegler();
    const { vilkårsvurdering } = useVilkår();

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
        hentRegler();
    }, [hentRegler]);

    useEffect(() => {
        request<Stønadsperiode[], null>(`/api/sak/stonadsperiode/${behandling.id}`).then(
            settStønadsperioder
        );
    }, [behandling.id, request]);

    return (
        <Container>
            {!erProd() && <FyllUtVilkårKnapp />}
            <DataViewer response={{ regler, vilkårsvurdering, vilkårperioder, stønadsperioder }}>
                {({ regler, vilkårsvurdering, vilkårperioder, stønadsperioder }) => (
                    <>
                        {features.nyeInngangsvilkår && (
                            <InngangsvilkårProvider
                                vilkårperioder={vilkårperioder}
                                hentVilkårperioder={hentVilkårperioder}
                            >
                                <Målgruppe />
                                <Aktivitet />
                                <Stønadsperioder eksisterendeStønadsperioder={stønadsperioder} />
                            </InngangsvilkårProvider>
                        )}
                        <MålgruppeGammel
                            vilkårsregler={regler.vilkårsregler.MÅLGRUPPE}
                            vilkårsvurdering={vilkårsvurdering}
                        />
                        <AktivitetGammel
                            vilkårsregler={regler.vilkårsregler.AKTIVITET}
                            vilkårsvurdering={vilkårsvurdering}
                        />
                        <PassBarn
                            vilkårsregler={regler.vilkårsregler.PASS_BARN}
                            vilkårsvurdering={vilkårsvurdering}
                        />
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default Inngangsvilkår;
