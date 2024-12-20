import React, { ReactNode } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { AktivitetType } from '../../typer/vilkårperiode/aktivitet';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormLæremidler } from '../EndreAktivitetLæremidler';
import { erUtdanningEllerTiltak } from '../utilsLæremidler';

export const HarBrukerUtgifterTilLæremidler: React.FC<{
    aktivitetForm: EndreAktivitetFormLæremidler;
    oppdaterSvar: (nyttSvar: SvarJaNei) => void;
    resettStudienivå: () => void;
    resettHarRettTilUtstyrsstipendSvar: () => void;
    readOnly: boolean;
}> = ({
    aktivitetForm,
    oppdaterSvar,
    resettStudienivå,
    resettHarRettTilUtstyrsstipendSvar,
    readOnly,
}) => {
    if (!erUtdanningEllerTiltak(aktivitetForm.type)) return null;

    return (
        <JaNeiVurdering
            label="Har bruker utgifter til læremidler?"
            readOnly={readOnly}
            svar={aktivitetForm.vurderinger.svarHarUtgifter}
            oppdaterSvar={(nyttSvar: SvarJaNei) => {
                oppdaterSvar(nyttSvar);
                if (nyttSvar === SvarJaNei.NEI) {
                    resettStudienivå();
                    resettHarRettTilUtstyrsstipendSvar();
                }
            }}
            hjelpetekst={lagHjelpetekst(aktivitetForm.type)}
            hjelpetekstHeader={'Slik vurderer du om søker har utgifter'}
        />
    );
};

function lagHjelpetekst(aktivitetType: AktivitetType) {
    if (!erUtdanningEllerTiltak(aktivitetType)) {
        return null;
    }

    return hjelpetekst[aktivitetType];
}

const hjelpetekst: Record<AktivitetType.TILTAK | AktivitetType.UTDANNING, ReactNode> = {
    [AktivitetType.UTDANNING]: (
        <>
            <BodyShort spacing>
                Vi vurderer det slik at søker har utgifter til læremidler hvis de deltar på en
                utdanning godkjent av Nav.
            </BodyShort>
            <BodyShort spacing>
                Unntaket er hvis utdanningen er på grunnskolenivå da skolen skal dekke alle
                utgifter.
            </BodyShort>
        </>
    ),
    [AktivitetType.TILTAK]: (
        <>
            <BodyShort spacing>
                Vi vurderer det slik at søker har utgifter til læremidler hvis de deltar på et
                opplæringstiltak eller en utdanning godkjent av Nav.
            </BodyShort>
            <BodyShort spacing>
                Unntakene er AMO-kurs hvor det må undersøkes om læremidler er dekket gjenom
                kursavgiften.
            </BodyShort>
        </>
    ),
};
