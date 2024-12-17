import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { Studienivå } from '../../typer/vilkårperiode/aktivitetLæremidler';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import {
    EndreAktivitetFormLæremidler,
    VurderingerAktivitetLæremidler,
} from '../EndreAktivitetLæremidler';
import { erUtdanningEllerTiltak } from '../utilsLæremidler';

const hjelpetekstUtstyrsstipend = (
    <BodyShort>
        Søkere under 21 år som går på videregående har som regel rett til utstyrsstipend.
        <br />
        <br />
        Lærlinger, lærekandidater, praksisbrevkandidater eller kandidater for fagbrev på jobb og de
        som har studiekompetanse, men går på vgs for å forbedre karakterer eller liknende, har ikke
        rett til utstyrsstipend.
    </BodyShort>
);

export const HarBrukerRettTilUtstyrsstipend: React.FC<{
    aktivitetForm: EndreAktivitetFormLæremidler;
    oppdaterVurderinger: (key: keyof VurderingerAktivitetLæremidler, nyttSvar: SvarJaNei) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterVurderinger, readOnly }) => {
    if (!erUtdanningEllerTiltak(aktivitetForm.type)) return null;

    if (aktivitetForm.studienivå !== Studienivå.VIDEREGÅENDE) {
        return null;
    }

    return (
        <JaNeiVurdering
            label="Har bruker rett til utsstyrsstipend?"
            readOnly={readOnly}
            svar={aktivitetForm.vurderinger.svarHarRettTilUtstyrsstipend}
            oppdaterSvar={(nyttSvar: SvarJaNei) =>
                oppdaterVurderinger('svarHarRettTilUtstyrsstipend', nyttSvar)
            }
            hjelpetekst={hjelpetekstUtstyrsstipend}
            hjelpetekstHeader={'Slik vurderer du om søker har rett'}
        />
    );
};
