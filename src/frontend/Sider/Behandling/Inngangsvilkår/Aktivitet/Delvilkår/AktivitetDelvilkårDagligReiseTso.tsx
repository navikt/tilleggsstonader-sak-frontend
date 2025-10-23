import React from 'react';

import { VStack } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormDagligReiseTso } from '../EndreAktivitetDagligReiseTso';
import { skalVurdereLønnet } from '../utilsDagligReiseTso';
import { HarBrukerUtgifterTilDagligReise } from './HarBrukerUtgifterTilDagligReise';

export const AktivitetDelvilkårDagligReiseTso: React.FC<{
    aktivitetForm: EndreAktivitetFormDagligReiseTso;
    oppdaterLønnet: (svar: SvarJaNei) => void;
    oppdaterHarUtgifter: (svar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterLønnet, oppdaterHarUtgifter }) => {
    if (aktivitetForm.type === '') return null;

    if (!skalVurdereLønnet(aktivitetForm.type)) return null;

    return (
        <VStack gap={'2'}>
            <JaNeiVurdering
                label="Mottar bruker ordinær lønn i tiltaket?"
                svar={aktivitetForm.svarLønnet}
                oppdaterSvar={oppdaterLønnet}
            />
            <HarBrukerUtgifterTilDagligReise
                aktivitetForm={aktivitetForm}
                oppdaterSvar={oppdaterHarUtgifter}
            />
        </VStack>
    );
};
