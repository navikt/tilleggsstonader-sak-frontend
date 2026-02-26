import React, { useEffect, useState } from 'react';

import { ErrorMessage, VStack } from '@navikt/ds-react';

import { Beregningsresultat } from './Beregningsresultat';
import { tilVedtaksperioderDto } from './innvilgeDagligReiseUtils';
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
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    BeregnDagligReiseRequest,
    BeregningsresultatDagligReise,
    InnvilgelseDagligReise,
    InnvilgelseDagligReiseRequest,
} from '../../../../../typer/vedtak/vedtakDagligReise';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { StegKnappInnvilgelseMedVarsel } from '../../Felles/StegKnappInnvilgelseMedVarsel';
import { validerVedtaksperioder } from '../../Felles/vedtaksperioder/valideringVedtaksperioder';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import { initialiserVedtaksperioder } from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';

interface Props {
    lagretVedtak?: InnvilgelseDagligReise;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}
export const InnvilgeDagligReise: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

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
        useState(byggTomRessurs<BeregningsresultatDagligReise>());

    const [erVedtaksperioderBeregnet, settErVedtaksperioderBeregnet] = useState(false);
    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState<boolean>();

    const [begrunnelse, settBegrunnelse] = useState<string | undefined>(lagretVedtak?.begrunnelse);

    const gjelderTsr = behandling.stønadstype === Stønadstype.DAGLIG_REISE_TSR;

    useEffect(() => {
        settErVedtaksperioderBeregnet(false);
    }, [vedtaksperioder]);

    const lagreVedtak = () => {
        if (beregningsresultat.status === RessursStatus.SUKSESS && erVedtaksperioderBeregnet) {
            const url = gjelderTsr
                ? `/api/sak/vedtak/daglig-reise/${behandling.id}/tsr/innvilgelse`
                : `/api/sak/vedtak/daglig-reise/${behandling.id}/tso/innvilgelse`;

            return request<null, InnvilgelseDagligReiseRequest>(url, 'POST', {
                type: TypeVedtak.INNVILGELSE,
                vedtaksperioder: tilVedtaksperioderDto(vedtaksperioder, behandling.stønadstype),
                begrunnelse: begrunnelse,
            });
        } else {
            settVisHarIkkeBeregnetFeilmelding(true);
            return Promise.reject();
        }
    };
    const validerForm = (): boolean => {
        const vedtaksperiodeFeil = validerVedtaksperioder(vedtaksperioder, gjelderTsr);
        settVedtaksperiodeFeil(vedtaksperiodeFeil);

        return isValid(vedtaksperiodeFeil);
    };

    const beregnDagligReiseOffentligTransport = () => {
        settVisHarIkkeBeregnetFeilmelding(false);
        settForeslåPeriodeFeil(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settBeregningsresultat(byggHenterRessurs());
            const url = gjelderTsr
                ? `/api/sak/vedtak/daglig-reise/${behandling.id}/tsr/beregn`
                : `/api/sak/vedtak/daglig-reise/${behandling.id}/tso/beregn`;

            request<BeregningsresultatDagligReise, BeregnDagligReiseRequest>(url, 'POST', {
                vedtaksperioder: tilVedtaksperioderDto(
                    vedtaksperioder,
                    behandling.stønadstype
                ) as Vedtaksperiode[],
            }).then((result) => {
                settBeregningsresultat(result);
                if (result.status === 'SUKSESS') {
                    settErVedtaksperioderBeregnet(true);
                }
            });
        }
    };

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
                        gjelderTsr={gjelderTsr}
                    />
                    <Begrunnelsesfelt
                        begrunnelse={begrunnelse}
                        oppdaterBegrunnelse={settBegrunnelse}
                    />
                    {erStegRedigerbart && (
                        <SmallButton onClick={beregnDagligReiseOffentligTransport}>
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
                    beregningsresultat.status === RessursStatus.SUKSESS
                        ? beregningsresultat.data.tidligsteEndring
                        : undefined
                }
            />
        </>
    );
};
