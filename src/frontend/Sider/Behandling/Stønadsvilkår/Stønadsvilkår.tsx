import React, { useEffect } from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import OppsummeringStønadsperioder from './OppsummeringStønadsperioder';
import PassBarn from './PassBarn/PassBarn';
import { VarselBarnUnder2År } from './PassBarn/VarselBarnUnder2år';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { useRegler } from '../../../hooks/useRegler';
import { useVilkårsoppsummering } from '../../../hooks/useVilkårsoppsummering';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { FanePath } from '../faner';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const Stønadsvilkår = () => {
    const { behandling } = useBehandling();
    const { regler, hentRegler } = useRegler();
    const { vilkårsvurdering } = useVilkår();

    const { vilkårsoppsummering } = useVilkårsoppsummering(behandling.id);

    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    return (
        <Container>
            <DataViewer
                response={{
                    regler,
                    vilkårsvurdering,
                    vilkårsoppsummering,
                }}
            >
                {({ regler, vilkårsvurdering, vilkårsoppsummering }) => (
                    <>
                        {vilkårsoppsummering.visVarselKontantstøtte && <VarselBarnUnder2År />}
                        <OppsummeringStønadsperioder
                            stønadsperioder={vilkårsoppsummering.stønadsperioder}
                        />
                        <PassBarn
                            vilkårsregler={regler.vilkårsregler.PASS_BARN.regler}
                            vilkårsvurdering={vilkårsvurdering}
                        />
                    </>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.VILKÅR} nesteFane={FanePath.VEDTAK_OG_BEREGNING}>
                Fullfør vilkårsvurdering og gå videre
            </StegKnapp>
        </Container>
    );
};

export default Stønadsvilkår;
