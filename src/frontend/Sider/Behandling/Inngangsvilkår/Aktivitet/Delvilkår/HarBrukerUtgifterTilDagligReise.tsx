import React from 'react';

import { BodyShort, List } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';

export const HarBrukerUtgifterTilDagligReise: React.FC<{
    svarHarUtgifter: SvarJaNei | undefined;
    oppdaterSvar: (nyttSvar: SvarJaNei) => void;
}> = ({ svarHarUtgifter, oppdaterSvar }) => {
    return (
        <JaNeiVurdering
            label="Har bruker nødvendige utgifter til daglige reiser?"
            svar={svarHarUtgifter}
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
            normalt å ha nødvendige utgifter til daglige reiser. Unntak gjelder for (se rundskriv
            for presiseringer):
        </BodyShort>
        <List as="ul" size={'small'}>
            <List.Item>
                Opplæringstiltak eller godkjent utdanning på grunnskolenivå (forberedende opplæring
                for voksne).
            </List.Item>
            <List.Item>
                Elever i videregående skole som er under 25 år det kalenderåret skoleåret starter,
                med mindre de bekrefter egne reiseutgifter i søknad.
            </List.Item>
            <List.Item>Lærlinger som får reise dekket av arbeidsgiver.</List.Item>
            <List.Item>
                Brukere med grunnstønad til transport eller bil – må vurderes om dette dekker reise
                til aktivitetsstedet.
            </List.Item>
        </List>
    </>
);
