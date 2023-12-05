import React from 'react';

import styled from 'styled-components';

import { Button, Heading, Select } from '@navikt/ds-react';
import { ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import { FieldState } from '../../../../hooks/felles/useFieldState';
import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { AktivitetType } from '../typer';

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

export type NyAktivitet = {
    fom: string;
    tom: string;
    type: AktivitetType;
};

const initFormState = { fom: '', tom: '', type: '' };

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validerForm = ({ fom, tom, type }: NyAktivitet): FormErrors<NyAktivitet> => {
    // TODO fikse validering
    return { fom: undefined, tom: undefined, type: undefined };
};

const LeggTilAktivitet: React.FC<{
    leggTilNyAktivitet: (nyAktivitet: NyAktivitet) => void;
}> = ({ leggTilNyAktivitet }) => {
    const formState = useFormState<NyAktivitet>(initFormState, validerForm);

    const typeState = formState.getProps('type') as FieldState;
    const fomState = formState.getProps('fom') as FieldState;
    const tomState = formState.getProps('tom') as FieldState;

    const handleSubmit = (form: FormState<NyAktivitet>) => {
        leggTilNyAktivitet({ fom: form.fom, tom: form.tom, type: form.type });
    };

    return (
        <Container>
            <Heading size="small">Legg til ny aktivitet</Heading>
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <InputContainer>
                    <Select
                        label={'Aktivitet'}
                        value={typeState.value}
                        onChange={(e) => typeState.setValue(e.target.value)}
                        size="small"
                    >
                        <option value="">Velg</option>
                        {Object.keys(AktivitetType).map((type) => (
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

export default LeggTilAktivitet;
