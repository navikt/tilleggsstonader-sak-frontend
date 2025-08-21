import React, { useEffect, useState } from 'react';

import { ErrorMessage, VStack } from '@navikt/ds-react';

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
import { Periode } from '../../../../../utils/periode';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { StegKnappInnvilgelseMedVarselOmVedtakIArena } from '../../Felles/StegKnappInnvilgelseMedVarselOmVedtakIArena';
import { validerVedtaksperioder } from '../../Felles/vedtaksperioder/valideringVedtaksperioder';
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
            />
        </>
    );
};
