import React from 'react';

import { BodyShort, VStack } from '@navikt/ds-react';

import {
    drivstofftypeTilTekst,
    FaktaPrivatBilInfo,
    ÅrsakKanIkkeBenytteEgenBil,
    årsakKanIkkeBenytteEgenBilTilTekst,
} from '../../../../../typer/behandling/behandlingFakta/faktaSamlinger';
import { jaNeiTilTekst } from '../../../../../typer/common';
import { tekstMedFallback } from '../../../../../utils/tekstformatering';
import { SøknadInfoFelt } from '../Visningskomponenter';

function formatKr(value?: string) {
    return value !== undefined && value !== null ? `${value} kr` : '-';
}

export const PrivatBilDetaljer: React.FC<{
    privatBil: FaktaPrivatBilInfo;
    unntakFraPrivatBil?: ÅrsakKanIkkeBenytteEgenBil[];
}> = ({ privatBil, unntakFraPrivatBil }) => {
    const utgifter = privatBil.utgifterPrivatBil;

    return (
        <>
            {privatBil.benyttetEgenBil && (
                <SøknadInfoFelt
                    label="Benyttet du egen bil?"
                    value={tekstMedFallback(jaNeiTilTekst, privatBil.benyttetEgenBil)}
                />
            )}

            {privatBil.betalteForReisen && (
                <SøknadInfoFelt
                    label="Betalte du for reisen?"
                    value={tekstMedFallback(jaNeiTilTekst, privatBil.betalteForReisen)}
                />
            )}

            {privatBil.infoBilKunDelerAvStrekning?.strekningHvorBilBleBenyttet && (
                <SøknadInfoFelt
                    label="Hvilken strekning ble bilen benyttet på?"
                    value={privatBil.infoBilKunDelerAvStrekning.strekningHvorBilBleBenyttet}
                />
            )}

            {privatBil.infoBilKunDelerAvStrekning?.antallKilometerKjørt && (
                <SøknadInfoFelt
                    label="Antall kilometer kjørt med bil"
                    value={`${privatBil.infoBilKunDelerAvStrekning.antallKilometerKjørt} km`}
                />
            )}

            {utgifter?.parkering && <SøknadInfoFelt label="Parkering" value={utgifter.parkering} />}

            {utgifter?.bompenger && (
                <SøknadInfoFelt label="Bompenger" value={formatKr(utgifter.bompenger)} />
            )}

            {utgifter?.ferge && <SøknadInfoFelt label="Ferge" value={formatKr(utgifter.ferge)} />}

            {utgifter?.piggdekkavgift && (
                <SøknadInfoFelt label="Piggdekkavgift" value={formatKr(utgifter.piggdekkavgift)} />
            )}

            {utgifter?.drivstoffType && (
                <SøknadInfoFelt
                    label="Drivstofftype"
                    value={drivstofftypeTilTekst[utgifter.drivstoffType]}
                />
            )}

            {unntakFraPrivatBil && unntakFraPrivatBil.length > 0 && (
                <SøknadInfoFelt
                    label="Hvorfor kan du ikke kjøre egen bil hele veien?"
                    value={
                        <VStack gap="space-4">
                            {unntakFraPrivatBil.map((årsak: ÅrsakKanIkkeBenytteEgenBil) => (
                                <BodyShort key={årsak} size="small">
                                    {tekstMedFallback(årsakKanIkkeBenytteEgenBilTilTekst, årsak)}
                                </BodyShort>
                            ))}
                        </VStack>
                    }
                />
            )}
        </>
    );
};
