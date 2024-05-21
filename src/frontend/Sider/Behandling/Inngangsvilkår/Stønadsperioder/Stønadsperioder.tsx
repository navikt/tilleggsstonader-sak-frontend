import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Heading, Label, VStack } from '@navikt/ds-react';

import Aksjonsknapper from './Aksjonsknapper';
import StønadsperiodeRad from './StønadsperiodeRad';
import { validerStønadsperioder } from './validering';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { useSteg } from '../../../../context/StegContext';
import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import { ListState } from '../../../../hooks/felles/useListState';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { RessursStatus } from '../../../../typer/ressurs';
import { Stønadsperiode } from '../typer/stønadsperiode';

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const Grid = styled.div`
    display: grid;
    grid-template-columns: repeat(5, max-content);
    grid-row-gap: 0.5rem;
    grid-column-gap: 1.5rem;

    .kolonne1 {
        grid-column: 1;
    }
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
    stønadsperioder: eksisterendeStønadsperioder,
});

const Stønadsperioder: React.FC = () => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { stønadsperioder, oppdaterStønadsperioder, stønadsperiodeFeil, settStønadsperiodeFeil } =
        useInngangsvilkår();

    const [laster, settLaster] = useState<boolean>(false);
    const [redigerer, settRedigerer] = useState<boolean>(false);

    const validerForm = (formState: StønadsperiodeForm): FormErrors<StønadsperiodeForm> => {
        return {
            stønadsperioder: validerStønadsperioder(formState.stønadsperioder),
        };
    };

    const formState = useFormState<StønadsperiodeForm>(initFormState(stønadsperioder), validerForm);
    const stønadsperioderState = formState.getProps('stønadsperioder') as ListState<Stønadsperiode>;

    useEffect(() => {
        stønadsperioderState.setValue(stønadsperioder);
        formState.nullstillErrors();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [stønadsperioder]);

    const handleSubmit = (form: FormState<StønadsperiodeForm>) => {
        if (laster) return;
        settLaster(true);
        settStønadsperiodeFeil(undefined);
        return request<Stønadsperiode[], Stønadsperiode>(
            `/api/sak/stonadsperiode/${behandling.id}`,
            'POST',
            form.stønadsperioder
        )
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    settRedigerer(false);
                    oppdaterStønadsperioder(res.data);
                } else {
                    settStønadsperiodeFeil(`Feilet legg til periode: ${res.frontendFeilmelding}`);
                }
            })
            .finally(() => settLaster(false));
    };

    const leggTilNyPeriode = () => {
        stønadsperioderState.setValue((prevState) => [...prevState, tomStønadsperiodeRad()]);
    };

    const slettPeriode = (indeks: number) => {
        stønadsperioderState.remove(indeks);

        formState.setErrors((prevState: FormErrors<StønadsperiodeForm>) => ({
            ...prevState,
            stønadsperioder: (prevState.stønadsperioder ?? []).filter((_, i) => i !== indeks),
        }));
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

    const avbrytRedigering = () => {
        settRedigerer(false);
        stønadsperioderState.setValue(stønadsperioder);
    };

    return (
        <Container>
            <Heading spacing size="small">
                Sett stønadsperioder
            </Heading>
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <VStack gap="4">
                    {stønadsperioderState.value.length !== 0 && (
                        <Grid>
                            <Label>Målgruppe</Label>
                            <Label>Aktivitet</Label>
                            <Label>Fra</Label>
                            <Label>Til</Label>

                            {stønadsperioderState.value.map((periode, indeks) => (
                                <StønadsperiodeRad
                                    key={periode.id || indeks}
                                    stønadsperide={periode}
                                    oppdaterStønadsperiode={(
                                        property: keyof Stønadsperiode,
                                        value: string | undefined
                                    ) => oppdaterStønadsperiode(indeks, property, value)}
                                    slettPeriode={() => slettPeriode(indeks)}
                                    feilmeldinger={
                                        formState.errors.stønadsperioder &&
                                        formState.errors.stønadsperioder[indeks]
                                    }
                                    erLeservisning={!erStegRedigerbart || !redigerer}
                                />
                            ))}
                        </Grid>
                    )}

                    <Feilmelding>{stønadsperiodeFeil}</Feilmelding>

                    {erStegRedigerbart && (
                        <Aksjonsknapper
                            redigerer={redigerer}
                            finnesStønadsperioder={stønadsperioderState.value.length !== 0}
                            laster={laster}
                            avbrytRedigering={avbrytRedigering}
                            initierFormMedTomRad={leggTilNyPeriode}
                            startRedigering={() => settRedigerer(true)}
                        />
                    )}
                </VStack>
            </form>
        </Container>
    );
};

export default Stønadsperioder;
