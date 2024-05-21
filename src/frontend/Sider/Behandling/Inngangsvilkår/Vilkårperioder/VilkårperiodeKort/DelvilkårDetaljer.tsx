import React from 'react';

import { Detail, VStack } from '@navikt/ds-react';

import {
    dekketAvAnnetRegelverkSvarTilTekst,
    lønnetSvarTilTekst,
    medlemskapSvarTilTekst,
} from './tekstmapping';
import { DelvilkårAktivitet } from '../../typer/aktivitet';
import { DelvilkårMålgruppe } from '../../typer/målgruppe';

const DelvilkårDetaljer: React.FC<{
    delvilkår: DelvilkårMålgruppe | DelvilkårAktivitet;
    aktivitetsdager?: number;
}> = ({ delvilkår, aktivitetsdager }) => {
    return (
        <VStack gap="2">
            {delvilkår['@type'] === 'MÅLGRUPPE' && (
                <>
                    {delvilkår.medlemskap?.svar && (
                        <Detail>{medlemskapSvarTilTekst[delvilkår.medlemskap.svar]}</Detail>
                    )}
                    {delvilkår.dekketAvAnnetRegelverk?.svar && (
                        <Detail>
                            {
                                dekketAvAnnetRegelverkSvarTilTekst[
                                    delvilkår.dekketAvAnnetRegelverk.svar
                                ]
                            }
                        </Detail>
                    )}
                </>
            )}
            {delvilkår['@type'] === 'AKTIVITET' && (
                <>
                    <Detail>{aktivitetsdager} aktivitetsdager</Detail>
                    {delvilkår.lønnet?.svar && (
                        <Detail>{lønnetSvarTilTekst[delvilkår.lønnet.svar]}</Detail>
                    )}
                </>
            )}
        </VStack>
    );
};

export default DelvilkårDetaljer;
