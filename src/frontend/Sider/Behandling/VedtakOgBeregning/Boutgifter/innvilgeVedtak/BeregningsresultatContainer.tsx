import React from 'react';

import { Label, VStack } from '@navikt/ds-react';

import { Beregningsresultat } from './Beregningsresultat';
import { Beregningsresultat as BeregningsresultatMedUtgift } from './BeregningsresultatMedUtgift';
import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { GjenbrukForrigeResultatAlert } from '../../Felles/GjenbrukForrigeResultatAlert';
import { HvorforVisesIkkeFlereEndringerReadMore } from '../../Felles/HvorforVisesIkkeFlereEndringerReadMore';

export const BeregningsresultatContainer: React.FC<{
    beregningsresultat: BeregningsresultatBoutgifter;
}> = ({ beregningsresultat }) => {
    const beregningsresultatInnhold = beregningsresultat.inneholderUtgifterOvernatting ? (
        <BeregningsresultatMedUtgift beregningsresultat={beregningsresultat} />
    ) : (
        <Beregningsresultat beregningsresultat={beregningsresultat} />
    );

    return (
        <VStack gap="space-16">
            <Label size="small">Beregningsresultat</Label>
            <GjenbrukForrigeResultatAlert beregningsplan={beregningsresultat.beregningsplan} />
            {beregningsresultatInnhold}
            <HvorforVisesIkkeFlereEndringerReadMore
                beregningsplan={beregningsresultat.beregningsplan}
            />
        </VStack>
    );
};
