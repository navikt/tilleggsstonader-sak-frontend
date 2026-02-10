import React, { useEffect, useState } from 'react';

import { ErrorMessage, VStack } from '@navikt/ds-react';

import { BekreftNyBeregningModal } from './BekreftNyBeregningModal';
import { Beregningsresultat } from './Beregningsresultat';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors, isValid } from '../../../../../hooks/felles/useFormState';
import { useMapById } from '../../../../../hooks/useMapById';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../../komponenter/Panel/Panel';
import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '../../../../../typer/ressurs';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    BeregningsresultatLæremidler,
    InnvilgelseLæremidler,
    InnvilgelseLæremidlerRequest,
} from '../../../../../typer/vedtak/vedtakLæremidler';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { StegKnappInnvilgelseMedVarselOmVedtakIArena } from '../../Felles/StegKnappInnvilgelseMedVarselOmVedtakIArena';
import { validerVedtaksperioder } from '../../Felles/vedtaksperioder/valideringVedtaksperioder';
import {
    tilVedtaksperioderTso,
    VedtaksperiodeTso,
} from '../../Felles/vedtaksperioder/vedtaksperiodeDtoUtil';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import { initialiserVedtaksperioder } from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';

export const InnvilgeLæremidler: React.FC<{
    lagretVedtak: InnvilgelseLæremidler | undefined;
    vedtaksperioderForrigeBehandling: Vedtaksperiode[] | undefined;
}> = ({ lagretVedtak, vedtaksperioderForrigeBehandling }) => {
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
    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState<boolean>();

    const [visNyBeregningVarsel, settVisNyBeregningVarsel] = useState<boolean>(false);

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatLæremidler>());

    const [vedtaksperiodeFeil, settVedtaksperiodeFeil] = useState<FormErrors<Vedtaksperiode>[]>();
    const [foreslåPeriodeFeil, settForeslåPeriodeFeil] = useState<Feil>();

    const [erVedtaksperioderBeregnet, settErVedtaksperioderBeregnet] = useState(false);

    const [begrunnelse, settBegrunnelse] = useState<string | undefined>(lagretVedtak?.begrunnelse);

    useEffect(() => {
        settErVedtaksperioderBeregnet(false);
    }, [vedtaksperioder]);

    const lagreVedtak = () => {
        if (beregningsresultat.status === RessursStatus.SUKSESS && erVedtaksperioderBeregnet) {
            return request<null, InnvilgelseLæremidlerRequest>(
                `/api/sak/vedtak/laremidler/${behandling.id}/innvilgelse`,
                'POST',
                {
                    type: TypeVedtak.INNVILGELSE,
                    vedtaksperioder: tilVedtaksperioderTso(vedtaksperioder),
                    begrunnelse: begrunnelse,
                }
            );
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

    /*
    Den nye beregningen kan føre til en periode mindre utbetalt enn forespeilet
    for behandlinger som har endringer før 1. januar 2026.
    Saksbehandler skal derfor varsles om dette.
    Varselet kan fjernes når vi er sikre på at saksbehandler ikke lenger endrer på vedtak før 1. januar 2026
     */
    const håndterSkalViseNyBeregningVarsel = (tidligsteEndring: string | undefined) => {
        if (tidligsteEndring && new Date(tidligsteEndring) < new Date('2026-01-01')) {
            settVisNyBeregningVarsel(true);
        }
    };

    const beregnLæremidler = () => {
        settVisHarIkkeBeregnetFeilmelding(false);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settBeregningsresultat(byggHenterRessurs());

            request<BeregningsresultatLæremidler, VedtaksperiodeTso[]>(
                `/api/sak/vedtak/laremidler/${behandling.id}/beregn`,
                'POST',
                tilVedtaksperioderTso(vedtaksperioder)
            ).then((result) => {
                settBeregningsresultat(result);
                if (result.status === 'SUKSESS') {
                    håndterSkalViseNyBeregningVarsel(result.data.tidligsteEndring);
                    settErVedtaksperioderBeregnet(true);
                }
            });
        }
    };

    return (
        <>
            <Panel tittel="Beregning og vedtaksperiode">
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
                <Begrunnelsesfelt begrunnelse={begrunnelse} oppdaterBegrunnelse={settBegrunnelse} />
                {erStegRedigerbart && <SmallButton onClick={beregnLæremidler}>Beregn</SmallButton>}
                <VStack gap="8">
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

            <StegKnappInnvilgelseMedVarselOmVedtakIArena
                lagreVedtak={lagreVedtak}
                vedtaksperioder={vedtaksperioder}
                tidligsteEndring={
                    beregningsresultat.status === RessursStatus.SUKSESS
                        ? beregningsresultat.data.tidligsteEndring
                        : undefined
                }
            />
            <BekreftNyBeregningModal
                visBekreftModal={visNyBeregningVarsel}
                settVisBekreftModal={settVisNyBeregningVarsel}
            />
        </>
    );
};
