import React from 'react';

import styles from './EndreTypeOgDatoer.module.css';
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
    typeAktivitet?: string;
}

interface Props<T extends MålgruppeEllerAktivitet> {
    form: TypeOgDatoFelter;
    oppdaterTypeIForm: (type: T) => void;
    oppdaterPeriode: (key: keyof Periode, nyVerdi: string) => void;
    oppdaterTypeAktivitet?: (typeAktivitet: string) => void;
    typeOptions: SelectOption[];
    typeAktivitetOptions?: SelectOption[];
    formFeil?: FormErrors<TypeOgDatoFelter>;
    kanEndreType: boolean;
    kanEndreTypeAktivitet?: boolean;
    erStøttetType?: boolean;
}

export const EndreTypeOgDatoer = <T extends MålgruppeEllerAktivitet>({
    form,
    oppdaterTypeIForm,
    oppdaterPeriode,
    oppdaterTypeAktivitet,
    typeOptions,
    typeAktivitetOptions,
    formFeil,
    kanEndreType,
    kanEndreTypeAktivitet,
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
            {typeAktivitetOptions && oppdaterTypeAktivitet && (
                <FeilmeldingMaksBredde>
                    <SelectMedOptions
                        className={styles.selectMaxBredde}
                        label={'Variant'}
                        readOnly={!kanEndreTypeAktivitet}
                        value={form.typeAktivitet}
                        valg={typeAktivitetOptions}
                        onChange={(e) => oppdaterTypeAktivitet(e.target.value)}
                        size="small"
                        error={formFeil?.typeAktivitet}
                    />
                </FeilmeldingMaksBredde>
            )}
            <FeilmeldingMaksBredde>
                <DateInputMedLeservisning
                    key={fomKeyDato}
                    readOnly={!erStøttetType}
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
