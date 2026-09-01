import React, { useEffect, useState } from 'react';

import { ErrorMessage, VStack } from '@navikt/ds-react';

import { Beregningsresultat } from './Beregningsresultat/Beregningsresultat';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors, isValid } from '../../../../../hooks/felles/useFormState';
import { useMapById } from '../../../../../hooks/useMapById';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../../komponenter/Panel/Panel';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '../../../../../typer/ressurs';
import { BeregningsplanOmfang } from '../../../../../typer/vedtak/beregningsplan';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    BeregningReiseOppstartAvslutningHjemreise,
    BeregnReiseOppstartAvslutningHjemreiseRequest,
    InnvilgeReiseOppstartAvslutningHjemreiseRequest,
    InnvilgelseReiseOppstartAvslutningHjemreise,
} from '../../../../../typer/vedtak/vedtakReiseOppstartAvslutningHjemreise';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { StegKnappInnvilgelseMedVarsel } from '../../Felles/StegKnappInnvilgelseMedVarsel';
import { validerVedtaksperioder } from '../../Felles/vedtaksperioder/valideringVedtaksperioder';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import { initialiserVedtaksperioder } from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';

interface Props {
    lagretVedtak?: InnvilgelseReiseOppstartAvslutningHjemreise;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}
export const InnvilgeReiseOppstartAvslutningHjemreise: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const gjelderTsr =
        behandling.stønadstype === Stønadstype.REISE_OPPSTART_AVSLUTNING_HJEMREISE_TSR;

    const [vedtaksperioder, settVedtaksperioder] = useState<Vedtaksperiode[]>(
        initialiserVedtaksperioder(
            lagretVedtak?.vedtaksperioder || vedtaksperioderForrigeBehandling
        )
    );
    const lagredeVedtaksperioder = useMapById(
        lagretVedtak?.vedtaksperioder || vedtaksperioderForrigeBehandling || []
    );

    const [vedtaksperiodeFeil, settVedtaksperiodeFeil] = useState<FormErrors<Vedtaksperiode>[]>();
    const [foreslåPeriodeFeil, settForeslåPeriodeFeil] = useState<Feil>();

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningReiseOppstartAvslutningHjemreise>());
    const [erVedtaksperioderBeregnet, settErVedtaksperioderBeregnet] = useState(false);
    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState<boolean>();

    const [begrunnelse, settBegrunnelse] = useState<string | undefined>(lagretVedtak?.begrunnelse);

    useEffect(() => {
        settErVedtaksperioderBeregnet(false);
    }, [vedtaksperioder]);

    const lagreVedtak = () => {
        if (beregningsresultat.status === RessursStatus.SUKSESS && erVedtaksperioderBeregnet) {
            const url = gjelderTsr
                ? `/api/sak/vedtak/reise-oppstart-avslutning-hjemreise/${behandling.id}/tsr/innvilgelse`
                : `/api/sak/vedtak/reise-oppstart-avslutning-hjemreise/${behandling.id}/tso/innvilgelse`;

            return request<null, InnvilgeReiseOppstartAvslutningHjemreiseRequest>(url, 'POST', {
                type: TypeVedtak.INNVILGELSE,
                vedtaksperioder: vedtaksperioder,
                begrunnelse: begrunnelse,
            });
        } else {
            settVisHarIkkeBeregnetFeilmelding(true);
            return Promise.reject();
        }
    };

    const validerForm = (): boolean => {
        const vedtaksperiodeFeil = validerVedtaksperioder(vedtaksperioder);
        settVedtaksperiodeFeil(vedtaksperiodeFeil);

        return isValid(vedtaksperiodeFeil);
    };
    const beregnReiseOppstartAvslutningHjemreise = () => {
        settVisHarIkkeBeregnetFeilmelding(false);
        settForeslåPeriodeFeil(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settBeregningsresultat(byggHenterRessurs());
            const url = gjelderTsr
                ? `/api/sak/vedtak/reise-oppstart-avslutning-hjemreise/${behandling.id}/tsr/beregn`
                : `/api/sak/vedtak/reise-oppstart-avslutning-hjemreise/${behandling.id}/tso/beregn`;
            request<
                BeregningReiseOppstartAvslutningHjemreise,
                BeregnReiseOppstartAvslutningHjemreiseRequest
            >(url, 'POST', {
                vedtaksperioder,
            }).then((result) => {
                settBeregningsresultat(result);
                if (result.status === 'SUKSESS') {
                    settErVedtaksperioderBeregnet(true);
                }
            });
        }
    };

    const beregningsplan = lagretVedtak?.beregningsresultat?.beregningsplan;
    return (
        <>
            <Panel tittel="Beregning og vedtaksperiode">
                <VStack gap={'space-32'}>
                    <Vedtaksperioder
                        vedtaksperioder={vedtaksperioder}
                        lagredeVedtaksperioder={lagredeVedtaksperioder}
                        settVedtaksperioder={settVedtaksperioder}
                        vedtaksperioderFeil={vedtaksperiodeFeil}
                        settVedtaksperioderFeil={settVedtaksperiodeFeil}
                        foreslåPeriodeFeil={foreslåPeriodeFeil}
                        settForeslåPeriodeFeil={settForeslåPeriodeFeil}
                        vedtakErLagret={lagretVedtak !== undefined}
                    />
                    <Begrunnelsesfelt
                        begrunnelse={begrunnelse}
                        oppdaterBegrunnelse={settBegrunnelse}
                    />
                    {erStegRedigerbart && (
                        <SmallButton onClick={beregnReiseOppstartAvslutningHjemreise}>
                            Beregn
                        </SmallButton>
                    )}
                    {erStegRedigerbart && (
                        <DataViewer type={'beregningsresultat'} response={{ beregningsresultat }}>
                            {({ beregningsresultat }) => (
                                <Beregningsresultat beregningsresultat={beregningsresultat} />
                            )}
                        </DataViewer>
                    )}
                    {!erStegRedigerbart && lagretVedtak?.beregningsresultat && (
                        <Beregningsresultat beregningsresultat={lagretVedtak.beregningsresultat} />
                    )}
                </VStack>
            </Panel>
            {visHarIkkeBeregnetFeilmelding && !erVedtaksperioderBeregnet && (
                <ErrorMessage>{'Du må beregne før du kan gå videre'}</ErrorMessage>
            )}
            <StegKnappInnvilgelseMedVarsel
                lagreVedtak={lagreVedtak}
                vedtaksperioder={vedtaksperioder}
                lagredeVedtaksperioder={lagredeVedtaksperioder}
                vedtakErLagret={lagretVedtak !== undefined}
                tidligsteEndring={
                    beregningsplan?.omfang === BeregningsplanOmfang.FRA_DATO
                        ? beregningsplan.tidligsteEndring
                        : undefined
                }
            />
        </>
    );
};
