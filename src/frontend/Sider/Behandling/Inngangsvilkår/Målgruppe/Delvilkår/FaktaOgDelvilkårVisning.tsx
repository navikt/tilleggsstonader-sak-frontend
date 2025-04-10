import React from 'react';

import { Detail, VStack } from '@navikt/ds-react';

import { MålgruppeVurderinger } from '../../typer/vilkårperiode/målgruppe';
import {
    dekketAvAnnetRegelverkSvarTilTekst,
    medlemskapSvarTilTekst,
    mottarSykepengerForFulltidsstillingSvarTilTekst,
} from '../../Vilkårperioder/VilkårperiodeKort/tekstmapping';

const FaktaOgDelvilkårVisning: React.FC<{
    vurderinger: MålgruppeVurderinger;
}> = ({ vurderinger }) => {
    return (
        <VStack gap="2">
            {vurderinger.medlemskap?.svar && (
                <Detail>{medlemskapSvarTilTekst[vurderinger.medlemskap.svar]}</Detail>
            )}
            {vurderinger.utgifterDekketAvAnnetRegelverk?.svar && (
                <Detail>
                    {
                        dekketAvAnnetRegelverkSvarTilTekst[
                            vurderinger.utgifterDekketAvAnnetRegelverk.svar
                        ]
                    }
                </Detail>
            )}
            {vurderinger.mottarSykepengerForFulltidsstilling?.svar &&
                vurderinger.mottarSykepengerForFulltidsstilling?.svar !== 'GAMMEL_MANGLER_DATA' && (
                    <Detail>
                        {
                            mottarSykepengerForFulltidsstillingSvarTilTekst[
                                vurderinger.mottarSykepengerForFulltidsstilling.svar
                            ]
                        }
                    </Detail>
                )}
        </VStack>
    );
};
export default FaktaOgDelvilkårVisning;
