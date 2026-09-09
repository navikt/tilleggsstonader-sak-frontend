import React from 'react';

import { VStack } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormReiseTilSamlingTso } from '../EndreAktivitetReiseTilSamlingTso';
import { erTiltak, erUtdanningEllerTiltak } from '../utilsReiseTilSamlingTso';

export const AktivitetDelvilkårReiseTilSamlingTso: React.FC<{
    aktivitetForm: EndreAktivitetFormReiseTilSamlingTso;
    oppdaterLønnet: (svar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterLønnet }) => {
    if (aktivitetForm.type === '') return null;

    if (!erUtdanningEllerTiltak(aktivitetForm.type)) return null;

    return (
        <VStack gap={'space-8'}>
            {erTiltak(aktivitetForm.type) && (
                <JaNeiVurdering
                    label="Mottar bruker ordinær lønn i tiltaket?"
                    svar={aktivitetForm.svarLønnet}
                    oppdaterSvar={oppdaterLønnet}
                />
            )}
        </VStack>
    );
};
