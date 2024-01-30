import React from 'react';

import { TrashIcon } from '@navikt/aksel-icons';
import { Button, Table } from '@navikt/ds-react';

import { FormErrors } from '../../../../hooks/felles/useFormState';
import DateInput from '../../../../komponenter/Skjema/DateInput';
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
        <Table.Row>
            <Table.DataCell>
                <SelectMedOptions
                    erLesevisning={erLeservisning}
                    valg={MålgruppeTypeOptions}
                    label={'Målgruppe'}
                    hideLabel
                    value={stønadsperide.målgruppe}
                    onChange={(e) => oppdaterStønadsperiode('målgruppe', e.target.value)}
                    size="small"
                    error={finnFeilmelding('målgruppe')}
                />
            </Table.DataCell>
            <Table.DataCell>
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
            </Table.DataCell>
            <Table.DataCell>
                <DateInput
                    erLesevisning={erLeservisning}
                    label={'Fra'}
                    hideLabel
                    value={stønadsperide.fom}
                    onChange={(dato) => oppdaterStønadsperiode('fom', dato || '')}
                    size="small"
                    feil={finnFeilmelding('fom')}
                />
            </Table.DataCell>
            <Table.DataCell>
                <DateInput
                    erLesevisning={erLeservisning}
                    label={'Til'}
                    hideLabel
                    value={stønadsperide.tom}
                    onChange={(dato) => oppdaterStønadsperiode('tom', dato || '')}
                    size="small"
                    feil={finnFeilmelding('tom')}
                />
            </Table.DataCell>
            <Table.DataCell>
                {!erLeservisning && (
                    <Button
                        type="button"
                        onClick={slettPeriode}
                        variant="tertiary"
                        icon={<TrashIcon />}
                        size="xsmall"
                    />
                )}
            </Table.DataCell>
        </Table.Row>
    );
};

export default StønadsperiodeRad;
