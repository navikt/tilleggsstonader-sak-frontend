import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';
import { Heading, Select } from '@navikt/ds-react';
import styled from 'styled-components';
import { IVurdering } from './vurderingValg';
import { alleHjemlerTilVisningstekst, Hjemmel } from './hjemmel';

const HjemmelStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const HjemmelInnholdStyled = styled.div`
    display: block;
    width: 18rem;
`;

interface IHjemmel {
    settHjemmel: Dispatch<SetStateAction<IVurdering>>;
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
                            (tidligereTilstand: IVurdering) =>
                                ({
                                    ...tidligereTilstand,
                                    hjemmel: e.target.value,
                                }) as IVurdering
                        );
                    }}
                    hideLabel
                >
                    <option value={''}>Velg</option>
                    {Object.keys(alleHjemlerTilVisningstekst).map(
                        (hjemmel: string, index: number) => (
                            <option value={hjemmel as Hjemmel} key={index}>
                                {alleHjemlerTilVisningstekst[hjemmel as Hjemmel]}
                            </option>
                        )
                    )}
                </Select>
            </HjemmelInnholdStyled>
        </HjemmelStyled>
    );
};
