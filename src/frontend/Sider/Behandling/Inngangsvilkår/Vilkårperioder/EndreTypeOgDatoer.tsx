import React from 'react';

import { FormErrors } from '../../../../hooks/felles/useFormState';
import { useTriggRerendringAvDateInput } from '../../../../hooks/useTriggRerendringAvDateInput';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
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
    oppdaterPeriode: (key: keyof Periode, nyVerdi: string) => void;
    typeOptions: SelectOption[];
    formFeil?: FormErrors<TypeOgDatoFelter>;
    alleFelterKanEndres: boolean;
    kanEndreType: boolean;
    erStøttetType?: boolean;
}

export const EndreTypeOgDatoer = <T extends MålgruppeEllerAktivitet>({
    form,
    oppdaterTypeIForm,
    oppdaterPeriode,
    typeOptions,
    formFeil,
    alleFelterKanEndres,
    kanEndreType,
    erStøttetType = true,
}: Props<T>) => {
    const { keyDato: fomKeyDato, oppdaterDatoKey: oppdaterFomDatoKey } =
        useTriggRerendringAvDateInput();
    const { keyDato: tomKeyDato, oppdaterDatoKey: oppdaterTomDatoKey } =
        useTriggRerendringAvDateInput();

    const oppdaterType = (type: T) => {
        oppdaterTypeIForm(type);

        oppdaterFomDatoKey();
        oppdaterTomDatoKey();
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
            <FeilmeldingMaksBredde>
                <DateInputMedLeservisning
                    key={fomKeyDato}
                    readOnly={!alleFelterKanEndres || !erStøttetType}
                    label={'Fra'}
                    value={form?.fom}
                    onChange={(dato) => oppdaterPeriode('fom', dato || '')}
                    size="small"
                    feil={formFeil?.fom}
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde>
                <DateInputMedLeservisning
                    key={tomKeyDato}
                    readOnly={!erStøttetType}
                    label={'Til'}
                    value={form?.tom}
                    onChange={(dato) => oppdaterPeriode('tom', dato || '')}
                    size="small"
                    feil={formFeil?.tom}
                />
            </FeilmeldingMaksBredde>
        </>
    );
};
