import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import {
    FaktaUnntakFraOffentligTransport,
    ÅrsakKanIkkeBenytteOffentligTransport,
    årsakKanIkkeBenytteOffentligTransportTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { tekstMedFallback } from '../../../../../utils/tekstformatering';
import { SøknadInfoFelt } from '../Visningskomponenter';

export const UnntakFraOffentligTransportDetaljer: React.FC<{
    unntakFraOffentligTransport: FaktaUnntakFraOffentligTransport;
}> = ({ unntakFraOffentligTransport }) => (
    <>
        {unntakFraOffentligTransport.årsaker && unntakFraOffentligTransport.årsaker.length > 0 && (
            <SøknadInfoFelt
                label="Hvorfor kan du ikke bruke offentlig transport?"
                value={
                    <VStack gap="space-4">
                        {unntakFraOffentligTransport.årsaker.map(
                            (årsak: ÅrsakKanIkkeBenytteOffentligTransport) => (
                                <BodyShort key={årsak} size="small">
                                    {tekstMedFallback(
                                        årsakKanIkkeBenytteOffentligTransportTilTekst,
                                        årsak
                                    )}
                                </BodyShort>
                            )
                        )}
                    </VStack>
                }
            />
        )}

        {unntakFraOffentligTransport.leveringOgHentingIBarnehage && (
            <>
                <SøknadInfoFelt
                    label="Gateadressen hvor du henter eller leverer barn"
                    value={unntakFraOffentligTransport.leveringOgHentingIBarnehage.gateadresse}
                />
                <SøknadInfoFelt
                    label="Postnummer hvor du henter eller leverer barn"
                    value={unntakFraOffentligTransport.leveringOgHentingIBarnehage.postnummer}
                />
            </>
        )}
    </>
);
