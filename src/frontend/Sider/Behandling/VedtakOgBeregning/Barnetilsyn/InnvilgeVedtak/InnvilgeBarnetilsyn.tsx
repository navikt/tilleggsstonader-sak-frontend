import React, { useEffect, useState } from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';
import { AWhite } from '@navikt/ds-tokens/dist/tokens';

import Beregningsresultat from './Beregningsresultat';
import StønadsperiodeValg from './Stønadsperiode/StønadsperiodeValg';
import Utgifter from './Utgifter/Utgifter';
import { validerInnvilgetVedtakForm, validerPerioder } from './vedtaksvalidering';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import useFormState, { FormState } from '../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../hooks/felles/useListState';
import DataViewer from '../../../../../komponenter/DataViewer';
import EkspanderbartPanel from '../../../../../komponenter/EkspanderbartPanel';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';
import { byggTomRessurs, RessursStatus } from '../../../../../typer/ressurs';
import {
    BeregningsresultatTilsynBarn,
    InnvilgeVedtakForBarnetilsyn,
    Stønadsperiode,
} from '../../../../../typer/vedtak';
import { GrunnlagBarn, Vilkårsresultat } from '../../../vilkår';
import {
    lagVedtakRequest,
    tomStønadsperiodeRad,
    tomUtgiftPerBarn,
    UtgifterPerBarn,
} from '../utils';

export type InnvilgeVedtakForm = {
    stønadsperioder: Stønadsperiode[];
    utgifterPerBarn: UtgifterPerBarn[];
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

const Divider = styled.hr`
    width: 100%;
    border-top: 1px solid ${AWhite};
`;

const Knapp = styled(Button)`
    width: max-content;
`;

const initStønadsperioder = (vedtak: InnvilgeVedtakForBarnetilsyn | undefined) =>
    vedtak ? vedtak.stønadsperioder : [tomStønadsperiodeRad()];

const utgiftPerBarn = (
    vedtak: InnvilgeVedtakForBarnetilsyn,
    barnIBehandling: GrunnlagBarn[]
): UtgifterPerBarn[] =>
    Object.entries(vedtak.utgifter).map(([barnId, utgifter]) => {
        const barn = barnIBehandling.find((b) => b.barnId === barnId);
        if (!barn) {
            throw 'Finner ikke barn';
        }
        return {
            barnId,
            utgifter,
        };
    });

const initUtgifter = (
    vedtak: InnvilgeVedtakForBarnetilsyn | undefined,
    barnIBehandling: GrunnlagBarn[]
): UtgifterPerBarn[] =>
    vedtak ? utgiftPerBarn(vedtak, barnIBehandling) : tomUtgiftPerBarn(barnIBehandling);

const initFormState = (
    vedtak: InnvilgeVedtakForBarnetilsyn | undefined,
    barnIBehandling: GrunnlagBarn[]
): InnvilgeVedtakForm => ({
    stønadsperioder: initStønadsperioder(vedtak),
    utgifterPerBarn: initUtgifter(vedtak, barnIBehandling),
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

    const stønadsperioderState = formState.getProps('stønadsperioder') as ListState<Stønadsperiode>;
    const utgifterState = formState.getProps('utgifterPerBarn') as ListState<UtgifterPerBarn>;

    const [laster, settLaster] = useState<boolean>(false);
    const [beregningsresultat, settBeregningsresultat] = useState(
        byggTomRessurs<BeregningsresultatTilsynBarn>()
    );

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
                stønadsperioder: stønadsperioderState.value,
                utgifterPerBarn: utgifterState.value,
            });
            request<BeregningsresultatTilsynBarn, InnvilgeVedtakForBarnetilsyn>(
                `/api/sak/vedtak/tilsyn-barn/${behandling.id}/beregn`,
                'POST',
                vedtaksRequest
            ).then(settBeregningsresultat);
        }
    };

    // TODO: Finn ut hva vi vil skal være statuser her
    const beregningsstatus =
        beregningsresultat.status === RessursStatus.SUKSESS
            ? Vilkårsresultat.OPPFYLT
            : Vilkårsresultat.IKKE_TATT_STILLING_TIL;

    return (
        <Form onSubmit={formState.onSubmit(handleSubmit)}>
            <EkspanderbartPanel tittel="Beregning" resultat={beregningsstatus}>
                <InnholdContainer>
                    <StønadsperiodeValg
                        stønadsperioderState={stønadsperioderState}
                        errorState={formState.errors.stønadsperioder}
                        settValideringsFeil={formState.setErrors}
                    />
                    <Divider />
                    <Utgifter
                        barnIBehandling={barnIBehandling}
                        utgifterState={utgifterState}
                        errorState={formState.errors.utgifterPerBarn}
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
            </EkspanderbartPanel>
            {behandlingErRedigerbar && (
                <Knapp type="submit" variant="primary" disabled={laster}>
                    Lagre vedtak
                </Knapp>
            )}
        </Form>
    );
};
