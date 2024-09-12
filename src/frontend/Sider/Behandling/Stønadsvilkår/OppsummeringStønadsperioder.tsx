import React from 'react';

import { Box, List } from '@navikt/ds-react';

import { formaterTilTekstligDato } from '../../../utils/dato';
import { aktivitetTypeTilTekst } from '../Inngangsvilkår/typer/aktivitet';
import { målgruppeTypeTilTekst } from '../Inngangsvilkår/typer/målgruppe';
import { Stønadsperiode } from '../Inngangsvilkår/typer/stønadsperiode';

const OppsummeringStønadsperioder: React.FC<{ stønadsperioder: Stønadsperiode[] }> = ({
    stønadsperioder,
}) => {
    const oppsummerStønadsperiode = (stønadsperiode: Stønadsperiode) => {
        return `${formaterTilTekstligDato(stønadsperiode.fom)} - ${formaterTilTekstligDato(stønadsperiode.tom)} (${målgruppeTypeTilTekst(stønadsperiode.målgruppe)}, ${aktivitetTypeTilTekst(stønadsperiode.aktivitet)})`;
    };

    return (
        <Box padding="4" background="surface-selected">
            <List as="ul" title="Stønadsperioder" size="small">
                {!stønadsperioder.length && <>Ingen stønadsperioder</>}
                {stønadsperioder.map((stønadsperiode, index) => (
                    <List.Item key={index}>{oppsummerStønadsperiode(stønadsperiode)}</List.Item>
                ))}
            </List>
        </Box>
    );
};

export default OppsummeringStønadsperioder;
