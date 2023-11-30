import React from 'react';

import styled from 'styled-components';

import { Select } from '@navikt/ds-react';

import { MålgruppeType } from './Målgruppe';
import DateInput from '../../../../komponenter/Skjema/DateInput';

const InputContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

/* eslint-disable no-console */
const LeggTilMålgruppe = () => {
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
