import React from 'react';

import styled from 'styled-components';

import { Button, Heading, Select } from '@navikt/ds-react';

import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import { ListState } from '../../../../hooks/felles/useListState';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { AktivitetType } from '../Aktivitet/Aktivitet';
import { MålgruppeType } from '../Målgruppe/Målgruppe';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(4, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;
`;

const Knapp = styled(Button)`
    max-width: fit-content;
    margin-top: 1rem;
`;

export type Stønadsperiode = {
    målgruppe: MålgruppeType;
    aktivitet: AktivitetType;
    fom: string;
    tom: string;
};

type StønadsperiodeForm = {
    stønadsperioder: Stønadsperiode[];
};

const initFormState: FormState<StønadsperiodeForm> = {
    stønadsperioder: [{ målgruppe: '', aktivitet: '', fom: '', tom: '' }],
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const validerForm = (formState: StønadsperiodeForm): FormErrors<StønadsperiodeForm> => {
    return { stønadsperioder: [] };
};

const Stønadsperioder = () => {
    const formState = useFormState<StønadsperiodeForm>(initFormState, validerForm);

    const stønadsperioderState = formState.getProps('stønadsperioder') as ListState<Stønadsperiode>;

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const handleSubmit = (form: FormState<StønadsperiodeForm>) => {
        //leggTilNyMålgruppe({ fom: form.fom, tom: form.tom, målgruppe: form.målgruppe });
    };

    return (
        <Container>
            <Heading size="small">Stønadsperioder</Heading>
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <Grid>
                    {stønadsperioderState.value.map((periode, index) => (
                        <React.Fragment key={index}>
                            <Select
                                label={'Målgruppe'}
                                value={periode.målgruppe}
                                //onChange={(e) => stønadsperioder.setValue(e.target.value)}
                                size="small"
                            >
                                <option value="">Velg</option>
                                {Object.keys(MålgruppeType).map((type) => (
                                    <option key={type} value={type}>
                                        {type}
                                    </option>
                                ))}
                            </Select>
                            <Select
                                label={'Aktivitet'}
                                value={periode.aktivitet}
                                //onChange={(e) => stønadsperioder.setValue(e.target.value)}
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
                                value={periode.fom}
                                onChange={(dato) => dato}
                                size="small"
                            />
                            <DateInput
                                label={'Til'}
                                value={periode.tom}
                                onChange={(dato) => dato}
                                size="small"
                            />
                        </React.Fragment>
                    ))}
                </Grid>

                <Knapp size="small" type="submit">
                    Lagre
                </Knapp>
            </form>
        </Container>
    );
};

export default Stønadsperioder;
