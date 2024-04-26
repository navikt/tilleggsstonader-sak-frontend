import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button } from '@navikt/ds-react';

import { FormErrors } from '../../../../hooks/felles/useFormState';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import SelectMedOptions from '../../../../komponenter/Skjema/SelectMedOptions';
import { AktivitetTypeOptions } from '../typer/aktivitet';
import { MålgruppeTypeOptions } from '../typer/målgruppe';
import { Stønadsperiode } from '../typer/stønadsperiode';

interface Props {
    stønadsperide: Stønadsperiode;
    feilmeldinger: FormErrors<Stønadsperiode>;
    oppdaterStønadsperiode: (property: keyof Stønadsperiode, value: string | undefined) => void;
    slettPeriode: () => void;
    erLeservisning: boolean;
}

const StønadsperiodeRad: React.FC<Props> = ({
    stønadsperide,
    feilmeldinger,
    oppdaterStønadsperiode,
    slettPeriode,
    erLeservisning,
}) => {
    const finnFeilmelding = (property: keyof Stønadsperiode) =>
        feilmeldinger && feilmeldinger[property];

    return (
        <>
            <SelectMedOptions
                className="kolonne1"
                erLesevisning={erLeservisning}
                valg={MålgruppeTypeOptions}
                label={'Målgruppe'}
                hideLabel
                value={stønadsperide.målgruppe}
                onChange={(e) => oppdaterStønadsperiode('målgruppe', e.target.value)}
                size="small"
                error={finnFeilmelding('målgruppe')}
            />

            <SelectMedOptions
                erLesevisning={erLeservisning}
                valg={AktivitetTypeOptions}
                label={'Aktivitet'}
                hideLabel
                value={stønadsperide.aktivitet}
                onChange={(e) => oppdaterStønadsperiode('aktivitet', e.target.value)}
                size="small"
                error={finnFeilmelding('aktivitet')}
            />
            <DateInputMedLeservisning
                erLesevisning={erLeservisning}
                label={'Fra'}
                hideLabel
                value={stønadsperide.fom}
                onChange={(dato) => oppdaterStønadsperiode('fom', dato || '')}
                size="small"
                feil={finnFeilmelding('fom')}
            />
            <DateInputMedLeservisning
                erLesevisning={erLeservisning}
                label={'Til'}
                hideLabel
                value={stønadsperide.tom}
                onChange={(dato) => oppdaterStønadsperiode('tom', dato || '')}
                size="small"
                feil={finnFeilmelding('tom')}
            />
            {!erLeservisning && (
                <Button
                    type="button"
                    onClick={slettPeriode}
                    variant="tertiary"
                    icon={<TrashIcon />}
                    size="xsmall"
                />
            )}
        </>
    );
};

export default StønadsperiodeRad;
