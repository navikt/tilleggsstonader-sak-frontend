import React from 'react';

import { FormErrors } from '../../../../hooks/felles/useFormState';
import { useTriggRerendringAvDateInput } from '../../../../hooks/useTriggRerendringAvDateInput';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import SelectMedOptions from '../../../../komponenter/Skjema/SelectMedOptions';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Periode } from '../../../../utils/periode';
import { AktivitetType, aktivitetTypeOptions } from '../typer/aktivitet';

export interface FellesFormFelter extends Periode {
    type: AktivitetType | '';
}

export const EndreFellesFelter: React.FC<{
    form: FellesFormFelter;
    oppdaterTypeIForm: (type: AktivitetType) => void;
    oppdaterPeriode: (key: keyof Periode, nyVerdi: string) => void;
    formFeil?: FormErrors<FellesFormFelter>;
    alleFelterKanEndres: boolean;
    kanEndreType: boolean;
}> = ({
    form,
    oppdaterTypeIForm,
    oppdaterPeriode,
    formFeil,
    alleFelterKanEndres,
    kanEndreType,
}) => {
    const { keyDato: fomKeyDato, oppdaterDatoKey: oppdaterFomDatoKey } =
        useTriggRerendringAvDateInput();
    const { keyDato: tomKeyDato, oppdaterDatoKey: oppdaterTomDatoKey } =
        useTriggRerendringAvDateInput();

    const oppdaterType = (type: AktivitetType) => {
        oppdaterTypeIForm(type);

        oppdaterFomDatoKey();
        oppdaterTomDatoKey();
    };

    return (
        <>
            <FeilmeldingMaksBredde>
                <SelectMedOptions
                    label="Type"
                    readOnly={!kanEndreType}
                    value={form.type}
                    valg={aktivitetTypeOptions}
                    onChange={(e) => oppdaterType(e.target.value as AktivitetType)}
                    size="small"
                    error={formFeil?.type}
                />
            </FeilmeldingMaksBredde>
            <FeilmeldingMaksBredde>
                <DateInputMedLeservisning
                    key={fomKeyDato}
                    readOnly={!alleFelterKanEndres}
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
