import React, { FC } from 'react';

import Select from '../../../../../../komponenter/Skjema/Select';
import {
    UtgiftsperiodeProperty,
    Utgiftsperiodetype,
    utgiftsperiodetypeTilTekst,
} from '../../../../../../typer/vedtak';

interface Props {
    className?: string;
    feil?: string;
    erLesevisning: boolean;
    oppdaterUtgiftsperiodeElement: (
        property: UtgiftsperiodeProperty,
        value: string | undefined
    ) => void;
    periodetype: Utgiftsperiodetype | '' | undefined;
}

const valgbarePeriodetyper = [Utgiftsperiodetype.ORDINÆR];

const PeriodetypeSelect: FC<Props> = ({
    className,
    feil,
    erLesevisning,
    oppdaterUtgiftsperiodeElement,
    periodetype,
}) => {
    return (
        <Select
            className={className}
            erLesevisning={erLesevisning}
            error={feil}
            hideLabel
            label="Periodetype"
            lesevisningVerdi={periodetype && utgiftsperiodetypeTilTekst[periodetype]}
            onChange={(e) => {
                oppdaterUtgiftsperiodeElement(UtgiftsperiodeProperty.periodetype, e.target.value);
            }}
            value={periodetype}
        >
            <option value="">Velg</option>
            {valgbarePeriodetyper.map((type) => (
                <option key={type} value={type}>
                    {utgiftsperiodetypeTilTekst[type]}
                </option>
            ))}
        </Select>
    );
};

export default PeriodetypeSelect;
