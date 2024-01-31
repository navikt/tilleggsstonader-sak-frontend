import React from 'react';

import { PlusCircleIcon, TrashIcon } from '@navikt/aksel-icons';
import { Button, Select, Table } from '@navikt/ds-react';

import { FormErrors } from '../../../../hooks/felles/useFormState';
import DateInput from '../../../../komponenter/Skjema/DateInput';
import { AktivitetType } from '../typer/aktivitet';
import { MålgruppeType } from '../typer/målgruppe';
import { Stønadsperiode } from '../typer/stønadsperiode';

interface Props {
    stønadsperide: Stønadsperiode;
    feilmeldinger: FormErrors<Stønadsperiode>;
    oppdaterStønadsperiode: (property: keyof Stønadsperiode, value: string | undefined) => void;
    leggTilTomRadUnder: () => void;
    slettPeriode: () => void;
    radKanSlettes: boolean;
}

const StønadsperiodeRad: React.FC<Props> = ({
    stønadsperide,
    feilmeldinger,
    oppdaterStønadsperiode,
    leggTilTomRadUnder,
    slettPeriode,
    radKanSlettes,
}) => {
    const finnFeilmelding = (property: keyof Stønadsperiode) =>
        feilmeldinger && feilmeldinger[property];

    return (
        <Table.Row>
            <Table.DataCell>
                <Select
                    label={'Målgruppe'}
                    hideLabel
                    value={stønadsperide.målgruppe}
                    onChange={(e) => oppdaterStønadsperiode('målgruppe', e.target.value)}
                    size="small"
                    error={finnFeilmelding('målgruppe')}
                >
                    <option value="">Velg</option>
                    {Object.keys(MålgruppeType).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </Select>
            </Table.DataCell>
            <Table.DataCell>
                <Select
                    label={'Aktivitet'}
                    hideLabel
                    value={stønadsperide.aktivitet}
                    onChange={(e) => oppdaterStønadsperiode('aktivitet', e.target.value)}
                    size="small"
                    error={finnFeilmelding('aktivitet')}
                >
                    <option value="">Velg</option>
                    {Object.keys(AktivitetType).map((type) => (
                        <option key={type} value={type}>
                            {type}
                        </option>
                    ))}
                </Select>
            </Table.DataCell>
            <Table.DataCell>
                <DateInput
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
                    label={'Til'}
                    hideLabel
                    value={stønadsperide.tom}
                    onChange={(dato) => oppdaterStønadsperiode('tom', dato || '')}
                    size="small"
                    feil={finnFeilmelding('tom')}
                />
            </Table.DataCell>
            <Table.DataCell>
                <div>
                    <Button
                        type="button"
                        onClick={leggTilTomRadUnder}
                        variant="tertiary"
                        icon={<PlusCircleIcon />}
                        size="small"
                    />
                    {radKanSlettes && (
                        <Button
                            type="button"
                            onClick={slettPeriode}
                            variant="tertiary"
                            icon={<TrashIcon />}
                            size="small"
                        />
                    )}
                </div>
            </Table.DataCell>
        </Table.Row>
    );
};

export default StønadsperiodeRad;
