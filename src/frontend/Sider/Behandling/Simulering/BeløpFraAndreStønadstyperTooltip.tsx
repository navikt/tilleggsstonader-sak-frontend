import React from 'react';

import { QuestionmarkCircleIcon } from '@navikt/aksel-icons';
import { Tooltip } from '@navikt/ds-react';

import { BeløpForStønadstype, BeløpFraUkjentKilde } from './simuleringTyper';
import { stønadstypeTilTekst } from '../../../typer/behandling/behandlingTema';
import { formaterTallMedTusenSkilleEllerStrek } from '../../../utils/fomatering';

/**
 * Viser et info-ikon med en tooltip som forklarer at beløpet for perioden inneholder utbetalinger
 * som egentlig tilhører andre stønadstyper, eller kilder vi ikke har noe forhold til. Dette kan
 * forekomme fordi simuleringen viser alle posteringer på samme fagområde, uavhengig av hvilken
 * fagsak/stønadstype de tilhører.
 */
export const BeløpFraAndreStønadstyperTooltip: React.FC<{
    beløpFraAndreStønadstyper: BeløpForStønadstype[];
    beløpFraUkjentKilde: BeløpFraUkjentKilde[];
}> = ({ beløpFraAndreStønadstyper, beløpFraUkjentKilde }) => {
    if (beløpFraAndreStønadstyper.length === 0 && beløpFraUkjentKilde.length === 0) {
        return null;
    }

    const beskrivelserAndreStønadstyper = beløpFraAndreStønadstyper.map(
        ({ stønadstype, beløp }) => {
            const tekst = stønadstypeTilTekst[stønadstype];
            const tekstMedLitenForbokstav = tekst.charAt(0).toLowerCase() + tekst.slice(1);
            return `${formaterTallMedTusenSkilleEllerStrek(beløp)} kr ${tekstMedLitenForbokstav}`;
        }
    );

    const beskrivelserUkjentKilde = beløpFraUkjentKilde.map(
        ({ kilde, beløp }) =>
            `${formaterTallMedTusenSkilleEllerStrek(beløp)} kr ${kilde.toLowerCase()}`
    );

    const beskrivelse = [...beskrivelserAndreStønadstyper, ...beskrivelserUkjentKilde].join(', ');

    return (
        <Tooltip content={`Beløpet inkluderer utbetalinger fra andre stønadstyper: ${beskrivelse}`}>
            <QuestionmarkCircleIcon />
        </Tooltip>
    );
};
