import React, { useEffect } from 'react';

import { BodyShort } from '@navikt/ds-react';

import { useBehandling } from '../../../../../context/BehandlingContext';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { Studienivå } from '../../typer/vilkårperiode/aktivitetLæremidler';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormLæremidler } from '../EndreAktivitetLæremidler';
import { beregnHarRettTilUtstyrsstipend, erUtdanningEllerTiltak } from '../utilsLæremidler';

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
    oppdaterSvar: (nyttSvar: SvarJaNei) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterSvar, readOnly }) => {
    const { behandlingFakta } = useBehandling();

    const alder =
        behandlingFakta['@type'] === Stønadstype.LÆREMIDLER ? behandlingFakta.alder : undefined;
    const harRettTilUtstyrsstipend = beregnHarRettTilUtstyrsstipend(alder);

    useEffect(() => {
        if (
            aktivitetForm.vurderinger.svarHarRettTilUtstyrsstipend === undefined &&
            harRettTilUtstyrsstipend !== undefined
        ) {
            oppdaterSvar(harRettTilUtstyrsstipend);
        }
    }, [
        alder,
        aktivitetForm.vurderinger.svarHarRettTilUtstyrsstipend,
        oppdaterSvar,
        harRettTilUtstyrsstipend,
    ]);

    if (!erUtdanningEllerTiltak(aktivitetForm.type)) return null;

    if (aktivitetForm.studienivå !== Studienivå.VIDEREGÅENDE) {
        return null;
    }

    return (
        <JaNeiVurdering
            label="Har bruker rett til utsstyrsstipend?"
            readOnly={readOnly}
            svar={aktivitetForm.vurderinger.svarHarRettTilUtstyrsstipend}
            oppdaterSvar={oppdaterSvar}
            hjelpetekst={hjelpetekstUtstyrsstipend}
            hjelpetekstHeader={'Slik vurderer du om søker har rett'}
        />
    );
};
