import React, { useEffect } from 'react';

import styled from 'styled-components';

import { BodyShort, HGrid, VStack } from '@navikt/ds-react';

import {
    OppsummeringAktiviteter,
    OppsummeringMålgrupper,
    VilkårOppsummeringRad,
} from './VilkårOppsummeringRad';
import { useHentVilkårsvurdering } from '../../../hooks/useHentVilkårsvurdering';
import { useVilkårperioder } from '../../../hooks/useVilkårperioder';
import DataViewer from '../../../komponenter/DataViewer';
import { BehandlingFaktaTilsynBarn } from '../../../typer/behandling/behandlingFakta/behandlingFakta';

const StyledHGrid = styled(HGrid).withConfig({
    shouldForwardProp: (prop) => prop !== 'bottomBorder',
})<{ bottomBorder?: boolean }>`
    padding-bottom: 1rem;
    ${(props) => props.bottomBorder && `border-bottom: solid 1px white;`}
`;

export const OppsummeringVilkårperioderOgVilkår: React.FC<{ behandlingId: string }> = ({
    behandlingId,
}) => {
    const { vilkårperioderResponse } = useVilkårperioder(behandlingId);
    const { hentVilkårsvurdering, vilkårsvurdering } = useHentVilkårsvurdering();

    useEffect(() => {
        hentVilkårsvurdering(behandlingId);
    }, [behandlingId, hentVilkårsvurdering]);

    const finnBarnNavn = (
        barnId: string | undefined,
        behandlingFakta: BehandlingFaktaTilsynBarn
    ) => {
        return behandlingFakta.barn.find((barn) => barn.barnId === barnId)?.registergrunnlag.navn;
    };

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
                    <StyledHGrid columns={'125px auto'}>
                        <BodyShort size={'small'}>Pass av barn</BodyShort>
                        <VStack gap={'2'}>
                            {vilkårsvurdering.vilkårsett.map((vilkår) => (
                                <VilkårOppsummeringRad
                                    key={vilkår.id}
                                    resultat={vilkår.resultat}
                                    fom={vilkår.fom}
                                    tom={vilkår.tom}
                                    gjelder={finnBarnNavn(
                                        vilkår.barnId,
                                        vilkårsvurdering.grunnlag as BehandlingFaktaTilsynBarn
                                    )}
                                />
                            ))}
                        </VStack>
                    </StyledHGrid>
                </VStack>
            )}
        </DataViewer>
    );
};
