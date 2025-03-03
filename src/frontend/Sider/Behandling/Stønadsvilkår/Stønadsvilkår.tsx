import React, { useEffect } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import { OppsummeringStønadsperioder } from './OppsummeringStønadsperioder';
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
import { Toggle } from '../../../utils/toggles';
import { FanePath } from '../faner';
import { VarselRevurderFraDatoMangler } from '../Felles/VarselRevurderFraDatoMangler';
import { OppsummeringVilkårperioder } from '../OppsummeringVilkår/OppsummeringVilkårperioder';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const Stønadsvilkår = () => {
    const { behandling } = useBehandling();
    const { regler, hentRegler } = useRegler();
    const { vilkårsoppsummering } = useVilkårsoppsummering(behandling.id);
    const { hentVilkårsvurdering, vilkårsvurdering } = useHentVilkårsvurdering();
    const kanBrukeVedtaksperioderTilsynbarn = useFlag(Toggle.KAN_BRUKE_VEDTAKSPERIODER_TILSYN_BARN);

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
                        {vilkårsoppsummering.visVarselKontantstøtte && <VarselBarnUnder2År />}
                        {!kanBrukeVedtaksperioderTilsynbarn && (
                            <OppsummeringStønadsperioder
                                stønadsperioder={vilkårsoppsummering.stønadsperioder}
                            />
                        )}
                        <PassBarn vilkårsregler={regler.vilkårsregler.PASS_BARN.regler} />
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
