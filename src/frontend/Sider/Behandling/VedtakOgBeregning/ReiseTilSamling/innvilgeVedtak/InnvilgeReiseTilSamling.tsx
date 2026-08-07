import React, { useEffect, useState } from 'react';

import { ErrorMessage, VStack } from '@navikt/ds-react';

import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors, isValid } from '../../../../../hooks/felles/useFormState';
import { useMapById } from '../../../../../hooks/useMapById';
import DataViewer from '../../../../../komponenter/DataViewer';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../../komponenter/Panel/Panel';
import { byggHenterRessurs, byggTomRessurs } from '../../../../../typer/ressurs';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    BeregningReiseTilSamling,
    BeregnReiseTilSamlingRequest,
    InnvilgelseReiseTilSamling,
} from '../../../../../typer/vedtak/vedtakReiseTilSamling';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { validerVedtaksperioder } from '../../Felles/vedtaksperioder/valideringVedtaksperioder';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import { initialiserVedtaksperioder } from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';
import { Beregningsresultat } from '../../ReiseTilSamling/innvilgeVedtak/Beregningsresultat/Beregningsresultat';

interface Props {
    lagretVedtak?: InnvilgelseReiseTilSamling;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}
export const InnvilgeReiseTilSamling: React.FC<Props> = ({
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
        useState(byggTomRessurs<BeregningReiseTilSamling>());
    const [erVedtaksperioderBeregnet, settErVedtaksperioderBeregnet] = useState(false);
    const [visHarIkkeBeregnetFeilmelding, settVisHarIkkeBeregnetFeilmelding] = useState<boolean>();

    const [begrunnelse, settBegrunnelse] = useState<string | undefined>(lagretVedtak?.begrunnelse);
    useEffect(() => {
        settErVedtaksperioderBeregnet(false);
    }, [vedtaksperioder]);

    const validerForm = (): boolean => {
        const vedtaksperiodeFeil = validerVedtaksperioder(vedtaksperioder);
        settVedtaksperiodeFeil(vedtaksperiodeFeil);

        return isValid(vedtaksperiodeFeil);
    };
    const beregnReiseTilSamling = () => {
        settVisHarIkkeBeregnetFeilmelding(false);
        settForeslåPeriodeFeil(undefined);

        const kanSendeInn = validerForm();

        if (kanSendeInn) {
            settBeregningsresultat(byggHenterRessurs());
            const url = `/api/sak/vedtak/reise-til-samling/${behandling.id}/tso/beregn`;
            request<BeregningReiseTilSamling, BeregnReiseTilSamlingRequest>(url, 'POST', {
                vedtaksperioder,
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
                    />
                    <Begrunnelsesfelt
                        begrunnelse={begrunnelse}
                        oppdaterBegrunnelse={settBegrunnelse}
                    />
                    {erStegRedigerbart && (
                        <SmallButton onClick={beregnReiseTilSamling}>Beregn</SmallButton>
                    )}
                    {erStegRedigerbart && (
                        <DataViewer type={'beregningsresultat'} response={{ beregningsresultat }}>
                            {({ beregningsresultat }) => (
                                <Beregningsresultat beregningsresultat={beregningsresultat} />
                            )}
                        </DataViewer>
                    )}
                </VStack>
            </Panel>
            {visHarIkkeBeregnetFeilmelding && !erVedtaksperioderBeregnet && (
                <ErrorMessage>{'Du må beregne før du kan gå videre'}</ErrorMessage>
            )}
        </>
    );
};
