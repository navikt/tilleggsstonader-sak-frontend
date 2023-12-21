import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, Heading, Select } from '@navikt/ds-react';
import { ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FieldState } from '../../../../hooks/felles/useFieldState';
import useFormState, { FormErrors, FormState } from '../../../../hooks/felles/useFormState';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { RessursStatus } from '../../../../typer/ressurs';
import { Aktivitet, AktivitetType } from '../typer';

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

const KnappContainer = styled.div`
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
    skjulLeggTilPeriode: () => void;
}> = ({ skjulLeggTilPeriode }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { leggTilAktivitet } = useInngangsvilkår();
    const formState = useFormState<NyAktivitet>(initFormState, validerForm);

    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);

    const typeState = formState.getProps('type') as FieldState;
    const fomState = formState.getProps('fom') as FieldState;
    const tomState = formState.getProps('tom') as FieldState;

    const leggTilNyAktivitet = (nyAktivitet: NyAktivitet) => {
        if (laster) return;
        settLaster(true);
        settFeilmelding(undefined);
        return request<Aktivitet, NyAktivitet>(
            `/api/sak/vilkar/${behandling.id}/periode`,
            'POST',
            nyAktivitet
        )
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    leggTilAktivitet(res.data);
                    skjulLeggTilPeriode();
                } else {
                    settFeilmelding(`Feilet legg til periode:${res.frontendFeilmelding}`);
                }
            })
            .finally(() => settLaster(false));
    };

    const handleSubmit = (form: FormState<NyAktivitet>) => {
        leggTilNyAktivitet({ fom: form.fom, tom: form.tom, type: form.type });
    };

    const handleReset = () => {
        if (laster) return;
        skjulLeggTilPeriode();
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
                        onChange={(dato) => fomState.setValue(dato || '')}
                        size="small"
                    />
                    <DateInput
                        label={'Til'}
                        value={tomState.value}
                        onChange={(dato) => tomState.setValue(dato || '')}
                        size="small"
                    />
                </InputContainer>
                <Feilmelding>{feilmelding}</Feilmelding>
                <KnappContainer>
                    <Knapp size="small" type="submit" disabled={laster}>
                        Legg til
                    </Knapp>
                    <Knapp
                        variant={'tertiary'}
                        size="small"
                        disabled={laster}
                        onClick={handleReset}
                    >
                        Avbryt
                    </Knapp>
                </KnappContainer>
            </form>
        </Container>
    );
};

export default LeggTilAktivitet;
