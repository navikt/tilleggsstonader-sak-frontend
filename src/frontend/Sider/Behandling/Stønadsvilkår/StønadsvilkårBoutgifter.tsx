import React, { useEffect } from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import { useBehandling } from '../../../context/BehandlingContext';
import { VilkårProvider } from '../../../context/VilkårContext';
import { useHentVilkårsvurdering } from '../../../hooks/useHentVilkårsvurdering';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { FanePath } from '../faner';
import { VarselRevurderFraDatoMangler } from '../Felles/VarselRevurderFraDatoMangler';
import { OppsummeringVilkårperioder } from '../OppsummeringVilkår/OppsummeringVilkårperioder';
import Boutgifter from './Boutgifter/Boutgifter';
import { useRegler } from '../../../hooks/useRegler';
import DataViewer from '../../../komponenter/DataViewer';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const StønadsvilkårBoutgifter = () => {
    const { behandling } = useBehandling();
    const { regler, hentRegler } = useRegler();
    const { hentVilkårsvurdering, vilkårsvurdering } = useHentVilkårsvurdering();

    useEffect(() => {
        hentVilkårsvurdering(behandling.id);
    }, [behandling.id, hentVilkårsvurdering]);

    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    return (
        <Container>
            <VarselRevurderFraDatoMangler />
            <OppsummeringVilkårperioder behandlingId={behandling.id} />
            <DataViewer response={{ regler, vilkårsvurdering }}>
                {({ regler, vilkårsvurdering }) => (
                    <VilkårProvider hentetVilkårsvurdering={vilkårsvurdering}>
                        <Boutgifter
                            vilkårsregler={regler.vilkårsregler.MIDLERTIDIG_OVERNATTING.regler}
                        />
                    </VilkårProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.VILKÅR} nesteFane={FanePath.VEDTAK_OG_BEREGNING}>
                Fullfør vilkårsvurdering og gå videre
            </StegKnapp>
        </Container>
    );
};

export default StønadsvilkårBoutgifter;
