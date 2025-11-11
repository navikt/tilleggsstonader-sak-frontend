import React from 'react';

import { BodyShort, List } from '@navikt/ds-react';

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
            hjelpetekst={hjelpetekst}
            hjelpetekstHeader={'Slik vurderer du om søker har nødvendige utgifter'}
        />
    );
};

const hjelpetekst = (
    <>
        <BodyShort size={'small'} spacing>
            Personer som deltar i arbeidsrettet utredning, tiltak eller godkjent utdanning anses
            normalt å ha nødvendige utgifter til daglig reise. Unntak gjelder for (se rundskriv for
            presiseringer):
        </BodyShort>
        <List as="ul" size={'small'}>
            <List.Item>
                Opplæringstiltak eller godkjent utdanning på grunnskolenivå (forberedende opplæring
                for voksne).
            </List.Item>
            <List.Item>
                Elever i videregående skole som er under 25 år når skoleåret starter, med mindre de
                bekrefter egne reiseutgifter i søknad.
            </List.Item>
            <List.Item>Lærlinger som får reise dekket av arbeidsgiver.</List.Item>
            <List.Item>
                Brukere med grunnstønad til transport eller bil – må vurderes om dette dekker reise
                til aktivitetsstedet.
            </List.Item>
            <List.Item>Lærlinger som får reise dekket av arbeidsgiver.</List.Item>
        </List>
    </>
);
