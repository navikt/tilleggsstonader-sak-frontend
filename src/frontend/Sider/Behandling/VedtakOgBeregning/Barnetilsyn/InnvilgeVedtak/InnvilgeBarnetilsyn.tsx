import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';

import UtgiftsperiodeValg from './Utgiftsperiode/UtgiftsperiodeValg';
import { validerInnvilgetVedtakForm } from './vedtaksvalidering';
import { useBehandling } from '../../../../../context/BehandlingContext';
import useFormState, { FormState } from '../../../../../hooks/felles/useFormState';
import { ListState } from '../../../../../hooks/felles/useListState';
import { BehandlingResultat } from '../../../../../typer/behandling/behandlingResultat';
import {
    InnvilgeVedtakForBarnetilsyn,
    Utgiftsperiode,
    VedtakType,
} from '../../../../../typer/vedtak';
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
    const { behandlingErRedigerbar } = useBehandling();
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

    const lagreVedtak = (vedtaksRequest: InnvilgeVedtakForBarnetilsyn) => {
        // eslint-disable-next-line no-console
        console.log('Lagre', vedtaksRequest);
    };

    const handleSubmit = (form: FormState<InnvilgeVedtakForm>) => {
        const vedtaksRequest: InnvilgeVedtakForBarnetilsyn = {
            perioder: form.utgiftsperioder,
            // begrunnelse: form.begrunnelse,
            _type: VedtakType.InnvilgelseBarnetilsyn,
            resultatType: BehandlingResultat.INNVILGET,
        };
        lagreVedtak(vedtaksRequest);
        return form;
    };

    return (
        // TODO: HandleSubmit
        <Form onSubmit={formState.onSubmit(handleSubmit)}>
            <UtgiftsperiodeValg
                utgiftsperioderState={utgiftsperiodeState}
                errorState={formState.errors}
            />
            {behandlingErRedigerbar && (
                <Button type="submit" variant="primary">
                    Lagre vedtak
                </Button>
            )}
        </Form>
    );
};
