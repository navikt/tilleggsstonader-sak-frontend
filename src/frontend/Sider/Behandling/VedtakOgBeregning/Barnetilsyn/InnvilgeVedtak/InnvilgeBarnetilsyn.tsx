import React, { useState } from 'react';

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
import { Steg } from '../../../../../typer/behandling/steg';
import { byggTomRessurs, RessursFeilet, RessursSuksess } from '../../../../../typer/ressurs';
import {
    BeregningsresultatTilsynBarn,
    InnvilgeBarnetilsynRequest,
    InnvilgelseBarnetilsyn,
    Utgift,
} from '../../../../../typer/vedtak';
import { FanePath } from '../../../faner';
import { GrunnlagBarn } from '../../../vilkår';
import { lagVedtakRequest, medEndretKey, tomUtgiftRad } from '../utils';

export type InnvilgeVedtakForm = {
    utgifter: Record<string, Utgift[]>;
};

const Knapp = styled(Button)`
    width: max-content;
`;

const initUtgifter = (
    barnMedOppfylteVilkår: GrunnlagBarn[],
    vedtak?: InnvilgelseBarnetilsyn
): Record<string, Utgift[]> =>
    barnMedOppfylteVilkår.reduce((acc, barn) => {
        const utgiftForBarn = vedtak?.utgifter?.[barn.barnId];
        return {
            ...acc,
            [barn.barnId]: utgiftForBarn ? medEndretKey(utgiftForBarn) : [tomUtgiftRad()],
        };
    }, {});

const initFormState = (
    vedtak: InnvilgelseBarnetilsyn | undefined,
    barnMedOppfylteVilkår: GrunnlagBarn[]
) => ({
    utgifter: initUtgifter(barnMedOppfylteVilkår, vedtak),
});

interface Props {
    lagretVedtak?: InnvilgelseBarnetilsyn;
    barnMedOppfylteVilkår: GrunnlagBarn[];
}

export const InnvilgeBarnetilsyn: React.FC<Props> = ({ lagretVedtak, barnMedOppfylteVilkår }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const formState = useFormState<InnvilgeVedtakForm>(
        initFormState(lagretVedtak, barnMedOppfylteVilkår),
        validerInnvilgetVedtakForm
    );

    const utgifterState = formState.getProps('utgifter') as RecordState<Utgift[]>;

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatTilsynBarn>());

    const lagreVedtak = (vedtaksRequest: InnvilgeBarnetilsynRequest) => {
        return request<null, InnvilgeBarnetilsynRequest>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}`,
            'POST',
            vedtaksRequest
        );
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
            request<BeregningsresultatTilsynBarn, InnvilgeBarnetilsynRequest>(
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
                        barnMedOppfylteVilkår={barnMedOppfylteVilkår}
                        utgifterState={utgifterState}
                        errorState={formState.errors.utgifter}
                        settValideringsFeil={formState.setErrors}
                    />
                    <Skillelinje />
                    {erStegRedigerbart && (
                        <>
                            <Knapp
                                type="button"
                                variant="primary"
                                size="small"
                                onClick={beregnBarnetilsyn}
                            >
                                Beregn
                            </Knapp>
                            <DataViewer response={{ beregningsresultat }}>
                                {({ beregningsresultat }) => (
                                    <Beregningsresultat beregningsresultat={beregningsresultat} />
                                )}
                            </DataViewer>
                        </>
                    )}
                    {!erStegRedigerbart && lagretVedtak?.beregningsresultat && (
                        <Beregningsresultat beregningsresultat={lagretVedtak?.beregningsresultat} />
                    )}
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
