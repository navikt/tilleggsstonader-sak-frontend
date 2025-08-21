import React, { useEffect, useState } from 'react';

import { ErrorMessage, VStack } from '@navikt/ds-react';

import BeregningsresultatContainer from './BeregningsresultatContainer';
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
import {
    BeregnBoutgifterRequest,
    BeregningsresultatBoutgifter,
    InnvilgeBoutgifterRequest,
    InnvilgelseBoutgifter,
} from '../../../../../typer/vedtak/vedtakBoutgifter';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { StegKnappInnvilgelseMedVarselOmVedtakIArena } from '../../Felles/StegKnappInnvilgelseMedVarselOmVedtakIArena';
import { validerVedtaksperioder } from '../../Felles/vedtaksperioder/valideringVedtaksperioder';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import { initialiserVedtaksperioder } from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';

interface Props {
    lagretVedtak?: InnvilgelseBoutgifter;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}

export const InnvilgeBoutgifter: React.FC<Props> = ({
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
        useState(byggTomRessurs<BeregningsresultatBoutgifter>());

    const [erVedtaksperioderBeregnet, settErVedtaksperioderBeregnet] = useState(false);
    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState<boolean>();

    const [begrunnelse, settBegrunnelse] = useState<string | undefined>(lagretVedtak?.begrunnelse);

    useEffect(() => {
        settErVedtaksperioderBeregnet(false);
    }, [vedtaksperioder]);

    const lagreVedtak = () => {
        if (beregningsresultat.status === RessursStatus.SUKSESS && erVedtaksperioderBeregnet) {
            return request<null, InnvilgeBoutgifterRequest>(
                `/api/sak/vedtak/boutgifter/${behandling.id}/innvilgelse`,
                'POST',
                {
                    vedtaksperioder: vedtaksperioder,
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

    const beregnBoutgifter = () => {
        settVisHarIkkeBeregnetFeilmelding(false);
        settForeslåPeriodeFeil(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settBeregningsresultat(byggHenterRessurs());
            request<BeregningsresultatBoutgifter, BeregnBoutgifterRequest>(
                `/api/sak/vedtak/boutgifter/${behandling.id}/beregn`,
                'POST',
                { vedtaksperioder: vedtaksperioder }
            ).then((result) => {
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
                <VStack gap={'8'}>
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
                        <SmallButton onClick={beregnBoutgifter}>Beregn</SmallButton>
                    )}
                    {erStegRedigerbart && (
                        <DataViewer type={'beregningsresultat'} response={{ beregningsresultat }}>
                            {({ beregningsresultat }) => (
                                <BeregningsresultatContainer
                                    beregningsresultat={beregningsresultat}
                                />
                            )}
                        </DataViewer>
                    )}
                    {!erStegRedigerbart && lagretVedtak?.beregningsresultat && (
                        <BeregningsresultatContainer
                            beregningsresultat={lagretVedtak.beregningsresultat}
                        />
                    )}
                </VStack>
            </Panel>
            {visHarIkkeBeregnetFeilmelding && !erVedtaksperioderBeregnet && (
                <ErrorMessage>{'Du må beregne før du kan gå videre'}</ErrorMessage>
            )}
            <DataViewer type={'beregningsresultat'} response={{ beregningsresultat }}>
                {({ beregningsresultat }) => (
                    <StegKnappInnvilgelseMedVarselOmVedtakIArena
                        lagreVedtak={lagreVedtak}
                        vedtaksperioder={vedtaksperioder}
                        tidligsteEndring={beregningsresultat.tidligsteEndring}
                    />
                )}
            </DataViewer>
        </>
    );
};
