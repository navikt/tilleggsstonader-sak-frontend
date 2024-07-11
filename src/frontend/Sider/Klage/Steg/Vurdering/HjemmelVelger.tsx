import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { alleHjemlerTilVisningstekst, Hjemmel } from './hjemmel';
import { Vurderingsfelter } from './Vurdering';

const HjemmelStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const HjemmelInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IHjemmel {
    settHjemmel: Dispatch<SetStateAction<Vurderingsfelter>>;
    hjemmelValgt?: Hjemmel;
    endring: (komponentId: string) => void;
}

export const HjemmelVelger: React.FC<IHjemmel> = ({ settHjemmel, hjemmelValgt, endring }) => {
    return (
        <HjemmelStyled>
            <Heading spacing size="medium" level="5">
                Hjemmel
            </Heading>
            <HjemmelInnholdStyled>
                <Select
                    value={hjemmelValgt}
                    label=""
                    size="medium"
                    onChange={(e) => {
                        endring(e.target.value);
                        settHjemmel(
                            (tidligereTilstand: Vurderingsfelter) =>
                                ({
                                    ...tidligereTilstand,
                                    hjemmel: e.target.value,
                                }) as Vurderingsfelter
                        );
                    }}
                    hideLabel
                >
                    <option value={''}>Velg</option>
                    {Object.keys(alleHjemlerTilVisningstekst).map(
                        (hjemmel: string) => (
                            <option value={hjemmel as Hjemmel} key={hjemmel}>
                                {alleHjemlerTilVisningstekst[hjemmel as Hjemmel]}
                            </option>
                        )
                    )}
                </Select>
            </HjemmelInnholdStyled>
        </HjemmelStyled>
    );
};
