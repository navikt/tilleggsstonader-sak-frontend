import React, { useEffect } from 'react';

import { styled } from 'styled-components';

import AktivitetGammel from './AktivitetGammel/Aktivitet';
import FyllUtVilkårKnapp from './FyllUtVilkårKnapp';
import InngangsvilkårInnhold from './InngangsvilkårInnhold';
import MålgruppeGammel from './MålgruppeGammel/Målgruppe';
import PassBarn from './PassBarn/PassBarn';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
import { useVilkår } from '../../../context/VilkårContext';
import { useRegler } from '../../../hooks/useRegler';
import DataViewer from '../../../komponenter/DataViewer';
import { features } from '../../../utils/features';
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
                        {features.nyeInngangsvilkår && (
                            <InngangsvilkårProvider>
                                <InngangsvilkårInnhold regler={regler.vilkårsregler} />
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
