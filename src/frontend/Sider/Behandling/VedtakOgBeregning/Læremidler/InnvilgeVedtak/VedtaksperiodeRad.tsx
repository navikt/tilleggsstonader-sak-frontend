import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { VedtaksperiodeMedEndretKey } from './InnvilgeLæremidler';
import { FormErrors } from '../../../../../hooks/felles/useFormState';
import { useRevurderingAvPerioder } from '../../../../../hooks/useRevurderingAvPerioder';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { Periode } from '../../../../../utils/periode';

interface Props {
    vedtaksperiode: VedtaksperiodeMedEndretKey;
    erLesevisning: boolean;
    vedtaksperiodeFeil: FormErrors<Periode> | undefined;
    oppdaterPeriode: (property: 'fom' | 'tom', value: string | undefined) => void;
    slettPeriode: () => void;
    erNyRad: boolean;
}

export const VedtaksperiodeRad: React.FC<Props> = ({
    vedtaksperiode,
    erLesevisning,
    vedtaksperiodeFeil,
    oppdaterPeriode,
    slettPeriode,
    erNyRad,
}) => {
    const { alleFelterKanEndres, helePeriodenErLåstForEndring, kanSlettePeriode } =
        useRevurderingAvPerioder({
            periodeFom: vedtaksperiode.fom,
            periodeTom: vedtaksperiode.tom,
            nyRadLeggesTil: erNyRad,
        });

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
            {kanSlettePeriode ? (
                <Button
                    variant="tertiary"
                    onClick={() => slettPeriode()}
                    icon={<TrashIcon />}
                    size="xsmall"
                />
            ) : (
                <div />
            )}
        </>
    );
};
