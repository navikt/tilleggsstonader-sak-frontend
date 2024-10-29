import React from 'react';

import { BodyShort, HGrid, HStack, VStack } from '@navikt/ds-react';

import { Delvilkår } from '../vilkår';
import { regelIdTilSpørsmålKortversjon, svarIdTilTekstKorversjon } from './tekster';

export function Vurderingsrad(props: { delvilkår: Delvilkår }) {
    // Kun siste vurdering i et delvikår har begrunnelse
    const begrunnelse = props.delvilkår.vurderinger.at(-1)?.begrunnelse;
    return (
        <>
            <HGrid gap={{ md: '4', lg: '8' }} columns="minmax(100px, 250px) auto">
                <VStack>
                    {props.delvilkår.vurderinger.map((vurdering, index) => (
                        <HStack gap="2" key={vurdering.regelId}>
                            {index === 0 && (
                                <BodyShort weight="semibold" size="small">
                                    {regelIdTilSpørsmålKortversjon[vurdering.regelId]}
                                </BodyShort>
                            )}
                            {vurdering.svar && (
                                <BodyShort size="small">
                                    {svarIdTilTekstKorversjon[vurdering.svar]}
                                </BodyShort>
                            )}
                        </HStack>
                    ))}
                </VStack>
                <BodyShort size="small">{begrunnelse}</BodyShort>
            </HGrid>
        </>
    );
}
