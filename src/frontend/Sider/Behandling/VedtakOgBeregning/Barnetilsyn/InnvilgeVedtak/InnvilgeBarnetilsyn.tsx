import React, { useEffect, useState } from 'react';

import { BodyShort, ErrorMessage, HStack, Link, VStack } from '@navikt/ds-react';

import Beregningsresultat from './Beregningsresultat';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors, isValid } from '../../../../../hooks/felles/useFormState';
import { useMapById } from '../../../../../hooks/useMapById';
import DataViewer from '../../../../../komponenter/DataViewer';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '../../../../../typer/ressurs';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    BeregnBarnetilsynRequest,
    BeregningsresultatTilsynBarn,
    InnvilgeBarnetilsynRequest,
    InnvilgelseBarnetilsyn,
} from '../../../../../typer/vedtak/vedtakTilsynBarn';
import { FanePath } from '../../../faner';
import { lenkerBeregningTilsynBarn } from '../../../lenker';
import { OppsummeringVilkårperioderOgVilkår } from '../../../OppsummeringVilkår/OppsummeringVilkårperioderOgVilkår';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { validerVedtaksperioder } from '../../Felles/vedtaksperioder/valideringVedtaksperioder';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import { initialiserVedtaksperioder } from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';

interface Props {
    lagretVedtak?: InnvilgelseBarnetilsyn;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
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

export const InnvilgeBarnetilsyn: React.FC<Props> = ({
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
    const [foreslåPeriodeFeil, settForeslåPeriodeFeil] = useState<string>();

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatTilsynBarn>());

    const [erVedtaksperioderBeregnet, settErVedtaksperioderBeregnet] = useState(false);
    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState<boolean>();

    const [begrunnelse, settBegrunnelse] = useState<string | undefined>(lagretVedtak?.begrunnelse);

    useEffect(() => {
        settErVedtaksperioderBeregnet(false);
    }, [vedtaksperioder]);

    const lagreVedtak = () => {
        if (beregningsresultat.status === RessursStatus.SUKSESS && erVedtaksperioderBeregnet) {
            return request<null, InnvilgeBarnetilsynRequest>(
                `/api/sak/vedtak/tilsyn-barn/${behandling.id}/innvilgelse`,
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
        const vedtaksperiodeFeil = validerVedtaksperioder(
            vedtaksperioder,
            lagredeVedtaksperioder,
            behandling.revurderFra
        );
        settVedtaksperiodeFeil(vedtaksperiodeFeil);

        return isValid(vedtaksperiodeFeil);
    };

    const beregnBarnetilsyn = () => {
        settVisHarIkkeBeregnetFeilmelding(false);
        settForeslåPeriodeFeil(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settBeregningsresultat(byggHenterRessurs());
            request<BeregningsresultatTilsynBarn, BeregnBarnetilsynRequest>(
                `/api/sak/vedtak/tilsyn-barn/${behandling.id}/beregn`,
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
                <VStack gap={'8'}>
                    <OppsummeringVilkårperioderOgVilkår />
                    <Vedtaksperioder
                        vedtaksperioder={vedtaksperioder}
                        lagredeVedtaksperioder={lagredeVedtaksperioder}
                        settVedtaksperioder={settVedtaksperioder}
                        vedtaksperioderFeil={vedtaksperiodeFeil}
                        settVedtaksperioderFeil={settVedtaksperiodeFeil}
                        foreslåPeriodeFeil={foreslåPeriodeFeil}
                        settForeslåPeriodeFeil={settForeslåPeriodeFeil}
                    />
                    <Begrunnelsesfelt
                        begrunnelse={begrunnelse}
                        oppdaterBegrunnelse={settBegrunnelse}
                    />
                    {erStegRedigerbart && (
                        <SmallButton onClick={beregnBarnetilsyn}>Beregn</SmallButton>
                    )}
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
            {visHarIkkeBeregnetFeilmelding && !erVedtaksperioderBeregnet && (
                <ErrorMessage>{'Du må beregne før du kan gå videre'}</ErrorMessage>
            )}
            <StegKnapp
                steg={Steg.BEREGNE_YTELSE}
                nesteFane={FanePath.SIMULERING}
                onNesteSteg={lagreVedtak}
                validerUlagedeKomponenter={false}
            >
                Lagre vedtak og gå videre
            </StegKnapp>
        </>
    );
};
