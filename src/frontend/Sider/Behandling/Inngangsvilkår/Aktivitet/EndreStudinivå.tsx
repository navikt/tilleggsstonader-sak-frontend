import React from 'react';

import { RadioGroup, HStack, Radio } from '@navikt/ds-react';

import { EndreAktivitetFormLæremidler } from './EndreAktivitetLæremidler';
import { erUtdanningEllerTiltak } from './utilsLæremidler';
import { AktivitetValidering } from './valideringAktivitetLæremidler';
import { FormErrors } from '../../../../hooks/felles/useFormState';
import { Studienivå, studienivåTilTekst } from '../typer/vilkårperiode/aktivitetLæremidler';

export const EndreStudienivå: React.FC<{
    form: EndreAktivitetFormLæremidler;
    settStudienivå: (studienivå: Studienivå) => void;
    alleFelterKanEndres: boolean;
    feil?: FormErrors<AktivitetValidering>;
}> = ({ form, settStudienivå, alleFelterKanEndres, feil }) => {
    if (!erUtdanningEllerTiltak(form.type)) {
        return null;
    }

    return (
        <RadioGroup
            value={form.studienivå || ''}
            legend="Studienivå"
            readOnly={!alleFelterKanEndres}
            onChange={(e) => settStudienivå(e)}
            size="small"
            error={feil?.studienivå}
        >
            <HStack gap="4">
                <Radio value={Studienivå.HØYERE_UTDANNING}>
                    {studienivåTilTekst[Studienivå.HØYERE_UTDANNING]}
                </Radio>
                <Radio value={Studienivå.VIDEREGÅENDE}>
                    {studienivåTilTekst[Studienivå.VIDEREGÅENDE]}
                </Radio>
            </HStack>
        </RadioGroup>
    );
};
