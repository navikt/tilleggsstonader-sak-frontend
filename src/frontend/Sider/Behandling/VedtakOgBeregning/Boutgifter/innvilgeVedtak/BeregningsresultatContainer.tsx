import React from 'react';

import { Label, VStack } from '@navikt/ds-react';

import { Beregningsresultat } from './Beregningsresultat';
import BeregningsresultatMedUtgift from './BeregningsresultatMedUtgift';
import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { skalViseBeregningsresultat } from '../../Felles/beregningsplanUtils';
import { BeregningsresultatContainer as FellesBeregningsresultatContainer } from '../../Felles/BeregningsresultatContainer';
import { GjenbrukForrigeResultatAlert } from '../../Felles/GjenbrukForrigeResultatAlert';
import { HvorforVisesIkkeFlereEndringerReadMore } from '../../Felles/HvorforVisesIkkeFlereEndringerReadMore';

export const BeregningsresultatContainer: React.FC<{
    beregningsresultat: BeregningsresultatBoutgifter;
}> = ({ beregningsresultat }) => {
    const visBeregningsresultat = skalViseBeregningsresultat(beregningsresultat.beregningsplan);

    const beregningsresultatInnhold = beregningsresultat.inneholderUtgifterOvernatting ? (
        <BeregningsresultatMedUtgift beregningsresultat={beregningsresultat} />
    ) : (
        <FellesBeregningsresultatContainer>
            <Beregningsresultat beregningsresultat={beregningsresultat} />
        </FellesBeregningsresultatContainer>
    );

    return (
        <VStack gap="space-16">
            <Label size="small">Beregningsresultat</Label>
            {visBeregningsresultat ? (
                beregningsresultatInnhold
            ) : (
                <GjenbrukForrigeResultatAlert beregningsplan={beregningsresultat.beregningsplan} />
            )}
            <HvorforVisesIkkeFlereEndringerReadMore
                beregningsplan={beregningsresultat.beregningsplan}
            />
        </VStack>
    );
};
