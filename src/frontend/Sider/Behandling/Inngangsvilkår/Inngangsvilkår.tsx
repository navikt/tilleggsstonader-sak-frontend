import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet/Aktivitet';
import Målgruppe from './Målgruppe/Målgruppe';
import OppdaterGrunnlagKnapp from './OppdaterGrunnlag/OppdaterGrunnlagKnapp';
import Stønadsperioder from './Stønadsperioder/Stønadsperioder';
import { useBehandling } from '../../../context/BehandlingContext';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
import { useStønadsperioder } from '../../../hooks/useStønadsperioder';
import { useVilkårperioder } from '../../../hooks/useVilkårperioder';
import DataViewer from '../../../komponenter/DataViewer';
import { StegKnapp } from '../../../komponenter/Stegflyt/StegKnapp';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { Steg } from '../../../typer/behandling/steg';
import { Toggle } from '../../../utils/toggles';
import { FanePath } from '../faner';
import { VarselRevurderFraDatoMangler } from '../Felles/VarselRevurderFraDatoMangler';
import { VarselVedtakIArena } from '../Felles/VarselVedtakIArena';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin: 0.5rem 2rem 2rem 2rem;
`;

const nesteFane = (stønadstype: Stønadstype): FanePath => {
    switch (stønadstype) {
        case Stønadstype.LÆREMIDLER:
            return FanePath.VEDTAK_OG_BEREGNING;
        case Stønadstype.BARNETILSYN:
        case Stønadstype.BOUTGIFTER:
            return FanePath.STØNADSVILKÅR;
    }
};

const Inngangsvilkår = () => {
    const kanBrukeVedtaksperioderTilsynBarn = useFlag(Toggle.KAN_BRUKE_VEDTAKSPERIODER_TILSYN_BARN);

    const { behandling } = useBehandling();

    const { stønadsperioder } = useStønadsperioder(behandling.id);
    const { vilkårperioderResponse, hentVilkårperioder } = useVilkårperioder(behandling.id);

    return (
        <Container>
            <VarselVedtakIArena />
            <VarselRevurderFraDatoMangler />

            <DataViewer
                response={{
                    vilkårperioderResponse,
                    stønadsperioder,
                }}
            >
                {({ vilkårperioderResponse, stønadsperioder }) => (
                    <InngangsvilkårProvider
                        vilkårperioder={vilkårperioderResponse.vilkårperioder}
                        hentedeStønadsperioder={stønadsperioder}
                    >
                        <OppdaterGrunnlagKnapp
                            vilkårperioder={vilkårperioderResponse}
                            hentVilkårperioder={hentVilkårperioder}
                        />
                        <VStack gap="8">
                            <Aktivitet grunnlag={vilkårperioderResponse.grunnlag} />
                            <Målgruppe grunnlag={vilkårperioderResponse.grunnlag} />
                            {(behandling.stønadstype !== Stønadstype.BARNETILSYN ||
                                !kanBrukeVedtaksperioderTilsynBarn) && <Stønadsperioder />}
                        </VStack>
                    </InngangsvilkårProvider>
                )}
            </DataViewer>
            <StegKnapp steg={Steg.INNGANGSVILKÅR} nesteFane={nesteFane(behandling.stønadstype)}>
                Ferdigstill inngangsvilkår og gå videre
            </StegKnapp>
        </Container>
    );
};

export default Inngangsvilkår;
