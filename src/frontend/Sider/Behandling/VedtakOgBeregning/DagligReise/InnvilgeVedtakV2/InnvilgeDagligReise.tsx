import React, { useState } from 'react';

import { VStack } from '@navikt/ds-react';

import { useApp } from '../../../../../context/AppContext';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { useSteg } from '../../../../../context/StegContext';
import { FormErrors, isValid } from '../../../../../hooks/felles/useFormState';
import { useMapById } from '../../../../../hooks/useMapById';
import { Feil } from '../../../../../komponenter/Feil/feilmeldingUtils';
import Panel from '../../../../../komponenter/Panel/Panel';
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import { Steg } from '../../../../../typer/behandling/steg';
import { TypeVedtak } from '../../../../../typer/vedtak/vedtak';
import {
    InnvilgelseDagligReise,
    InnvilgelseDagligReiseRequest,
} from '../../../../../typer/vedtak/vedtakDagligReise';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { FanePath } from '../../../faner';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { StegKnappInnvilgelseMedVarselOmVedtakIArena } from '../../Felles/StegKnappInnvilgelseMedVarselOmVedtakIArena';
import { validerVedtaksperioder } from '../../Felles/vedtaksperioder/valideringVedtaksperioder';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import { initialiserVedtaksperioder } from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';

interface Props {
    lagretVedtak?: InnvilgelseDagligReise;
    vedtaksperioderForrigeBehandling?: Vedtaksperiode[];
}

export const InnvilgeDagligReise: React.FC<Props> = ({
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

    const [begrunnelse, settBegrunnelse] = useState<string | undefined>(lagretVedtak?.begrunnelse);

    const gjelderTsr = behandling.stønadstype === Stønadstype.DAGLIG_REISE_TSR;

    const lagreVedtak = () => {
        const kanSendeInn = validerForm() && erStegRedigerbart;

        if (kanSendeInn) {
            const url = gjelderTsr
                ? `/api/sak/vedtak/daglig-reise/${behandling.id}/tsr/innvilgelse`
                : `/api/sak/vedtak/daglig-reise/${behandling.id}/tso/innvilgelse`;

            return request<null, InnvilgelseDagligReiseRequest>(url, 'POST', {
                type: TypeVedtak.INNVILGELSE,
                vedtaksperioder: vedtaksperioder,
                begrunnelse: begrunnelse,
            });
        } else {
            return Promise.reject();
        }
    };

    function validerForm(): boolean {
        const vedtaksperiodeFeil = validerVedtaksperioder(vedtaksperioder);
        settVedtaksperiodeFeil(vedtaksperiodeFeil);

        return isValid(vedtaksperiodeFeil);
    }

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
                </VStack>
            </Panel>
            <StegKnappInnvilgelseMedVarselOmVedtakIArena
                steg={Steg.VEDTAK}
                nesteFane={FanePath.KJØRELISTE}
                lagreVedtak={lagreVedtak}
                vedtaksperioder={vedtaksperioder}
                //TODO legg til når vi begynner med revurdering for daglig resise
                tidligsteEndring={undefined}
            />
        </>
    );
};
