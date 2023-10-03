import React, { useEffect } from 'react';

import styled from 'styled-components';

import UtgiftsperiodeValg from './Utgiftsperiode/UtgiftsperiodeValg';
import { validerInnvilgetVedtakForm } from './vedtaksvalidering';
import useFormState from '../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../hooks/felles/useListState';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';
import { InnvilgeVedtakForBarnetilsyn, Utgiftsperiode } from '../../../../../typer/vedtak';
import { tomUtgiftsperiodeRad } from '../utils';

export type InnvilgeVedtakForm = {
    utgiftsperioder: Utgiftsperiode[];
    begrunnelse?: string;
};

const Form = styled.form`
    display: flex;
    flex-direction: column;
    gap: 1rem;
`;

const initUtgiftsperioder = (vedtak: InnvilgeVedtakForBarnetilsyn | undefined) =>
    vedtak ? vedtak.perioder : [tomUtgiftsperiodeRad()];

const initFormState = (vedtak: InnvilgeVedtakForBarnetilsyn | undefined) => ({
    utgiftsperioder: initUtgiftsperioder(vedtak),
    begrunnelse: vedtak?.begrunnelse || '',
});

interface Props {
    lagretVedtak?: InnvilgeVedtakForBarnetilsyn;
    settResultatType: (val: BehandlingResultat | undefined) => void;
    låsFraDatoFørsteRad: boolean;
}

export const InnvilgeBarnetilsyn: React.FC<Props> = ({ lagretVedtak }) => {
    // TODO: Prøve å slippe denne castingen
    const lagretInnvilgetVedtak = lagretVedtak as InnvilgeVedtakForBarnetilsyn;

    const formState = useFormState<InnvilgeVedtakForm>(
        initFormState(lagretInnvilgetVedtak),
        validerInnvilgetVedtakForm
    );

    const utgiftsperiodeState = formState.getProps('utgiftsperioder') as ListState<Utgiftsperiode>;

    useEffect(() => {
        if (!lagretInnvilgetVedtak) {
            return;
        }
        utgiftsperiodeState.setValue(initUtgiftsperioder(lagretInnvilgetVedtak));
        formState.setErrors((prevState) => ({
            ...prevState,
            utgiftsperioder: [],
        }));

        // eslint-disable-next-line
    }, [lagretInnvilgetVedtak]);

    return (
        // TODO: HandleSubmit
        <Form>
            <UtgiftsperiodeValg utgiftsperioderState={utgiftsperiodeState} />
        </Form>
    );
};
