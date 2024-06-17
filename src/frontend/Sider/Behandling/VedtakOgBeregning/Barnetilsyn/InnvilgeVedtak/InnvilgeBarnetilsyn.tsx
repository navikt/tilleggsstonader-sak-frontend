import React, { useState } from 'react';

import styled from 'styled-components';

import { Button, HStack, Link, VStack } from '@navikt/ds-react';

import Beregningsresultat from './Beregningsresultat';
import OppsummeringStønadsperioder from './OppsummeringStønadsperioder';
import Utgifter from './Utgifter/Utgifter';
import { UtgifterLesMer } from './UtgifterLesMer';
import { VarselBarnUnder2År } from './VarselBarnUnder2år';
import { validerInnvilgetVedtakForm, validerPerioder } from './vedtaksvalidering';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import useFormState from '../../../../../hooks/felles/useFormState';
import { RecordState } from '../../../../../hooks/felles/useRecordState';
import { useStønadsperioder } from '../../../../../hooks/useStønadsperioder';
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
import { BarnOppsummering } from '../../../../../typer/vilkårsoppsummering';
import { FanePath } from '../../../faner';
import { lenkerBeregningTilsynBarn } from '../../../lenker';
import { lagVedtakRequest, medEndretKey, tomUtgiftRad } from '../utils';

export type InnvilgeVedtakForm = {
    utgifter: Record<string, Utgift[]>;
};

const Knapp = styled(Button)`
    width: max-content;
`;

const initUtgifter = (
    barnMedOppfylteVilkår: BarnOppsummering[],
    vedtak?: InnvilgelseBarnetilsyn
): Record<string, BarnOppsummering[]> =>
    barnMedOppfylteVilkår.reduce((acc, barn) => {
        const utgiftForBarn = vedtak?.utgifter?.[barn.barnId];
        return {
            ...acc,
            [barn.barnId]: utgiftForBarn ? medEndretKey(utgiftForBarn) : [tomUtgiftRad()],
        };
    }, {});

const initFormState = (
    vedtak: InnvilgelseBarnetilsyn | undefined,
    barnMedOppfylteVilkår: BarnOppsummering[]
) => ({
    utgifter: initUtgifter(barnMedOppfylteVilkår, vedtak),
});

interface Props {
    lagretVedtak?: InnvilgelseBarnetilsyn;
    vilkårsvurderteBarn: BarnOppsummering[];
}

export const HeadingBeregning: React.FC = () => {
    return (
        <HStack gap="4" align={'end'}>
            {lenkerBeregningTilsynBarn.map((lenke, indeks) => (
                <React.Fragment key={indeks}>
                    <Link key={indeks} href={lenke.url} target="_blank" variant="neutral">
                        {lenke.tekst}
                    </Link>
                </React.Fragment>
            ))}
        </HStack>
    );
};

export const InnvilgeBarnetilsyn: React.FC<Props> = ({ lagretVedtak, vilkårsvurderteBarn }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const { stønadsperioder } = useStønadsperioder(behandling.id);

    const barnMedOppfylteVilkår = vilkårsvurderteBarn.filter((barn) => barn.oppfyllerAlleVilkår);

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
            <Panel tittel="Beregning" ekstraHeading={<HeadingBeregning />}>
                <VStack gap="8">
                    <DataViewer response={{ stønadsperioder }}>
                        {({ stønadsperioder }) => (
                            <OppsummeringStønadsperioder stønadsperioder={stønadsperioder} />
                        )}
                    </DataViewer>
                    <UtgifterLesMer />
                    <Utgifter
                        barnMedOppfylteVilkår={barnMedOppfylteVilkår}
                        utgifterState={utgifterState}
                        errorState={formState.errors.utgifter}
                        settValideringsFeil={formState.setErrors}
                    />
                    <Skillelinje />
                    <VarselBarnUnder2År vilkårsvurderteBarn={vilkårsvurderteBarn} />
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
                validerUlagedeKomponenter={false}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
        </>
    );
};
