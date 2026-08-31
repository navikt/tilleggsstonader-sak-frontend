import React from 'react';

import { VStack } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr } from '../EndreAktivitetReiseOppstartAvslutningHjemreiseTsr';
import { erTiltak } from '../utilsReiseOppstartAvslutningHjemreiseTsr';
import { HarBrukerUtgifterTilReiseOppstartAvslutningHjemreise } from './HarBrukerUtgifterTilReiseOppstartAvslutningHjemreise';

export const AktivitetDelvilkårReiseOppstartAvslutningHjemreiseTsr: React.FC<{
    aktivitetForm: EndreAktivitetFormReiseOppstartAvslutningHjemreiseTsr;
    oppdaterLønnet: (svar: SvarJaNei) => void;
    oppdaterHarUtgifter: (svar: SvarJaNei) => void;
    oppdaterErObligatorisk: (svar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterLønnet, oppdaterHarUtgifter, oppdaterErObligatorisk }) => {
    if (aktivitetForm.type === '') return null;

    if (!erTiltak(aktivitetForm.type)) return null;

    return (
        <VStack gap={'space-8'}>
            <JaNeiVurdering
                label="Mottar bruker ordinær lønn i tiltaket?"
                svar={aktivitetForm.svarLønnet}
                oppdaterSvar={oppdaterLønnet}
            />
            <HarBrukerUtgifterTilReiseOppstartAvslutningHjemreise
                svarHarUtgifter={aktivitetForm.svarHarUtgifter}
                oppdaterSvar={oppdaterHarUtgifter}
            />
            <JaNeiVurdering
                label="Er reisen obligatorisk?"
                svar={aktivitetForm.svarErAktivitetenObligatorisk}
                oppdaterSvar={oppdaterErObligatorisk}
            />
        </VStack>
    );
};
