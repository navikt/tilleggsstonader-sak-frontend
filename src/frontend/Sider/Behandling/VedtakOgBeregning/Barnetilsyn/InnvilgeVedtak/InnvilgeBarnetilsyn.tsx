import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';

import Beregningsresultat from './Beregningsresultat';
import StønadsperiodeValg from './Stønadsperiode/StønadsperiodeValg';
import Utgifter from './Utgifter/Utgifter';
import { validerInnvilgetVedtakForm, validerPerioder } from './vedtaksvalidering';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import useFormState, { FormState } from '../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../hooks/felles/useListState';
import { RecordState } from '../../../../../hooks/felles/useRecordState';
import DataViewer from '../../../../../komponenter/DataViewer';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';
import { Ressurs, byggTomRessurs } from '../../../../../typer/ressurs';
import {
    BeregningsresultatTilsynBarn,
    InnvilgeVedtakForBarnetilsyn,
    Stønadsperiode,
    Utgift,
} from '../../../../../typer/vedtak';
import { Barn } from '../../../vilkår';
import { lagVedtakRequest, tomStønadsperiodeRad, tomUtgiftPerBarn } from '../utils';

export type InnvilgeVedtakForm = {
    stønadsperioder: Stønadsperiode[];
    utgifter: Record<string, Utgift[]>;
};

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const initStønadsperioder = (vedtak: InnvilgeVedtakForBarnetilsyn | undefined) =>
    vedtak ? vedtak.stønadsperioder : [tomStønadsperiodeRad()];

const initUtgifter = (vedtak: InnvilgeVedtakForBarnetilsyn | undefined, barnIBehandling: Barn[]) =>
    vedtak ? vedtak.utgifter : tomUtgiftPerBarn(barnIBehandling);

const initFormState = (
    vedtak: InnvilgeVedtakForBarnetilsyn | undefined,
    barnIBehandling: Barn[]
) => ({
    stønadsperioder: initStønadsperioder(vedtak),
    utgifter: initUtgifter(vedtak, barnIBehandling),
});

interface Props {
    lagretVedtak?: InnvilgeVedtakForBarnetilsyn;
    settResultatType: (val: BehandlingResultat | undefined) => void;
    låsFraDatoFørsteRad: boolean;
    barnIBehandling: Barn[];
}

export const InnvilgeBarnetilsyn: React.FC<Props> = ({ lagretVedtak, barnIBehandling }) => {
    const { request } = useApp();
    const { behandlingErRedigerbar, behandling } = useBehandling();
    // TODO: Prøve å slippe denne castingen
    const lagretInnvilgetVedtak = lagretVedtak as InnvilgeVedtakForBarnetilsyn;

    const formState = useFormState<InnvilgeVedtakForm>(
        initFormState(lagretInnvilgetVedtak, barnIBehandling),
        validerInnvilgetVedtakForm
    );

    const stønadsperioderState = formState.getProps('stønadsperioder') as ListState<Stønadsperiode>;
    const utgifterState = formState.getProps('utgifter') as RecordState<Utgift[]>;

    const [beregningsresultat, settBeregningsresultat] = useState(
        byggTomRessurs<BeregningsresultatTilsynBarn>()
    );

    // TODO: Finn ut hva denne gjør
    useEffect(() => {
        if (!lagretInnvilgetVedtak) {
            return;
        }
        // utgiftsperiodeState.setValue(initUtgiftsperioder(lagretInnvilgetVedtak));
        formState.setErrors((prevState) => ({
            ...prevState,
            utgiftsperioder: [],
        }));

        // eslint-disable-next-line
    }, [lagretInnvilgetVedtak]);

    const lagreVedtak = (vedtaksRequest: InnvilgeVedtakForBarnetilsyn) => {
        request<null, InnvilgeVedtakForBarnetilsyn>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}`,
            'POST',
            vedtaksRequest
            // eslint-disable-next-line no-console
        ).then((res) => console.log('response: ', res));
    };

    const handleSubmit = (form: FormState<InnvilgeVedtakForm>) => {
        const vedtaksRequest = lagVedtakRequest(form);
        lagreVedtak(vedtaksRequest);
        return form;
    };

    const beregnBarnetilsyn = () => {
        if (formState.customValidate(validerPerioder)) {
            const vedtaksRequest = lagVedtakRequest({
                stønadsperioder: stønadsperioderState.value,
                utgifter: utgifterState.value,
            });
            request<BeregningsresultatTilsynBarn, InnvilgeVedtakForBarnetilsyn>(
                `/api/sak/vedtak/tilsyn-barn/${behandling.id}/beregn`,
                'POST',
                vedtaksRequest
            ).then((res: Ressurs<BeregningsresultatTilsynBarn>) => settBeregningsresultat(res));
        }
    };

    return (
        <Form onSubmit={formState.onSubmit(handleSubmit)}>
            <StønadsperiodeValg
                stønadsperioderState={stønadsperioderState}
                errorState={formState.errors.stønadsperioder}
            />
            <Utgifter
                barnIBehandling={barnIBehandling}
                utgifterState={utgifterState}
                errorState={formState.errors.utgifter}
            />
            <DataViewer response={{ beregningsresultat }}>
                {({ beregningsresultat }) => (
                    <Beregningsresultat beregningsresultat={beregningsresultat} />
                )}
            </DataViewer>
            {behandlingErRedigerbar && (
                <Button type="button" variant="primary" onClick={beregnBarnetilsyn}>
                    Beregn
                </Button>
            )}
            {behandlingErRedigerbar && (
                <Button type="submit" variant="primary">
                    Lagre vedtak
                </Button>
            )}
        </Form>
    );
};
