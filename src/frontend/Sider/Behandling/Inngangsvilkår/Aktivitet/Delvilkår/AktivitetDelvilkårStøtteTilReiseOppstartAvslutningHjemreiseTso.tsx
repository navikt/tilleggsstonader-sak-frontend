import React from 'react';

import { VStack } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso } from '../EndreAktivitetStøtteTilReiseOppstartAvslutningHjemreiseTso';
import {
    erTiltak,
    erUtdanningEllerTiltak,
} from '../utilsStøtteTilReiseOppstartAvslutningHjemreiseTso';
import { HarBrukerUtgifterTilReiseOppstartAvslutningHjemreise } from './HarBrukerUtgifterTilReiseOppstartAvslutningHjemreise';

export const AktivitetDelvilkårStøtteTilReiseOppstartAvslutningHjemreiseTso: React.FC<{
    aktivitetForm: EndreAktivitetFormStøtteTilReiseOppstartAvslutningHjemreiseTso;
    oppdaterLønnet: (svar: SvarJaNei) => void;
    oppdaterHarUtgifter: (svar: SvarJaNei) => void;
    oppdaterErObligatorisk: (svar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterLønnet, oppdaterHarUtgifter, oppdaterErObligatorisk }) => {
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
