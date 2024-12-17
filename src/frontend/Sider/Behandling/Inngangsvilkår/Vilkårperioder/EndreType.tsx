import React from 'react';

import { FormErrors } from '../../../../hooks/felles/useFormState';
import SelectMedOptions, { SelectOption } from '../../../../komponenter/Skjema/SelectMedOptions';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Periode } from '../../../../utils/periode';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../typer/vilkårperiode/målgruppe';

type MålgruppeEllerAktivitet = MålgruppeType | AktivitetType;

interface TypeOgDatoFelter extends Periode {
    type: MålgruppeType | AktivitetType | '';
}

interface Props<T extends MålgruppeEllerAktivitet> {
    form: TypeOgDatoFelter;
    oppdaterTypeIForm: (type: T) => void;
    typeOptions: SelectOption[];
    formFeil?: FormErrors<TypeOgDatoFelter>;
    kanEndreType: boolean;
}

export const EndreType = <T extends MålgruppeEllerAktivitet>({
    form,
    oppdaterTypeIForm,
    typeOptions,
    formFeil,
    kanEndreType,
}: Props<T>) => {
    const oppdaterType = (type: T) => {
        oppdaterTypeIForm(type);
    };

    return (
        <>
            <FeilmeldingMaksBredde>
                <SelectMedOptions
                    label={form.type in MålgruppeType ? 'Ytelse/situasjon' : 'Type'}
                    readOnly={!kanEndreType}
                    value={form.type}
                    valg={typeOptions}
                    onChange={(e) => oppdaterType(e.target.value as T)}
                    size="small"
                    error={formFeil?.type}
                />
            </FeilmeldingMaksBredde>
        </>
    );
};
