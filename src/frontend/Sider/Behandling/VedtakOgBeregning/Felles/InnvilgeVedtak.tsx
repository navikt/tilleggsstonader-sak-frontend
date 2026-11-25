import React, { ReactElement, ReactNode, useRef, useState } from 'react';

import { ErrorMessage, VStack } from '@navikt/ds-react';

import { Begrunnelsesfelt } from './Begrunnelsesfelt';
import { StegKnappInnvilgelseMedVarsel } from './StegKnappInnvilgelseMedVarsel';
import { validerVedtaksperioder } from './vedtaksperioder/valideringVedtaksperioder';
import { Vedtaksperioder } from './vedtaksperioder/Vedtaksperioder';
import {
    initialiserVedtaksperioder,
    tilVedtaksperioderDto,
} from './vedtaksperioder/vedtaksperiodeUtils';
import { useApp } from '../../../../context/AppContext';
import { useBehandling } from '../../../../context/BehandlingContext';
import { useSteg } from '../../../../context/StegContext';
import { FormErrors, isValid } from '../../../../hooks/felles/useFormState';
import { useMapById } from '../../../../hooks/useMapById';
import DataViewer from '../../../../komponenter/DataViewer';
import { Feil } from '../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../komponenter/Panel/Panel';
import {
    byggHenterRessurs,
    byggRessursFeilet,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../../../typer/ressurs';
import { InnvilgelseRequest, Vedtaksperiode } from '../../../../typer/vedtak/vedtakperiode';

interface LagretInnvilgelse<TBeregningsresultat> {
    vedtaksperioder: Vedtaksperiode[];
    beregningsresultat?: TBeregningsresultat;
    begrunnelse?: string;
}

interface Props<TBeregningsresultat> {
    lagretVedtak?: LagretInnvilgelse<TBeregningsresultat>;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
    /** Base-url for vedtaket. `/beregn` og `/innvilgelse` legges til. */
    vedtakUrl: string;
    skjulAktivitet?: boolean;
    visBeregningsresultat: (beregningsresultat: TBeregningsresultat) => ReactElement;
    /** Fast verdi, eller utledet fra et vellykket beregningsresultat. */
    tidligsteEndring?: string | ((beregningsresultat: TBeregningsresultat) => string | undefined);
    /** Overstyr body til beregn-kallet. Standard er `{ vedtaksperioder }`. */
    lagBeregnRequest?: (vedtaksperioder: Vedtaksperiode[]) => unknown;
    onBeregnet?: (beregningsresultat: TBeregningsresultat) => void;
    panelTittel?: string;
    kontekstmeny?: ReactNode;
    /** Rendres etter stegknappen, f.eks. modaler. */
    children?: ReactNode;
}

export function InnvilgeVedtak<TBeregningsresultat>({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
    vedtakUrl,
    skjulAktivitet = false,
    visBeregningsresultat,
    tidligsteEndring,
    lagBeregnRequest,
    onBeregnet,
    panelTittel = 'Beregning og vedtaksperiode',
    kontekstmeny,
    children,
}: Props<TBeregningsresultat>) {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const [vedtaksperioder, settVedtaksperioder] = useState(
        initialiserVedtaksperioder(
            lagretVedtak?.vedtaksperioder || vedtaksperioderForrigeBehandling
        )
    );
    const lagredeVedtaksperioder = useMapById(
        lagretVedtak?.vedtaksperioder || vedtaksperioderForrigeBehandling || []
    );
    const [vedtaksperiodeFeil, settVedtaksperiodeFeil] = useState<FormErrors<Vedtaksperiode>[]>();
    const [foreslåPeriodeFeil, settForeslåPeriodeFeil] = useState<Feil>();
    const [begrunnelse, settBegrunnelse] = useState(lagretVedtak?.begrunnelse);
    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState(false);

    // Resultatet knyttes til periodene det ble beregnet for. Endres periodene, er resultatet utdatert.
    const [beregning, settBeregning] = useState<{
        perioder: Vedtaksperiode[];
        resultat: Ressurs<TBeregningsresultat>;
    }>();
    const beregningId = useRef(0);
    const beregningsresultat =
        beregning?.perioder === vedtaksperioder
            ? beregning.resultat
            : byggTomRessurs<TBeregningsresultat>();

    const beregn = () => {
        const id = ++beregningId.current;
        settVisHarIkkeBeregnetFeilmelding(false);
        settForeslåPeriodeFeil(undefined);
        const feil = validerVedtaksperioder(vedtaksperioder, skjulAktivitet);
        settVedtaksperiodeFeil(feil);

        if (vedtaksperioder.length === 0 || !isValid(feil)) {
            settBeregning({
                perioder: vedtaksperioder,
                resultat: byggRessursFeilet(
                    vedtaksperioder.length === 0
                        ? 'Du må legge til minst én vedtaksperiode før du kan beregne'
                        : 'Du må rette feilene i vedtaksperiodene før du kan beregne'
                ),
            });
            return;
        }

        settBeregning({ perioder: vedtaksperioder, resultat: byggHenterRessurs() });
        const vedtaksperioderDto = tilVedtaksperioderDto(vedtaksperioder, behandling.stønadstype);
        request<TBeregningsresultat, unknown>(
            `${vedtakUrl}/beregn`,
            'POST',
            lagBeregnRequest
                ? lagBeregnRequest(vedtaksperioder)
                : { vedtaksperioder: vedtaksperioderDto }
        ).then((resultat) => {
            // Ignorer svar fra en eldre beregning som kommer etter en nyere
            if (id === beregningId.current) {
                settBeregning({ perioder: vedtaksperioder, resultat });
                if (resultat.status === RessursStatus.SUKSESS) {
                    onBeregnet?.(resultat.data);
                }
            }
        });
    };

    const lagreVedtak = () => {
        if (beregningsresultat.status !== RessursStatus.SUKSESS) {
            settVisHarIkkeBeregnetFeilmelding(true);
            return Promise.reject();
        }

        return request<null, InnvilgelseRequest>(`${vedtakUrl}/innvilgelse`, 'POST', {
            vedtaksperioder: tilVedtaksperioderDto(vedtaksperioder, behandling.stønadstype),
            begrunnelse,
        });
    };

    return (
        <>
            <Panel tittel={panelTittel} kontekstmeny={kontekstmeny}>
                <VStack gap="space-32">
                    <Vedtaksperioder
                        vedtaksperioder={vedtaksperioder}
                        lagredeVedtaksperioder={lagredeVedtaksperioder}
                        settVedtaksperioder={settVedtaksperioder}
                        vedtaksperioderFeil={vedtaksperiodeFeil}
                        settVedtaksperioderFeil={settVedtaksperiodeFeil}
                        foreslåPeriodeFeil={foreslåPeriodeFeil}
                        settForeslåPeriodeFeil={settForeslåPeriodeFeil}
                        vedtakErLagret={lagretVedtak !== undefined}
                        skjulAktivitet={skjulAktivitet}
                    />
                    <Begrunnelsesfelt
                        begrunnelse={begrunnelse}
                        oppdaterBegrunnelse={settBegrunnelse}
                    />
                    {erStegRedigerbart ? (
                        <>
                            <SmallButton
                                onClick={beregn}
                                loading={beregningsresultat.status === RessursStatus.HENTER}
                                disabled={beregningsresultat.status === RessursStatus.HENTER}
                            >
                                Beregn
                            </SmallButton>
                            <DataViewer type="beregningsresultat" response={{ beregningsresultat }}>
                                {({ beregningsresultat }) =>
                                    visBeregningsresultat(beregningsresultat)
                                }
                            </DataViewer>
                        </>
                    ) : (
                        lagretVedtak?.beregningsresultat &&
                        visBeregningsresultat(lagretVedtak.beregningsresultat)
                    )}
                </VStack>
            </Panel>
            {visHarIkkeBeregnetFeilmelding && (
                <ErrorMessage>Du må beregne før du kan gå videre</ErrorMessage>
            )}
            <StegKnappInnvilgelseMedVarsel
                lagreVedtak={lagreVedtak}
                vedtaksperioder={vedtaksperioder}
                lagredeVedtaksperioder={lagredeVedtaksperioder}
                vedtakErLagret={lagretVedtak !== undefined}
                tidligsteEndring={
                    typeof tidligsteEndring === 'function'
                        ? beregningsresultat.status === RessursStatus.SUKSESS
                            ? tidligsteEndring(beregningsresultat.data)
                            : undefined
                        : tidligsteEndring
                }
            />
            {children}
        </>
    );
}
