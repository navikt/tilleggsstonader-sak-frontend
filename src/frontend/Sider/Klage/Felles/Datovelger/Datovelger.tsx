import React, { FC } from 'react';
import { useDatepicker, DatePicker } from '@navikt/ds-react';
import { FamilieLesefelt } from '@navikt/familie-form-elements';
import { formaterNullableIsoDato, nullableTilDato, tilLocaleDateString } from '../../../../utils/dato';

export const Datovelger: FC<{
    verdi: string | undefined;
    settVerdi: (verdi: string | undefined) => void;
    erLesevisning?: boolean;
    label: string;
    id: string;
    feil?: string;
    maksDato?: Date;
    minDato?: Date;
    placeholder?: string;
}> = ({ settVerdi, erLesevisning, verdi, label, id, feil, minDato, maksDato, placeholder }) => {
    const { datepickerProps, inputProps } = useDatepicker({
        defaultSelected: nullableTilDato(verdi),
        onDateChange: (dato) => settVerdi(dato && tilLocaleDateString(dato)),
        toDate: maksDato,
        fromDate: minDato ?? new Date('1 Jan 1990'),
    });

    return (
        <div>
            {erLesevisning ? (
                <FamilieLesefelt
                    size={'small'}
                    label={label}
                    verdi={formaterNullableIsoDato(verdi)}
                />
            ) : (
                <DatePicker id={id} {...datepickerProps} dropdownCaption>
                    <DatePicker.Input
                        label={label}
                        placeholder={placeholder}
                        {...inputProps}
                        error={feil}
                        size={'medium'}
                    />
                </DatePicker>
            )}
        </div>
    );
};
