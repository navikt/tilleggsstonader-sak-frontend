import React, { useEffect } from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import FasteUtgifterEnBolig from './Boutgifter/FasteUtgifterEnBolig';
import FasteUtgifterToBoliger from './Boutgifter/FasteUtgifterToBoliger';
import PassBarn from './PassBarn/PassBarn';
import { VarselBarnUnder2År } from './PassBarn/VarselBarnUnder2år';
import { useBehandling } from '../../../context/BehandlingContext';
import { VilkårProvider } from '../../../context/VilkårContext';
import { useHentVilkårsvurdering } from '../../../hooks/useHentVilkårsvurdering';
import { useRegler } from '../../../hooks/useRegler';
import { useVilkårsoppsummering } from '../../../hooks/useVilkårsoppsummering';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { FanePath } from '../faner';
import { VarselRevurderFraDatoMangler } from '../Felles/VarselRevurderFraDatoMangler';
import { OppsummeringVilkårperioder } from '../OppsummeringVilkår/OppsummeringVilkårperioder';
import MidlertidigOvernatting from './Boutgifter/MidlertidigOvernatting';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const Stønadsvilkår: React.FC<{
    stønadstype: Stønadstype;
}> = ({ stønadstype }) => {
    const { behandling } = useBehandling();
    const { regler, hentRegler } = useRegler();
    const { vilkårsoppsummering } = useVilkårsoppsummering(behandling.id);
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
            <DataViewer
                response={{
                    regler,
                    vilkårsvurdering,
                    vilkårsoppsummering,
                }}
            >
                {({ regler, vilkårsvurdering, vilkårsoppsummering }) => (
                    <VilkårProvider hentetVilkårsvurdering={vilkårsvurdering}>
                        {stønadstype === Stønadstype.BARNETILSYN && (
                            <>
                                {vilkårsoppsummering.visVarselKontantstøtte && (
                                    <VarselBarnUnder2År />
                                )}
                                <PassBarn vilkårsregler={regler.vilkårsregler.PASS_BARN.regler} />
                            </>
                        )}
                        {stønadstype === Stønadstype.BOUTGIFTER && (
                            <>
                                <MidlertidigOvernatting
                                    vilkårsregler={
                                        regler.vilkårsregler.MIDLERTIDIG_OVERNATTING.regler
                                    }
                                />
                                <FasteUtgifterEnBolig
                                    vilkårsregler={
                                        regler.vilkårsregler.FASTE_UTGIFTER_EN_BOLIG.regler
                                    }
                                />
                                <FasteUtgifterToBoliger
                                    vilkårsregler={
                                        regler.vilkårsregler.FASTE_UTGIFTER_TO_BOLIGER.regler
                                    }
                                />
                            </>
                        )}
                    </VilkårProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.VILKÅR} nesteFane={FanePath.VEDTAK_OG_BEREGNING}>
                Fullfør vilkårsvurdering og gå videre
            </StegKnapp>
        </Container>
    );
};

export default Stønadsvilkår;
