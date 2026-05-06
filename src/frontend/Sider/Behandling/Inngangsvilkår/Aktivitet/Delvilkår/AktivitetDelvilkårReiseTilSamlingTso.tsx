import React from 'react';

import { VStack } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormReiseTilSamlingTso } from '../EndreAktivitetReiseTilSamlingTso';
import { erUtdanningEllerTiltak, skalVurdereLønnet } from '../utilsReiseTilSamlingTso';
import { HarBrukerUtgifterTilReiseTilSamling } from './HarBrukerUtgifterTilReiseTilSamling';

export const AktivitetDelvilkårReiseTilSamlingTso: React.FC<{
    aktivitetForm: EndreAktivitetFormReiseTilSamlingTso;
    oppdaterLønnet: (svar: SvarJaNei) => void;
    oppdaterHarUtgifter: (svar: SvarJaNei) => void;
    oppdaterErObligatorisk: (svar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterLønnet, oppdaterHarUtgifter, oppdaterErObligatorisk }) => {
    if (aktivitetForm.type === '') return null;

    if (!skalVurdereLønnet(aktivitetForm.type)) return null;

    return (
        <VStack gap={'space-8'}>
            <JaNeiVurdering
                label="Mottar bruker ordinær lønn i tiltaket?"
                svar={aktivitetForm.svarLønnet}
                oppdaterSvar={oppdaterLønnet}
            />
            {erUtdanningEllerTiltak(aktivitetForm.type) && (
                <HarBrukerUtgifterTilReiseTilSamling
                    svarHarUtgifter={aktivitetForm.svarHarUtgifter}
                    oppdaterSvar={oppdaterHarUtgifter}
                />
            )}
            <JaNeiVurdering
                label="Er samlingen obligatorisk?"
                svar={aktivitetForm.svarErAktivitetenObligatorisk}
                oppdaterSvar={oppdaterErObligatorisk}
            />
        </VStack>
    );
};
