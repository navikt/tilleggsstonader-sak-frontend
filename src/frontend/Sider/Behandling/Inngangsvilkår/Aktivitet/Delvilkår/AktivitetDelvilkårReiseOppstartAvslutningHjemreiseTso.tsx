import React from 'react';

import { VStack } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso } from '../EndreAktivitetReiseOppstartAvslutningHjemreiseTso';
import { erTiltak } from '../utilsReiseOppstartAvslutningHjemreiseTso';

export const AktivitetDelvilkårReiseOppstartAvslutningHjemreiseTso: React.FC<{
    aktivitetForm: EndreAktivitetFormReiseOppstartAvslutningHjemreiseTso;
    oppdaterLønnet: (svar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterLønnet }) => {
    if (aktivitetForm.type === '') return null;

    if (!erTiltak(aktivitetForm.type)) return null;

    return (
        <VStack gap={'space-8'}>
            <JaNeiVurdering
                label="Mottar bruker ordinær lønn i tiltaket?"
                svar={aktivitetForm.svarLønnet}
                oppdaterSvar={oppdaterLønnet}
            />
        </VStack>
    );
};
