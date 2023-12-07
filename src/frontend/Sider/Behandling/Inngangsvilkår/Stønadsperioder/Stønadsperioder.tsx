import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Heading, Label, Select } from '@navikt/ds-react';

import { validerStønadsperioder } from './validering';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import { ListState } from '../../../../hooks/felles/useListState';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { RessursStatus } from '../../../../typer/ressurs';
import { leggTilTomRadUnderIListe } from '../../VedtakOgBeregning/Barnetilsyn/utils';
import { AktivitetType, MålgruppeType, Stønadsperiode, Vilkårperioder } from '../typer';

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

export type StønadsperiodeForm = {
    stønadsperioder: Stønadsperiode[];
};
const tomStønadsperiodeRad = (): Stønadsperiode => ({
    målgruppe: '',
    aktivitet: '',
    fom: '',
    tom: '',
});

const initFormState = (
    eksisterendeStønadsperioder: Stønadsperiode[]
): FormState<StønadsperiodeForm> => ({
    stønadsperioder:
        eksisterendeStønadsperioder.length !== 0
            ? eksisterendeStønadsperioder
            : [tomStønadsperiodeRad()],
});

const Stønadsperioder: React.FC<{
    vilkårperioder: Vilkårperioder;
    eksisterendeStønadsperioder: Stønadsperiode[];
}> = ({ vilkårperioder, eksisterendeStønadsperioder }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);
    const validerForm = (formState: StønadsperiodeForm): FormErrors<StønadsperiodeForm> => {
        return {
            stønadsperioder: validerStønadsperioder(
                formState.stønadsperioder,
                vilkårperioder.målgrupper,
                vilkårperioder.aktiviteter
            ),
        };
    };
    const formState = useFormState<StønadsperiodeForm>(
        initFormState(eksisterendeStønadsperioder),
        validerForm
    );

    const stønadsperioderState = formState.getProps('stønadsperioder') as ListState<Stønadsperiode>;

    const handleSubmit = (form: FormState<StønadsperiodeForm>) => {
        if (laster) return;
        settLaster(true);
        return request<Stønadsperiode[], Stønadsperiode>(
            `/api/sak/stonadsperiode/${behandling.id}`,
            'POST',
            form.stønadsperioder
        )
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    stønadsperioderState.setValue(res.data);
                } else {
                    settFeilmelding(`Feilet legg til periode:${res.frontendFeilmelding}`);
                }
            })
            .finally(() => settLaster(false));
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

    const hentFormFeil = (indeks: number, property: keyof Stønadsperiode) => {
        return (
            formState.errors.stønadsperioder &&
            formState.errors.stønadsperioder[indeks] &&
            formState.errors.stønadsperioder[indeks][property]
        );
    };

    // Hvis målgrupper eller aktiviteter endrer seg, valider at stønadsperioder fortsatt er gyldige
    useEffect(() => {
        if (stønadsperioderState.value[0].målgruppe !== '') {
            formState.validateForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vilkårperioder]);

    return (
        <Container>
            <Heading size="medium">Stønadsperioder</Heading>
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <Grid>
                    <Label size="small">Målgruppe</Label>
                    <Label size="small">Aktivitet</Label>
                    <Label size="small">Fra</Label>
                    <Label size="small">Til</Label>

                    {stønadsperioderState.value.map((periode, indeks) => (
                        <React.Fragment key={periode.id || indeks}>
                            <Select
                                label={'Målgruppe'}
                                hideLabel
                                value={periode.målgruppe}
                                onChange={(e) =>
                                    oppdaterStønadsperiode(indeks, 'målgruppe', e.target.value)
                                }
                                size="small"
                                error={hentFormFeil(indeks, 'målgruppe')}
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
                                error={hentFormFeil(indeks, 'aktivitet')}
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
                                feil={hentFormFeil(indeks, 'fom')}
                            />
                            <DateInput
                                label={'Til'}
                                hideLabel
                                value={periode.tom}
                                onChange={(dato) =>
                                    dato && oppdaterStønadsperiode(indeks, 'tom', dato)
                                }
                                size="small"
                                feil={hentFormFeil(indeks, 'tom')}
                            />
                            <Feilmelding>{feilmelding}</Feilmelding>
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
