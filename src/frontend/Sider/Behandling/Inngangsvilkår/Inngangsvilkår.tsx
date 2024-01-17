import React, { useCallback, useEffect, useState } from 'react';

import { styled } from 'styled-components';

import AktivitetGammel from './AktivitetGammel/Aktivitet';
import FyllUtVilkårKnapp from './FyllUtVilkårKnapp';
import InngangsvilkårInnhold from './InngangsvilkårInnhold';
import MålgruppeGammel from './MålgruppeGammel/Målgruppe';
import PassBarn from './PassBarn/PassBarn';
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

    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    const hentVilkårperioderCallback = useCallback(() => {
        request<Vilkårperioder, null>(`/api/sak/vilkarperiode/behandling/${behandling.id}`).then(
            settVilkårperioder
        );
    }, [request, behandling.id]);

    const hentVilkårperioder = useRerunnableEffect(hentVilkårperioderCallback, [behandling.id]);

    return (
        <Container>
            {!erProd() && <FyllUtVilkårKnapp />}
            <DataViewer response={{ regler, vilkårsvurdering, vilkårperioder }}>
                {({ regler, vilkårsvurdering, vilkårperioder }) => (
                    <>
                        {features.nyeInngangsvilkår && (
                            <InngangsvilkårProvider
                                vilkårperioder={vilkårperioder}
                                hentVilkårperioder={hentVilkårperioder}
                            >
                                <InngangsvilkårInnhold />
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
