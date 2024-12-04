import React from 'react';

import { Detail, HGrid, VStack } from '@navikt/ds-react';

import { Delvilkår } from '../vilkår';
import { regelIdTilSpørsmål2 } from './tekster';

export function VurderingsradTest(props: { delvilkår: Delvilkår }) {
    // Kun siste vurdering i et delvikår har begrunnelse
    const begrunnelse = props.delvilkår.vurderinger.at(-1)?.begrunnelse;

    return (
        <HGrid gap={{ md: '4', lg: '8' }} columns="minmax(100px, 250px) auto">
            <VStack gap="2">
                {props.delvilkår.vurderinger.map((vurdering, index) => {
                    const regelId = vurdering.regelId;
                    const svar = vurdering.svar;
                    return (
                        svar && (
                            <Detail size="small" key={index}>
                                {regelIdTilSpørsmål2[regelId][svar]}
                            </Detail>
                        )
                    );
                })}
            </VStack>
            <Detail size="small">{begrunnelse}</Detail>
        </HGrid>
    );
}
