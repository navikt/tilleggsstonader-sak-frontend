import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { useMapById } from '../../../../../hooks/useMapById';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import Panel from '../../../../../komponenter/Panel/Panel';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    InnvilgelseDagligReise,
    InnvilgelseDagligReiseRequest,
} from '../../../../../typer/vedtak/vedtakDagligReise';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { StegKnappInnvilgelseMedVarselOmVedtakIArena } from '../../Felles/StegKnappInnvilgelseMedVarselOmVedtakIArena';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import { initialiserVedtaksperioder } from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';

interface Props {
    lagretVedtak?: InnvilgelseDagligReise;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}

export const InnvilgeVedtakDagligReise: React.FC<Props> = ({
    lagretVedtak,
    vedtaksperioderForrigeBehandling,
}) => {
    const { request } = useApp();
    const { behandling } = useBehandling();

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

    const [begrunnelse, settBegrunnelse] = useState<string | undefined>(lagretVedtak?.begrunnelse);

    const lagreVedtak = () => {
        return request<null, InnvilgelseDagligReiseRequest>(
            `/api/sak/vedtak/daglig-reise/${behandling.id}/innvilgelse`,
            'POST',
            {
                type: TypeVedtak.INNVILGELSE,
                vedtaksperioder: vedtaksperioder,
                begrunnelse: begrunnelse,
            }
        );
    };

    return (
        <>
            <Panel tittel="Vedtaksperiode">
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
                </VStack>
            </Panel>
            <StegKnappInnvilgelseMedVarselOmVedtakIArena
                lagreVedtak={lagreVedtak}
                vedtaksperioder={vedtaksperioder}
                //TODO legg til når vi begynner med revurdering for daglig resise
                tidligsteEndring={undefined}
            />
        </>
    );
};
