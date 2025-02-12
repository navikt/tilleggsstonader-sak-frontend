import React, { useState } from 'react';

import { BodyShort, HStack, Link, VStack } from '@navikt/ds-react';

import Beregningsresultat from './Beregningsresultat';
import { Vedtaksperioder } from './Vedtaksperioder';
import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import DataViewer from '../../../../../komponenter/DataViewer';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../../komponenter/Panel/Panel';
import { StegKnapp } from '../../../../../komponenter/Stegflyt/StegKnapp';
import { Steg } from '../../../../../typer/behandling/steg';
import { byggHenterRessurs, byggTomRessurs } from '../../../../../typer/ressurs';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    BeregningsresultatTilsynBarn,
    InnvilgeBarnetilsynRequest,
    InnvilgelseBarnetilsyn,
    VedtaksperiodeTilsynBarn,
    vedtaksperiodeTilVedtakperiodeTilsynBarn,
} from '../../../../../typer/vedtak/vedtakTilsynBarn';
import { FanePath } from '../../../faner';
import { lenkerBeregningTilsynBarn } from '../../../lenker';
import { initialiserVedtaksperioder } from '../VedtakBarnetilsynUtils';

interface Props {
    lagretVedtak?: InnvilgelseBarnetilsyn;
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

export const InnvilgeBarnetilsynV2: React.FC<Props> = ({ lagretVedtak }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const [vedtaksperioder, settVedtaksperioder] = useState<VedtaksperiodeTilsynBarn[]>(
        initialiserVedtaksperioder(
            vedtaksperiodeTilVedtakperiodeTilsynBarn(
                lagretVedtak?.beregningsresultat?.vedtaksperioder
            )
        )
    );
    const [vedtaksperiodeFeil, settVedtaksperiodeFeil] =
        useState<FormErrors<VedtaksperiodeTilsynBarn>[]>();

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatTilsynBarn>());

    const lagreVedtak = () => {
        return request<null, InnvilgeBarnetilsynRequest>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}/innvilgelse`,
            'POST',
            { type: TypeVedtak.INNVILGELSE }
        );
    };

    const beregnBarnetilsyn = () => {
        settBeregningsresultat(byggHenterRessurs());
        request<BeregningsresultatTilsynBarn, VedtaksperiodeTilsynBarn[]>(
            `/api/sak/vedtak/tilsyn-barn/${behandling.id}/beregnV2`,
            'POST',
            vedtaksperioder
        ).then(settBeregningsresultat);
    };

    return (
        <>
            <Panel tittel="Beregning" ekstraHeading={<HeadingBeregning />}>
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
        </>
    );
};
