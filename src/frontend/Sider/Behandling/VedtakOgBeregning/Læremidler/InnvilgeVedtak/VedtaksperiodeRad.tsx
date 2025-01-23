import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { FormErrors } from '../../../../../hooks/felles/useFormState';
import DateInputMedLeservisning from '../../../../../komponenter/Skjema/DateInputMedLeservisning';
import { Periode, PeriodeMedEndretKey } from '../../../../../utils/periode';

interface Props {
    vedtaksperiode: PeriodeMedEndretKey;
    erLesevisning: boolean;
    vedtaksperiodeFeil: FormErrors<Periode> | undefined;
    oppdaterPeriode: (property: 'fom' | 'tom', value: string | undefined) => void;
    slettPeriode: () => void;
}

export const VedtaksperiodeRad: React.FC<Props> = ({
    vedtaksperiode,
    erLesevisning,
    vedtaksperiodeFeil,
    oppdaterPeriode,
    slettPeriode,
}) => {
    return (
        <>
            <DateInputMedLeservisning
                label="Fra"
                hideLabel
                erLesevisning={erLesevisning}
                value={vedtaksperiode.fom}
                onChange={(dato?: string) => oppdaterPeriode('fom', dato)}
                feil={vedtaksperiodeFeil?.fom}
                size="small"
            />
            <DateInputMedLeservisning
                label="Til"
                hideLabel
                erLesevisning={erLesevisning}
                value={vedtaksperiode.tom}
                onChange={(dato?: string) => oppdaterPeriode('tom', dato)}
                feil={vedtaksperiodeFeil?.tom}
                size="small"
            />
            {!erLesevisning ? (
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
