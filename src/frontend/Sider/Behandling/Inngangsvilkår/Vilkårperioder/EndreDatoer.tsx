import React, { useEffect } from 'react';

import { FormErrors } from '../../../../hooks/felles/useFormState';
import { useTriggRerendringAvDateInput } from '../../../../hooks/useTriggRerendringAvDateInput';
import DateInputMedLeservisning from '../../../../komponenter/Skjema/DateInputMedLeservisning';
import { FeilmeldingMaksBredde } from '../../../../komponenter/Visningskomponenter/FeilmeldingFastBredde';
import { Periode } from '../../../../utils/periode';
import { AktivitetType } from '../typer/vilkårperiode/aktivitet';
import { MålgruppeType } from '../typer/vilkårperiode/målgruppe';

interface TypeOgDatoFelter extends Periode {
    type: MålgruppeType | AktivitetType | '';
}

interface Props {
    form: TypeOgDatoFelter;
    oppdaterPeriode: (key: keyof Periode, nyVerdi: string) => void;
    formFeil?: FormErrors<TypeOgDatoFelter>;
    alleFelterKanEndres: boolean;
}

export const EndreDatoer = ({ form, oppdaterPeriode, formFeil, alleFelterKanEndres }: Props) => {
    const { keyDato: fomKeyDato, oppdaterDatoKey: oppdaterFomDatoKey } =
        useTriggRerendringAvDateInput();
    const { keyDato: tomKeyDato, oppdaterDatoKey: oppdaterTomDatoKey } =
        useTriggRerendringAvDateInput();

    useEffect(() => {
        oppdaterFomDatoKey();
        oppdaterTomDatoKey();
        // eslint-disable-next-line
    }, [form.type]);

    return (
        <>
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
