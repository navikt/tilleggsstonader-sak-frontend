import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { useBehandling } from '../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { useRevurderingAvPerioder } from '../../../../../hooks/useRevurderingAvPerioder';
import { StatusTag } from '../../../../../komponenter/PerioderStatusTag/StatusTag';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import SelectMedOptions from '../../../../../komponenter/Skjema/SelectMedOptions';
import { FeilmeldingMaksBredde } from '../../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { BehandlingType } from '../../../../../typer/behandling/behandlingType';
import { PeriodeStatus } from '../../../../../typer/behandling/periodeStatus';
import { Vedtaksperiode } from '../../../../../typer/vedtak/vedtakperiode';
import {
    faktiskMålgruppeTilTekst,
    faktiskMålgruppeTypeOptions,
} from '../../../Felles/faktiskMålgruppe';
import {
    aktivitetTypeTilTekst,
    valgbareAktivitetTyperForVedtaksperiode,
} from '../../../Inngangsvilkår/Aktivitet/utilsAktivitet';

interface Props {
    vedtaksperiode: Vedtaksperiode;
    lagretVedtaksperiode: Vedtaksperiode | undefined;
    erLesevisning: boolean;
    vedtaksperiodeFeil: FormErrors<Vedtaksperiode> | undefined;
    oppdaterPeriode: (
        property: 'fom' | 'tom' | 'målgruppeType' | 'aktivitetType',
        value: string | undefined
    ) => void;
    slettPeriode: () => void;
    erNyRad: boolean;
    vedtakErLagret: boolean;
}

export const VedtaksperiodeRad: React.FC<Props> = ({
    vedtaksperiode,
    lagretVedtaksperiode,
    erLesevisning,
    vedtaksperiodeFeil,
    oppdaterPeriode,
    slettPeriode,
    erNyRad,
    vedtakErLagret,
}) => {
    const { behandling } = useBehandling();
    const { alleFelterKanEndres, helePeriodenErLåstForEndring, kanSlettePeriode } =
        useRevurderingAvPerioder({
            periodeFom: lagretVedtaksperiode?.fom,
            periodeTom: lagretVedtaksperiode?.tom,
            nyRadLeggesTil: erNyRad,
        });

    const erRevurdering = behandling.type === BehandlingType.REVURDERING;

    const valgbareAktiviteter = valgbareAktivitetTyperForVedtaksperiode(behandling.stønadstype);

    const utledStatus = (vedtaksperiode: Vedtaksperiode) => {
        // Hvis vedtak ikke er lagret på behandling, hentes vedtaksperiode fra forrige behandling
        // og vedtaksperiode.forrigeVedtaksperiode er forrige-forrige vedtaksperiode
        const vedtaksperiodeFraForrigeBehandling = vedtakErLagret
            ? vedtaksperiode.forrigeVedtaksperiode
            : lagretVedtaksperiode;

        if (!vedtaksperiodeFraForrigeBehandling) {
            return PeriodeStatus.NY;
        }

        if (
            vedtaksperiode.fom === vedtaksperiodeFraForrigeBehandling.fom &&
            vedtaksperiode.tom === vedtaksperiodeFraForrigeBehandling.tom &&
            vedtaksperiode.aktivitetType === vedtaksperiodeFraForrigeBehandling.aktivitetType &&
            vedtaksperiode.målgruppeType === vedtaksperiodeFraForrigeBehandling.målgruppeType
        ) {
            return PeriodeStatus.UENDRET;
        }

        return PeriodeStatus.ENDRET;
    };

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
            <FeilmeldingMaksBredde>
                <SelectMedOptions
                    label={'Aktivitet'}
                    hideLabel
                    erLesevisning={erLesevisning}
                    readOnly={!alleFelterKanEndres}
                    value={
                        erLesevisning
                            ? aktivitetTypeTilTekst(vedtaksperiode.aktivitetType ?? '')
                            : vedtaksperiode.aktivitetType
                    }
                    onChange={(e) => oppdaterPeriode('aktivitetType', e.target.value)}
                    valg={valgbareAktiviteter}
                    size={'small'}
                    error={vedtaksperiodeFeil?.aktivitetType}
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde>
                <SelectMedOptions
                    label={'Målgruppe'}
                    hideLabel
                    erLesevisning={erLesevisning}
                    readOnly={!alleFelterKanEndres}
                    value={
                        erLesevisning
                            ? faktiskMålgruppeTilTekst(vedtaksperiode.målgruppeType ?? '')
                            : vedtaksperiode.målgruppeType
                    }
                    onChange={(e) => oppdaterPeriode('målgruppeType', e.target.value)}
                    valg={faktiskMålgruppeTypeOptions}
                    size={'small'}
                    error={vedtaksperiodeFeil?.målgruppeType}
                />
            </FeilmeldingMaksBredde>
            <div>
                {!erLesevisning && kanSlettePeriode && (
                    <Button
                        variant="tertiary"
                        onClick={() => slettPeriode()}
                        icon={<TrashIcon />}
                        size="xsmall"
                    />
                )}
            </div>
            <div>
                {erRevurdering && (
                    <StatusTag status={utledStatus(vedtaksperiode)} lesevisning={erLesevisning} />
                )}
            </div>
        </>
    );
};
