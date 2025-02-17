import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { useBehandling } from '../../../../../context/BehandlingContext';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { useRevurderingAvPerioder } from '../../../../../hooks/useRevurderingAvPerioder';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import SelectMedOptions from '../../../../../komponenter/Skjema/SelectMedOptions';
import { BehandlingType } from '../../../../../typer/behandling/behandlingType';
import { VedtaksperiodeTilsynBarn } from '../../../../../typer/vedtak/vedtakTilsynBarn';
import {
    aktivitetTypeTilTekst,
    valgbareAktivitetTyperForStønadsperiode,
} from '../../../Inngangsvilkår/Aktivitet/utilsAktivitet';
import { StatusTag } from '../../../Inngangsvilkår/Stønadsperioder/StatusTag';
import {
    målgruppeTypeOptionsForStønadsperiode,
    målgruppeTypeTilTekst,
} from '../../../Inngangsvilkår/typer/vilkårperiode/målgruppe';

interface Props {
    vedtaksperiode: VedtaksperiodeTilsynBarn;
    lagretVedtaksperiode: VedtaksperiodeTilsynBarn | undefined;
    erLesevisning: boolean;
    vedtaksperiodeFeil: FormErrors<VedtaksperiodeTilsynBarn> | undefined;
    oppdaterPeriode: (
        property: 'fom' | 'tom' | 'målgruppeType' | 'aktivitetType',
        value: string | undefined
    ) => void;
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

    const valgbareAktiviteter = valgbareAktivitetTyperForStønadsperiode(behandling.stønadstype);
    return (
        <>
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
            <SelectMedOptions
                label={'Målgruppe'}
                hideLabel
                erLesevisning={erLesevisning}
                readOnly={!alleFelterKanEndres}
                value={
                    erLesevisning
                        ? målgruppeTypeTilTekst(vedtaksperiode.målgruppeType ?? '')
                        : vedtaksperiode.målgruppeType
                }
                onChange={(e) => oppdaterPeriode('målgruppeType', e.target.value)}
                valg={målgruppeTypeOptionsForStønadsperiode}
                size={'small'}
                error={vedtaksperiodeFeil?.målgruppeType}
            />
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
