import React, { useEffect } from 'react';

import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import StønadsvilkårBoutgifter from './Boutgifter/StønadsvilkårBoutgifter';
import { StønadsvilkårDagligReise } from './DagligReise/StønadsvilkårDagligReise';
import { useBehandling } from '../../../context/BehandlingContext';
import { VilkårProvider } from '../../../context/VilkårContext';
import { useHentVilkårsvurdering } from '../../../hooks/useHentVilkårsvurdering';
import { useRegler } from '../../../hooks/useRegler';
import { useVilkårsoppsummering } from '../../../hooks/useVilkårsoppsummering';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { Steg } from '../../../typer/behandling/steg';
import { FanePath } from '../faner';
import { StønadsvilkårPassBarn } from './PassBarn/StønadsvilkårPassBarn';

const Container = styled(VStack).attrs({ gap: '8' })`
    margin: 0.5rem 2rem 2rem 2rem;
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
            <DataViewer
                type={'stønadsvilkår'}
                response={{
                    regler,
                    vilkårsvurdering,
                    vilkårsoppsummering,
                }}
            >
                {({ regler, vilkårsvurdering, vilkårsoppsummering }) => (
                    <VilkårProvider hentetVilkårsvurdering={vilkårsvurdering}>
                        {stønadstype === Stønadstype.BARNETILSYN && (
                            <StønadsvilkårPassBarn
                                regler={regler}
                                vilkårsoppsummering={vilkårsoppsummering}
                            />
                        )}
                        {stønadstype === Stønadstype.BOUTGIFTER && (
                            <StønadsvilkårBoutgifter regler={regler} />
                        )}
                        {stønadstype === Stønadstype.DAGLIG_REISE_TSO && (
                            <StønadsvilkårDagligReise regler={regler} />
                        )}
                        {stønadstype === Stønadstype.DAGLIG_REISE_TSR && (
                            <StønadsvilkårDagligReise regler={regler} />
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
