import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { Heading, Select } from '@navikt/ds-react';

import { Vurderingsfelter } from './vurderingsfelter';
import { ÅrsakOmgjøring } from './vurderingValg';
import { useKlagebehandling } from '../../context/KlagebehandlingContext';

const ÅrsakStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const ÅrsakInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IÅrsak {
    settÅrsak: Dispatch<SetStateAction<Vurderingsfelter>>;
    årsakValgt?: ÅrsakOmgjøring;
    årsakValgmuligheter: Record<string, string>;
    endring: (komponentId: string) => void;
}

export const VelgÅrsakOmgjøring: React.FC<IÅrsak> = ({
    settÅrsak,
    årsakValgt,
    årsakValgmuligheter,
    endring,
}) => {
    const { settVurderingEndret } = useKlagebehandling();
    return (
        <ÅrsakStyled>
            <Heading spacing size="medium" level="5">
                Årsak
            </Heading>
            <ÅrsakInnholdStyled>
                <Select
                    value={årsakValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        settÅrsak(
                            (tidligereTilstand: Vurderingsfelter) =>
                                ({
                                    ...tidligereTilstand,
                                    årsak: e.target.value,
                                }) as Vurderingsfelter
                        );
                        settVurderingEndret(true);
                    }}
                    hideLabel
                >
                    <option value={''}>Velg</option>
                    {Object.keys(årsakValgmuligheter).map((valg, index) => (
                        <option value={valg} key={index}>
                            {årsakValgmuligheter[valg]}
                        </option>
                    ))}
                </Select>
            </ÅrsakInnholdStyled>
        </ÅrsakStyled>
    );
};
