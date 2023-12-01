import React from 'react';

import styled from 'styled-components';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label, Select } from '@navikt/ds-react';

import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import { ListState } from '../../../../hooks/felles/useListState';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { leggTilTomRadUnderIListe } from '../../VedtakOgBeregning/Barnetilsyn/utils';
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
    grid-template-columns: repeat(5, max-content);
    grid-gap: 0.5rem 1rem;
    align-items: start;

    > :nth-child(5n) {
        grid-column: 1;
    }
`;

const Knapp = styled(Button)`
    max-width: fit-content;
    margin-top: 1rem;
`;

export type Stønadsperiode = {
    målgruppe: MålgruppeType | '';
    aktivitet: AktivitetType | '';
    fom: string;
    tom: string;
};

type StønadsperiodeForm = {
    stønadsperioder: Stønadsperiode[];
};
const tomStønadsperiodeRad = (): Stønadsperiode => ({
    målgruppe: '',
    aktivitet: '',
    fom: '',
    tom: '',
});

const initFormState: FormState<StønadsperiodeForm> = {
    stønadsperioder: [tomStønadsperiodeRad()],
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

    const leggTilTomRadUnder = (indeks: number) => {
        stønadsperioderState.setValue((prevState) =>
            leggTilTomRadUnderIListe(prevState, tomStønadsperiodeRad(), indeks)
        );
    };

    const slettPeriode = (indeks: number) => {
        stønadsperioderState.remove(indeks);

        formState.setErrors((prevState: FormErrors<StønadsperiodeForm>) => {
            const stønadsperioder = (prevState.stønadsperioder ?? []).splice(indeks, 1);
            return { ...prevState, stønadsperioder };
        });
    };

    const oppdaterStønadsperiode = (
        indeks: number,
        property: keyof Stønadsperiode,
        value: string | undefined
    ) => {
        stønadsperioderState.update(
            {
                ...stønadsperioderState.value[indeks],
                [property]: value,
            },
            indeks
        );
    };

    return (
        <Container>
            <Heading size="small">Stønadsperioder</Heading>
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <Grid>
                    <Label size="small">Målgruppe</Label>
                    <Label size="small">Aktivitet</Label>
                    <Label size="small">Fra</Label>
                    <Label size="small">Til</Label>

                    {stønadsperioderState.value.map((periode, indeks) => (
                        <React.Fragment key={indeks}>
                            <Select
                                label={'Målgruppe'}
                                hideLabel
                                value={periode.målgruppe}
                                onChange={(e) =>
                                    oppdaterStønadsperiode(indeks, 'målgruppe', e.target.value)
                                }
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
                                hideLabel
                                value={periode.aktivitet}
                                onChange={(e) =>
                                    oppdaterStønadsperiode(indeks, 'aktivitet', e.target.value)
                                }
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
                                hideLabel
                                value={periode.fom}
                                onChange={(dato) =>
                                    dato && oppdaterStønadsperiode(indeks, 'fom', dato)
                                }
                                size="small"
                            />
                            <DateInput
                                label={'Til'}
                                hideLabel
                                value={periode.tom}
                                onChange={(dato) =>
                                    dato && oppdaterStønadsperiode(indeks, 'tom', dato)
                                }
                                size="small"
                            />
                            <div>
                                <Button
                                    type="button"
                                    onClick={() => leggTilTomRadUnder(indeks)}
                                    variant="tertiary"
                                    icon={<PlusCircleIcon />}
                                    size="small"
                                />
                                {indeks !== 0 && (
                                    <Button
                                        type="button"
                                        onClick={() => slettPeriode(indeks)}
                                        variant="tertiary"
                                        icon={<TrashIcon />}
                                        size="small"
                                    />
                                )}
                            </div>
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
