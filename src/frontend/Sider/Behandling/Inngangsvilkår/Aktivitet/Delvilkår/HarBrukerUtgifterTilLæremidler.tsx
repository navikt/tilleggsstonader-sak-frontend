import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import {
    EndreAktivitetFormLæremidler,
    VurderingerAktivitetLæremidler,
} from '../EndreAktivitetLæremidler';
import { skalVurdereHarUtgifter } from '../utilsLæremidler';

const hjelpetekstUtgifter = (
    <BodyShort>
        Vi vurderer det slik at søker har utgifter til læremidler hvis de deltar på et
        opplæringstiltak eller en utdanning godkjent av Nav.
        <br />
        <br />
        Unntaket er AMO-kurs hvor det må undersøkes om læremidler er dekket gjennom kursavgiften.
    </BodyShort>
);

export const HarBrukerUtgifterTilLæremidler: React.FC<{
    aktivitetForm: EndreAktivitetFormLæremidler;
    oppdaterVurderinger: (key: keyof VurderingerAktivitetLæremidler, nyttSvar: SvarJaNei) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterVurderinger, readOnly }) => {
    if (!skalVurdereHarUtgifter(aktivitetForm.type)) return null;

    return (
        <>
            {skalVurdereHarUtgifter(aktivitetForm.type) && (
                <JaNeiVurdering
                    label="Har bruker utgifter til læremidler?"
                    readOnly={readOnly}
                    svar={aktivitetForm.vurderinger.svarHarUtgifter}
                    oppdaterSvar={(nyttSvar: SvarJaNei) =>
                        oppdaterVurderinger('svarHarUtgifter', nyttSvar)
                    }
                    hjelpetekst={hjelpetekstUtgifter}
                    hjelpetekstHeader={'Slik vurderer du om søker har utgifter'}
                />
            )}
        </>
    );
};
