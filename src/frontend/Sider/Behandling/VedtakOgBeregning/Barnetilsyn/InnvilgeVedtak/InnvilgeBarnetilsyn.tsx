import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';

import StønadsperiodeValg from './Stønadsperiode/StønadsperiodeValg';
import Utgifter from './Utgifter/Utgifter';
import { validerInnvilgetVedtakForm } from './vedtaksvalidering';
import { useBehandling } from '../../../../../context/BehandlingContext';
import useFormState, { FormState } from '../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../hooks/felles/useListState';
import { RecordState } from '../../../../../hooks/felles/useRecordState';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';
import {
    InnvilgeVedtakForBarnetilsyn,
    Stønadsperiode,
    Utgift,
    VedtakType,
} from '../../../../../typer/vedtak';
import { Barn } from '../../../vilkår';
import { tomStønadsperiodeRad, tomUtgiftPerBarn } from '../utils';

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
    utgiftsperioder: initUtgiftsperioder(vedtak),
    begrunnelse: vedtak?.begrunnelse || '',
});

interface Props {
    lagretVedtak?: InnvilgeVedtakForBarnetilsyn;
    settResultatType: (val: BehandlingResultat | undefined) => void;
    låsFraDatoFørsteRad: boolean;
}

export const InnvilgeBarnetilsyn: React.FC<Props> = ({ lagretVedtak }) => {
    const barnIBehandling = [
        { barnId: 'id1', registergrunnlag: { navn: 'Ronja Røverdatter' } },
        { barnId: 'id2', registergrunnlag: { navn: 'Espen Askeladden' } },
    ];

    const { behandlingErRedigerbar } = useBehandling();
    // TODO: Prøve å slippe denne castingen
    const lagretInnvilgetVedtak = lagretVedtak as InnvilgeVedtakForBarnetilsyn;

    const formState = useFormState<InnvilgeVedtakForm>(
        initFormState(lagretInnvilgetVedtak, barnIBehandling),
        validerInnvilgetVedtakForm
    );

    const stønadsperioderState = formState.getProps('stønadsperioder') as ListState<Stønadsperiode>;
    const utgifterState = formState.getProps('utgifter') as RecordState<Utgift[]>;

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
        // eslint-disable-next-line no-console
        console.log('Lagre', vedtaksRequest);
    };

    const handleSubmit = (form: FormState<InnvilgeVedtakForm>) => {
        const vedtaksRequest: InnvilgeVedtakForBarnetilsyn = {
            stønadsperioder: form.stønadsperioder,
            utgifter: form.utgifter,
            _type: VedtakType.InnvilgelseBarnetilsyn,
            resultatType: BehandlingResultat.INNVILGET,
        };
        lagreVedtak(vedtaksRequest);
        return form;
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
            {behandlingErRedigerbar && (
                <Button type="submit" variant="primary">
                    Lagre vedtak
                </Button>
            )}
        </Form>
    );
};
