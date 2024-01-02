import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, Heading, Select } from '@navikt/ds-react';
import { ABlue50 } from '@navikt/ds-tokens/dist/tokens';

import { validerForm } from './validering';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useInngangsvilkår } from '../../../../context/InngangsvilkårContext';
import { FieldState } from '../../../../hooks/felles/useFieldState';
import useFormState, { FormState } from '../../../../hooks/felles/useFormState';
import { Feilmelding } from '../../../../komponenter/Feil/Feilmelding';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { RessursStatus } from '../../../../typer/ressurs';
import { Periode } from '../../../../utils/periode';
import { Målgruppe, MålgruppeType } from '../typer';

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
    align-items: start;
`;

const KnappContainer = styled.div`
    display: flex;
    gap: 1rem;
`;

const Knapp = styled(Button)`
    max-width: fit-content;
    margin-top: 1rem;
`;

export type NyMålgruppe = {
    type: MålgruppeType;
} & Periode;

const initFormState = { fom: '', tom: '', type: '' };

const LeggTilMålgruppe: React.FC<{
    skjulLeggTilPeriode: () => void;
}> = ({ skjulLeggTilPeriode }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { leggTilMålgruppe } = useInngangsvilkår();
    const [feilmelding, settFeilmelding] = useState<string>();
    const [laster, settLaster] = useState<boolean>(false);

    const formState = useFormState<NyMålgruppe>(initFormState, validerForm);

    const typeState = formState.getProps('type') as FieldState;
    const fomState = formState.getProps('fom') as FieldState;
    const tomState = formState.getProps('tom') as FieldState;

    const leggTilNyMålgruppe = (nyMålgruppe: NyMålgruppe) => {
        if (laster) return;
        settLaster(true);
        settFeilmelding(undefined);
        return request<Målgruppe, NyMålgruppe>(
            `/api/sak/vilkar/${behandling.id}/periode`,
            'POST',
            nyMålgruppe
        )
            .then((res) => {
                if (res.status === RessursStatus.SUKSESS) {
                    leggTilMålgruppe(res.data);
                    skjulLeggTilPeriode();
                } else {
                    settFeilmelding(`Feilet legg til periode:${res.frontendFeilmelding}`);
                }
            })
            .finally(() => settLaster(false));
    };

    const handleSubmit = (form: FormState<NyMålgruppe>) => {
        leggTilNyMålgruppe({ fom: form.fom, tom: form.tom, type: form.type });
    };

    const handleReset = () => {
        if (laster) return;
        skjulLeggTilPeriode();
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
                        error={formState.errors.type}
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
                        onChange={(dato) => fomState.setValue(dato || '')}
                        size="small"
                        feil={formState.errors.fom}
                    />
                    <DateInput
                        label={'Til'}
                        value={tomState.value}
                        onChange={(dato) => tomState.setValue(dato || '')}
                        size="small"
                        feil={formState.errors.tom}
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

export default LeggTilMålgruppe;
