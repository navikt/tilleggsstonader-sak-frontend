import React from 'react';

import styled from 'styled-components';

import { BodyShort } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { Studienivå } from '../../typer/vilkårperiode/aktivitetLæremidler';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import {
    EndreAktivitetFormLæremidler,
    VurderingerAktivitetLæremidler,
} from '../EndreAktivitetLæremidler';
import {
    erUtdanningEllerTiltak,
    skalVurdereHarUtgifter,
    skalVurdereHarUtstyrsstipend,
} from '../utilsLæremidler';

const Container = styled.div`
    display: flex;
    gap: 2rem;
`;

const hjelpetekstUtgifter = (
    <BodyShort>
        Vi vurderer det slik at søker har utgifter til læremidler hvis de deltar på et
        opplæringstiltak eller en utdanning godkjent av Nav.
        <br />
        <br />
        Unntaket er AMO-kurs hvor det må undersøkes om læremidler er dekket gjennom kursavgiften.
    </BodyShort>
);

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

export const AktivitetDelvilkårLæremidler: React.FC<{
    aktivitetForm: EndreAktivitetFormLæremidler;
    oppdaterVurderinger: (key: keyof VurderingerAktivitetLæremidler, nyttSvar: SvarJaNei) => void;
    readOnly: boolean;
    studienivå: Studienivå | undefined;
}> = ({ aktivitetForm, oppdaterVurderinger, readOnly }) => {
    if (!erUtdanningEllerTiltak(aktivitetForm.type)) return null;

    return (
        <Container>
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
            {skalVurdereHarUtstyrsstipend(aktivitetForm.studienivå) && (
                <JaNeiVurdering
                    label="Har bruker rett til utsstyrsstipend?"
                    readOnly={readOnly}
                    svar={aktivitetForm.vurderinger.svarHarRettTilUtstyrsstipend}
                    oppdaterSvar={(nyttSvar: SvarJaNei) => {
                        oppdaterVurderinger('svarHarRettTilUtstyrsstipend', nyttSvar);
                    }}
                    hjelpetekst={hjelpetekstUtstyrsstipend}
                    hjelpetekstHeader={'Slik vurderer du om søker har rett'}
                />
            )}
        </Container>
    );
};
