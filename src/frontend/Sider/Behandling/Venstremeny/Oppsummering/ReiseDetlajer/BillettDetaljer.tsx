import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import { OffentligTransport } from '../../../../../typer/behandling/behandlingFakta/faktaReise';

interface Props {
    offentligTransport: OffentligTransport;
}
export function BillettDetaljer({ offentligTransport }: Props) {
    return (
        <>
            {offentligTransport.enkeltbillettPris && (
                <VStack>
                    <Label size="small">Hvor mye koster én enkeltbillett?</Label>
                    <BodyShort size="small">{`${offentligTransport.enkeltbillettPris} kr`}</BodyShort>
                </VStack>
            )}

            {offentligTransport.syvdagersbillettPris && (
                <VStack>
                    <Label size="small">Hvor mye koster ett ukeskort / 7-dagersbillett?</Label>
                    <BodyShort size="small">{`${offentligTransport.syvdagersbillettPris} kr`}</BodyShort>
                </VStack>
            )}

            {offentligTransport.månedskortPris && (
                <VStack>
                    <Label size="small">Hvor mye koster ett månedskort / 30-dagersbillett?</Label>
                    <BodyShort size="small">{`${offentligTransport.månedskortPris} kr`}</BodyShort>
                </VStack>
            )}
        </>
    );
}
