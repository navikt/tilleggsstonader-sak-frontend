import React, { useEffect } from 'react';

import { styled } from 'styled-components';

import Aktivitet from './Aktivitet/Aktivitet';
import AktivitetGammel from './AktivitetGammel/Aktivitet';
import FyllUtVilkårKnapp from './FyllUtVilkårKnapp';
import Målgruppe from './Målgruppe/Målgruppe';
import MålgruppeGammel from './MålgruppeGammel/Målgruppe';
import PassBarn from './PassBarn/PassBarn';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { useVilkår } from '../../../context/VilkårContext';
import { useRegler } from '../../../hooks/useRegler';
import DataViewer from '../../../komponenter/DataViewer';
import { erProd } from '../../../utils/miljø';

const Container = styled.div`
    display: grid;
    grid-direction: column;
    gap: 2rem;
    margin: 2rem;
`;

const Inngangsvilkår = () => {
    const { regler, hentRegler } = useRegler();
    const { vilkårsvurdering } = useVilkår();

    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    return (
        <Container>
            {!erProd() && <FyllUtVilkårKnapp />}
            <DataViewer response={{ regler, vilkårsvurdering }}>
                {({ regler, vilkårsvurdering }) => (
                    <>
                        <Målgruppe />
                        <Aktivitet />
                        <Stønadsperioder />
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
