import React, { useEffect, useState } from 'react';

import { BodyShort, ErrorMessage, HStack, Link, VStack } from '@navikt/ds-react';

import Beregningsresultat from './Beregningsresultat';
import { Vedtaksperioder } from './Vedtaksperioder';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors, isValid } from '../../../../../hooks/felles/useFormState';
import DataViewer from '../../../../../komponenter/DataViewer';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '../../../../../typer/ressurs';
import {
    BeregningsresultatTilsynBarn,
    InnvilgeBarnetilsynRequestV2,
    InnvilgelseBarnetilsyn,
    validerVedtaksperioder,
    VedtaksperiodeTilsynBarn,
    vedtaksperiodeTilVedtakperiodeTilsynBarn,
} from '../../../../../typer/vedtak/vedtakTilsynBarn';
import { FanePath } from '../../../faner';
import { lenkerBeregningTilsynBarn } from '../../../lenker';
import { initialiserVedtaksperioder } from '../VedtakBarnetilsynUtils';
import { BehandlingInfo } from './BehandlingInfo';

interface Props {
    lagretVedtak?: InnvilgelseBarnetilsyn;
    vedtaksperioderForrigeBehandling?: VedtaksperiodeTilsynBarn[];
}

export const HeadingBeregning: React.FC = () => {
    return (
        <HStack gap="4" align={'end'}>
            {lenkerBeregningTilsynBarn.map((lenke, indeks) => (
                <BodyShort key={indeks} size={'small'}>
                    <Link key={indeks} href={lenke.url} target="_blank" variant="neutral">
                        {lenke.tekst}
                    </Link>
                </BodyShort>
            ))}
        </HStack>
    );
};

export const InnvilgeBarnetilsynV2: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const [vedtaksperioder, settVedtaksperioder] = useState<VedtaksperiodeTilsynBarn[]>(
        initialiserVedtaksperioder(
            vedtaksperiodeTilVedtakperiodeTilsynBarn(
                lagretVedtak?.beregningsresultat?.vedtaksperioder
            ) || vedtaksperioderForrigeBehandling
        )
    );
    const [vedtaksperiodeFeil, settVedtaksperiodeFeil] =
        useState<FormErrors<VedtaksperiodeTilsynBarn>[]>();

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatTilsynBarn>());

    const [erVedtaksperioderBeregnet, settErVedtaksperioderBeregnet] = useState(false);
    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState<boolean>();

    useEffect(() => {
        settErVedtaksperioderBeregnet(false);
    }, [vedtaksperioder]);

    const lagreVedtak = () => {
        if (beregningsresultat.status === RessursStatus.SUKSESS && erVedtaksperioderBeregnet) {
            return request<null, InnvilgeBarnetilsynRequestV2>(
                `/api/sak/vedtak/tilsyn-barn/${behandling.id}/innvilgelseV2`,
                'POST',
                { vedtaksperioder: vedtaksperioder }
            );
        } else {
            settVisHarIkkeBeregnetFeilmelding(true);
            return Promise.reject();
        }
    };
    const validerForm = (): boolean => {
        const vedtaksperiodeFeil = validerVedtaksperioder(
            vedtaksperioder,
            vedtaksperioderForrigeBehandling,
            behandling.revurderFra
        );
        settVedtaksperiodeFeil(vedtaksperiodeFeil);

        return isValid(vedtaksperiodeFeil);
    };

    const beregnBarnetilsyn = () => {
        settVisHarIkkeBeregnetFeilmelding(false);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settBeregningsresultat(byggHenterRessurs());
            request<BeregningsresultatTilsynBarn, InnvilgeBarnetilsynRequestV2>(
                `/api/sak/vedtak/tilsyn-barn/${behandling.id}/beregnV2`,
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
            <Panel tittel="Beregning" ekstraHeading={<HeadingBeregning />}>
                <BehandlingInfo behandlingId={behandling.id} />
                <Vedtaksperioder
                    vedtaksperioder={vedtaksperioder}
                    settVedtaksperioder={settVedtaksperioder}
                    vedtaksperioderFeil={vedtaksperiodeFeil}
                    settVedtaksperioderFeil={settVedtaksperiodeFeil}
                />
                {erStegRedigerbart && <SmallButton onClick={beregnBarnetilsyn}>Beregn</SmallButton>}
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
