import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { utledStatus } from './vedtaksperiodeUtils';
import { VelgAktivitet } from './VelgAktivitet';
import { VelgMålgruppe } from './VelgMålgruppe';
import { VelgTiltaksvariant } from './VelgTiltaksvariant';
import { useBehandling } from '../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { StatusTag } from '../../../../../komponenter/PerioderStatusTag/StatusTag';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { BehandlingType } from '../../../../../typer/behandling/behandlingType';
import { Kodeverk } from '../../../../../typer/kodeverk';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import { BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal } from '../../../Felles/BekreftEndretDatoetFørTidligereVedtak/BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal';
import { useSlettePeriodeFørTidligereVedtak } from '../../../Felles/BekreftEndretDatoetFørTidligereVedtak/useHarEndretDatoerFørTidligereVedtak';

interface Props {
    vedtaksperiode: Vedtaksperiode;
    lagretVedtaksperiode: Vedtaksperiode | undefined;
    erLesevisning: boolean;
    vedtaksperiodeFeil: FormErrors<Vedtaksperiode> | undefined;
    oppdaterPeriode: (
        property: 'fom' | 'tom' | 'målgruppeType' | 'aktivitetType' | 'typeAktivitet',
        value: string | Kodeverk | undefined
    ) => void;
    slettPeriode: () => void;
    vedtakErLagret: boolean;
    gjelderTsr: boolean;
}

export const VedtaksperiodeRad: React.FC<Props> = ({
    vedtaksperiode,
    lagretVedtaksperiode,
    erLesevisning,
    vedtaksperiodeFeil,
    oppdaterPeriode,
    slettPeriode,
    vedtakErLagret,
    gjelderTsr,
}) => {
    const { behandling } = useBehandling();

    const { visBekreftModal, settVisBekreftModal, burdeViseModal } =
        useSlettePeriodeFørTidligereVedtak({
            tidligere: lagretVedtaksperiode || vedtaksperiode,
        });

    const erRevurdering = behandling.type === BehandlingType.REVURDERING;

    const bekreftSlettVedtaksperiode = () => {
        if (burdeViseModal) {
            settVisBekreftModal(true);
            return;
        }
        slettPeriode();
    };

    return (
        <>
            <FeilmeldingMaksBredde>
                <DateInputMedLeservisning
                    label="Fra"
                    hideLabel
                    erLesevisning={erLesevisning}
                    value={vedtaksperiode.fom}
                    onChange={(dato?: string) => oppdaterPeriode('fom', dato)}
                    feil={vedtaksperiodeFeil?.fom}
                    size="small"
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde>
                <DateInputMedLeservisning
                    label="Til"
                    hideLabel
                    erLesevisning={erLesevisning}
                    value={vedtaksperiode.tom}
                    onChange={(dato?: string) => oppdaterPeriode('tom', dato)}
                    feil={vedtaksperiodeFeil?.tom}
                    size="small"
                />
            </FeilmeldingMaksBredde>
            {gjelderTsr ? (
                <VelgTiltaksvariant
                    vedtaksperiode={vedtaksperiode}
                    erLesevisning={erLesevisning}
                    vedtaksperiodeFeil={vedtaksperiodeFeil}
                    oppdaterPeriode={oppdaterPeriode}
                />
            ) : (
                <>
                    <VelgAktivitet
                        stønadstype={behandling.stønadstype}
                        vedtaksperiode={vedtaksperiode}
                        erLesevisning={erLesevisning}
                        vedtaksperiodeFeil={vedtaksperiodeFeil}
                        oppdaterPeriode={oppdaterPeriode}
                    />
                    <VelgMålgruppe
                        stønadstype={behandling.stønadstype}
                        vedtaksperiode={vedtaksperiode}
                        erLesevisning={erLesevisning}
                        vedtaksperiodeFeil={vedtaksperiodeFeil}
                        oppdaterPeriode={oppdaterPeriode}
                    />
                </>
            )}
            <div>
                {!erLesevisning && (
                    <Button
                        variant="tertiary"
                        onClick={() => bekreftSlettVedtaksperiode()}
                        icon={<TrashIcon />}
                        size="xsmall"
                    />
                )}
            </div>
            <div>
                {erRevurdering && (
                    <StatusTag
                        status={utledStatus(vedtaksperiode, vedtakErLagret, lagretVedtaksperiode)}
                        lesevisning={erLesevisning}
                    />
                )}
            </div>
            <BekreftEndringPåPeriodeSomPåvirkerTidligereVedtakModal
                visBekreftModal={visBekreftModal}
                settVisBekreftModal={settVisBekreftModal}
                bekreftLagre={slettPeriode}
                laster={false}
            />
        </>
    );
};
