import React from 'react';

import { List } from '@navikt/ds-react';

import { tilTekstligDato } from '../../../../../utils/dato';
import { aktivitetTypeTilTekst } from '../../../Inngangsvilkår/typer/aktivitet';
import { målgruppeTypeTilTekst } from '../../../Inngangsvilkår/typer/målgruppe';
import { Stønadsperiode } from '../../../Inngangsvilkår/typer/stønadsperiode';

const OppsummeringStønadsperioder: React.FC<{ stønadsperioder: Stønadsperiode[] }> = ({
    stønadsperioder,
}) => {
    const oppsummerStønadsperiode = (stønadsperiode: Stønadsperiode) => {
        return `${tilTekstligDato(stønadsperiode.fom)} - ${tilTekstligDato(stønadsperiode.tom)} (${målgruppeTypeTilTekst(stønadsperiode.målgruppe)}, ${aktivitetTypeTilTekst(stønadsperiode.aktivitet)})`;
    };

    return (
        <List as="ul" title="Stønadsperioder" size="small">
            {stønadsperioder.map((stønadsperiode, index) => (
                <List.Item key={index}>{oppsummerStønadsperiode(stønadsperiode)}</List.Item>
            ))}
        </List>
    );
};

export default OppsummeringStønadsperioder;
