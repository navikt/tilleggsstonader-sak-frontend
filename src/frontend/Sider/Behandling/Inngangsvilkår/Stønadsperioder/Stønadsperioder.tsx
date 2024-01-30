import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Table, VStack } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import { Aksjonsknapper } from './Aksjonsknapper';
import StønadsperiodeRad from './StønadsperiodeRad';
import { validerStønadsperioder } from './validering';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import { ListState } from '../../../../hooks/felles/useListState';
import EkspanderbartPanel from '../../../../komponenter/EkspanderbartPanel/EkspanderbartPanel';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import { RessursStatus } from '../../../../typer/ressurs';
import { Stønadsperiode } from '../typer/stønadsperiode';

const HvitTabell = styled(Table)`
    background-color: ${AWhite};
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
    const { behandling, behandlingErRedigerbar } = useBehandling();
    const {
        målgrupper,
        aktiviteter,
        stønadsperioder,
        oppdaterStønadsperioder,
        hentStønadsperioder,
    } = useInngangsvilkår();

    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);
    const [redigerer, settRedigerer] = useState<boolean>(false);

    const validerForm = (formState: StønadsperiodeForm): FormErrors<StønadsperiodeForm> => {
        return {
            stønadsperioder: validerStønadsperioder(
                formState.stønadsperioder,
                målgrupper,
                aktiviteter
            ),
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
        settFeilmelding(undefined);
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
                    settFeilmelding(`Feilet legg til periode:${res.frontendFeilmelding}`);
                }
            })
            .finally(() => settLaster(false));
    };

    const leggTilNyPeriode = () => {
        stønadsperioderState.setValue((prevState) => [...prevState, tomStønadsperiodeRad()]);
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

    const avbrytRedigering = () => {
        settRedigerer(false);
        hentStønadsperioder.rerun();
    };

    return (
        <EkspanderbartPanel tittel="Stønadsperioder">
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <VStack gap="4">
                    {stønadsperioderState.value.length !== 0 && (
                        <HvitTabell size="small">
                            <Table.Header>
                                <Table.Row>
                                    <Table.HeaderCell>Målgruppe</Table.HeaderCell>
                                    <Table.HeaderCell>Aktivitet</Table.HeaderCell>
                                    <Table.HeaderCell>Fra</Table.HeaderCell>
                                    <Table.HeaderCell>Til</Table.HeaderCell>
                                    <Table.HeaderCell />
                                </Table.Row>
                            </Table.Header>
                            <Table.Body>
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
                                        erLeservisning={
                                            !behandlingErRedigerbar || redigerer === false
                                        }
                                    />
                                ))}
                            </Table.Body>
                        </HvitTabell>
                    )}

                    <Feilmelding>{feilmelding}</Feilmelding>

                    {behandlingErRedigerbar && (
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
        </EkspanderbartPanel>
    );
};

export default Stønadsperioder;
