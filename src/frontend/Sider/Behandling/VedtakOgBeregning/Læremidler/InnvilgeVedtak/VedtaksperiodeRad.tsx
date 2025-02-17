import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { useBehandling } from '../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { useRevurderingAvPerioder } from '../../../../../hooks/useRevurderingAvPerioder';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { BehandlingType } from '../../../../../typer/behandling/behandlingType';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakLæremidler';
import { Periode } from '../../../../../utils/periode';
import { StatusTag } from '../../../Inngangsvilkår/Stønadsperioder/StatusTag';

interface Props {
    vedtaksperiode: Vedtaksperiode;
    lagretVedtaksperiode: Vedtaksperiode | undefined;
    erLesevisning: boolean;
    vedtaksperiodeFeil: FormErrors<Periode> | undefined;
    oppdaterPeriode: (property: 'fom' | 'tom', value: string | undefined) => void;
    slettPeriode: () => void;
    erNyRad: boolean;
}

export const VedtaksperiodeRad: React.FC<Props> = ({
    vedtaksperiode,
    lagretVedtaksperiode,
    erLesevisning,
    vedtaksperiodeFeil,
    oppdaterPeriode,
    slettPeriode,
    erNyRad,
}) => {
    const { behandling } = useBehandling();
    const { alleFelterKanEndres, helePeriodenErLåstForEndring, kanSlettePeriode } =
        useRevurderingAvPerioder({
            periodeFom: lagretVedtaksperiode?.fom,
            periodeTom: lagretVedtaksperiode?.tom,
            nyRadLeggesTil: erNyRad,
        });

    const erRevurdering = behandling.type === BehandlingType.REVURDERING;

    return (
        <>
            <FeilmeldingMaksBredde>
                <DateInputMedLeservisning
                    label="Fra"
                    hideLabel
                    erLesevisning={erLesevisning}
                    readOnly={!alleFelterKanEndres}
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
                    readOnly={helePeriodenErLåstForEndring}
                    value={vedtaksperiode.tom}
                    onChange={(dato?: string) => oppdaterPeriode('tom', dato)}
                    feil={vedtaksperiodeFeil?.tom}
                    size="small"
                />
            </FeilmeldingMaksBredde>
            <div>
                {erLesevisning
                    ? erRevurdering && <StatusTag status={vedtaksperiode.status} />
                    : kanSlettePeriode && (
                          <Button
                              variant="tertiary"
                              onClick={() => slettPeriode()}
                              icon={<TrashIcon />}
                              size="xsmall"
                          />
                      )}
            </div>
        </>
    );
};
