import * as React from 'react';
import { Dispatch, SetStateAction } from 'react';

import styled from 'styled-components';

import { UNSAFE_Combobox } from '@navikt/ds-react';

import { alleHjemlerTilVisningstekst, Hjemmel } from './hjemmel';
import { Vurderingsfelter } from './vurderingsfelter';

const HjemmelStyled = styled.div`
    margin: 2rem 4rem 2rem 4rem;
`;

const HjemmelInnholdStyled = styled.div`
    display: block;
    width: 23rem;
`;

interface IHjemmel {
    settHjemler: Dispatch<SetStateAction<Vurderingsfelter>>;
    hjemler?: Hjemmel[];
    endring: (komponentId: string) => void;
}

const hjemlerTilOptions = (hjemler: Hjemmel[] | undefined) =>
    hjemler?.map((hjemmel) => ({
        value: hjemmel,
        label: alleHjemlerTilVisningstekst[hjemmel as Hjemmel],
    })) ?? [];

export const HjemmelVelger: React.FC<IHjemmel> = ({ settHjemler, hjemler, endring }) => {
    const options = hjemlerTilOptions(Object.keys(alleHjemlerTilVisningstekst) as Hjemmel[]);
    const selectedOptions = hjemlerTilOptions(hjemler);
    const onToggleSelected = (option: string, isSelected: boolean) => {
        endring('hjemmel');
        settHjemler((prevState) => {
            if (isSelected) {
                return {
                    ...prevState,
                    hjemler: [...(prevState.hjemler || []), option as Hjemmel],
                };
            } else {
                return {
                    ...prevState,
                    hjemler: (prevState.hjemler || []).filter((hjemmel) => hjemmel !== option),
                };
            }
        });
    };

    return (
        <HjemmelStyled>
            <HjemmelInnholdStyled>
                <UNSAFE_Combobox
                    label="Hjemler"
                    description={'Velg inntil 2 hjemler som klagen kan knyttes til'}
                    size="medium"
                    options={options}
                    selectedOptions={selectedOptions}
                    onToggleSelected={onToggleSelected}
                    isMultiSelect={true}
                    maxSelected={{
                        limit: 2,
                        message: `2 av maks 2 er valgt`,
                    }}
                />
            </HjemmelInnholdStyled>
        </HjemmelStyled>
    );
};
