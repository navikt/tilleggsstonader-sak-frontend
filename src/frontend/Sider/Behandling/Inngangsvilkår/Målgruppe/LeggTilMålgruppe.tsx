import React from 'react';

import styled from 'styled-components';

import { Button, Select } from '@navikt/ds-react';

import { MålgruppeType } from './Målgruppe';
import { FieldState } from '../../../../hooks/felles/useFieldState';
import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import DateInput from '../../../../komponenter/Skjema/DateInput';

const InputContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

export type NyMålgruppe = {
    fom: string;
    tom: string;
    type: MålgruppeType;
};

const initFormState = { fom: '', tom: '', type: '' };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validerForm = ({ fom, tom, type }: NyMålgruppe): FormErrors<NyMålgruppe> => {
    return { fom: undefined, tom: undefined, type: undefined };
};

const LeggTilMålgruppe: React.FC<{
    leggTilNyMålgruppe: (nyMålgruppe: NyMålgruppe) => void;
}> = ({ leggTilNyMålgruppe }) => {
    const formState = useFormState<NyMålgruppe>(initFormState, validerForm);

    const typeState = formState.getProps('type') as FieldState;
    const fomState = formState.getProps('fom') as FieldState;
    const tomState = formState.getProps('tom') as FieldState;

    const handleSubmit = (form: FormState<NyMålgruppe>) => {
        leggTilNyMålgruppe({ fom: form.fom, tom: form.tom, type: form.type });
    };

    return (
        <form onSubmit={formState.onSubmit(handleSubmit)}>
            <InputContainer>
                <Select
                    label={'Målgruppe'}
                    value={typeState.value}
                    onChange={(e) => typeState.setValue(e.target.value)}
                >
                    <option value="">Velg</option>
                    {Object.keys(MålgruppeType).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </Select>
                <DateInput
                    label={'Fra'}
                    value={fomState.value}
                    onChange={(dato) => dato && fomState.setValue(dato)}
                />
                <DateInput
                    label={'Til'}
                    value={tomState.value}
                    onChange={(dato) => dato && tomState.setValue(dato)}
                />
            </InputContainer>
            <Button size="small" type="submit">
                Lagre
            </Button>
        </form>
    );
};

export default LeggTilMålgruppe;
