import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import { PrivatBilDetaljer } from './PrivatBilDetaljer';
import { TaxiDetaljer } from './TaxiDetaljer';
import {
    PrivatTransport,
    ÅrsakIkkeOffentligTransport,
    ÅrsakIkkeOffentligTransportTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaReise';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { tekstMedFallback } from '../../../../../utils/tekstformatering';
import { SøknadInfoFelt } from '../Visningskomponenter';

export const PrivatTransportDetaljer: React.FC<{ privatTransport: PrivatTransport }> = ({
    privatTransport,
}) => (
    <>
        {privatTransport.årsakIkkeOffentligTransport && (
            <SøknadInfoFelt
                label="Hvorfor kan du ikke reise med offentlig transport?"
                value={
                    <VStack gap="space-4">
                        {privatTransport.årsakIkkeOffentligTransport.map(
                            (årsak: ÅrsakIkkeOffentligTransport) => (
                                <BodyShort key={årsak} size="small">
                                    {tekstMedFallback(ÅrsakIkkeOffentligTransportTilTekst, årsak)}
                                </BodyShort>
                            )
                        )}
                    </VStack>
                }
            />
        )}

        {privatTransport.kanKjøreMedEgenBil && (
            <SøknadInfoFelt
                label="Kan du kjøre bil til aktivitetsstedet?"
                value={tekstMedFallback(jaNeiTilTekst, privatTransport.kanKjøreMedEgenBil)}
            />
        )}

        {privatTransport.utgifterBil && (
            <PrivatBilDetaljer utgifterBil={privatTransport.utgifterBil} />
        )}

        {privatTransport.taxi && <TaxiDetaljer taxi={privatTransport.taxi} />}
    </>
);
