import React, { useEffect } from 'react';

import styled from 'styled-components';

import { BodyShort, HGrid, VStack } from '@navikt/ds-react';

import { OppsummeringAktiviteter, OppsummeringMålgrupper } from './VilkårOppsummeringRad';
import { useBehandling } from '../../../context/BehandlingContext';
import { useHentVilkårsvurdering } from '../../../hooks/useHentVilkårsvurdering';
import { useVilkårperioder } from '../../../hooks/useVilkårperioder';
import DataViewer from '../../../komponenter/DataViewer';
import { Stønadstype } from '../../../typer/behandling/behandlingTema';
import { VilkårOppsummeringRadPassBarn } from '../VedtakOgBeregning/Barnetilsyn/InnvilgeVedtak/VilkårOppsummeringRadPassBarn';
import { VilkårOppsummeringRadBoutgifter } from '../VedtakOgBeregning/Boutgifter/innvilgeVedtak/VilkårOppsummeringRadBoutgifter';

const StyledHGrid = styled(HGrid).withConfig({
    shouldForwardProp: (prop) => prop !== 'bottomBorder',
})<{ bottomBorder?: boolean }>`
    padding-bottom: 1rem;
    ${(props) => props.bottomBorder && `border-bottom: solid 1px white;`}
`;

export const OppsummeringVilkårperioderOgVilkår: React.FC = () => {
    const { behandling, behandlingFakta } = useBehandling();
    const { vilkårperioderResponse } = useVilkårperioder(behandling.id);
    const { hentVilkårsvurdering, vilkårsvurdering } = useHentVilkårsvurdering();

    useEffect(() => {
        hentVilkårsvurdering(behandling.id);
    }, [behandling.id, hentVilkårsvurdering]);

    return (
        <DataViewer response={{ vilkårsvurdering, vilkårperioderResponse }}>
            {({ vilkårsvurdering, vilkårperioderResponse }) => (
                <VStack gap={'6'}>
                    <StyledHGrid bottomBorder columns={'125px auto'}>
                        <BodyShort size={'small'}>Aktivitet</BodyShort>
                        <VStack gap={'2'}>
                            <OppsummeringAktiviteter
                                aktiviteter={vilkårperioderResponse.vilkårperioder.aktiviteter}
                            />
                        </VStack>
                    </StyledHGrid>
                    <StyledHGrid bottomBorder columns={'125px auto'}>
                        <BodyShort size={'small'}>Målgruppe</BodyShort>
                        <VStack gap={'2'}>
                            <OppsummeringMålgrupper
                                målgrupper={vilkårperioderResponse.vilkårperioder.målgrupper}
                            />
                        </VStack>
                    </StyledHGrid>
                    {behandlingFakta['@type'] === Stønadstype.BARNETILSYN && (
                        <StyledHGrid columns={'125px auto'}>
                            {VilkårOppsummeringRadPassBarn(vilkårsvurdering, behandlingFakta)}
                        </StyledHGrid>
                    )}
                    {behandlingFakta['@type'] === Stønadstype.BOUTGIFTER && (
                        <StyledHGrid columns={'125px auto'}>
                            {VilkårOppsummeringRadBoutgifter(vilkårsvurdering)}
                        </StyledHGrid>
                    )}
                </VStack>
            )}
        </DataViewer>
    );
};
