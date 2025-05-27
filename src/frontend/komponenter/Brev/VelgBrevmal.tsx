import React, { useMemo } from 'react';

import styled from 'styled-components';

import { Select } from '@navikt/ds-react';

import { Brevmal, BrevmalResultat } from './typer';
import { useBrevFeilContext } from '../../context/BrevFeilContext';
import { groupBy } from '../../utils/utils';

const Container = styled.div`
    max-width: fit-content;
`;

interface Props {
    brevmaler: Brevmal[];
    brevmal?: string;
    settBrevmal: (brevmal: string) => void;
}

/**
 * Viser en dropdown for å velge brevmal.
 * Brevmaler er gruppert etter resultat (innvilget, avslag, opphør, osv.) for å gjøre det enklere å finne riktig mal.
 * For frittstående brev vises alle maler uten gruppering.
 */
const VelgBrevmal: React.FC<Props> = ({ brevmaler, brevmal, settBrevmal }) => {
    const { nullstillFeilIBrev } = useBrevFeilContext();

    const handleOnChange = (event: string) => {
        settBrevmal(event);
        nullstillFeilIBrev();
    };

    const gruperteBrevmaler = useMemo(() => grupperBrevmaler(brevmaler), [brevmaler]);

    return (
        <Container>
            <Select
                label="Velg brevmal"
                onChange={(e) => handleOnChange(e.target.value)}
                value={brevmal || ''}
                size="small"
            >
                <option value="">Velg</option>
                {gruperteBrevmaler.map(([gruppe, maler]) => {
                    const options = maler.map((mal) => (
                        <option value={mal._id} key={mal._id}>
                            {mal.visningsnavn}
                        </option>
                    ));
                    if (gruppe === 'FRITTSTAENDE') {
                        return options;
                    }
                    return (
                        <optgroup label={gruppeTilTekst[gruppe as Gruppe]} key={gruppe}>
                            {options}
                        </optgroup>
                    );
                })}
            </Select>
        </Container>
    );
};

/**
 * Grupperer brevmaler basert på resultatet og visningsnavn.
 * I tilfelle det er en REVURDERING, skiller den mellom endring, forlengelse og opphør.
 */
const grupperBrevmaler = (brevmaler: Brevmal[]) => {
    const gruppert = groupBy(brevmaler, finnGruppe);
    return Object.entries(gruppert).sort(
        ([gruppeA], [gruppeB]) =>
            (prioritetBrevmaler[gruppeA as Gruppe] | 0) -
            (prioritetBrevmaler[gruppeB as Gruppe] | 0)
    );
};

/**
 * Definerer grupper for brevmaler basert på resultatet.
 * For revurderinger, skiller den mellom endring, forlengelse og opphør.
 * ANNET brukes for andre typer revurderinger som ikke passer inn i de spesifikke kategoriene.
 *  Men burde egentlige ikke bli brukt
 *
 */
type Gruppe =
    | Exclude<BrevmalResultat, BrevmalResultat.REVURDERING>
    | 'REVURDERING_ENDRING'
    | 'REVURDERING_FORLENGET'
    | 'REVURDERING_OPPHØR'
    | 'ANNET';

const prioritetBrevmaler: Record<Gruppe, number> = {
    INNVILGET: 1,
    REVURDERING_ENDRING: 2,
    REVURDERING_FORLENGET: 3,
    REVURDERING_OPPHØR: 4,
    AVSLAG: 5,
    OPPHOR: 6,
    ANNET: 7,
    FRITTSTAENDE: 8,
};

const gruppeTilTekst: Record<Gruppe, string> = {
    INNVILGET: 'Innvilget',
    REVURDERING_ENDRING: 'Endring',
    REVURDERING_FORLENGET: 'Forlengelse',
    REVURDERING_OPPHØR: 'Opphør',
    AVSLAG: 'Avslag',
    OPPHOR: 'Opphør',
    ANNET: 'Annet',
    FRITTSTAENDE: 'Frittstående brev',
};

const finnGruppe = (brevmal: Brevmal): Gruppe => {
    const resultat = brevmal.resultat;
    if (resultat === BrevmalResultat.REVURDERING) {
        if (brevmal.visningsnavn.startsWith('Endring')) {
            return 'REVURDERING_ENDRING';
        } else if (brevmal.visningsnavn.startsWith('Forlenget')) {
            return 'REVURDERING_FORLENGET';
        } else if (brevmal.visningsnavn.startsWith('Opphør')) {
            return 'REVURDERING_OPPHØR';
        }
        return 'ANNET';
    }
    return resultat;
};

export default VelgBrevmal;
