import React from 'react';

import { BodyShort, Label, VStack } from '@navikt/ds-react';

import { PrivatBilDetaljer } from './PrivatBilDetaljer';
import { TaxiDetaljer } from './TaxiDetaljer';
import {
    PrivatTransport,
    ÅrsakIkkeOffentligTransport,
    ÅrsakIkkeOffentligTransportTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../../typer/common';

export const PrivatTransportDetaljer: React.FC<{ privatTransport: PrivatTransport }> = ({
    privatTransport,
}) => (
    <>
        {privatTransport.årsakIkkeOffentligTransport && (
            <VStack>
                <Label size={'small'}>Hvorfor kan du ikke reise med offentlig transport?</Label>
                {privatTransport.årsakIkkeOffentligTransport.map(
                    (årsak: ÅrsakIkkeOffentligTransport) => (
                        <BodyShort key={årsak} size="small">
                            {ÅrsakIkkeOffentligTransportTilTekst[årsak]}
                        </BodyShort>
                    )
                )}
            </VStack>
        )}

        {privatTransport.kanKjøreMedEgenBil && (
            <VStack>
                <Label size={'small'}>Kan du kjøre bil til aktivitetsstedet?</Label>
                <BodyShort size="small">
                    {jaNeiTilTekst[privatTransport.kanKjøreMedEgenBil]}
                </BodyShort>
            </VStack>
        )}

        {privatTransport.utgifterBil && (
            <PrivatBilDetaljer utgifterBil={privatTransport.utgifterBil} />
        )}

        {privatTransport.taxi && <TaxiDetaljer taxi={privatTransport.taxi} />}
    </>
);
