import React, { useEffect, useState } from 'react';

import { ErrorMessage, VStack } from '@navikt/ds-react';

import { useSteg } from '../../../../../context/StegContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { useMapById } from '../../../../../hooks/useMapById';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import SmallButton from '../../../../../komponenter/Knapper/SmallButton';
import Panel from '../../../../../komponenter/Panel/Panel';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { InnvilgelseReiseTilSamling } from '../../../../../typer/vedtak/vedtakReiseTilSamling';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import { initialiserVedtaksperioder } from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';

interface Props {
    lagretVedtak?: InnvilgelseReiseTilSamling;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}
export const InnvilgeReiseTilSamling: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
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

    const [erVedtaksperioderBeregnet, settErVedtaksperioderBeregnet] = useState(false);
    const [visHarIkkeBeregnetFeilmelding] = useState<boolean>();

    const [begrunnelse, settBegrunnelse] = useState<string | undefined>(lagretVedtak?.begrunnelse);

    useEffect(() => {
        settErVedtaksperioderBeregnet(false);
    }, [vedtaksperioder]);
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
                    {erStegRedigerbart && <SmallButton>Beregn</SmallButton>}
                </VStack>
            </Panel>
            {visHarIkkeBeregnetFeilmelding && !erVedtaksperioderBeregnet && (
                <ErrorMessage>{'Du må beregne før du kan gå videre'}</ErrorMessage>
            )}
        </>
    );
};
