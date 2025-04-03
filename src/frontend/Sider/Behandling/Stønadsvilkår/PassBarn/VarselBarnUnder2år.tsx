import React from 'react';

import { Alert, Heading } from '@navikt/ds-react';

import { perioderOverlapper, plusÅr, tilDatoStr } from '../../../../utils/dato';
import { erOppfylt, Vilkår } from '../../vilkår';

/**
 *                <----------->         Vilkårperiode
 *   |--------|                         0-2 år begynner før vilkårperiode
 *         |--------|                   0-2 år innenfor vilkårperiode
 *                 |--------|           0-2 år innenfor vilkårperiode
 *                       |--------|     0-2 år innenfor vilkårperiode
 *                                |---- 0-2 år begynner etter vilkårperiode
 */
const erUnder2ÅrIEnPeriode = (fødselsdato: string, vilkår: Vilkår[]): boolean => {
    return vilkår
        .filter((v) => erOppfylt(v.resultat))
        .some(({ fom, tom }) => {
            if (!fom || !tom) {
                return false;
            }
            const fødselsdato2År = tilDatoStr(plusÅr(fødselsdato, 2));
            return perioderOverlapper({ fom: fødselsdato, tom: fødselsdato2År }, { fom, tom });
        });
};

/**
 * Viser varsel hvis barn blir 2 under under en stønadsvilkårsperiode som er oppfylt
 */
export const VarselBarnUnder2År = ({
    fødselsdato,
    vilkår,
}: {
    fødselsdato: string | undefined;
    vilkår: Vilkår[];
}) => {
    if (!fødselsdato) {
        return;
    }

    if (erUnder2ÅrIEnPeriode(fødselsdato, vilkår))
        return (
            <Alert variant={'warning'} size={'small'}>
                <Heading size={'xsmall'} level="3">
                    Mulig kontantstøtte. Søker har barn under 2 år i en periode.
                </Heading>
                Sjekk om det utbetales kontantstøtte for barnet. Meld fra til utviklingsteamet hvis
                det er tilfelle.
            </Alert>
        );
};
