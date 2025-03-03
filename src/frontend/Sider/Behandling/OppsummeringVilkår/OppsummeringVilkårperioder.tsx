import React from 'react';

import { Box, Heading, HGrid, VStack } from '@navikt/ds-react';

import { OppsummeringAktiviteter, OppsummeringMålgrupper } from './VilkårOppsummeringRad';
import { useVilkårperioder } from '../../../hooks/useVilkårperioder';
import DataViewer from '../../../komponenter/DataViewer';

export const OppsummeringVilkårperioder: React.FC<{ behandlingId: string }> = ({
    behandlingId,
}) => {
    const { vilkårperioderResponse } = useVilkårperioder(behandlingId);

    return (
        <Box background="surface-selected" padding={'4'}>
            <DataViewer response={{ vilkårperioderResponse }}>
                {({ vilkårperioderResponse }) => (
                    <VStack gap={'6'}>
                        <HGrid columns={'125px auto'}>
                            <Heading size="small">Aktivitet</Heading>
                            <VStack gap={'2'} justify={'center'}>
                                <OppsummeringAktiviteter
                                    aktiviteter={vilkårperioderResponse.vilkårperioder.aktiviteter}
                                />
                            </VStack>
                        </HGrid>
                        <HGrid columns={'125px auto'}>
                            <Heading size="small">Målgruppe</Heading>
                            <VStack gap={'2'} justify={'center'}>
                                <OppsummeringMålgrupper
                                    målgrupper={vilkårperioderResponse.vilkårperioder.målgrupper}
                                />
                            </VStack>
                        </HGrid>
                    </VStack>
                )}
            </DataViewer>
        </Box>
    );
};
