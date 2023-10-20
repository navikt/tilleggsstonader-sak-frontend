import React, { useEffect } from 'react';

import styled from 'styled-components';

import { Button } from '@navikt/ds-react';

import StønadsperiodeValg from './Stønadsperiode/StønadsperiodeValg';
import Utgifter from './Utgifter/Utgifter';
import { validerInnvilgetVedtakForm } from './vedtaksvalidering';
import { useApp } from '../../../../../context/AppContext';
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

    const { request } = useApp();
    const { behandlingErRedigerbar, behandling } = useBehandling();
    // TODO: Prøve å slippe denne castingen
    const lagretInnvilgetVedtak = lagretVedtak as InnvilgeVedtakForBarnetilsyn;
    // const [laster, settLaster] = useState<boolean>(false);
    // const [feilmelding, settFeilmelding] = useState('');

    // const { axiosRequest, nullstillIkkePersisterteKomponenter, settIkkePersistertKomponent } =
    //     useApp();
    // const { utførRedirect } = useRedirectEtterLagring(`/behandling/${behandling.id}/simulering`);

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
        request<null, InnvilgeVedtakForBarnetilsyn>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}`,
            'POST',
            vedtaksRequest
            // eslint-disable-next-line no-console
        ).then((res) => console.log('response: ', res));

        // settLaster(true);
        // nullstillIkkePersisterteKomponenter();
        // axiosRequest<string, InnvilgeVedtakForBarnetilsyn>({
        //     method: 'POST',
        //     url: `/familie-ef-sak/api/vedtak/${behandling.id}/lagre-vedtak`,
        //     data: vedtaksRequest,
        // })
        //     .then(håndterVedtaksresultat())
        //     .finally(() => {
        //         settLaster(false);
        //     });
    };

    // const håndterVedtaksresultat = () => {
    //     return (res: Ressurs<string>) => {
    //         switch (res.status) {
    //             case RessursStatus.SUKSESS:
    //                 utførRedirect();
    //                 hentBehandling.rerun();
    //                 break;
    //             case RessursStatus.HENTER:
    //             case RessursStatus.IKKE_HENTET:
    //                 break;
    //             default:
    //                 // settIkkePersistertKomponent(uuidv4());
    //                 settFeilmelding(res.frontendFeilmelding);
    //         }
    //     };
    // };

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

    // const beregnBarnetilsyn = () => {
    //     if (formState.customValidate(validerPerioder)) {
    //         axiosRequest<IBeregningsperiodeBarnetilsyn[], IBeregningsrequestBarnetilsyn>({
    //             method: 'POST',
    //             url: `/familie-ef-sak/api/beregning/barnetilsyn`,
    //             data: {
    //                 utgiftsperioder: utgiftsperiodeState.value,
    //                 kontantstøtteperioder:
    //                     kontantstøtteState.value === ERadioValg.JA
    //                         ? kontantstøttePeriodeState.value
    //                         : [],
    //                 tilleggsstønadsperioder:
    //                     tilleggsstønadState.value === ERadioValg.JA &&
    //                     stønadsreduksjonState.value === ERadioValg.JA
    //                         ? tilleggsstønadsperiodeState.value
    //                         : [],
    //             },
    //         }).then((res: Ressurs<IBeregningsperiodeBarnetilsyn[]>) => settBeregningsresultat(res));
    //     }
    // };

    // useEffect(() => {
    //     if (!behandlingErRedigerbar) {
    //         axiosRequest<IBeregningsperiodeBarnetilsyn[], null>({
    //             method: 'GET',
    //             url: `/familie-ef-sak/api/beregning/barnetilsyn/${behandling.id}`,
    //         }).then((res: Ressurs<IBeregningsperiodeBarnetilsyn[]>) => settBeregningsresultat(res));
    //     }
    //     // eslint-disable-next-line
    // }, [behandlingErRedigerbar]);

    // useEffect(() => {
    //     if (beregningsresultat.status === RessursStatus.SUKSESS) {
    //         const kontantstøttebeløpOverstigerUtgiftsbeløpForAllePerioder =
    //             blirNullUtbetalingPgaOverstigendeKontantstøtte(beregningsresultat.data);
    //         settNullUtbetalingPgaKontantstøtte(
    //             kontantstøttebeløpOverstigerUtgiftsbeløpForAllePerioder
    //         );
    //         if (kontantstøttebeløpOverstigerUtgiftsbeløpForAllePerioder) {
    //             settResultatType(EBehandlingResultat.INNVILGE_UTEN_UTBETALING);
    //         } else {
    //             settResultatType(EBehandlingResultat.INNVILGE);
    //         }
    //     }
    // }, [beregningsresultat, settResultatType]);

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
        // begrunnelseState={begrunnelseState}
        // errorState={formState.errors}
        // settValideringsFeil={formState.setErrors}
        // barn={barn}
        // låsFraDatoFørsteRad={låsFraDatoFørsteRad}
        // />
        /* <KontantstøtteValg
                erLesevisning={!behandlingErRedigerbar}
                kontantstøtte={kontantstøtteState}
                kontantstøttePerioder={kontantstøttePeriodeState}
                settValideringsFeil={formState.setErrors}
                valideringsfeil={formState.errors}
                finnesKontantstøtteUtbetaling={finnesKontantstøtteUtbetaling}
    );
            <TilleggsstønadValg
                erLesevisning={!behandlingErRedigerbar}
                settValideringsfeil={formState.setErrors}
                stønadsreduksjon={stønadsreduksjonState}
                tilleggsstønad={tilleggsstønadState}
                tilleggsstønadBegrunnelse={tilleggsstønadBegrunnelseState}
                tilleggsstønadPerioder={tilleggsstønadsperiodeState}
                valideringsfeil={formState.errors}
            /> */
        /* {behandlingErRedigerbar && (
                <div>
                    <Knapp
                        variant={'secondary'}
                        onClick={beregnBarnetilsyn}
                        type={'button'}
                        icon={<CalculatorIcon title={'beregn'} />}
                        iconPosition={'right'}
                    >
                        Beregn
                    </Knapp>
                    {feilmelding && <AlertError>{feilmelding}</AlertError>}
                </div>
            )} */
        /* <Utregningstabell beregningsresultat={beregningsresultat} />
            {behandlingErRedigerbar && <HovedKnapp disabled={laster} knappetekst="Lagre vedtak" />} */
    );
};
