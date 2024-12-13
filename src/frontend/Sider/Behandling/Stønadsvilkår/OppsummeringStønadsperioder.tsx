import React from 'react';

import { BodyShort, Box, List } from '@navikt/ds-react';

import { formaterTilTekstligDato } from '../../../utils/dato';
import { aktivitetTypeTilTekst } from '../Inngangsvilkår/Aktivitet/utilsAktivitet';
import { Stønadsperiode } from '../Inngangsvilkår/typer/stønadsperiode';
import { målgruppeTypeTilTekst } from '../Inngangsvilkår/typer/vilkårperiode/målgruppe';

export const OppsummeringStønadsperioder: React.FC<{ stønadsperioder: Stønadsperiode[] }> = ({
    stønadsperioder,
}) => {
    return (
        <Box padding="4" background="surface-selected">
            <StønadsperiodeListe
                stønadsperioder={stønadsperioder}
                tittel="Perioder med overlapp mellom aktivitet og målgruppe"
            />
        </Box>
    );
};

export const StønadsperiodeListe: React.FC<{
    stønadsperioder: Stønadsperiode[];
    tittel: string;
}> = ({ stønadsperioder, tittel }) => {
    const oppsummerStønadsperiode = (stønadsperiode: Stønadsperiode) => {
        return `${formaterTilTekstligDato(stønadsperiode.fom)} - ${formaterTilTekstligDato(stønadsperiode.tom)} (${målgruppeTypeTilTekst(stønadsperiode.målgruppe)}, ${aktivitetTypeTilTekst(stønadsperiode.aktivitet)})`;
    };

    if (stønadsperioder.length === 0) {
        return (
            <BodyShort size="small">
                Det er ikke registrert noen perioder med overlapp mellom aktivitet og målgruppe
            </BodyShort>
        );
    }

    return (
        <List as="ul" title={tittel} size="small">
            {!stønadsperioder.length && <>Ingen stønadsperioder</>}
            {stønadsperioder.map((stønadsperiode, index) => (
                <List.Item key={index}>{oppsummerStønadsperiode(stønadsperiode)}</List.Item>
            ))}
        </List>
    );
};
