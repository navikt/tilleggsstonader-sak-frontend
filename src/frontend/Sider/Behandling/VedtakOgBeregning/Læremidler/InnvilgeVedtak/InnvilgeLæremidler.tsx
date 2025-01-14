import React, { useState } from 'react';

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
import { Steg } from '../../../../../typer/behandling/steg';
import { byggHenterRessurs, byggTomRessurs, RessursStatus } from '../../../../../typer/ressurs';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    BeregningsresultatLæremidler,
    InnvilgelseLæremidler,
    InnvilgelseLæremidlerRequest,
} from '../../../../../typer/vedtak/vedtakLæremidler';
import { Periode, PeriodeMedEndretKey } from '../../../../../utils/periode';
import { FanePath } from '../../../faner';
import { StønadsperiodeListe } from '../../../Stønadsvilkår/OppsummeringStønadsperioder';
import { validerVedtaksperioder } from '../validering';
import {initialiserVedtaksperioder, vedtaksperiodeRecordTilListe} from '../vedtakLæremidlerUtils';

export const InnvilgeLæremidler: React.FC<{
    lagretVedtak: InnvilgelseLæremidler | undefined;
}> = ({ lagretVedtak }) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();

    const { stønadsperioder } = useStønadsperioder(behandling.id);

    const [vedtaksperioder, settVedtaksperioder] = useState<{[k: string]: PeriodeMedEndretKey}>(
        initialiserVedtaksperioder(lagretVedtak)
    );
    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState<boolean>();

    const [beregningsresultat, settBeregningsresultat] =
        useState(byggTomRessurs<BeregningsresultatLæremidler>());

    const [vedtaksperiodeFeil, settVedtaksperiodeFeil] = useState<
        { [k: string]: FormErrors<Periode> } | undefined
    >();

    const lagreVedtak = () => {
        if (beregningsresultat.status === RessursStatus.SUKSESS) {
            return request<null, InnvilgelseLæremidlerRequest>(
                `/api/sak/vedtak/laremidler/${behandling.id}/innvilgelse`,
                'POST',
                { type: TypeVedtak.INNVILGELSE, vedtaksperioder: vedtaksperiodeRecordTilListe(vedtaksperioder) }
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
                vedtaksperiodeRecordTilListe(vedtaksperioder)
            ).then(settBeregningsresultat);
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
            {visHarIkkeBeregnetFeilmelding && (
                <ErrorMessage>{'Du må beregne før du kan gå videre'}</ErrorMessage>
            )}
        </>
    );
};
