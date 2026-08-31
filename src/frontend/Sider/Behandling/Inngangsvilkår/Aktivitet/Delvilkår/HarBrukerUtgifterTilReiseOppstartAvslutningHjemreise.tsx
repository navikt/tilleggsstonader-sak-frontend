import React from 'react';

import { BodyShort } from '@navikt/ds-react';

import { JaNeiVurdering } from '../../../Vilkårvurdering/JaNeiVurdering';
import { SvarJaNei } from '../../typer/vilkårperiode/vilkårperiode';

// TODO: avklar hjelpetekst med fag
export const HarBrukerUtgifterTilReiseOppstartAvslutningHjemreise: React.FC<{
    svarHarUtgifter: SvarJaNei | undefined;
    oppdaterSvar: (nyttSvar: SvarJaNei) => void;
}> = ({ svarHarUtgifter, oppdaterSvar }) => {
    return (
        <JaNeiVurdering
            label="Har bruker nødvendige utgifter til reise ved oppstart, avslutning eller hjemreise?"
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
    <BodyShort size={'small'} spacing>
        Personer som deltar i arbeidsrettet utredning, tiltak eller godkjent utdanning anses normalt
        å ha nødvendige utgifter til reise ved oppstart, avslutning eller hjemreise fra aktiviteten.
    </BodyShort>
);
