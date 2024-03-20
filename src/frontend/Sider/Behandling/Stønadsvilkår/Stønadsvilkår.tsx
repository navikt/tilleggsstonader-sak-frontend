import React, { useEffect } from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import PassBarn from './PassBarn/PassBarn';
import { useBehandling } from '../../../context/BehandlingContext';
import { useVilkår } from '../../../context/VilkårContext';
import { useRegler } from '../../../hooks/useRegler';
import DataViewer from '../../../komponenter/DataViewer';
import { NesteStegKnapp } from '../../../komponenter/NesteStegKnapp/NesteStegKnapp';
import { Steg } from '../../../typer/behandling/steg';
import { FanePath } from '../faner';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 2rem;
`;

const Stønadsvilkår = () => {
    const { regler, hentRegler } = useRegler();
    const { vilkårsvurdering } = useVilkår();
    const { behandlingErRedigerbar } = useBehandling();

    useEffect(() => {
        hentRegler();
    }, [hentRegler]);

    return (
        <Container>
            <DataViewer
                response={{
                    regler,
                    vilkårsvurdering,
                }}
            >
                {({ regler, vilkårsvurdering }) => (
                    <PassBarn
                        vilkårsregler={regler.vilkårsregler.PASS_BARN}
                        vilkårsvurdering={vilkårsvurdering}
                    />
                )}
            </DataViewer>
            {behandlingErRedigerbar && (
                <NesteStegKnapp steg={Steg.VILKÅR} nesteFane={FanePath.VEDTAK_OG_BEREGNING}>
                    Fullfør vilkårsvurdering og gå videre
                </NesteStegKnapp>
            )}
        </Container>
    );
};

export default Stønadsvilkår;
