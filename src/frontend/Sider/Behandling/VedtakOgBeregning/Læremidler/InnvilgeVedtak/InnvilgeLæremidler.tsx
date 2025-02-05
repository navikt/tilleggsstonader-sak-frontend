import React, { useEffect, useState } from 'react';

import { ErrorMessage, VStack } from '@navikt/ds-react';

import { Beregningsresultat } from './Beregningsresultat';
import { Vedtaksperioder } from './Vedtaksperioder';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors, isValid } from '../../../../../hooks/felles/useFormState';
import { useStønadsperioder } from '../../../../../hooks/useStønadsperioder';
import DataViewer from '../../../../../komponenter/DataViewer';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { PeriodeStatus } from '../../../../../typer/behandling/periodeStatus';
import { Steg } from '../../../../../typer/behandling/steg';
import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '../../../../../typer/ressurs';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    BeregningsresultatLæremidler,
    InnvilgelseLæremidler,
    InnvilgelseLæremidlerRequest,
} from '../../../../../typer/vedtak/vedtakLæremidler';
import { Periode } from '../../../../../utils/periode';
import { FanePath } from '../../../faner';
import { StønadsperiodeListe } from '../../../Stønadsvilkår/OppsummeringStønadsperioder';
import { validerVedtaksperioder } from '../validering';
import { initialiserVedtaksperioder } from '../vedtakLæremidlerUtils';

export interface Vedtaksperiode extends Periode {
    id: string;
    status?: PeriodeStatus;
}

export interface VedtaksperiodeMedEndretKey extends Vedtaksperiode {
    endretKey: string;
}

export const InnvilgeLæremidler: React.FC<{
    lagretVedtak: InnvilgelseLæremidler | undefined;
    vedtaksperioderForrigeBehandling: Vedtaksperiode[] | undefined;
}> = ({ lagretVedtak, vedtaksperioderForrigeBehandling }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const { stønadsperioder } = useStønadsperioder(behandling.id);

    const [vedtaksperioder, settVedtaksperioder] = useState<VedtaksperiodeMedEndretKey[]>(
        initialiserVedtaksperioder(
            lagretVedtak?.vedtaksperioder || vedtaksperioderForrigeBehandling
        )
    );

    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState<boolean>();

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatLæremidler>());

    const [vedtaksperiodeFeil, settVedtaksperiodeFeil] = useState<FormErrors<Periode>[]>();

    const [erVedtaksperioderBeregnet, settErVedtaksperioderBeregnet] = useState(false);

    useEffect(() => {
        settErVedtaksperioderBeregnet(false);
    }, [vedtaksperioder]);

    const lagreVedtak = () => {
        if (beregningsresultat.status === RessursStatus.SUKSESS && erVedtaksperioderBeregnet) {
            return request<null, InnvilgelseLæremidlerRequest>(
                `/api/sak/vedtak/laremidler/${behandling.id}/innvilgelse`,
                'POST',
                { type: TypeVedtak.INNVILGELSE, vedtaksperioder: vedtaksperioder }
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

    const beregnLæremidler = () => {
        settVisHarIkkeBeregnetFeilmelding(false);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settBeregningsresultat(byggHenterRessurs());

            request<BeregningsresultatLæremidler, Periode[]>(
                `/api/sak/vedtak/laremidler/${behandling.id}/beregn`,
                'POST',
                vedtaksperioder
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
                <DataViewer response={{ stønadsperioder }}>
                    {({ stønadsperioder }) => (
                        <StønadsperiodeListe
                            stønadsperioder={stønadsperioder}
                            tittel="Periode hvor bruker er i aktivitet og målgruppe"
                        />
                    )}
                </DataViewer>
                <Vedtaksperioder
                    vedtaksperioder={vedtaksperioder}
                    settVedtaksperioder={settVedtaksperioder}
                    vedtaksperioderFeil={vedtaksperiodeFeil}
                    settVedtaksperioderFeil={settVedtaksperiodeFeil}
                />
                {erStegRedigerbart && <SmallButton onClick={beregnLæremidler}>Beregn</SmallButton>}
                <VStack gap="8">
                    {erStegRedigerbart && (
                        <DataViewer response={{ beregningsresultat }}>
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
            <StegKnapp
                steg={Steg.BEREGNE_YTELSE}
                nesteFane={FanePath.SIMULERING}
                onNesteSteg={lagreVedtak}
                validerUlagedeKomponenter={false}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
            {visHarIkkeBeregnetFeilmelding && !erVedtaksperioderBeregnet && (
                <ErrorMessage>{'Du må beregne før du kan gå videre'}</ErrorMessage>
            )}
        </>
    );
};
