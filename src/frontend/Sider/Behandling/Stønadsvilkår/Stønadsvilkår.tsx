import React, { useEffect } from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { Box, VStack } from '@navikt/ds-react';

import PassBarn from './PassBarn/PassBarn';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { useRegler } from '../../../hooks/useRegler';
import { useStønadsperioder } from '../../../hooks/useStønadsperioder';
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

    const { stønadsperioder } = useStønadsperioder(behandling.id);

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
                    stønadsperioder,
                }}
            >
                {({ regler, vilkårsvurdering, stønadsperioder }) => (
                    <>
                        {periodiserteVilkårIsEnabled && (
                            /*TODO flytt box inn i OppsummeringStønadsperioder når FT fjernes */
                            <Box padding="4" background="surface-selected">
                                <OppsummeringStønadsperioder stønadsperioder={stønadsperioder} />
                            </Box>
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
