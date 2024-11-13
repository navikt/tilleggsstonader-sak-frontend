import React from 'react';

import { Detail, VStack } from '@navikt/ds-react';

import { DelvilkårMålgruppe } from '../../typer/målgruppe';
import {
    dekketAvAnnetRegelverkSvarTilTekst,
    medlemskapSvarTilTekst,
} from '../../Vilkårperioder/VilkårperiodeKort/tekstmapping';

const FaktaOgDelvilkårVisning: React.FC<{
    delvilkår: DelvilkårMålgruppe;
}> = ({ delvilkår }) => {
    return (
        <VStack gap="2">
            {delvilkår.medlemskap?.svar && (
                <Detail>{medlemskapSvarTilTekst[delvilkår.medlemskap.svar]}</Detail>
            )}
            {delvilkår.dekketAvAnnetRegelverk?.svar && (
                <Detail>
                    {dekketAvAnnetRegelverkSvarTilTekst[delvilkår.dekketAvAnnetRegelverk.svar]}
                </Detail>
            )}
        </VStack>
    );
};
export default FaktaOgDelvilkårVisning;
