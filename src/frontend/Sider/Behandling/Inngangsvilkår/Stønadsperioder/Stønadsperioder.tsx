import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, Table } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

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
import { leggTilTomRadUnderIListe } from '../../VedtakOgBeregning/Barnetilsyn/utils';
import { Stønadsperiode } from '../typer/stønadsperiode';

const HvitTabell = styled(Table)`
    background-color: ${AWhite};
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
    eksisterendeStønadsperioder: Stønadsperiode[];
}> = ({ eksisterendeStønadsperioder }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { målgrupper, aktiviteter } = useInngangsvilkår();

    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);

    const validerForm = (formState: StønadsperiodeForm): FormErrors<StønadsperiodeForm> => {
        return {
            stønadsperioder: validerStønadsperioder(
                formState.stønadsperioder,
                målgrupper,
                aktiviteter
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
    }, [målgrupper, aktiviteter]);

    return (
        <EkspanderbartPanel tittel="Stønadsperioder">
            <form onSubmit={formState.onSubmit(handleSubmit)}>
                <HvitTabell>
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
                                leggTilTomRadUnder={() => leggTilTomRadUnder(indeks)}
                                slettPeriode={() => slettPeriode(indeks)}
                                feilmeldinger={
                                    formState.errors.stønadsperioder &&
                                    formState.errors.stønadsperioder[indeks]
                                }
                                radKanSlettes={indeks !== 0}
                                erLeservisning={false}
                            />
                        ))}
                    </Table.Body>
                </HvitTabell>

                <Feilmelding>{feilmelding}</Feilmelding>
                <Knapp size="small" type="submit" disabled={laster}>
                    Lagre
                </Knapp>
                <Feilmelding>{feilmelding}</Feilmelding>
            </form>
        </EkspanderbartPanel>
    );
};

export default Stønadsperioder;
