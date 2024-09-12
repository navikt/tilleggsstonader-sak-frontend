import React, { useEffect } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { Box, VStack } from '@navikt/ds-react';

import PassBarn from './PassBarn/PassBarn';
import { VarselBarnUnder2År } from './PassBarn/VarselBarnUnder2år';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { useRegler } from '../../../hooks/useRegler';
import { useVilkårsoppsummering } from '../../../hooks/useVilkårsoppsummering';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { Toggle } from '../../../utils/toggles';
import { FanePath } from '../faner';
import OppsummeringStønadsperioder from '../VedtakOgBeregning/Barnetilsyn/InnvilgeVedtak/OppsummeringStønadsperioder';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const Stønadsvilkår = () => {
    const { behandling } = useBehandling();
    const { regler, hentRegler } = useRegler();
    const { vilkårsvurdering } = useVilkår();

    const { vilkårsoppsummering } = useVilkårsoppsummering(behandling.id);

    const periodiserteVilkårIsEnabled = useFlag(Toggle.VILKÅR_PERIODISERING);

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
                        {periodiserteVilkårIsEnabled && (
                            /*
                            TODO flytt box inn i OppsummeringStønadsperioder når FT fjernes
                            TODO flytt OppsummeringStønadsperioder inn under Stønadsvilkår
                            */
                            <>
                                {vilkårsoppsummering.visVarselKontantstøtte && (
                                    <VarselBarnUnder2År />
                                )}
                                <Box padding="4" background="surface-selected">
                                    <OppsummeringStønadsperioder
                                        stønadsperioder={vilkårsoppsummering.stønadsperioder}
                                    />
                                </Box>
                            </>
                        )}
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
