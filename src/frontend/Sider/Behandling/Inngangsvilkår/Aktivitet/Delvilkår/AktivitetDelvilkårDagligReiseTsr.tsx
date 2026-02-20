import React from 'react';

import { VStack } from '@navikt/ds-react';

import { HarBrukerUtgifterTilDagligReise } from './HarBrukerUtgifterTilDagligReise';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormDagligReiseTsr } from '../EndreAktivitetDagligReiseTsr';

export const AktivitetDelvilkårDagligReiseTsr: React.FC<{
    aktivitetForm: EndreAktivitetFormDagligReiseTsr;
    oppdaterHarUtgifter: (svar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterHarUtgifter }) => {
    if (aktivitetForm.type === '') return null;

    return (
        <VStack gap={'space-8'}>
            <HarBrukerUtgifterTilDagligReise
                svarHarUtgifter={aktivitetForm.svarHarUtgifter}
                oppdaterSvar={oppdaterHarUtgifter}
            />
        </VStack>
    );
};
