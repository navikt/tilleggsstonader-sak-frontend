import React from 'react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormDagligReiseTso } from '../EndreAktivitetDagligReiseTso';
import { erUtdanningEllerTiltak } from '../utilsLæremidler';

export const HarBrukerUtgifterTilDagligReise: React.FC<{
    aktivitetForm: EndreAktivitetFormDagligReiseTso;
    oppdaterSvar: (nyttSvar: SvarJaNei) => void;
}> = ({ aktivitetForm, oppdaterSvar }) => {
    if (!erUtdanningEllerTiltak(aktivitetForm.type)) return null;

    return (
        <JaNeiVurdering
            label="Har bruker nødvendige utgifter til daglig reise?"
            svar={aktivitetForm.svarHarUtgifter}
            oppdaterSvar={(nyttSvar: SvarJaNei) => {
                oppdaterSvar(nyttSvar);
            }}
            //hjelpetekst={lagHjelpetekst(aktivitetForm.type)}
            //hjelpetekstHeader={'Slik vurderer du om søker har utgifter'}
        />
    );
};

/*
function lagHjelpetekst(aktivitetType: AktivitetType) {
    if (!erUtdanningEllerTiltak(aktivitetType)) {
        return null;
    }

    return hjelpetekst[aktivitetType];
}
*/

/*
const hjelpetekst: Record<AktivitetType.TILTAK | AktivitetType.UTDANNING, ReactNode> = {
    [AktivitetType.UTDANNING]: (
        <>
            <BodyShort size={'small'} spacing>
                Vi vurderer det slik at søker har utgifter til læremidler hvis de deltar på en
                utdanning godkjent av Nav.
            </BodyShort>
            <BodyShort size={'small'} spacing>
                Unntaket er hvis utdanningen er på grunnskolenivå da skolen skal dekke alle
                utgifter.
            </BodyShort>
        </>
    ),
    [AktivitetType.TILTAK]: (
        <>
            <BodyShort size={'small'} spacing>
                Vi vurderer det slik at søker har utgifter til læremidler hvis de deltar på et
                opplæringstiltak eller en utdanning godkjent av Nav.
            </BodyShort>
            <BodyShort size={'small'} spacing>
                Unntakene er AMO-kurs hvor det må undersøkes om læremidler er dekket gjenom
                kursavgiften.
            </BodyShort>
        </>
    ),
};
*/
