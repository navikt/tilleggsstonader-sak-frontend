import React from 'react';

import { useFlag } from '@unleash/proxy-client-react';

import Beregningsresultat from './Beregningsresultat';
import BeregningsresultatMedUtgift from './BeregningsresultatMedUtgift';
import { BeregningsresultatBoutgifter } from '../../../../../typer/vedtak/vedtakBoutgifter';
import { Toggle } from '../../../../../utils/toggles';

const BeregningsresultatContainer: React.FC<{
    beregningsresultat: BeregningsresultatBoutgifter;
}> = ({ beregningsresultat }) => {
    const skalViseDetaljertBeregningsresultat = useFlag(
        Toggle.SKAL_VISE_DETALJERT_BEREGNINGSRESULTAT
    );

    const skalBrukeDetaljertVisning = () =>
        skalViseDetaljertBeregningsresultat && beregningsresultat.skalBrukeDetaljertVisning;

    return skalBrukeDetaljertVisning() ? (
        <BeregningsresultatMedUtgift beregningsresultat={beregningsresultat} />
    ) : (
        <Beregningsresultat beregningsresultat={beregningsresultat} />
    );
};

export default BeregningsresultatContainer;
