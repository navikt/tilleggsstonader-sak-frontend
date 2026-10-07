import React, { useRef, useState } from 'react';

import { VStack } from '@navikt/ds-react';

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
import { Stønadstype } from '../../../../../typer/behandling/behandlingTema';
import {
    byggHenterRessurs,
    byggRessursFeilet,
    byggTomRessurs,
    Ressurs,
    RessursStatus,
} from '../../../../../typer/ressurs';
import {
    BeregningsresultatFlytting,
    InnvilgelseFlytting,
    InnvilgelseFlyttingRequest,
} from '../../../../../typer/vedtak/vedtakFlytting';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { Begrunnelsesfelt } from '../../Felles/Begrunnelsesfelt';
import { StegKnappInnvilgelseMedVarsel } from '../../Felles/StegKnappInnvilgelseMedVarsel';
import { validerVedtaksperioder } from '../../Felles/vedtaksperioder/valideringVedtaksperioder';
import { Vedtaksperioder } from '../../Felles/vedtaksperioder/Vedtaksperioder';
import {
    initialiserVedtaksperioder,
    tilVedtaksperioderDto,
} from '../../Felles/vedtaksperioder/vedtaksperiodeUtils';

export const InnvilgeFlytting: React.FC<{ lagretVedtak?: InnvilgelseFlytting }> = ({
    lagretVedtak,
}) => {
    const { request } = useApp();
    const { behandling } = useBehandling();
    const { erStegRedigerbart } = useSteg();
    const [vedtaksperioder, settVedtaksperioder] = useState(
        initialiserVedtaksperioder(lagretVedtak?.vedtaksperioder)
    );
    const lagredeVedtaksperioder = useMapById(lagretVedtak?.vedtaksperioder ?? []);
    const [vedtaksperiodeFeil, settVedtaksperiodeFeil] = useState<FormErrors<Vedtaksperiode>[]>();
    const [foreslåPeriodeFeil, settForeslåPeriodeFeil] = useState<Feil>();
    const [begrunnelse, settBegrunnelse] = useState(lagretVedtak?.begrunnelse ?? undefined);
    const [beregning, settBeregning] = useState<{
        perioder: Vedtaksperiode[];
        resultat: Ressurs<BeregningsresultatFlytting>;
    }>();
    const beregningId = useRef(0);
    const beregningsresultat =
        beregning?.perioder === vedtaksperioder
            ? beregning.resultat
            : byggTomRessurs<BeregningsresultatFlytting>();
    const gjelderTsr = behandling.stønadstype === Stønadstype.FLYTTING_TSR;
    const vedtakUrl = `/api/sak/vedtak/flytting/${behandling.id}/${gjelderTsr ? 'tsr' : 'tso'}`;

    const beregnFlytting = () => {
        const id = ++beregningId.current;
        settForeslåPeriodeFeil(undefined);
        const feil = validerVedtaksperioder(vedtaksperioder, gjelderTsr);
        settVedtaksperiodeFeil(feil);

        if (vedtaksperioder.length === 0 || !isValid(feil)) {
            settBeregning({
                perioder: vedtaksperioder,
                resultat: byggRessursFeilet(
                    vedtaksperioder.length === 0
                        ? 'Du må legge til minst én vedtaksperiode før du kan beregne'
                        : 'Du må rette feilene i vedtaksperiodene før du kan beregne'
                ),
            });
            return;
        }

        settBeregning({ perioder: vedtaksperioder, resultat: byggHenterRessurs() });
        request<BeregningsresultatFlytting, InnvilgelseFlyttingRequest>(
            `${vedtakUrl}/beregn`,
            'POST',
            { vedtaksperioder: tilVedtaksperioderDto(vedtaksperioder, behandling.stønadstype) }
        ).then((resultat) => {
            if (id === beregningId.current) {
                settBeregning({ perioder: vedtaksperioder, resultat });
            }
        });
    };

    const lagreVedtak = () => {
        if (beregningsresultat.status !== RessursStatus.SUKSESS) {
            return Promise.resolve(byggRessursFeilet('Du må beregne før du kan gå videre'));
        }
        return request<null, InnvilgelseFlyttingRequest>(`${vedtakUrl}/innvilgelse`, 'POST', {
            vedtaksperioder: tilVedtaksperioderDto(vedtaksperioder, behandling.stønadstype),
            begrunnelse,
        });
    };

    return (
        <>
            <Panel tittel="Beregning og vedtaksperiode">
                <VStack gap="space-32">
                    <Vedtaksperioder
                        vedtaksperioder={vedtaksperioder}
                        lagredeVedtaksperioder={lagredeVedtaksperioder}
                        settVedtaksperioder={settVedtaksperioder}
                        vedtaksperioderFeil={vedtaksperiodeFeil}
                        settVedtaksperioderFeil={settVedtaksperiodeFeil}
                        foreslåPeriodeFeil={foreslåPeriodeFeil}
                        settForeslåPeriodeFeil={settForeslåPeriodeFeil}
                        vedtakErLagret={lagretVedtak !== undefined}
                        gjelderTsr={gjelderTsr}
                    />
                    <Begrunnelsesfelt
                        begrunnelse={begrunnelse}
                        oppdaterBegrunnelse={settBegrunnelse}
                    />
                    {erStegRedigerbart ? (
                        <>
                            <SmallButton
                                onClick={beregnFlytting}
                                loading={beregningsresultat.status === RessursStatus.HENTER}
                                disabled={beregningsresultat.status === RessursStatus.HENTER}
                            >
                                Beregn
                            </SmallButton>
                            <DataViewer type="beregningsresultat" response={{ beregningsresultat }}>
                                {({ beregningsresultat }) => (
                                    <Beregningsresultat beregningsresultat={beregningsresultat} />
                                )}
                            </DataViewer>
                        </>
                    ) : (
                        lagretVedtak && (
                            <Beregningsresultat
                                beregningsresultat={lagretVedtak.beregningsresultat}
                            />
                        )
                    )}
                </VStack>
            </Panel>
            <StegKnappInnvilgelseMedVarsel
                lagreVedtak={lagreVedtak}
                vedtaksperioder={vedtaksperioder}
                lagredeVedtaksperioder={lagredeVedtaksperioder}
                vedtakErLagret={lagretVedtak !== undefined}
                tidligsteEndring={undefined}
            />
        </>
    );
};
