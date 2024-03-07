import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';

import Beregningsresultat from './Beregningsresultat';
import Utgifter from './Utgifter/Utgifter';
import { validerInnvilgetVedtakForm, validerPerioder } from './vedtaksvalidering';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import useFormState, { FormState } from '../../../../../hooks/felles/useFormState';
import { RecordState } from '../../../../../hooks/felles/useRecordState';
import DataViewer from '../../../../../komponenter/DataViewer';
import Panel from '../../../../../komponenter/Panel/Panel';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';
import { byggTomRessurs } from '../../../../../typer/ressurs';
import {
    BeregningsresultatTilsynBarn,
    InnvilgeVedtakForBarnetilsyn,
    Utgift,
} from '../../../../../typer/vedtak';
import { GrunnlagBarn } from '../../../vilkår';
import { lagVedtakRequest, tomUtgiftPerBarn } from '../utils';

export type InnvilgeVedtakForm = {
    utgifter: Record<string, Utgift[]>;
};

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const InnholdContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2rem;
`;

const Knapp = styled(Button)`
    width: max-content;
`;

const initUtgifter = (
    vedtak: InnvilgeVedtakForBarnetilsyn | undefined,
    barnIBehandling: GrunnlagBarn[]
) => (vedtak ? vedtak.utgifter : tomUtgiftPerBarn(barnIBehandling));

const initFormState = (
    vedtak: InnvilgeVedtakForBarnetilsyn | undefined,
    barnIBehandling: GrunnlagBarn[]
) => ({
    utgifter: initUtgifter(vedtak, barnIBehandling),
});

interface Props {
    lagretVedtak?: InnvilgeVedtakForBarnetilsyn;
    settResultatType: (val: BehandlingResultat | undefined) => void;
    låsFraDatoFørsteRad: boolean;
    barnIBehandling: GrunnlagBarn[];
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

    const utgifterState = formState.getProps('utgifter') as RecordState<Utgift[]>;

    const [laster, settLaster] = useState<boolean>(false);
    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatTilsynBarn>());

    // TODO: Finn ut hva denne gjør
    useEffect(() => {
        if (!lagretInnvilgetVedtak && laster) {
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
        settLaster(true);
        request<null, InnvilgeVedtakForBarnetilsyn>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}`,
            'POST',
            vedtaksRequest
        )
            // eslint-disable-next-line no-console
            .then((res) => console.log('response: ', res))
            .finally(() => settLaster(false));
    };

    const handleSubmit = (form: FormState<InnvilgeVedtakForm>) => {
        const vedtaksRequest = lagVedtakRequest(form);
        lagreVedtak(vedtaksRequest);
        return form;
    };

    const beregnBarnetilsyn = () => {
        if (formState.customValidate(validerPerioder)) {
            const vedtaksRequest = lagVedtakRequest({
                utgifter: utgifterState.value,
            });
            request<BeregningsresultatTilsynBarn, InnvilgeVedtakForBarnetilsyn>(
                `/api/sak/vedtak/tilsyn-barn/${behandling.id}/beregn`,
                'POST',
                vedtaksRequest
            ).then(settBeregningsresultat);
        }
    };

    return (
        <Form onSubmit={formState.onSubmit(handleSubmit)}>
            <Panel tittel="Beregning">
                <InnholdContainer>
                    <Utgifter
                        barnIBehandling={barnIBehandling}
                        utgifterState={utgifterState}
                        errorState={formState.errors.utgifter}
                        settValideringsFeil={formState.setErrors}
                    />
                    <DataViewer response={{ beregningsresultat }}>
                        {({ beregningsresultat }) => (
                            <Beregningsresultat beregningsresultat={beregningsresultat} />
                        )}
                    </DataViewer>
                    {behandlingErRedigerbar && (
                        <Knapp type="button" variant="primary" onClick={beregnBarnetilsyn}>
                            Beregn
                        </Knapp>
                    )}
                </InnholdContainer>
            </Panel>
            {behandlingErRedigerbar && (
                <Knapp type="submit" variant="primary" disabled={laster}>
                    Lagre vedtak
                </Knapp>
            )}
        </Form>
    );
};
