import React from 'react';

import Select from '../../../../../../komponenter/Skjema/Select';
import {
    UtgiftsperiodeAktivitet,
    utgiftsperiodeAktivitetTilTekst,
} from '../../../../../../typer/vedtak';

interface Props {
    aktivitet: UtgiftsperiodeAktivitet | '' | undefined;
    oppdaterUtgiftsperiodeElement: (value: string | undefined) => void;
    erLesevisning: boolean;
    feil?: string;
}

const valgbareAktivitetstyper = [UtgiftsperiodeAktivitet.TILTAK, UtgiftsperiodeAktivitet.UTDANNING];

const AktivitetSelect: React.FC<Props> = ({
    aktivitet,
    oppdaterUtgiftsperiodeElement,
    erLesevisning,
    feil,
}) => {
    const utledLesevisningVerdi = () => {
        if (aktivitet) return utgiftsperiodeAktivitetTilTekst[aktivitet];
        return 'Ukjent';
    };

    return (
        <Select
            label={'Aktivitet'}
            hideLabel
            value={aktivitet}
            error={feil}
            onChange={(e) => {
                oppdaterUtgiftsperiodeElement(e.target.value);
            }}
            erLesevisning={erLesevisning}
            lesevisningVerdi={utledLesevisningVerdi()}
        >
            <option value="">Velg</option>
            {valgbareAktivitetstyper.map((aktivitet) => (
                <option key={aktivitet} value={aktivitet}>
                    {utgiftsperiodeAktivitetTilTekst[aktivitet]}
                </option>
            ))}
        </Select>
    );
};

export default AktivitetSelect;
