import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button, VStack } from '@navikt/ds-react';

import Beregningsresultat from './Beregningsresultat';
import Utgifter from './Utgifter/Utgifter';
import { validerInnvilgetVedtakForm, validerPerioder } from './vedtaksvalidering';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import useFormState from '../../../../../hooks/felles/useFormState';
import { RecordState } from '../../../../../hooks/felles/useRecordState';
import DataViewer from '../../../../../komponenter/DataViewer';
import Panel from '../../../../../komponenter/Panel/Panel';
import { Skillelinje } from '../../../../../komponenter/Skillelinje';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';
import { Steg } from '../../../../../typer/behandling/steg';
import { byggTomRessurs, RessursFeilet, RessursSuksess } from '../../../../../typer/ressurs';
import {
    BeregningsresultatTilsynBarn,
    InnvilgeVedtakForBarnetilsyn,
    Utgift,
} from '../../../../../typer/vedtak';
import { FanePath } from '../../../faner';
import { GrunnlagBarn } from '../../../vilkår';
import { lagVedtakRequest, tomUtgiftPerBarn } from '../utils';

export type InnvilgeVedtakForm = {
    utgifter: Record<string, Utgift[]>;
};

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
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
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
        return request<null, InnvilgeVedtakForBarnetilsyn>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}`,
            'POST',
            vedtaksRequest
        ).finally(() => settLaster(false));
    };

    const validerOgLagreVedtak = (): Promise<RessursSuksess<unknown> | RessursFeilet> => {
        if (formState.validateForm()) {
            const request = lagVedtakRequest({
                utgifter: utgifterState.value,
            });
            return lagreVedtak(request);
        } else {
            return Promise.reject();
        }
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
        <>
            <Panel tittel="Beregning">
                <VStack gap="8">
                    <Utgifter
                        barnIBehandling={barnIBehandling}
                        utgifterState={utgifterState}
                        errorState={formState.errors.utgifter}
                        settValideringsFeil={formState.setErrors}
                    />
                    <Skillelinje />
                    {erStegRedigerbart && (
                        <Knapp
                            type="button"
                            variant="primary"
                            size="small"
                            onClick={beregnBarnetilsyn}
                        >
                            Beregn
                        </Knapp>
                    )}
                    <DataViewer response={{ beregningsresultat }}>
                        {({ beregningsresultat }) => (
                            <Beregningsresultat beregningsresultat={beregningsresultat} />
                        )}
                    </DataViewer>
                </VStack>
            </Panel>
            <StegKnapp
                steg={Steg.BEREGNE_YTELSE}
                nesteFane={FanePath.BREV}
                onNesteSteg={validerOgLagreVedtak}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
        </>
    );
};
