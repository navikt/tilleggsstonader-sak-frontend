import React from 'react';

import Beregningsresultat from './Beregningsresultat';
import BeregningsresultatMedUtgift from './BeregningsresultatMedUtgift';
import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';

const BeregningsresultatContainer: React.FC<{
    beregningsresultat: BeregningsresultatBoutgifter;
}> = ({ beregningsresultat }) => {
    const skalBrukeDetaljertVisning = () => beregningsresultat.inneholderUtgifterOvernatting;

    return skalBrukeDetaljertVisning() ? (
        <BeregningsresultatMedUtgift beregningsresultat={beregningsresultat} />
    ) : (
        <Beregningsresultat beregningsresultat={beregningsresultat} />
    );
};

export default BeregningsresultatContainer;
