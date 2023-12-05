import React from 'react';

import styled from 'styled-components';

import { Button, Heading, Select } from '@navikt/ds-react';
import { ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import { FieldState } from '../../../../hooks/felles/useFieldState';
import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { MålgruppeType } from '../typer';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    background-color: ${ABlue50};
    border: 0.5px dotted blue;
`;

const InputContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

const Knapp = styled(Button)`
    max-width: fit-content;
    margin-top: 1rem;
`;

export type NyMålgruppe = {
    fom: string;
    tom: string;
    type: MålgruppeType;
};

const initFormState = { fom: '', tom: '', type: '' };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validerForm = ({ fom, tom, type }: NyMålgruppe): FormErrors<NyMålgruppe> => {
    // TODO fikse validering
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
        <Container>
            <Heading size="small">Legg til ny målgruppe</Heading>
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <InputContainer>
                    <Select
                        label={'Målgruppe'}
                        value={typeState.value}
                        onChange={(e) => typeState.setValue(e.target.value)}
                        size="small"
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
                        size="small"
                    />
                    <DateInput
                        label={'Til'}
                        value={tomState.value}
                        onChange={(dato) => dato && tomState.setValue(dato)}
                        size="small"
                    />
                </InputContainer>
                <Knapp size="small" type="submit">
                    Legg til
                </Knapp>
            </form>
        </Container>
    );
};

export default LeggTilMålgruppe;
