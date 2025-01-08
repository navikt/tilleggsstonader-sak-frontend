import React from 'react';

import { BodyShort, List } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { Studienivå } from '../../typer/vilkårperiode/aktivitetLæremidler';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';
import { EndreAktivitetFormLæremidler } from '../EndreAktivitetLæremidler';
import { erUtdanningEllerTiltak } from '../utilsLæremidler';

const hjelpetekstUtstyrsstipend = (
    <>
        <BodyShort size={'small'} spacing>
            Søkere under 21 år som går på videregående har som regel rett til utstyrsstipend.
        </BodyShort>
        <BodyShort size={'small'} spacing>
            Disse har ikke rett til utstyrsstipend:
        </BodyShort>
        <List size="small">
            <List.Item>
                lærlinger, lærekandidater, praksisbrevkandidater eller kandidater for fagbrev på
                jobb
            </List.Item>
            <List.Item>
                de som har studiekompetanse, men går på vgs for å forbedre karakterer eller
                liknende.
            </List.Item>
        </List>
        <BodyShort size={'small'} spacing>
            Hvis søker har rett til utstyrsstipend, så har de ikke rett på tilleggsstønad.
        </BodyShort>
    </>
);

export const HarBrukerRettTilUtstyrsstipend: React.FC<{
    aktivitetForm: EndreAktivitetFormLæremidler;
    oppdaterSvar: (nyttSvar: SvarJaNei) => void;
    readOnly: boolean;
}> = ({ aktivitetForm, oppdaterSvar, readOnly }) => {
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
            hjelpetekstHeader={'Slik vurderer du om søker har rett på utstyrsstipend'}
        />
    );
};
