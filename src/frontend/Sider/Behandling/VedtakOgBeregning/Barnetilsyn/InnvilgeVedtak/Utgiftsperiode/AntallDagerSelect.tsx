import React from 'react';

import Select from '../../../../../../komponenter/Skjema/Select';
import { UtgiftsperiodeProperty } from '../../../../../../typer/vedtak';

interface Props {
    erLesevisning: boolean;
    feil?: string;
    oppdaterUtgiftsperiodeElement: (value: string | undefined) => void;
    property: UtgiftsperiodeProperty;
    value: number | undefined;
}

const AntallDagerSelect: React.FC<Props> = ({
    erLesevisning,
    feil,
    oppdaterUtgiftsperiodeElement,
    property,
    value,
}) => {
    const erAntallAktivitetsdager = property === UtgiftsperiodeProperty.antallAktivitetsdager;

    return (
        <Select
            label={erAntallAktivitetsdager ? 'Antall aktivitetsdager' : 'Dager med tilsyn'}
            hideLabel
            value={value}
            error={feil}
            onChange={(e) => {
                oppdaterUtgiftsperiodeElement(e.target.value);
            }}
            erLesevisning={erLesevisning}
            lesevisningVerdi={value ? value.toString() : ''}
        >
            <option value="">Velg</option>
            <option value={5}>
                {erAntallAktivitetsdager ? '5 eller flere dager' : 'Full pass'}
            </option>
            <option value={4}>4 dager</option>
            <option value={3}>3 dager</option>
            <option value={2}>2 dager</option>
            <option value={1}>1 dag</option>
        </Select>
    );
};

export default AntallDagerSelect;
