import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, Label } from '@navikt/ds-react';

import StønadsperiodeRad from './StønadsperiodeRad';
import { validerStønadsperioder } from './validering';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import { ListState } from '../../../../hooks/felles/useListState';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { RessursStatus } from '../../../../typer/ressurs';
import { leggTilTomRadUnderIListe } from '../../VedtakOgBeregning/Barnetilsyn/utils';
import { Stønadsperiode, Vilkårperioder } from '../typer';

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

const RedigerStønadsperioder: React.FC<{
    vilkårperioder: Vilkårperioder;
    eksisterendeStønadsperioder: Stønadsperiode[];
}> = ({ vilkårperioder, eksisterendeStønadsperioder }) => {
    const { oppdaterStønadsperioder } = useInngangsvilkår();
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
        settFeilmelding(undefined);
        return request<Stønadsperiode[], Stønadsperiode>(
            `/api/sak/stonadsperiode/${behandling.id}`,
            'POST',
            form.stønadsperioder
        )
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    stønadsperioderState.setValue(res.data);
                    oppdaterStønadsperioder(res);
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

    // Hvis målgrupper eller aktiviteter endrer seg, valider at stønadsperioder fortsatt er gyldige
    useEffect(() => {
        if (stønadsperioderState.value[0].målgruppe !== '') {
            formState.validateForm();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [vilkårperioder]);

    return (
        <form onSubmit={formState.onSubmit(handleSubmit)}>
            <Grid>
                <Label size="small">Målgruppe</Label>
                <Label size="small">Aktivitet</Label>
                <Label size="small">Fra</Label>
                <Label size="small">Til</Label>

                {stønadsperioderState.value.map((periode, indeks) => (
                    <StønadsperiodeRad
                        key={periode.id}
                        stønadsperide={periode}
                        oppdaterStønadsperiode={(
                            property: keyof Stønadsperiode,
                            value: string | undefined
                        ) => oppdaterStønadsperiode(indeks, property, value)}
                        leggTilTomRadUnder={() => leggTilTomRadUnder(indeks)}
                        slettPeriode={() => slettPeriode(indeks)}
                        feilmeldinger={
                            formState.errors.stønadsperioder &&
                            formState.errors.stønadsperioder[indeks]
                        }
                        radKanSlettes={indeks !== 0}
                    />
                ))}
            </Grid>

            <Feilmelding>{feilmelding}</Feilmelding>
            <Knapp size="small" type="submit" disabled={laster}>
                Lagre
            </Knapp>
            <Feilmelding>{feilmelding}</Feilmelding>
        </form>
    );
};

export default RedigerStønadsperioder;
