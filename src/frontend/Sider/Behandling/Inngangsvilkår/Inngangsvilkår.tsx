import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';
import { styled } from 'styled-components';

import { VStack } from '@navikt/ds-react';

import Aktivitet from './Aktivitet/Aktivitet';
import Målgruppe from './Målgruppe/Målgruppe';
import OppdaterGrunnlagKnapp from './OppdaterGrunnlag/OppdaterGrunnlagKnapp';
import { useBehandling } from '../../../context/BehandlingContext';
import { InngangsvilkårProvider } from '../../../context/InngangsvilkårContext';
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
        case Stønadstype.DAGLIG_REISE_TSR:
            return FanePath.STØNADSVILKÅR;
        case Stønadstype.DAGLIG_REISE_TSO:
            return FanePath.STØNADSVILKÅR;
    }
};

const Inngangsvilkår = () => {
    const { behandling } = useBehandling();

    const { vilkårperioderResponse, hentVilkårperioder } = useVilkårperioder(behandling.id);
    const utledEndringsdatoAutomatisk = useFlag(Toggle.SKAL_UTLEDE_ENDRINGSDATO_AUTOMATISK);

    return (
        <Container>
            <VarselVedtakIArena />
            {!utledEndringsdatoAutomatisk && <VarselRevurderFraDatoMangler />}

            <DataViewer
                type={'inngangsvilkår'}
                response={{
                    vilkårperioderResponse,
                }}
            >
                {({ vilkårperioderResponse }) => (
                    <>
                        <InngangsvilkårProvider
                            vilkårperioder={vilkårperioderResponse.vilkårperioder}
                        >
                            <OppdaterGrunnlagKnapp
                                vilkårperioder={vilkårperioderResponse}
                                hentVilkårperioder={hentVilkårperioder}
                            />
                            <VStack gap="8">
                                <Aktivitet grunnlag={vilkårperioderResponse.grunnlag} />
                                <Målgruppe grunnlag={vilkårperioderResponse.grunnlag} />
                            </VStack>
                        </InngangsvilkårProvider>
                        <StegKnapp
                            steg={Steg.INNGANGSVILKÅR}
                            nesteFane={nesteFane(behandling.stønadstype)}
                        >
                            Ferdigstill inngangsvilkår og gå videre
                        </StegKnapp>
                    </>
                )}
            </DataViewer>
        </Container>
    );
};

export default Inngangsvilkår;
