import React from 'react';

import styled from 'styled-components';

import { Select } from '@navikt/ds-react';

import { MålgruppeType } from './Målgruppe';
import useFormState, { FormErrors } from '../../../../hooks/felles/useFormState';
import DateInput from '../../../../komponenter/Skjema/DateInput';

const InputContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

type NyMålgruppeForm = {
    fom: string;
    tom: string;
    type?: MålgruppeType;
};

const initFormState = { fom: '', tom: '' };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validerForm = ({ fom, tom, type }: NyMålgruppeForm): FormErrors<NyMålgruppeForm> => {
    return { fom: undefined, tom: undefined, type: undefined };
};

/* eslint-disable no-console */
const LeggTilMålgruppe = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const formState = useFormState<NyMålgruppeForm>(initFormState, validerForm);
    return (
        <InputContainer>
            <Select label={'Målgruppe'}>
                {Object.keys(MålgruppeType).map((type) => (
                    <option key={type} value={type}>
                        {type}
                    </option>
                ))}
            </Select>
            <DateInput label={'Fra'} value={''} onChange={(dato) => console.log('Fra:' + dato)} />
            <DateInput label={'Til'} value={''} onChange={(dato) => console.log(dato)} />
        </InputContainer>
    );
};

export default LeggTilMålgruppe;
